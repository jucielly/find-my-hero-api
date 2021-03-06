const User = require('./models/user');
const UserFavorites = require('./models/favorites');
const { sequelize } = require('./connection');

const startDb = () => {
  sequelize.sync();
};

module.exports = {
  User,
  UserFavorites,
  startDb,
};
