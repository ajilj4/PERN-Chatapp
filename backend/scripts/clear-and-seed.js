#!/usr/bin/env node

require('dotenv').config();
const { User, UserSubscription, SubscriptionPlan } = require('../models');
const bcrypt = require('bcrypt');

const clearAndSeed = async () => {
  try {
    console.log('🧹 Clearing existing data and seeding fresh data...\n');

    // Clear existing user subscriptions first (due to foreign key constraints)
    console.log('🗑️ Clearing existing user subscriptions...');
    await UserSubscription.destroy({ where: {}, force: true });
    console.log('✅ User subscriptions cleared.\n');

    // Clear existing users
    console.log('🗑️ Clearing existing users...');
    await User.destroy({ where: {}, force: true });
    console.log('✅ Users cleared.\n');

    // Clear existing subscription plans
    console.log('🗑️ Clearing existing subscription plans...');
    await SubscriptionPlan.destroy({ where: {}, force: true });
    console.log('✅ Subscription plans cleared.\n');

    // Create subscription plans
    console.log('📋 Creating subscription plans...');
    const plans = [
      {
        name: 'Free',
        price: 0.00,
        description: 'Basic chat functionality',
        features: JSON.stringify([
          'Text messaging',
          'Basic audio calls',
          'Up to 5 chat rooms',
          'File sharing (10MB limit)'
        ]),
        limitations: JSON.stringify([
          'No video calls',
          'Limited file storage',
          'No premium themes'
        ]),
        trial_days: 0,
        duration_days: 365,
        is_active: true
      },
      {
        name: 'Pro',
        price: 9.99,
        description: 'Enhanced features for power users',
        features: JSON.stringify([
          'Everything in Free',
          'Video calls',
          'Unlimited chat rooms',
          'File sharing (100MB limit)',
          'Premium themes',
          'Message history export'
        ]),
        limitations: JSON.stringify([]),
        trial_days: 14,
        duration_days: 30,
        is_active: true
      },
      {
        name: 'Premium',
        price: 19.99,
        description: 'Full-featured experience',
        features: JSON.stringify([
          'Everything in Pro',
          'Group video calls (up to 10 people)',
          'File sharing (1GB limit)',
          'Advanced admin controls',
          'Priority support',
          'Custom integrations'
        ]),
        limitations: JSON.stringify([]),
        trial_days: 14,
        duration_days: 30,
        is_active: true
      }
    ];

    const createdPlans = await SubscriptionPlan.bulkCreate(plans);
    console.log(`✅ Created ${createdPlans.length} subscription plans.\n`);

    // Create users
    console.log('👥 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        username: 'john_doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        name: 'John Doe',
        password: hashedPassword,
        role: 'user',
        is_active: true,
        is_verified: true,
        status_message: "Hey there! I'm John and I love chatting!",
        profile: null
      },
      {
        username: 'jane_smith',
        email: 'jane.smith@example.com',
        phone: '+1234567891',
        name: 'Jane Smith',
        password: hashedPassword,
        role: 'user',
        is_active: true,
        is_verified: true,
        status_message: "Available for chat 24/7!",
        profile: null
      },
      {
        username: 'mike_wilson',
        email: 'mike.wilson@example.com',
        phone: '+1234567892',
        name: 'Mike Wilson',
        password: hashedPassword,
        role: 'user',
        is_active: true,
        is_verified: true,
        status_message: "Let's connect and share ideas!",
        profile: null
      },
      {
        username: 'sarah_johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1234567893',
        name: 'Sarah Johnson',
        password: hashedPassword,
        role: 'admin',
        is_active: true,
        is_verified: true,
        status_message: "Admin here - always ready to help!",
        profile: null
      },
      {
        username: 'alex_brown',
        email: 'alex.brown@example.com',
        phone: '+1234567894',
        name: 'Alex Brown',
        password: hashedPassword,
        role: 'user',
        is_active: false,
        is_verified: true,
        status_message: "Currently away, will be back soon!",
        profile: null
      }
    ];

    const createdUsers = await User.bulkCreate(users);
    console.log(`✅ Created ${createdUsers.length} users.\n`);

    // Get plans for subscriptions
    const freePlan = await SubscriptionPlan.findOne({ where: { name: 'Free' } });
    const proPlan = await SubscriptionPlan.findOne({ where: { name: 'Pro' } });
    const premiumPlan = await SubscriptionPlan.findOne({ where: { name: 'Premium' } });

    // Create user subscriptions
    console.log('💳 Creating user subscriptions...');
    const userSubscriptions = [
      {
        user_id: createdUsers[0].id, // John Doe
        plan_id: proPlan.id,
        status: 'trialing',
        start_date: new Date(),
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
        payment_id: null
      },
      {
        user_id: createdUsers[1].id, // Jane Smith
        plan_id: premiumPlan.id,
        status: 'active',
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Started 30 days ago
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Ends in 30 days
        payment_id: 'pm_test_jane_premium'
      },
      {
        user_id: createdUsers[2].id, // Mike Wilson
        plan_id: freePlan.id,
        status: 'active',
        start_date: new Date(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        payment_id: null
      },
      {
        user_id: createdUsers[3].id, // Sarah Johnson (Admin)
        plan_id: premiumPlan.id,
        status: 'active',
        start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // Started 60 days ago
        end_date: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000), // Long term
        payment_id: 'pm_test_sarah_premium'
      },
      {
        user_id: createdUsers[4].id, // Alex Brown
        plan_id: proPlan.id,
        status: 'expired',
        start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        end_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Expired 10 days ago
        payment_id: 'pm_test_alex_expired'
      }
    ];

    const createdSubscriptions = await UserSubscription.bulkCreate(userSubscriptions);
    console.log(`✅ Created ${createdSubscriptions.length} user subscriptions.\n`);

    // Seed chat data
    console.log('💬 Seeding chat data...');
    const seedChatData = require('../seeders/chat-data');
    await seedChatData();
    console.log('✅ Chat data seeded successfully.\n');

    console.log('🎉 Database cleared and seeded successfully!');
    console.log('\n📋 Test Users Created:');
    console.log('1. john_doe (john.doe@example.com) - Pro Trial');
    console.log('2. jane_smith (jane.smith@example.com) - Premium Active');
    console.log('3. mike_wilson (mike.wilson@example.com) - Free Active');
    console.log('4. sarah_johnson (sarah.johnson@example.com) - Premium Active (Admin)');
    console.log('5. alex_brown (alex.brown@example.com) - Pro Expired');
    console.log('\n🔑 All users have password: password123');

  } catch (error) {
    console.error('❌ Error clearing and seeding:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

clearAndSeed();
