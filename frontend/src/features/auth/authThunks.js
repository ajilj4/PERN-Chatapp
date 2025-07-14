import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../api/authService';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await authService.register(formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (creds, { rejectWithValue }) => {
    try {
      const { data } = await authService.login(creds);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.verifyOTP(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.resendOTP(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.forgotPassword(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.resetPassword(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.logout(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'auth/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authService.getAllUsers();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
