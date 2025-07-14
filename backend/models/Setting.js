// models/Setting.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'settings',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      name: 'unique_user_key_pair',
      fields: ['user_id', 'key']
    }
  ]
});

module.exports = Setting;
