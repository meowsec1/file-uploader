const { Router } = require('express');
const authController = require('../controllers/authController.js');

const authRouter = Router();


authRouter.get('/signup', authController.getSignUp);
authRouter.post('/signup', authController.postSignUp);

authRouter.get('/login', authController.getLogin);
authRouter.post('/login', authController.postLogin);



module.exports = authRouter;
