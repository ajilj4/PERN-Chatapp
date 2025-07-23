const bcrypt = require('bcrypt');
const { User, SubscriptionPlan, UserSubscription } = require('../models');

const seedUsers = async () => {
  try {
    console.log('🌱 Starting user seeding...');

    // Check if users already exist
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log('👥 Users already exist, skipping seeding...');
      return;
    }

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        id: '1ebd2981-b433-4861-99d8-458c21056212',
        username: 'john_doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        name: 'John Doe',
        password: hashedPassword,
        role: 'user',
        is_active: true,
        status_message: "Hey there! I'm John and I love chatting!",
        profile: null
      },
      {
        id: '2fcd3982-c544-5972-a0e9-569d32167323',
        username: 'jane_smith',
        email: 'jane.smith@example.com',
        phone: '+1234567891',
        name: 'Jane Smith',
        password: hashedPassword,
        role: 'user',
        is_active: true,
        status_message: "Available for chat 24/7!",
        profile: null
      },
      {
        id: '3gde4093-d655-6083-b1fa-67ae43278434',
        username: 'mike_wilson',
        email: 'mike.wilson@example.com',
        phone: '+1234567892',
        name: 'Mike Wilson',
        password: hashedPassword,
        role: 'user',
        is_active: true,
        status_message: "Let's connect and share ideas!",
        profile: null
      },
      {
        id: '4hef5104-e766-7194-c2gb-78bf54389545',
        username: 'sarah_johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1234567893',
        name: 'Sarah Johnson',
        password: hashedPassword,
        role: 'admin',
        is_active: true,
        status_message: "Admin here - always ready to help!",
        profile: null
      },
      {
        id: '5ifg6215-f877-8205-d3hc-89cg65490656',
        username: 'alex_brown',
        email: 'alex.brown@example.com',
        phone: '+1234567894',
        name: 'Alex Brown',
        password: hashedPassword,
        role: 'user',
        is_active: false,
        status_message: "Currently away, will be back soon!",
        profile: null
      },
      {
        id: '6jgh7326-g988-9316-e4id-90dh76501767',
        username: 'emma_davis',
        email: 'emma.davis@example.com',
        phone: '+1234567895',
        name: 'Emma Davis',
        password: hashedPassword,
        role: 'user',
        is_active: true,
        status_message: "Love connecting with new people!",
        profile: null
      },
      {
        id: '7khi8437-h099-0427-f5je-01ei87612878',
        username: 'david_miller',
        email: 'david.miller@example.com',
        phone: '+1234567896',
        name: 'David Miller',
        password: hashedPassword,
        role: 'user',
        is_active: true,
        status_message: "Tech enthusiast and chat lover!",
        profile: null
      }
    ];

    // Create users
    const createdUsers = await User.bulkCreate(users);
    console.log(`✅ Created ${createdUsers.length} users successfully!`);

    // Get subscription plans for assigning to users
    const freePlan = await SubscriptionPlan.findOne({ where: { name: 'Free' } });
    const proPlan = await SubscriptionPlan.findOne({ where: { name: 'Pro' } });
    const premiumPlan = await SubscriptionPlan.findOne({ where: { name: 'Premium' } });

    if (!freePlan || !proPlan || !premiumPlan) {
      console.log('⚠️  Subscription plans not found. Please seed subscription plans first.');
      return;
    }

    // Create user subscriptions
    const userSubscriptions = [
      {
        user_id: '1ebd2981-b433-4861-99d8-458c21056212', // John Doe
        plan_id: proPlan.id,
        status: 'trialing',
        start_date: new Date(),
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
        payment_id: null
      },
      {
        user_id: '2fcd3982-c544-5972-a0e9-569d32167323', // Jane Smith
        plan_id: premiumPlan.id,
        status: 'active',
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Started 30 days ago
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Ends in 30 days
        payment_id: 'pm_test_jane_premium'
      },
      {
        user_id: '3gde4093-d655-6083-b1fa-67ae43278434', // Mike Wilson
        plan_id: freePlan.id,
        status: 'active',
        start_date: new Date(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        payment_id: null
      },
      {
        user_id: '4hef5104-e766-7194-c2gb-78bf54389545', // Sarah Johnson (Admin)
        plan_id: premiumPlan.id,
        status: 'active',
        start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // Started 60 days ago
        end_date: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000), // Long term
        payment_id: 'pm_test_sarah_premium'
      },
      {
        user_id: '5ifg6215-f877-8205-d3hc-89cg65490656', // Alex Brown
        plan_id: proPlan.id,
        status: 'expired',
        start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        end_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Expired 10 days ago
        payment_id: 'pm_test_alex_expired'
      },
      {
        user_id: '6jgh7326-g988-9316-e4id-90dh76501767', // Emma Davis
        plan_id: proPlan.id,
        status: 'trialing',
        start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Started 5 days ago
        end_date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days left in trial
        payment_id: null
      },
      {
        user_id: '7khi8437-h099-0427-f5je-01ei87612878', // David Miller
        plan_id: freePlan.id,
        status: 'active',
        start_date: new Date(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        payment_id: null
      }
    ];

    const createdSubscriptions = await UserSubscription.bulkCreate(userSubscriptions);
    console.log(`✅ Created ${createdSubscriptions.length} user subscriptions successfully!`);

    console.log('🎉 User seeding completed successfully!');
    console.log('\n📋 Test Users Created:');
    console.log('1. john_doe (john.doe@example.com) - Pro Trial');
    console.log('2. jane_smith (jane.smith@example.com) - Premium Active');
    console.log('3. mike_wilson (mike.wilson@example.com) - Free Active');
    console.log('4. sarah_johnson (sarah.johnson@example.com) - Premium Active (Admin)');
    console.log('5. alex_brown (alex.brown@example.com) - Pro Expired');
    console.log('6. emma_davis (emma.davis@example.com) - Pro Trial');
    console.log('7. david_miller (david.miller@example.com) - Free Active');
    console.log('\n🔑 All users have password: password123');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

module.exports = seedUsers;

// Run if called directly
if (require.main === module) {
  seedUsers().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
