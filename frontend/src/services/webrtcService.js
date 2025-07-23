import { store } from '../app/store';
import {
  setLocalStream,
  setRemoteStream,
  setPeerConnection,
  updateConnectionStatus,
  setCallError,
  endCall,
  receiveIncomingCall
} from '../features/calls/callsSlice';

class WebRTCService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.socket = null;
    this.isInitiator = false;
    
    // WebRTC configuration
    this.configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // Add TURN servers for production
        // {
        //   urls: 'turn:your-turn-server.com:3478',
        //   username: 'username',
        //   credential: 'password'
        // }
      ]
    };
  }

  // Initialize WebRTC service with socket
  initialize(socket) {
    this.socket = socket;
    this.setupSocketListeners();
  }

  // Setup socket event listeners for signaling
  setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('call:offer', this.handleOffer.bind(this));
    this.socket.on('call:answer', this.handleAnswer.bind(this));
    this.socket.on('call:ice-candidate', this.handleIceCandidate.bind(this));
    this.socket.on('call:end', this.handleCallEnd.bind(this));
  }

  // Start a call (initiator)
  async startCall(callType = 'audio', targetUserId) {
    try {
      this.isInitiator = true;
      store.dispatch(updateConnectionStatus('connecting'));

      // Get user media
      await this.getUserMedia(callType);
      
      // Create peer connection
      this.createPeerConnection();
      
      // Add local stream to peer connection
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, this.localStream);
        });
      }

      // Create and send offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      this.socket.emit('call:offer', {
        targetUserId,
        offer,
        callType
      });

    } catch (error) {
      console.error('Error starting call:', error);
      store.dispatch(setCallError(error.message));
      store.dispatch(updateConnectionStatus('failed'));
    }
  }

  // Answer a call (receiver)
  async answerCall(offer, callType = 'audio') {
    try {
      this.isInitiator = false;
      store.dispatch(updateConnectionStatus('connecting'));

      // Get user media
      await this.getUserMedia(callType);
      
      // Create peer connection
      this.createPeerConnection();
      
      // Add local stream to peer connection
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, this.localStream);
        });
      }

      // Set remote description and create answer
      await this.peerConnection.setRemoteDescription(offer);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      
      this.socket.emit('call:answer', { answer });

    } catch (error) {
      console.error('Error answering call:', error);
      store.dispatch(setCallError(error.message));
      store.dispatch(updateConnectionStatus('failed'));
    }
  }

  // Get user media (camera/microphone)
  async getUserMedia(callType) {
    try {
      const constraints = {
        audio: true,
        video: callType === 'video'
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      store.dispatch(setLocalStream(this.localStream));
      
      return this.localStream;
    } catch (error) {
      console.error('Error getting user media:', error);
      throw new Error('Could not access camera/microphone');
    }
  }

  // Create peer connection
  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.configuration);
    store.dispatch(setPeerConnection(this.peerConnection));

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('call:ice-candidate', {
          candidate: event.candidate
        });
      }
    };

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      store.dispatch(setRemoteStream(this.remoteStream));
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection.connectionState;
      store.dispatch(updateConnectionStatus(state));
      
      if (state === 'failed' || state === 'disconnected') {
        this.endCall();
      }
    };

    return this.peerConnection;
  }

  // Handle incoming offer
  async handleOffer({ offer, callType, callerInfo }) {
    try {
      // This would trigger the incoming call UI
      // The actual answer logic is in answerCall method
      store.dispatch(receiveIncomingCall({
        offer,
        callType,
        callerName: callerInfo.name,
        callerEmail: callerInfo.email,
        callerId: callerInfo.id
      }));
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  // Handle incoming answer
  async handleAnswer({ answer }) {
    try {
      await this.peerConnection.setRemoteDescription(answer);
      store.dispatch(updateConnectionStatus('connected'));
    } catch (error) {
      console.error('Error handling answer:', error);
      store.dispatch(setCallError(error.message));
    }
  }

  // Handle ICE candidate
  async handleIceCandidate({ candidate }) {
    try {
      await this.peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }

  // Handle call end
  handleCallEnd() {
    this.endCall();
  }

  // End call
  endCall() {
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Reset remote stream
    this.remoteStream = null;

    // Notify other party
    if (this.socket) {
      this.socket.emit('call:end');
    }

    // Update Redux state
    store.dispatch(endCall());
  }

  // Toggle mute
  toggleMute() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return !audioTrack.enabled; // Return muted state
      }
    }
    return false;
  }

  // Toggle video
  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled; // Return enabled state
      }
    }
    return false;
  }
}

// Create singleton instance
const webrtcService = new WebRTCService();
export default webrtcService;
