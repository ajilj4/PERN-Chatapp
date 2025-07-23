import { createSlice } from '@reduxjs/toolkit';
import {
  fetchRooms,
  fetchRoomDetails,
  fetchMessages,
  sendMessage,
  searchUsers,
  createRoom,
  fetchContacts
} from './chatThunks';

const initialState = {
  rooms: [],
  currentRoom: null,
  messages: [],
  contacts: [],
  loading: false,
  error: null,
  searchResults: [],
  searchLoading: false,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0
  },
  messagesLoading: false,
  sendingMessage: false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentRoom(state, action) {
      state.currentRoom = action.payload;
      state.messages = [];
    },
    
    addMessage(state, action) {
      state.messages.push(action.payload);
      
      // Update last message in room list
      if (state.currentRoom?.id === action.payload.room_id) {
        state.rooms = state.rooms.map(room => 
          room.id === action.payload.room_id 
            ? { ...room, lastMessage: action.payload } 
            : room
        );
      }
    },
    
    updateMessage(state, action) {
      state.messages = state.messages.map(msg => 
        msg.id === action.payload.id ? action.payload : msg
      );
    },
    
    removeMessage(state, action) {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
    
    setUserOnlineStatus(state, action) {
      const { userId, isOnline } = action.payload;
      state.contacts = state.contacts.map(contact => 
        contact.id === userId ? { ...contact, is_online: isOnline } : contact
      );
      
      state.rooms = state.rooms.map(room => {
        const updatedMembers = room.members.map(member => 
          member.user.id === userId ? { ...member, user: { ...member.user, is_online: isOnline } } : member
        );
        return { ...room, members: updatedMembers };
      });
    },
    
    clearChatState(state) {
      Object.assign(state, initialState);
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch rooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload.data.rooms || [];
        state.pagination = {
          page: action.payload.data.page || 1,
          totalPages: action.payload.data.totalPages || 1,
          total: action.payload.data.total || 0
        };
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch room details
      .addCase(fetchRoomDetails.fulfilled, (state, action) => {
        state.currentRoom = action.payload.data;
      })

      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.messages = action.payload.data.messages || [];
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload;
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        if (action.payload.data) {
          state.messages.push(action.payload.data);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload;
      })

      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.data || [];
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })

      // Create room
      .addCase(createRoom.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.rooms.unshift(action.payload.data);
        }
      })

      // Fetch contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data || [];
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setCurrentRoom, 
  addMessage, 
  updateMessage, 
  removeMessage,
  setUserOnlineStatus,
  clearChatState
} = chatSlice.actions;

export default chatSlice.reducer;