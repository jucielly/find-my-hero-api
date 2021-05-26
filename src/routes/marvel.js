const express = require('express');
const MarvelService = require('../services/marvel');
const authorizationMiddleware = require('../middlewares/authorization');
const env = require('../config/env');
const ServerError = require('../errors/serverError');
const NotFoundError = require('../errors/notFound');

const marvel = new MarvelService(env.marvel);

const marvelRouter = express.Router();

marvelRouter.get('/characters', [authorizationMiddleware, (request, response, next) => {
  const { name, page } = request.query || {};
  marvel.searchCharacter({ name, page, userId: request.user.id }).then((data) => {
    response.json(data);
  }).catch((error) => {
    next(new ServerError('Não foi possível obter os personagens'));
  });
}]);

marvelRouter.get('/characters/:id', [authorizationMiddleware, (request, response, next) => {
  const characterId = request.params.id;
  const userId = request.user.id;
  marvel.getCharacter(characterId, userId).then((data) => response.json(data)).catch((error) => {
    next(new NotFoundError('Personagem não encontrado'));
  });
}]);

module.exports = marvelRouter;
