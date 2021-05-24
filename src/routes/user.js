const express = require('express');
const UserService = require('../services/user');

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

module.exports = userRouter;
