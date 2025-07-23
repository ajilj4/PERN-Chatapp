import { createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../../api/chatService';

// Fetch user's chat rooms
export const fetchRooms = createAsyncThunk(
  'chat/fetchRooms',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await chatService.getUserRooms(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rooms');
    }
  }
);

// Fetch room details
export const fetchRoomDetails = createAsyncThunk(
  'chat/fetchRoomDetails',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await chatService.getRoomDetails(roomId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch room details');
    }
  }
);

// Fetch messages for a room
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ roomId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await chatService.getMessages(roomId, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

// Send a new message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ roomId, content, type = 'text', replyTo, attachment }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(roomId, { content, type, replyTo }, attachment);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

// Search users
export const searchUsers = createAsyncThunk(
  'chat/searchUsers',
  async (query, { rejectWithValue }) => {
    try {
      const response = await chatService.searchUsers(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search users');
    }
  }
);

// Create a new room
export const createRoom = createAsyncThunk(
  'chat/createRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await chatService.createRoom(roomData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create room');
    }
  }
);

// Fetch user's contacts
export const fetchContacts = createAsyncThunk(
  'chat/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getContacts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contacts');
    }
  }
);



export const sendNewMessage = (roomId, content, attachment) => async (dispatch) => {
  try {
    const response = await chatService.sendMessage(roomId, { content }, attachment);
    dispatch(addMessage(response.data));
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateExistingMessage = (messageId, content) => async (dispatch) => {
  try {
    const response = await chatService.editMessage(messageId, content);
    dispatch(updateMessage(response.data));
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteExistingMessage = (messageId) => async (dispatch) => {
  try {
    await chatService.deleteMessage(messageId);
    dispatch(removeMessage(messageId));
  } catch (error) {
    throw error.response.data;
  }
};



export const markAsRead = (messageId) => async (dispatch) => {
  try {
    const response = await chatService.markAsRead(messageId);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Other thunks for creating rooms, adding members, etc.