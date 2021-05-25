const bcrypt = require('bcrypt');
const User = require('../database/models/user');
const ClientError = require('../errors/clientError');
const ServerError = require('../errors/serverError');
const env = require('../config/env');
const TokenService = require('./token');
const AuthError = require('../errors/authError');

class UserService {
  static validateUser(user, validateAllFields = false) {
    if (typeof user !== 'object') return false;
    const { name, email, password } = user;
    if (name && name.trim().length < 2) {
      return false;
    }
    if (email && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      return false;
    }

    if (password && password.length < 8) {
      return false;
    }
    const hasAllFields = !!(email && name && password);
    if (validateAllFields && !hasAllFields) {
      return false;
    }
    return true;
  }

  static createUser(user) {
    if (!this.validateUser(user, true)) throw new ClientError('Dados inválidos');
    const { name, email, password } = user;
    const passwordHash = bcrypt.hashSync(password, env.saltRounds);
    return User.create({
      name,
      email,
      passwordHash,
    }).catch(() => {
      throw new ServerError('Erro ao criar conta');
    });
  }

  static login(email, password) {
    if (!email || !password) throw new ClientError('Preencha email ou senha');
    return User.findOne({
      where: {
        email,
      },
    }).then((user) => {
      if (!user) throw new AuthError('Usuário ou senha incorretos');
      const { passwordHash, ...userWithoutHash } = user.toJSON();
      const passwordsMatch = bcrypt.compareSync(password, passwordHash);
      if (!passwordsMatch) throw new AuthError('Usuário ou senha incorretos');
      const token = TokenService.sign(userWithoutHash);
      return {
        user: userWithoutHash,
        token,

      };
    }).catch((error) => {
      if (!error.httpCode) throw new ServerError('Erro ao obter credenciais');
      throw error;
    });
  }

  static editUser({ user, userId, currentPassword }) {
    if (!this.validateUser(user, false)) throw new ClientError('Dados inválidos');
    const { name, email, password } = user;
    const updatedUser = {};
    if (name) updatedUser.name = name;
    if (email) updatedUser.email = email;
    if (password) updatedUser.passwordHash = bcrypt.hashSync(password, env.saltRounds);
    return User.findByPk(userId).then((foundUser) => {
      console.log('foundUser', foundUser);
      if (!foundUser) throw new ClientError('Usuário não encontrado');
      const passwordsMatch = bcrypt.compareSync(currentPassword, foundUser.passwordHash);
      if (!passwordsMatch) throw new AuthError('Senha incorreta');
      return foundUser.update(updatedUser).then((result) => {
        // eslint-disable-next-line no-shadow
        const updatedUser = result.toJSON();
        updatedUser.passwordHash = undefined;
        return updatedUser;
      });
    }).catch((error) => {
      if (!error.httpCode) throw new ServerError('Ocorreu um erro ao autorizar o usuário');
      throw error;
    });
  }

  static getUser(userId) {
    return User.findByPk(userId).then((user) => {
      if (!user) throw new ClientError('Usuário não encontrado');
      const userWithoutHash = user.toJSON();
      userWithoutHash.passwordHash = undefined;
      return userWithoutHash;
    }).catch((error) => {
      if (!error.httpCode) throw new ServerError('Ocorreu um erro ao obter o usuário');
      throw error;
    });
  }
}

module.exports = UserService;
