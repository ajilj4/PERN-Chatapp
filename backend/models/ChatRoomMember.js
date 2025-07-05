const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ChatRoomMember = sequelize.define('ChatRoomMember', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  room_id: { type: DataTypes.UUID },
  user_id: { type: DataTypes.UUID },
  is_admin: { type: DataTypes.BOOLEAN, defaultValue: false }
},{
    timestamps:true,
    paranoid:true
});

module.exports = ChatRoomMember;
