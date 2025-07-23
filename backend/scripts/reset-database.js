#!/usr/bin/env node

require('dotenv').config();
const sequelize = require('../config/db');
const seedSubscriptionPlans = require('../seeders/subscription-plans');
const seedUsers = require('../seeders/users');

const resetDatabase = async () => {
  try {
    console.log('🔄 Resetting database...\n');

    // Test database connection
    console.log('🔌 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Drop and recreate all tables
    console.log('🗑️ Dropping all tables...');
    await sequelize.drop();
    console.log('✅ All tables dropped successfully.\n');

    // Sync database schema (create tables)
    console.log('📊 Creating database schema...');
    await sequelize.sync({ force: true });
    console.log('✅ Database schema created successfully.\n');

    // Seed subscription plans first (required for user subscriptions)
    console.log('📋 Seeding subscription plans...');
    await seedSubscriptionPlans();
    console.log('✅ Subscription plans seeded successfully.\n');

    // Seed users and their subscriptions
    console.log('👥 Seeding users and subscriptions...');
    await seedUsers();
    console.log('✅ Users and subscriptions seeded successfully.\n');

    console.log('🎉 Database reset and initialization completed successfully!');
    console.log('\n📝 Summary:');
    console.log('- Database connection: ✅');
    console.log('- Tables dropped: ✅');
    console.log('- Schema recreation: ✅');
    console.log('- Subscription plans: ✅');
    console.log('- Users and subscriptions: ✅');
    
    console.log('\n🔑 Test Login Credentials:');
    console.log('Username: john_doe | Email: john.doe@example.com | Password: password123');
    console.log('Username: jane_smith | Email: jane.smith@example.com | Password: password123');
    console.log('Username: sarah_johnson | Email: sarah.johnson@example.com | Password: password123 (Admin)');
    
    console.log('\n🌐 You can now start your application!');

  } catch (error) {
    console.error('❌ Database reset failed:', error);
    console.error('\n🔍 Troubleshooting:');
    console.error('1. Check your database connection settings in .env');
    console.error('2. Ensure PostgreSQL is running');
    console.error('3. Verify database credentials');
    console.error('4. Check if the database exists');
    
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Handle script execution
if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('\n✨ Database reset script completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Database reset script failed:', error);
      process.exit(1);
    });
}

module.exports = resetDatabase;
