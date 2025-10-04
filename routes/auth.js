const { Router } = require('express');
const passport = require('passport');
const authController = require('../controllers/authController.js');
const redirectIfAuthenticated = require('../middleware/redirectIfAuthenticated.js');

const authRouter = Router();

authRouter.get('/signup', redirectIfAuthenticated, authController.getSignUp);
authRouter.post('/signup', authController.postSignUp);

authRouter.get('/login', redirectIfAuthenticated, authController.getLogin);
authRouter.post('/login', authController.postLogin);

module.exports = authRouter;
