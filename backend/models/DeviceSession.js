const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DeviceSession = sequelize.define('DeviceSession', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID },
  device_info: { type: DataTypes.STRING },
  ip: { type: DataTypes.STRING },
  refresh_token: { type: DataTypes.TEXT },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = DeviceSession;
