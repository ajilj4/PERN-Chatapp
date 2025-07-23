import axiosClient from './axiosClient';

const BASE = '/auth';

export default {
  register(formData) {
    // multipart/form-data for profile upload
    return axiosClient.post(`${BASE}/register`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  login(credentials) {
    return axiosClient.post(`${BASE}/login`, credentials);
  },
  verifyOTP(payload) {
    return axiosClient.post(`${BASE}/verify-otp`, payload);
  },
  resendOTP(payload) {
    return axiosClient.post(`${BASE}/resend-otp`, payload);
  },
  forgotPassword(payload) {
    return axiosClient.post(`${BASE}/forgot-password`, payload);
  },
  resetPassword(payload) {
    return axiosClient.post(`${BASE}/reset-password`, payload);
  },
  refreshToken(payload) {
    return axiosClient.post(`${BASE}/refresh-token`, payload);
  },
  logout(payload) {
    return axiosClient.post(`${BASE}/logout`, payload);
  },
  // Get current user profile
  getCurrentUser() {
    return axiosClient.get(`${BASE}/me`);
  },

  // Update current user profile
  updateProfile(data) {
    return axiosClient.put(`${BASE}/profile`, data);
  },

  // Change password
  changePassword(data) {
    return axiosClient.post(`${BASE}/change-password`, data);
  }
};
