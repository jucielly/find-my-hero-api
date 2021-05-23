const express = require('express');
const UserService = require('../services/user');

const userRouter = express.Router();

userRouter.post('/', (request, response, next) => {
  const user = request.body;
  UserService.createUser(user).then(() => {
    response.sendStatus(201);
  }).catch((error) => {
    next(error);
  });
});

module.exports = userRouter;
