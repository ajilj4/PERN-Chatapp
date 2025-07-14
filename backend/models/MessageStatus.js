const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MessageStatus = sequelize.define('MessageStatus', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    message_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('sent', 'delivered', 'read'),
        defaultValue: 'sent'
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['message_id', 'user_id']
        }
    ]
});

module.exports = MessageStatus;