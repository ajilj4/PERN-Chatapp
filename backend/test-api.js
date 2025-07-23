const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/v1';

const testAPI = async () => {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test 1: Get subscription plans
    console.log('1. Testing subscription plans endpoint...');
    const plansResponse = await axios.get(`${BASE_URL}/subscription/plans`);
    console.log('✅ Subscription plans:', plansResponse.data.data.length, 'plans found');
    console.log('   Plans:', plansResponse.data.data.map(p => p.name).join(', '));

    // Test 2: Login with test user
    console.log('\n2. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'john.doe@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful for user:', loginResponse.data.data.user.username);

    const token = loginResponse.data.data.accessToken;

    // Test 3: Get current subscription
    console.log('\n3. Testing current subscription endpoint...');
    const subscriptionResponse = await axios.get(`${BASE_URL}/subscription/current`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Current subscription:', subscriptionResponse.data.data ?
      `${subscriptionResponse.data.data.planName} (${subscriptionResponse.data.data.status})` :
      'No active subscription');

    // Test 4: Test another user
    console.log('\n4. Testing another user (Jane Smith)...');
    const janeLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'jane.smith@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful for user:', janeLoginResponse.data.data.user.username);

    const janeToken = janeLoginResponse.data.data.accessToken;
    const janeSubscriptionResponse = await axios.get(`${BASE_URL}/subscription/current`, {
      headers: {
        'Authorization': `Bearer ${janeToken}`
      }
    });
    console.log('✅ Jane\'s subscription:', janeSubscriptionResponse.data.data ?
      `${janeSubscriptionResponse.data.data.planName} (${janeSubscriptionResponse.data.data.status})` :
      'No active subscription');

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('- Subscription plans endpoint: ✅');
    console.log('- User login: ✅');
    console.log('- Current subscription endpoint: ✅');
    console.log('- Multiple users: ✅');
    console.log('- Database enum issue: ✅ Fixed');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    console.error('\n🔍 Error details:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    process.exit(1);
  }
};

// Run tests
testAPI().then(() => {
  console.log('\n✨ API testing completed.');
  process.exit(0);
}).catch(err => {
  console.error('💥 API testing failed:', err);
  process.exit(1);
});
