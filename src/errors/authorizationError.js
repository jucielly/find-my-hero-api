class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.httpCode = 403;
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
