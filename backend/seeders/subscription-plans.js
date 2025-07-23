const { SubscriptionPlan } = require('../models');

const seedSubscriptionPlans = async () => {
  try {
    // Check if plans already exist
    const existingPlans = await SubscriptionPlan.count();
    if (existingPlans > 0) {
      console.log('Subscription plans already exist, skipping seed...');
      return;
    }

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

    await SubscriptionPlan.bulkCreate(plans);
    console.log('✅ Subscription plans seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding subscription plans:', error);
  }
};

module.exports = seedSubscriptionPlans;

// Run if called directly
if (require.main === module) {
  seedSubscriptionPlans().then(() => process.exit(0));
}
