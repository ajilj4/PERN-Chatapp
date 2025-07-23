// src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { checkUserPermission, hasRole } from '../utils/authUtils';

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRole = null,
  requiredPermission = null,
  fallbackPath = '/unauthorized'
}) {
  const { user, isAuthenticated, role, permissions } = useSelector(state => state.auth);
  const location = useLocation();

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect authenticated users away from auth pages
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(role, requiredRole)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check permission-based access
  if (requiredPermission && !checkUserPermission(permissions, requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}