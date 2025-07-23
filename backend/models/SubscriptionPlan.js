const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING },
  price: { type: DataTypes.DECIMAL },
  description: { type: DataTypes.TEXT },
  features: { type: DataTypes.TEXT }, // JSON string
  limitations: { type: DataTypes.TEXT }, // JSON string
  trial_days: { type: DataTypes.INTEGER, defaultValue: 0 },
  duration_days: { type: DataTypes.INTEGER },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = SubscriptionPlan;
