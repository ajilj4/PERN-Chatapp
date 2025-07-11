const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING,
        allowNull:true
    },

    email: {
        type: DataTypes.STRING,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        unique: true
    },
    profile: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    },
    qrCode:{
        type: DataTypes.STRING,
        defaultValue: null,
    },
    last_seen: {
        type: DataTypes.DATE,
        defaultValue: Date.now()
    },
    status_message: {
        type: DataTypes.STRING,
        defaultValue: "Hey there! I'm using AjilChat."
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_verified: {
        type: DataTypes.BOOLEAN
    }
}, {
    timestamps: true,
    paranoid: true
})

module.exports = User

