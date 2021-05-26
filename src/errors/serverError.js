class ServerError extends Error {
  constructor(message) {
    super(message);
    this.httpCode = 500;
    this.name = 'ServerError';
  }
}

module.exports = ServerError;
