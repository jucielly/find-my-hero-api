class AuthError extends Error {
  constructor(message) {
    super(message);
    this.httpCode = 401;
    this.name = 'AuthError';
  }
}

module.exports = AuthError;
