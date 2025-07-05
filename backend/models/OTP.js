const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OTP = sequelize.define('OTP', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  phone: { type: DataTypes.STRING },
  otp_code: { type: DataTypes.STRING },
  expires_at: { type: DataTypes.DATE },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = OTP;
