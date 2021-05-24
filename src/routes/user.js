const express = require('express');
const UserService = require('../services/user');
const authorizationMiddleware = require('../middlewares/authorization');

const userRouter = express.Router();

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

module.exports = userRouter;
