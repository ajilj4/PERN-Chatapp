import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Current call state
  currentCall: null,
  callStatus: 'idle', // idle, calling, ringing, connected, ended
  callType: null, // 'audio' | 'video'
  
  // Call participants
  localStream: null,
  remoteStream: null,
  participants: [],
  
  // Call controls
  isMuted: false,
  isVideoEnabled: true,
  isSpeakerOn: false,
  
  // Call history
  callHistory: [],
  
  // WebRTC connection
  peerConnection: null,
  
  // UI state
  isCallModalOpen: false,
  isIncomingCall: false,
  incomingCallData: null,
  
  // Error handling
  error: null,
  connectionStatus: 'disconnected' // disconnected, connecting, connected, failed
};

const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    // Call initiation
    initiateCall(state, action) {
      const { userId, callType, roomId } = action.payload;
      state.currentCall = {
        id: Date.now().toString(),
        userId,
        roomId,
        callType,
        startTime: new Date().toISOString(),
        status: 'calling'
      };
      state.callStatus = 'calling';
      state.callType = callType;
      state.isCallModalOpen = true;
    },
    
    // Incoming call
    receiveIncomingCall(state, action) {
      state.isIncomingCall = true;
      state.incomingCallData = action.payload;
      state.callType = action.payload.callType;
    },
    
    // Accept call
    acceptCall(state, action) {
      state.isIncomingCall = false;
      state.currentCall = action.payload;
      state.callStatus = 'connected';
      state.isCallModalOpen = true;
      state.incomingCallData = null;
    },
    
    // Reject call
    rejectCall(state) {
      state.isIncomingCall = false;
      state.incomingCallData = null;
      state.callStatus = 'idle';
    },
    
    // End call
    endCall(state) {
      if (state.currentCall) {
        state.callHistory.unshift({
          ...state.currentCall,
          endTime: new Date().toISOString(),
          duration: Date.now() - new Date(state.currentCall.startTime).getTime()
        });
      }
      
      state.currentCall = null;
      state.callStatus = 'idle';
      state.callType = null;
      state.isCallModalOpen = false;
      state.isIncomingCall = false;
      state.incomingCallData = null;
      state.localStream = null;
      state.remoteStream = null;
      state.participants = [];
      state.peerConnection = null;
      state.connectionStatus = 'disconnected';
    },
    
    // Update call status
    updateCallStatus(state, action) {
      state.callStatus = action.payload;
    },
    
    // Set streams
    setLocalStream(state, action) {
      state.localStream = action.payload;
    },
    
    setRemoteStream(state, action) {
      state.remoteStream = action.payload;
    },
    
    // Call controls
    toggleMute(state) {
      state.isMuted = !state.isMuted;
    },
    
    toggleVideo(state) {
      state.isVideoEnabled = !state.isVideoEnabled;
    },
    
    toggleSpeaker(state) {
      state.isSpeakerOn = !state.isSpeakerOn;
    },
    
    // WebRTC connection
    setPeerConnection(state, action) {
      state.peerConnection = action.payload;
    },
    
    updateConnectionStatus(state, action) {
      state.connectionStatus = action.payload;
    },
    
    // Participants management
    addParticipant(state, action) {
      const participant = action.payload;
      if (!state.participants.find(p => p.id === participant.id)) {
        state.participants.push(participant);
      }
    },
    
    removeParticipant(state, action) {
      state.participants = state.participants.filter(p => p.id !== action.payload);
    },
    
    updateParticipant(state, action) {
      const { id, updates } = action.payload;
      state.participants = state.participants.map(p => 
        p.id === id ? { ...p, ...updates } : p
      );
    },
    
    // UI controls
    setCallModalOpen(state, action) {
      state.isCallModalOpen = action.payload;
    },
    
    // Error handling
    setCallError(state, action) {
      state.error = action.payload;
    },
    
    clearCallError(state) {
      state.error = null;
    },
    
    // Clear call state
    clearCallState(state) {
      Object.assign(state, initialState);
    }
  }
});

export const {
  initiateCall,
  receiveIncomingCall,
  acceptCall,
  rejectCall,
  endCall,
  updateCallStatus,
  setLocalStream,
  setRemoteStream,
  toggleMute,
  toggleVideo,
  toggleSpeaker,
  setPeerConnection,
  updateConnectionStatus,
  addParticipant,
  removeParticipant,
  updateParticipant,
  setCallModalOpen,
  setCallError,
  clearCallError,
  clearCallState
} = callsSlice.actions;

export default callsSlice.reducer;
