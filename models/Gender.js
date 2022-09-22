const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/config');

class Gender extends Model {}
Gender.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    img: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    sequelize, 
    modelName: 'Gender',
    timestamps: false
  });

  module.exports = Gender;