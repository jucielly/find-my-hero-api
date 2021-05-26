const express = require('express');
const UserService = require('../services/user');
const MarvelService = require('../services/marvel');
const env = require('../config/env');
const ServerError = require('../errors/serverError');
const authorizationMiddleware = require('../middlewares/authorization');

const userRouter = express.Router();
const marvel = new MarvelService(env.marvel);

userRouter.post('/', (request, response, next) => {
  const user = request.body;
  UserService.createUser(user).then(() => {
    response.sendStatus(201);
  }).catch(next);
});

userRouter.post('/login', (request, response, next) => {
  const { email, password } = request.body || {};
  UserService.login(email, password).then((authResponse) => {
    response.json(authResponse);
  }).catch(next);
});

userRouter.patch('/current', [authorizationMiddleware, (request, response, next) => {
  const { user, currentPassword } = request.body || {};
  UserService.editUser({
    user,
    currentPassword,
    userId: request.user.id,
  }).then((editedUser) => response.json(editedUser))
    .catch(next);
}]);

userRouter.get('/current', [authorizationMiddleware, (request, response, next) => {
  UserService.getUser(request.user.id).then((user) => response.json(user))
    .catch(next);
}]);

userRouter.post('/current/:resource/:id/favorite', [authorizationMiddleware, (request, response, next) => {
  const { resource, id: resourceId } = request.params || {};
  const userId = request.user.id;
  const { favorited } = request.body || {};
  marvel.favorite({
    resourceId, userId, favorited, type: resource,
  })
    .then(() => {
      response.sendStatus(204);
    })
    .catch((error) => {
      next(new ServerError('ocorreu um erro inesperado'));
      console.error(error);
    });
}]);

userRouter.get('/current/:resource/favorites', [authorizationMiddleware, (request, response, next) => {
  const userId = request.user.id;
  const type = request.params.resource;

  marvel.getUserFavorites(userId, type).then((resources) => {
    response.json(resources);
  })
    .catch((error) => {
      next(new ServerError('ocorreu um erro inesperado'));
      console.error(error);
    });
}]);

module.exports = userRouter;
