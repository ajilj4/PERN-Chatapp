const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CallSession = sequelize.define('CallSession', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  room_id: { type: DataTypes.UUID },
  initiated_by: { type: DataTypes.UUID },
  type: { type: DataTypes.ENUM('audio', 'video') },
  started_at: { type: DataTypes.DATE },
  ended_at: { type: DataTypes.DATE },
  status: { type: DataTypes.ENUM('missed', 'completed', 'cancelled') }
});

module.exports = CallSession;
