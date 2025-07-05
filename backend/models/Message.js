const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  room_id: { type: DataTypes.UUID },
  sender_id: { type: DataTypes.UUID },
  content: { type: DataTypes.TEXT },
  type: { type: DataTypes.ENUM('text', 'image', 'video', 'file', 'audio'), defaultValue: 'text' }
}, { timestamps: true,
    paranoid:true
 });

module.exports = Message;
