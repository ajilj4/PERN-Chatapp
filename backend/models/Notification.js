const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {  // Receiver
    type: DataTypes.UUID,
    allowNull: false
  },
  actor_id: {  // Initiator
    type: DataTypes.UUID,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., message_received, call_missed, payment_success'
  },
  payload: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['actor_id'] },
    { fields: ['type'] },
    { fields: ['is_read'] }
  ]
});

module.exports = Notification;
