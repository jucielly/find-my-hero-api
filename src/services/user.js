const bcrypt = require('bcrypt');
const User = require('../database/models/user');
const ClientError = require('../errors/clientError');
const ServerError = require('../errors/serverError');
const env = require('../config/env');

class UserService {
  static createUser(user) {
    if (typeof user !== 'object') throw new ClientError('Dados inválidos');
    const { name, email, password } = user;
    const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    if (!validEmail) throw new ClientError('Email inválido');
    if (!name) throw new ClientError('Nome não existe');
    if (!password) throw new ClientError('Senha inválida');
    const passwordHash = bcrypt.hashSync(password, env.saltRounds);
    return User.create({
      name,
      email,
      passwordHash,
    }).catch(() => {
      throw new ServerError('Erro ao criar conta');
    });
  }
}

module.exports = UserService;
