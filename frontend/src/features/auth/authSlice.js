import { createSlice } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  logoutUser,
  fetchAllUsers
} from './authThunks';

const initialState = {
  user: null,
  token: null,
  users: [],
  status: 'idle',
  error: null,
  message: null,
  permissions: [],
  role: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearState(state) {
      state.status = 'idle';
      state.error = null;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending,  s => { s.status = 'loading'; })
      .addCase(registerUser.fulfilled, (s,a) => {
        s.status = 'succeeded';
        s.message = a.payload.message;
      })
      .addCase(registerUser.rejected,  (s,a) => {
        s.status = 'failed';
        s.error  = a.payload;
      })

      // Login
      .addCase(loginUser.fulfilled, (s,a) => {
        s.user  = a.payload.data.user;
        s.token = a.payload.data.accessToken;
        s.role = a.payload.data.user.role;
        s.permissions = a.payload.data.user.permissions || [];
        s.isAuthenticated = true;
        localStorage.setItem('accessToken', s.token);
      })
      .addCase(loginUser.rejected, (s,a) => {
        s.error = a.payload;
      })

      // OTP Flows
      .addCase(verifyOTP.fulfilled, (s,a) => { s.message = a.payload.message; })
      .addCase(resendOTP.fulfilled, (s,a) => { s.message = a.payload.message; })

      // Password Flows
      .addCase(forgotPassword.fulfilled, (s,a) => { s.message = a.payload.message; })
      .addCase(resetPassword.fulfilled,  (s,a) => { s.message = a.payload.message; })

      // Logout
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null;
        s.token = null;
        s.role = null;
        s.permissions = [];
        s.isAuthenticated = false;
        localStorage.removeItem('accessToken');
      })

      // Fetch Users
      .addCase(fetchAllUsers.fulfilled, (s,a) => {
        s.users = a.payload.data.users;
      });
  }
});

export const { clearState } = authSlice.actions;
export default authSlice.reducer;
