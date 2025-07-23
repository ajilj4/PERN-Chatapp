import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  fetchUserProfile,
  updateUserProfile
} from './usersThunks';

const initialState = {
  users: [],
  currentUserProfile: null,
  onlineUsers: [],
  selectedUser: null,
  
  // Pagination
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },
  
  // Filters and search
  filters: {
    role: 'all',
    status: 'all',
    subscription: 'all'
  },
  searchQuery: '',
  
  // Loading states
  loading: false,
  userProfileLoading: false,
  
  // Error handling
  error: null,
  
  // User statistics
  userStats: {
    total: 0,
    active: 0,
    inactive: 0,
    premium: 0,
    standard: 0
  }
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // User selection
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
    
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
    
    // Online status management
    setUserOnline(state, action) {
      const userId = action.payload;
      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
      
      // Update user in users array
      state.users = state.users.map(user => 
        user.id === userId ? { ...user, isOnline: true, lastSeen: new Date().toISOString() } : user
      );
    },
    
    setUserOffline(state, action) {
      const userId = action.payload;
      state.onlineUsers = state.onlineUsers.filter(id => id !== userId);
      
      // Update user in users array
      state.users = state.users.map(user => 
        user.id === userId ? { ...user, isOnline: false, lastSeen: new Date().toISOString() } : user
      );
    },
    
    // Bulk online status update
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
      
      // Update all users' online status
      state.users = state.users.map(user => ({
        ...user,
        isOnline: action.payload.includes(user.id)
      }));
    },
    
    // Filters and search
    setUserFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    setUserSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    
    // Pagination
    setPagination(state, action) {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    // User updates (optimistic updates)
    updateUserInList(state, action) {
      const { userId, updates } = action.payload;
      state.users = state.users.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      );
    },
    
    // Remove user from list
    removeUserFromList(state, action) {
      state.users = state.users.filter(user => user.id !== action.payload);
      state.userStats.total = Math.max(0, state.userStats.total - 1);
    },
    
    // Update user statistics
    updateUserStats(state, action) {
      state.userStats = { ...state.userStats, ...action.payload };
    },
    
    // Clear error
    clearUsersError(state) {
      state.error = null;
    },
    
    // Reset users state
    resetUsersState(state) {
      Object.assign(state, initialState);
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data.users;
        state.pagination = action.payload.data.pagination;
        state.userStats = action.payload.data.stats;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update user role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload.data;
        state.users = state.users.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        );
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Update user status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload.data;
        state.users = state.users.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        );
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedUserId = action.payload.data.userId;
        state.users = state.users.filter(user => user.id !== deletedUserId);
        state.userStats.total = Math.max(0, state.userStats.total - 1);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.userProfileLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userProfileLoading = false;
        state.currentUserProfile = action.payload.data;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.userProfileLoading = false;
        state.error = action.payload;
      })
      
      // Update user profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.currentUserProfile = action.payload.data;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const {
  setSelectedUser,
  clearSelectedUser,
  setUserOnline,
  setUserOffline,
  setOnlineUsers,
  setUserFilters,
  setUserSearchQuery,
  setPagination,
  updateUserInList,
  removeUserFromList,
  updateUserStats,
  clearUsersError,
  resetUsersState
} = usersSlice.actions;

export default usersSlice.reducer;
