import { createAsyncThunk } from '@reduxjs/toolkit';
import usersService from '../../api/usersService';

// Fetch all users with pagination and filters
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async ({ page = 1, limit = 20, filters = {}, search = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        ...filters
      });
      
      const response = await usersService.getAllUsers({ page, limit, search, ...filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Update user role
export const updateUserRole = createAsyncThunk(
  'users/updateRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
    }
  }
);

// Update user status (active/inactive)
export const updateUserStatus = createAsyncThunk(
  'users/updateStatus',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'users/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'users/updateProfile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/users/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user profile');
    }
  }
);

// Bulk user operations
export const bulkUpdateUsers = createAsyncThunk(
  'users/bulkUpdate',
  async ({ userIds, updates }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put('/users/bulk-update', {
        userIds,
        updates
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to bulk update users');
    }
  }
);

// Export users data
export const exportUsers = createAsyncThunk(
  'users/export',
  async ({ format = 'csv', filters = {} }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/users/export', {
        params: { format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export users');
    }
  }
);

// Send invitation to user
export const sendUserInvitation = createAsyncThunk(
  'users/sendInvitation',
  async ({ email, role = 'user' }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/users/invite', { email, role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send invitation');
    }
  }
);

// Get user activity logs
export const fetchUserActivityLogs = createAsyncThunk(
  'users/fetchActivityLogs',
  async ({ userId, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/users/${userId}/activity`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activity logs');
    }
  }
);
