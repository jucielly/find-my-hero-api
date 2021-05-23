class ClientError extends Error {
  constructor(message) {
    super(message);
    this.httpCode = 400;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;
