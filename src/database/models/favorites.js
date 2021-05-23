const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const UserFavorites = sequelize.define('UserFavorites', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  resourceId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('character', 'comic'),
    allowNull: false,
  },

});

module.exports = UserFavorites;
