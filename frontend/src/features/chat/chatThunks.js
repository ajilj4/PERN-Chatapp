import chatService from '../../api/chatService';
import { addMessage, updateMessage, removeMessage } from './chatSlice';

export const fetchContacts = () => async (dispatch) => {
  try {
    const response = await chatService.getContacts();
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchRooms = () => async (dispatch) => {
  try {
    const response = await chatService.getUserRooms();
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchRoomDetails = (roomId) => async (dispatch) => {
  try {
    const response = await chatService.getRoomDetails(roomId);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchMessages = (roomId, params) => async (dispatch) => {
  try {
    const response = await chatService.getMessages(roomId, params);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

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

export const createRoom = (roomData) => async (dispatch) => {
  try {
    const response = await chatService.createRoom(roomData);
    return response.data; // Return the created room
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