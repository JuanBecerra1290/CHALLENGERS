const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/config');

class User extends Model {}
User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    sequelize, 
    modelName: 'User',
    timestamps: false
  });

  module.exports = User;