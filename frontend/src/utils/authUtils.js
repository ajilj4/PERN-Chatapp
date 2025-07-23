// Role hierarchy (higher number = higher privilege)
export const ROLES = {
  USER: { name: 'user', level: 1 },
  PRO_USER: { name: 'pro_user', level: 2 },
  ADMIN: { name: 'admin', level: 3 },
  SUPER_ADMIN: { name: 'super_admin', level: 4 }
};

// Permissions mapping
export const PERMISSIONS = {
  // Chat permissions
  SEND_MESSAGE: 'send_message',
  DELETE_MESSAGE: 'delete_message',
  EDIT_MESSAGE: 'edit_message',
  CREATE_ROOM: 'create_room',
  DELETE_ROOM: 'delete_room',
  INVITE_USERS: 'invite_users',
  
  // Call permissions
  MAKE_AUDIO_CALL: 'make_audio_call',
  MAKE_VIDEO_CALL: 'make_video_call',
  RECORD_CALL: 'record_call',
  
  // User management permissions
  VIEW_USERS: 'view_users',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',
  MANAGE_ROLES: 'manage_roles',
  
  // Admin permissions
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SUBSCRIPTIONS: 'manage_subscriptions',
  SYSTEM_SETTINGS: 'system_settings',
  
  // Super admin permissions
  FULL_ACCESS: 'full_access'
};

// Base permissions for each role (built incrementally to avoid circular references)
const USER_PERMISSIONS = [
  PERMISSIONS.SEND_MESSAGE,
  PERMISSIONS.EDIT_MESSAGE,
  PERMISSIONS.MAKE_AUDIO_CALL
];

const PRO_USER_PERMISSIONS = [
  ...USER_PERMISSIONS,
  PERMISSIONS.DELETE_MESSAGE,
  PERMISSIONS.CREATE_ROOM,
  PERMISSIONS.INVITE_USERS,
  PERMISSIONS.MAKE_VIDEO_CALL,
  PERMISSIONS.RECORD_CALL
];

const ADMIN_PERMISSIONS = [
  ...PRO_USER_PERMISSIONS,
  PERMISSIONS.VIEW_USERS,
  PERMISSIONS.EDIT_USER,
  PERMISSIONS.DELETE_ROOM,
  PERMISSIONS.VIEW_ANALYTICS,
  PERMISSIONS.MANAGE_SUBSCRIPTIONS
];

const SUPER_ADMIN_PERMISSIONS = [
  PERMISSIONS.FULL_ACCESS
];

// Default permissions for each role
export const ROLE_PERMISSIONS = {
  [ROLES.USER.name]: USER_PERMISSIONS,
  [ROLES.PRO_USER.name]: PRO_USER_PERMISSIONS,
  [ROLES.ADMIN.name]: ADMIN_PERMISSIONS,
  [ROLES.SUPER_ADMIN.name]: SUPER_ADMIN_PERMISSIONS
};

/**
 * Check if user has a specific role or higher
 * @param {string} userRole - Current user role
 * @param {string} requiredRole - Required role
 * @returns {boolean}
 */
export const hasRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  
  const userRoleLevel = ROLES[userRole.toUpperCase()]?.level || 0;
  const requiredRoleLevel = ROLES[requiredRole.toUpperCase()]?.level || 0;
  
  return userRoleLevel >= requiredRoleLevel;
};

/**
 * Check if user has a specific permission
 * @param {Array} userPermissions - User's permissions array
 * @param {string} requiredPermission - Required permission
 * @returns {boolean}
 */
export const checkUserPermission = (userPermissions = [], requiredPermission) => {
  if (!requiredPermission) return true;
  
  // Super admin has full access
  if (userPermissions.includes(PERMISSIONS.FULL_ACCESS)) {
    return true;
  }
  
  return userPermissions.includes(requiredPermission);
};

/**
 * Check if user has any of the specified permissions
 * @param {Array} userPermissions - User's permissions array
 * @param {Array} requiredPermissions - Array of required permissions
 * @returns {boolean}
 */
export const hasAnyPermission = (userPermissions = [], requiredPermissions = []) => {
  if (requiredPermissions.length === 0) return true;
  
  // Super admin has full access
  if (userPermissions.includes(PERMISSIONS.FULL_ACCESS)) {
    return true;
  }
  
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission)
  );
};

/**
 * Check if user has all of the specified permissions
 * @param {Array} userPermissions - User's permissions array
 * @param {Array} requiredPermissions - Array of required permissions
 * @returns {boolean}
 */
export const hasAllPermissions = (userPermissions = [], requiredPermissions = []) => {
  if (requiredPermissions.length === 0) return true;
  
  // Super admin has full access
  if (userPermissions.includes(PERMISSIONS.FULL_ACCESS)) {
    return true;
  }
  
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  );
};

/**
 * Get user's effective permissions based on role
 * @param {string} role - User role
 * @param {Array} customPermissions - Custom permissions assigned to user
 * @returns {Array}
 */
export const getUserPermissions = (role, customPermissions = []) => {
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  
  // Combine role permissions with custom permissions
  const allPermissions = [...new Set([...rolePermissions, ...customPermissions])];
  
  return allPermissions;
};

/**
 * Check if user can access a specific feature
 * @param {Object} user - User object
 * @param {string} feature - Feature name
 * @returns {boolean}
 */
export const canAccessFeature = (user, feature) => {
  if (!user) return false;
  
  const featurePermissions = {
    'video_calls': [PERMISSIONS.MAKE_VIDEO_CALL],
    'user_management': [PERMISSIONS.VIEW_USERS],
    'analytics': [PERMISSIONS.VIEW_ANALYTICS],
    'system_settings': [PERMISSIONS.SYSTEM_SETTINGS],
    'subscription_management': [PERMISSIONS.MANAGE_SUBSCRIPTIONS]
  };
  
  const requiredPermissions = featurePermissions[feature];
  if (!requiredPermissions) return true;
  
  const userPermissions = getUserPermissions(user.role, user.permissions);
  return hasAnyPermission(userPermissions, requiredPermissions);
};

/**
 * Get user role display name
 * @param {string} role - Role key
 * @returns {string}
 */
export const getRoleDisplayName = (role) => {
  const roleMap = {
    'user': 'Standard User',
    'pro_user': 'Pro User',
    'admin': 'Administrator',
    'super_admin': 'Super Administrator'
  };
  
  return roleMap[role] || role;
};

/**
 * Check if user is premium (pro or higher)
 * @param {string} role - User role
 * @returns {boolean}
 */
export const isPremiumUser = (role) => {
  return hasRole(role, ROLES.PRO_USER.name);
};

/**
 * Check if user is admin or higher
 * @param {string} role - User role
 * @returns {boolean}
 */
export const isAdmin = (role) => {
  return hasRole(role, ROLES.ADMIN.name);
};

/**
 * Check if user is super admin
 * @param {string} role - User role
 * @returns {boolean}
 */
export const isSuperAdmin = (role) => {
  return role === ROLES.SUPER_ADMIN.name;
};
