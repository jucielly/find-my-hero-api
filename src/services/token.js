const jwt = require('jsonwebtoken');
const env = require('../config/env');

class TokenService {
  static sign(user) {
    const token = jwt.sign(user, env.jwtSecret, { expiresIn: '1d' });
    return token;
  }

  static verify(token) {
    const decoded = jwt.verify(token, env.jwtSecret);
    return decoded;
  }
}

module.exports = TokenService;
