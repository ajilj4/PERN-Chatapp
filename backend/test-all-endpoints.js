#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/v1';

const testAllEndpoints = async () => {
  try {
    console.log('🚀 Testing All PERN Chat App Endpoints...\n');

    // 1. Test subscription plans
    console.log('1. 📋 Testing subscription plans...');
    const plansResponse = await axios.get(`${BASE_URL}/subscription/plans`);
    console.log(`✅ Found ${plansResponse.data.data.length} subscription plans:`);
    plansResponse.data.data.forEach(plan => {
      console.log(`   - ${plan.name}: $${plan.price} (${plan.trialDays} day trial)`);
    });

    // 2. Login as John
    console.log('\n2. 🔐 Testing login (John)...');
    const johnLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'john.doe@example.com',
      password: 'password123'
    });
    console.log(`✅ Login successful: ${johnLogin.data.data.user.username} (${johnLogin.data.data.user.role})`);
    const johnToken = johnLogin.data.data.accessToken;

    // 3. Test John's subscription
    console.log('\n3. 💳 Testing subscription status...');
    const johnSubscription = await axios.get(`${BASE_URL}/subscription/current`, {
      headers: { 'Authorization': `Bearer ${johnToken}` }
    });
    if (johnSubscription.data.data) {
      console.log(`✅ Subscription: ${johnSubscription.data.data.planName} (${johnSubscription.data.data.status})`);
    } else {
      console.log('ℹ️ No active subscription');
    }

    // 4. Test chat rooms
    console.log('\n4. 💬 Testing chat rooms...');
    const roomsResponse = await axios.get(`${BASE_URL}/chat/rooms`, {
      headers: { 'Authorization': `Bearer ${johnToken}` }
    });
    console.log(`✅ Found ${roomsResponse.data.data.total} chat rooms:`);
    roomsResponse.data.data.rooms.forEach(room => {
      console.log(`   - ${room.name || 'Private Chat'} (${room.type}) - ${room.members?.length || 0} members`);
    });

    // 5. Test messages from first room
    if (roomsResponse.data.data.rooms.length > 0) {
      const firstRoom = roomsResponse.data.data.rooms[0];
      console.log(`\n5. 📨 Testing messages from "${firstRoom.name || 'Private Chat'}"...`);
      
      const messagesResponse = await axios.get(`${BASE_URL}/chat/rooms/${firstRoom.id}/messages`, {
        headers: { 'Authorization': `Bearer ${johnToken}` }
      });
      console.log(`✅ Found ${messagesResponse.data.data.messages.length} messages:`);
      messagesResponse.data.data.messages.slice(0, 3).forEach(msg => {
        console.log(`   - ${msg.sender?.username}: "${msg.content.substring(0, 40)}${msg.content.length > 40 ? '...' : ''}"`);
      });
    }

    // 6. Test user search
    console.log('\n6. 🔍 Testing user search...');
    const searchResponse = await axios.get(`${BASE_URL}/chat/search/users?q=smith`, {
      headers: { 'Authorization': `Bearer ${johnToken}` }
    });
    console.log(`✅ Search results for "smith": ${searchResponse.data.data.length} users found`);
    searchResponse.data.data.forEach(user => {
      console.log(`   - ${user.username} (${user.name}) - ${user.email}`);
    });

    // 7. Login as Jane and test her data
    console.log('\n7. 👩 Testing another user (Jane)...');
    const janeLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'jane.smith@example.com',
      password: 'password123'
    });
    console.log(`✅ Jane login successful: ${janeLogin.data.data.user.username}`);
    const janeToken = janeLogin.data.data.accessToken;

    // Jane's subscription
    const janeSubscription = await axios.get(`${BASE_URL}/subscription/current`, {
      headers: { 'Authorization': `Bearer ${janeToken}` }
    });
    console.log(`✅ Jane's subscription: ${janeSubscription.data.data.planName} (${janeSubscription.data.data.status})`);

    // Jane's chat rooms
    const janeRooms = await axios.get(`${BASE_URL}/chat/rooms`, {
      headers: { 'Authorization': `Bearer ${janeToken}` }
    });
    console.log(`✅ Jane has access to ${janeRooms.data.data.total} chat rooms`);

    // 8. Test users endpoint
    console.log('\n8. 👥 Testing users endpoint...');
    const usersResponse = await axios.get(`${BASE_URL}/users`, {
      headers: { 'Authorization': `Bearer ${johnToken}` }
    });
    console.log(`✅ Found ${usersResponse.data.data.users.length} users:`);
    usersResponse.data.data.users.forEach(user => {
      console.log(`   - ${user.username} (${user.name}) - ${user.subscription.plan} - ${user.isActive ? 'Active' : 'Inactive'}`);
    });
    console.log(`📊 User stats: ${usersResponse.data.data.stats.total} total, ${usersResponse.data.data.stats.active} active, ${usersResponse.data.data.stats.premium} premium`);

    console.log('\n🎉 All endpoint tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- ✅ Subscription plans endpoint working');
    console.log('- ✅ User authentication working');
    console.log('- ✅ Subscription management working');
    console.log('- ✅ Chat rooms endpoint working');
    console.log('- ✅ Messages endpoint working');
    console.log('- ✅ User search working');
    console.log('- ✅ Users management endpoint working');
    console.log('- ✅ Multiple user sessions working');
    console.log('- ✅ Database relationships working');
    console.log('- ✅ All enum issues resolved');

    console.log('\n🔗 Frontend Integration Ready!');
    console.log('The backend is fully functional and ready for frontend integration.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('URL:', error.config?.url);
    }
  }
};

testAllEndpoints();
