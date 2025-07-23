import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Layout state
  sidebarOpen: true,
  sidebarCollapsed: false,
  
  // Theme and appearance
  theme: 'light', // 'light' | 'dark' | 'system'
  
  // Modals and overlays
  modals: {
    profile: false,
    settings: false,
    userManagement: false,
    subscription: false,
    createRoom: false,
    inviteUsers: false,
    audioCall: false,
    videoCall: false
  },
  
  // Notifications
  notifications: [],
  notificationSettings: {
    sound: true,
    desktop: true,
    email: true
  },
  
  // Loading states
  loading: {
    global: false,
    chat: false,
    users: false,
    subscription: false
  },
  
  // Mobile responsiveness
  isMobile: false,
  screenSize: 'desktop', // 'mobile' | 'tablet' | 'desktop'
  
  // Search and filters
  searchQuery: '',
  activeFilters: [],
  
  // Toast messages
  toasts: [],
  
  // Connection status
  isOnline: true,
  connectionStatus: 'connected' // 'connected' | 'connecting' | 'disconnected'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar controls
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    
    toggleSidebarCollapsed(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    // Theme management
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    
    // Modal management
    openModal(state, action) {
      state.modals[action.payload] = true;
    },
    
    closeModal(state, action) {
      state.modals[action.payload] = false;
    },
    
    closeAllModals(state) {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
    
    // Notifications
    addNotification(state, action) {
      const notification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload
      };
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    
    markNotificationRead(state, action) {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    
    markAllNotificationsRead(state) {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    
    removeNotification(state, action) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    clearNotifications(state) {
      state.notifications = [];
    },
    
    updateNotificationSettings(state, action) {
      state.notificationSettings = { ...state.notificationSettings, ...action.payload };
    },
    
    // Loading states
    setLoading(state, action) {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
    
    setGlobalLoading(state, action) {
      state.loading.global = action.payload;
    },
    
    // Responsive design
    setIsMobile(state, action) {
      state.isMobile = action.payload;
    },
    
    setScreenSize(state, action) {
      state.screenSize = action.payload;
    },
    
    // Search and filters
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    
    addFilter(state, action) {
      if (!state.activeFilters.includes(action.payload)) {
        state.activeFilters.push(action.payload);
      }
    },
    
    removeFilter(state, action) {
      state.activeFilters = state.activeFilters.filter(filter => filter !== action.payload);
    },
    
    clearFilters(state) {
      state.activeFilters = [];
    },
    
    // Toast messages
    addToast(state, action) {
      const toast = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload
      };
      state.toasts.push(toast);
    },
    
    removeToast(state, action) {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    
    clearToasts(state) {
      state.toasts = [];
    },
    
    // Connection status
    setOnlineStatus(state, action) {
      state.isOnline = action.payload;
    },
    
    setConnectionStatus(state, action) {
      state.connectionStatus = action.payload;
    },
    
    // Reset UI state
    resetUiState(state) {
      Object.assign(state, initialState);
    }
  }
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setTheme,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  clearNotifications,
  updateNotificationSettings,
  setLoading,
  setGlobalLoading,
  setIsMobile,
  setScreenSize,
  setSearchQuery,
  addFilter,
  removeFilter,
  clearFilters,
  addToast,
  removeToast,
  clearToasts,
  setOnlineStatus,
  setConnectionStatus,
  resetUiState
} = uiSlice.actions;

export default uiSlice.reducer;
