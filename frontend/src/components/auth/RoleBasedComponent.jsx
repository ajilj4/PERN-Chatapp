import { useSelector } from 'react-redux';
import { 
  hasRole, 
  checkUserPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  getUserPermissions 
} from '../../utils/authUtils';

/**
 * Component that conditionally renders children based on user role/permissions
 */
export default function RoleBasedComponent({
  children,
  requiredRole = null,
  requiredPermission = null,
  requiredPermissions = [],
  requireAll = false, // If true, user must have ALL permissions; if false, ANY permission
  fallback = null,
  inverse = false // If true, renders when user DOESN'T have access
}) {
  const { user, role, permissions } = useSelector(state => state.auth);
  
  // If no user is logged in, don't render
  if (!user) {
    return inverse ? children : fallback;
  }
  
  let hasAccess = true;
  
  // Check role requirement
  if (requiredRole) {
    hasAccess = hasRole(role, requiredRole);
  }
  
  // Check single permission requirement
  if (hasAccess && requiredPermission) {
    const userPermissions = getUserPermissions(role, permissions);
    hasAccess = checkUserPermission(userPermissions, requiredPermission);
  }
  
  // Check multiple permissions requirement
  if (hasAccess && requiredPermissions.length > 0) {
    const userPermissions = getUserPermissions(role, permissions);
    
    if (requireAll) {
      hasAccess = hasAllPermissions(userPermissions, requiredPermissions);
    } else {
      hasAccess = hasAnyPermission(userPermissions, requiredPermissions);
    }
  }
  
  // Apply inverse logic if specified
  if (inverse) {
    hasAccess = !hasAccess;
  }
  
  return hasAccess ? children : fallback;
}

/**
 * Hook for checking user permissions in components
 */
export const usePermissions = () => {
  const { user, role, permissions } = useSelector(state => state.auth);
  
  const userPermissions = user ? getUserPermissions(role, permissions) : [];
  
  return {
    hasRole: (requiredRole) => hasRole(role, requiredRole),
    hasPermission: (permission) => checkUserPermission(userPermissions, permission),
    hasAnyPermission: (permissionsList) => hasAnyPermission(userPermissions, permissionsList),
    hasAllPermissions: (permissionsList) => hasAllPermissions(userPermissions, permissionsList),
    permissions: userPermissions,
    role,
    user
  };
};

/**
 * Higher-order component for role-based access control
 */
export const withRoleAccess = (WrappedComponent, accessConfig = {}) => {
  return function RoleAccessComponent(props) {
    const { user, role, permissions } = useSelector(state => state.auth);
    
    if (!user) {
      return accessConfig.fallback || null;
    }
    
    const userPermissions = getUserPermissions(role, permissions);
    let hasAccess = true;
    
    // Check role requirement
    if (accessConfig.requiredRole) {
      hasAccess = hasRole(role, accessConfig.requiredRole);
    }
    
    // Check permission requirements
    if (hasAccess && accessConfig.requiredPermission) {
      hasAccess = checkUserPermission(userPermissions, accessConfig.requiredPermission);
    }
    
    if (hasAccess && accessConfig.requiredPermissions?.length > 0) {
      if (accessConfig.requireAll) {
        hasAccess = hasAllPermissions(userPermissions, accessConfig.requiredPermissions);
      } else {
        hasAccess = hasAnyPermission(userPermissions, accessConfig.requiredPermissions);
      }
    }
    
    if (!hasAccess) {
      return accessConfig.fallback || null;
    }
    
    return <WrappedComponent {...props} />;
  };
};
