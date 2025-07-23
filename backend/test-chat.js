#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/v1';

const testChatAPI = async () => {
  try {
    console.log('🧪 Testing Chat API endpoints...\n');

    // First login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'john.doe@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful');
    
    const token = loginResponse.data.data.accessToken;

    // Test chat rooms endpoint
    console.log('\n2. Testing chat rooms endpoint...');
    try {
      const roomsResponse = await axios.get(`${BASE_URL}/chat/rooms`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Chat rooms found:', roomsResponse.data.data.total);
      console.log('   Rooms:', roomsResponse.data.data.rooms.map(r => ({
        id: r.id,
        name: r.name || 'Private Chat',
        type: r.type,
        memberCount: r.members?.length || 0,
        lastActivity: r.last_activity
      })));

      // Test getting messages from first room if available
      if (roomsResponse.data.data.rooms.length > 0) {
        const firstRoom = roomsResponse.data.data.rooms[0];
        console.log('\n3. Testing messages endpoint...');

        const messagesResponse = await axios.get(`${BASE_URL}/chat/rooms/${firstRoom.id}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Messages found:', messagesResponse.data.data.messages.length);
        console.log('   Sample messages:', messagesResponse.data.data.messages.slice(0, 3).map(m => ({
          sender: m.sender?.username,
          content: m.content.substring(0, 50) + (m.content.length > 50 ? '...' : ''),
          createdAt: m.createdAt
        })));
      }

      // Test search users endpoint
      console.log('\n4. Testing search users endpoint...');
      const searchResponse = await axios.get(`${BASE_URL}/chat/search/users?q=jane`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Search results:', searchResponse.data.data.length, 'users found');
      console.log('   Users:', searchResponse.data.data.map(u => ({
        username: u.username,
        name: u.name,
        email: u.email
      })));

    } catch (error) {
      console.error('❌ Chat API error:', error.response?.data || error.message);
      console.error('Status:', error.response?.status);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testChatAPI();
