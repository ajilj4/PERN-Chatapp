const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ChatRoom = sequelize.define('ChatRoom', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  type: { type: DataTypes.ENUM('private', 'group'), defaultValue: 'private' }
},{
    timestamps:true,
    paranoid:true
});

module.exports = ChatRoom;
