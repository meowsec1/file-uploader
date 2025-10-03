const { Router } = require('express');
const passport = require('passport');
const authController = require('../controllers/authController.js');

const authRouter = Router();


authRouter.get('/signup', authController.getSignUp);
authRouter.post('/signup', authController.postSignUp);

authRouter.get('/login', authController.getLogin);
authRouter.post('/login', authController.postLogin);

authRouter.get('/protected', passport.authenticate('jwt', { session: false }), authController.getProtected);

module.exports = authRouter;
