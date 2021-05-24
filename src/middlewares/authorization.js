const TokenService = require('../services/token');
const AuthorizationError = require('../errors/authorizationError');

const authorizationMiddleware = (request, response, next) => {
  const authorizationHeader = request.headers.authorization;
  console.log(request.headers);
  if (!authorizationHeader) throw new AuthorizationError('Token ausente');
  const [bearer, token] = authorizationHeader.split(' ');
  if (bearer !== 'Bearer') throw new AuthorizationError('Formato do token incorreto');
  try {
    const decodedUser = TokenService.verify(token);
    request.user = decodedUser;
    next();
  } catch {
    throw new AuthorizationError('Token inválido');
  }
};

module.exports = authorizationMiddleware;
