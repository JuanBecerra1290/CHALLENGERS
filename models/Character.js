const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/config');

class Character extends Model {}
Character.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    history: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize, 
    modelName: 'Character',
    timestamps: false
  })

  module.exports = Character;