const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

// Dynamically import all models except index.js and association.js
fs.readdirSync(__dirname)
  .filter(file => (
    file !== 'index.js' && file !== 'association.js' && file.endsWith('.js')
  ))
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

// Setup associations
require('./association')(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
