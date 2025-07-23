// Test script to verify new API routes
const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/v1';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

async function testRoutes() {
  try {
    console.log('🚀 Testing API Routes...\n');

    // Test subscription routes
    console.log('📋 Testing Subscription Routes:');
    
    try {
      const plansResponse = await axios.get(`${BASE_URL}/subscription/plans`);
      console.log('✅ GET /subscription/plans:', plansResponse.status);
    } catch (error) {
      console.log('❌ GET /subscription/plans:', error.response?.status || 'Failed');
    }

    // Test user routes (requires auth)
    console.log('\n👥 Testing User Routes:');
    
    try {
      // This will fail without auth token, which is expected
      const usersResponse = await axios.get(`${BASE_URL}/users`);
      console.log('✅ GET /users:', usersResponse.status);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ GET /users: 401 (Auth required - Expected)');
      } else {
        console.log('❌ GET /users:', error.response?.status || 'Failed');
      }
    }

    // Test auth routes
    console.log('\n🔐 Testing Auth Routes:');
    
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
      console.log('✅ POST /auth/login:', loginResponse.status);
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 401) {
        console.log('✅ POST /auth/login: Auth endpoint working (credentials may be invalid)');
      } else {
        console.log('❌ POST /auth/login:', error.response?.status || 'Failed');
      }
    }

    // Test chat routes
    console.log('\n💬 Testing Chat Routes:');
    
    try {
      const roomsResponse = await axios.get(`${BASE_URL}/chat/rooms`);
      console.log('✅ GET /chat/rooms:', roomsResponse.status);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ GET /chat/rooms: 401 (Auth required - Expected)');
      } else {
        console.log('❌ GET /chat/rooms:', error.response?.status || 'Failed');
      }
    }

    console.log('\n🎉 Route testing completed!');
    console.log('\nNote: 401 errors are expected for protected routes without authentication.');
    console.log('To fully test protected routes, first login and use the returned JWT token.');

  } catch (error) {
    console.error('❌ Error testing routes:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testRoutes();
}

module.exports = testRoutes;
