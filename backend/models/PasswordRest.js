const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PasswordReset = sequelize.define('PasswordReset', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    is_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['token']
        },
        {
            fields: ['user_id', 'is_used']
        }
    ]
});

module.exports = PasswordReset;