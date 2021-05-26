const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');
const UserFavorites = require('./favorites');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },

});

User.hasMany(UserFavorites);

module.exports = User;
