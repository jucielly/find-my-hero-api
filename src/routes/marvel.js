const express = require('express');
const MarvelService = require('../services/marvel');
const authorizationMiddleware = require('../middlewares/authorization');
const env = require('../config/env');
const ServerError = require('../errors/serverError');
const NotFoundError = require('../errors/notFound');

const marvel = new MarvelService(env.marvel);

const marvelRouter = express.Router();

marvelRouter.get('/:resource', [authorizationMiddleware, (request, response, next) => {
  const { name, page } = request.query || {};
  const { resource: type } = request.params;
  marvel.searchResource({
    name, page, userId: request.user.id, type,
  }).then((data) => {
    response.json(data);
  }).catch((error) => {
    console.error(error);
    next(new ServerError('Não foi possível obter os personagens'));
  });
}]);

marvelRouter.get('/:resource/:id', [authorizationMiddleware, (request, response, next) => {
  const characterId = request.params.id;
  const userId = request.user.id;
  const { resource: type } = request.params;
  marvel
    .getResource(characterId, userId, type)
    .then((data) => response.json(data)).catch((error) => {
      next(new NotFoundError('Personagem não encontrado'));
    });
}]);

module.exports = marvelRouter;
