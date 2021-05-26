const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const UserFavorites = sequelize.define('userFavorites', {
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
    type: DataTypes.STRING,
    allowNull: false,
  },
  resource: {
    type: DataTypes.JSON,
    allowNull: false,
  },

});

module.exports = UserFavorites;
