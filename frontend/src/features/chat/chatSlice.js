import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contacts: [],
  rooms: [],
  currentRoom: null,
  messages: [],
  loading: false,
  error: null,
  searchResults: [],
  activeContacts: [],
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
   
    // Async thunk handlers would go here
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