const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: { // Who performed the action
    type: DataTypes.UUID,
    allowNull: false
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., login, updated_profile, deleted_message'
  },
  target_type: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g., Message, User, ChatRoom'
  },
  target_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Extra context like IP, payload, etc.'
  }
}, {
  tableName: 'activities',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['action'] },
    { fields: ['target_type', 'target_id'] }
  ]
});

module.exports = Activity;
