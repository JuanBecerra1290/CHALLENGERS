const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATA_BASE, process.env.USER_NAME, process.env.PASSWORD, {
  host: process.env.HOST_DB,
  port: process.env.PORT_DB,
  dialect: 'mysql'
});

module.exports = sequelize;