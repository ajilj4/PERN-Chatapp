import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';
import {
  addMessage,
  setUserOnlineStatus,
  updateMessage,
  removeMessage
} from '../features/chat/chatSlice';
import {
  receiveIncomingCall,
  endCall,
  updateCallStatus
} from '../features/calls/callsSlice';
import {
  setOnlineUsers,
  setUserOnline,
  setUserOffline
} from '../features/users/usersSlice';
import {
  setConnectionStatus,
  addNotification
} from '../features/ui/uiSlice';
import webrtcService from '../services/webrtcService';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);

  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { currentRoom } = useSelector(state => state.chat);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    const newSocket = socketIOClient(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000', {
      auth: { token: accessToken },
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    setSocket(newSocket);

    // Initialize WebRTC service with socket
    webrtcService.initialize(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      dispatch(setConnectionStatus('connected'));

      // Join user to their personal room
      newSocket.emit('user:join', { userId: user.id });

      // Join current chat room if exists
      if (currentRoom) {
        newSocket.emit('room:join', { roomId: currentRoom.id });
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      dispatch(setConnectionStatus('disconnected'));
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      dispatch(setConnectionStatus('failed'));
    });

    // Setup event listeners
    setupChatListeners(newSocket, dispatch);
    setupPresenceListeners(newSocket, dispatch);
    setupCallListeners(newSocket, dispatch);
    setupNotificationListeners(newSocket, dispatch);

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [isAuthenticated, user, dispatch]);

  // Join/leave rooms when currentRoom changes
  useEffect(() => {
    if (socket && isConnected && currentRoom) {
      socket.emit('room:join', { roomId: currentRoom.id });

      return () => {
        socket.emit('room:leave', { roomId: currentRoom.id });
      };
    }
  }, [socket, isConnected, currentRoom]);

  const socketValue = {
    socket,
    isConnected,
    // Helper methods
    sendMessage: (messageData) => {
      if (socket && isConnected) {
        socket.emit('message:send', messageData);
      }
    },
    joinRoom: (roomId) => {
      if (socket && isConnected) {
        socket.emit('room:join', { roomId });
      }
    },
    leaveRoom: (roomId) => {
      if (socket && isConnected) {
        socket.emit('room:leave', { roomId });
      }
    },
    startCall: (callData) => {
      if (socket && isConnected) {
        socket.emit('call:start', callData);
      }
    },
    endCall: (callId) => {
      if (socket && isConnected) {
        socket.emit('call:end', { callId });
      }
    }
  };

  return (
    <SocketContext.Provider value={socketValue}>
      {children}
    </SocketContext.Provider>
  );
};

// Chat event listeners
function setupChatListeners(socket, dispatch) {
  // New message received
  socket.on('message:new', (message) => {
    dispatch(addMessage(message));

    // Show notification if not in current room
    dispatch(addNotification({
      type: 'message',
      title: `New message from ${message.sender.username}`,
      message: message.content,
      timestamp: new Date().toISOString()
    }));
  });

  // Message updated
  socket.on('message:updated', (message) => {
    dispatch(updateMessage(message));
  });

  // Message deleted
  socket.on('message:deleted', (messageId) => {
    dispatch(removeMessage(messageId));
  });

  // Typing indicators
  socket.on('user:typing', ({ userId, roomId, isTyping }) => {
    // Handle typing indicators
    console.log(`User ${userId} is ${isTyping ? 'typing' : 'stopped typing'} in room ${roomId}`);
  });
}

// Presence event listeners
function setupPresenceListeners(socket, dispatch) {
  // Online users list
  socket.on('presence:online-users', (users) => {
    dispatch(setOnlineUsers(users));
  });

  // User came online
  socket.on('presence:user-online', (userId) => {
    dispatch(setUserOnline(userId));
    dispatch(setUserOnlineStatus({ userId, isOnline: true }));
  });

  // User went offline
  socket.on('presence:user-offline', (userId) => {
    dispatch(setUserOffline(userId));
    dispatch(setUserOnlineStatus({ userId, isOnline: false }));
  });
}

// Call event listeners
function setupCallListeners(socket, dispatch) {
  // Incoming call
  socket.on('call:incoming', (callData) => {
    dispatch(receiveIncomingCall({
      callType: callData.type,
      callerName: callData.caller.username,
      callerEmail: callData.caller.email,
      callerId: callData.caller.id,
      callId: callData.id
    }));
  });

  // Call ended
  socket.on('call:ended', () => {
    dispatch(endCall());
  });

  // Call status update
  socket.on('call:status', ({ status }) => {
    dispatch(updateCallStatus(status));
  });
}

// Notification event listeners
function setupNotificationListeners(socket, dispatch) {
  // System notifications
  socket.on('notification:system', (notification) => {
    dispatch(addNotification({
      type: 'system',
      ...notification
    }));
  });

  // User notifications
  socket.on('notification:user', (notification) => {
    dispatch(addNotification({
      type: 'user',
      ...notification
    }));
  });
}