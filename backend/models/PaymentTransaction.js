const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PaymentTransaction = sequelize.define('PaymentTransaction', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID },
  provider: { type: DataTypes.STRING },
  amount: { type: DataTypes.DECIMAL },
  currency: { type: DataTypes.STRING },
  provider_txn_id: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING }
});

module.exports = PaymentTransaction;
