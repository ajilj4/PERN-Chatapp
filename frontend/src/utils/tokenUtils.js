/**
 * JWT Token utility functions
 */

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Store token in localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Get token from localStorage
 * @returns {string|null} JWT token
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Store refresh token in localStorage
 * @param {string} refreshToken - Refresh token
 */
export const setRefreshToken = (refreshToken) => {
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Get refresh token from localStorage
 * @returns {string|null} Refresh token
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Decode JWT token payload
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date
 */
export const getTokenExpiration = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  return new Date(decoded.exp * 1000);
};

/**
 * Get time until token expires (in milliseconds)
 * @param {string} token - JWT token
 * @returns {number} Milliseconds until expiration
 */
export const getTimeUntilExpiration = (token) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return 0;
  
  return expiration.getTime() - Date.now();
};

/**
 * Check if token needs refresh (expires within 5 minutes)
 * @param {string} token - JWT token
 * @returns {boolean} True if needs refresh
 */
export const shouldRefreshToken = (token) => {
  const timeUntilExpiration = getTimeUntilExpiration(token);
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  return timeUntilExpiration <= fiveMinutes;
};

/**
 * Get user info from token
 * @param {string} token - JWT token
 * @returns {Object|null} User info
 */
export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    id: decoded.sub || decoded.userId,
    email: decoded.email,
    role: decoded.role,
    permissions: decoded.permissions || [],
    iat: decoded.iat,
    exp: decoded.exp
  };
};

/**
 * Validate token format
 * @param {string} token - JWT token
 * @returns {boolean} True if valid format
 */
export const isValidTokenFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  removeToken();
  // Clear any other auth-related data from localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('userPreferences');
};

/**
 * Initialize auth state from stored tokens
 * @returns {Object|null} Auth state
 */
export const initializeAuthFromStorage = () => {
  const token = getToken();
  const refreshToken = getRefreshToken();
  
  if (!token || isTokenExpired(token)) {
    clearAuthData();
    return null;
  }
  
  const user = getUserFromToken(token);
  if (!user) {
    clearAuthData();
    return null;
  }
  
  return {
    user,
    token,
    refreshToken,
    isAuthenticated: true,
    role: user.role,
    permissions: user.permissions
  };
};
