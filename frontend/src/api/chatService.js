import axiosClient from './axiosClient';

const BASE = '/v1/chat';

export default {
  createRoom(data) {
    return axiosClient.post(`${BASE}/rooms`, data);
  },
  
  getUserRooms(params) {
    return axiosClient.get(`${BASE}/rooms`, { params });
  },
  
  getRoomDetails(roomId) {
    return axiosClient.get(`${BASE}/rooms/${roomId}`);
  },
  
  getMessages(roomId, params) {
    return axiosClient.get(`${BASE}/rooms/${roomId}/messages`, { params });
  },
  
  sendMessage(roomId, data, attachment) {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('type', data.type || 'text');
    if (data.replyTo) formData.append('replyTo', data.replyTo);
    if (attachment) formData.append('attachment', attachment);
    
    return axiosClient.post(`${BASE}/rooms/${roomId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  editMessage(messageId, content) {
    return axiosClient.put(`${BASE}/messages/${messageId}`, { content });
  },
  
  deleteMessage(messageId) {
    return axiosClient.delete(`${BASE}/messages/${messageId}`);
  },
  
  markAsRead(messageId) {
    return axiosClient.post(`${BASE}/messages/${messageId}/read`);
  },
  
  addMember(roomId, userId) {
    return axiosClient.post(`${BASE}/rooms/${roomId}/members`, { userId });
  },
  
  removeMember(roomId, userId) {
    return axiosClient.delete(`${BASE}/rooms/${roomId}/members/${userId}`);
  },
  
  searchUsers(query) {
    return axiosClient.get(`${BASE}/search/users`, { params: { query } });
  },
  
  getContacts() {
    return axiosClient.get(`${BASE}/contacts`);
  },
};