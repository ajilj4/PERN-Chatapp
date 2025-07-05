const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Attachment = sequelize.define('Attachment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  message_id: { type: DataTypes.UUID },
  file_url: { type: DataTypes.STRING },
  file_type: { type: DataTypes.STRING }
},{
    paranoid:true,
    timestamps:true
});

module.exports = Attachment;
