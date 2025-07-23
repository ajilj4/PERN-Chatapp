const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserSubscription = sequelize.define('UserSubscription', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID },
  plan_id: { type: DataTypes.UUID },
  status: { type: DataTypes.ENUM('active', 'expired', 'cancelled', 'trialing') },
  start_date: { type: DataTypes.DATE },
  end_date: { type: DataTypes.DATE },
  payment_id: { type: DataTypes.STRING }
});

module.exports = UserSubscription;
