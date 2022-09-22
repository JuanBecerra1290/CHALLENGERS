const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/config');

class Movie extends Model {}
Movie.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    img: {
        type: DataTypes.STRING
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    ratings: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
  }, {
    sequelize, 
    modelName: 'Movie',
    timestamps: false
  });

  module.exports = Movie;