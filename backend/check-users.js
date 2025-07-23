#!/usr/bin/env node

require('dotenv').config();
const { User, UserSubscription, SubscriptionPlan } = require('./models');

const checkUsers = async () => {
  try {
    console.log('🔍 Checking database users...\n');

    // Get all users
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'name', 'is_active'],
      include: [{
        model: UserSubscription,
        include: [{
          model: SubscriptionPlan,
          attributes: ['name', 'price']
        }]
      }]
    });

    console.log(`Found ${users.length} users in database:`);
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.username} (${user.email})`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Active: ${user.is_active}`);
      console.log(`   ID: ${user.id}`);
      
      if (user.UserSubscriptions && user.UserSubscriptions.length > 0) {
        user.UserSubscriptions.forEach(sub => {
          console.log(`   Subscription: ${sub.SubscriptionPlan?.name || 'Unknown'} - ${sub.status}`);
        });
      } else {
        console.log(`   Subscription: None`);
      }
    });

    // Test specific user
    console.log('\n🔍 Testing specific user lookup...');
    const johnUser = await User.findOne({ 
      where: { email: 'john.doe@example.com' },
      attributes: ['id', 'username', 'email', 'password']
    });
    
    if (johnUser) {
      console.log('✅ John Doe found:');
      console.log(`   Username: ${johnUser.username}`);
      console.log(`   Email: ${johnUser.email}`);
      console.log(`   Password hash exists: ${johnUser.password ? 'Yes' : 'No'}`);
      console.log(`   Password hash length: ${johnUser.password ? johnUser.password.length : 0}`);
    } else {
      console.log('❌ John Doe not found');
    }

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    process.exit(0);
  }
};

checkUsers();
