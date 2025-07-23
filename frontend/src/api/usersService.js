import axiosClient from './axiosClient';

const BASE = '/users';

export default {
  // Get all users (admin only)
  getAllUsers(params = {}) {
    return axiosClient.get(BASE, { params });
  },

  // Get user profile by ID
  getUserProfile(userId) {
    return axiosClient.get(`${BASE}/${userId}/profile`);
  },

  // Update user profile
  updateUserProfile(userId, data) {
    return axiosClient.put(`${BASE}/${userId}/profile`, data);
  },

  // Update user role (admin only)
  updateUserRole(userId, role) {
    return axiosClient.put(`${BASE}/${userId}/role`, { role });
  },

  // Update user status (admin only)
  updateUserStatus(userId, status) {
    return axiosClient.put(`${BASE}/${userId}/status`, { status });
  },

  // Delete user (admin only)
  deleteUser(userId) {
    return axiosClient.delete(`${BASE}/${userId}`);
  },

  // Get user statistics (admin only)
  getUserStats() {
    return axiosClient.get(`${BASE}/stats`);
  },

  // Search users
  searchUsers(query) {
    return axiosClient.get(`${BASE}/search`, { params: { q: query } });
  },

  // Get online users
  getOnlineUsers() {
    return axiosClient.get(`${BASE}/online`);
  },

  // Update user avatar
  updateUserAvatar(userId, formData) {
    return axiosClient.post(`${BASE}/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Get user activity
  getUserActivity(userId, params = {}) {
    return axiosClient.get(`${BASE}/${userId}/activity`, { params });
  },

  // Block user
  blockUser(userId) {
    return axiosClient.post(`${BASE}/${userId}/block`);
  },

  // Unblock user
  unblockUser(userId) {
    return axiosClient.post(`${BASE}/${userId}/unblock`);
  },

  // Get blocked users
  getBlockedUsers() {
    return axiosClient.get(`${BASE}/blocked`);
  }
};
