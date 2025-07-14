

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    room_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    sender_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('text', 'image', 'video', 'file', 'audio', 'system'),
        defaultValue: 'text'
    },
    reply_to: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Messages',
            key: 'id'
        }
    },
    is_edited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    edited_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    metadata: {
        type: DataTypes.JSONB,
        defaultValue: {}
    }
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Message;