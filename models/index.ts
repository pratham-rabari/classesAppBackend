'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
let basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

let sequelize = new Sequelize(process.env.DATABASE, process.env.DBUSER, process.env.PASSWORD, {
  host: process.env.DBHOST,
  dialect: process.env.DIALECT,
  port: process.env.DBPORT,
    define: {
        timestamps: false
    },
    // timezone: '+05:30',
    // timezone problem
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {    
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);

    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db['sequelize'] = sequelize;
db['Sequelize'] = Sequelize;



module.exports = db;
