

// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/chat/chatSlice';
import subscriptionReducer from '../features/subscription/subscriptionSlice';
import callsReducer from '../features/calls/callsSlice';
import uiReducer from '../features/ui/uiSlice';
import usersReducer from '../features/users/usersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    subscription: subscriptionReducer,
    calls: callsReducer,
    ui: uiReducer,
    users: usersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for WebRTC streams and peer connections
        ignoredActions: [
          'calls/setLocalStream',
          'calls/setRemoteStream',
          'calls/setPeerConnection'
        ],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['payload.stream', 'payload.peerConnection'],
        // Ignore these paths in the state
        ignoredPaths: ['calls.localStream', 'calls.remoteStream', 'calls.peerConnection']
      }
    })
});

export default store;
export { store };
