import axiosClient from './axiosClient';

const BASE = '/v1/auth';

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
  getAllUsers() {
    return axiosClient.get(`${BASE}/all-users`);
  },
  getUser(id) {
    return axiosClient.get(`${BASE}/user/${id}`);
  }
};
