

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ChatRoom = sequelize.define('ChatRoom', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true // null for private chats
    },
    type: {
        type: DataTypes.ENUM('private', 'group'),
        defaultValue: 'private'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: false
    },
    last_message_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    last_activity: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    paranoid: true
});

module.exports = ChatRoom;