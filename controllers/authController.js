const { body, validationResult } = require('express-validator');
const passwordUtils = require('../utils/passwordUtils.js');
const jwt = require('jsonwebtoken');

const db = require('../models/User.js');

const validateSignUp = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
        .isAlphanumeric().withMessage('Username must contain only letters and numbers'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('passwordConfirm')
        .notEmpty().withMessage("Password confirmation is required")
        .custom((value, { req }) => value === req.body.password).withMessage("Password confirmation must match password")
]

const postSignUp = [
    validateSignUp,
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
        }
        const { username, password } = req.body;
        const existingUser = await db.findUser(username);
        if (existingUser) {
            return res.status(404).json({
                success: false,
                message: "Username taken",
            });
        }

        const user = await db.createUser(username, password);
        return res.json({
            success: true,
            message: `User created: ${user}`
        });
    }
]

async function getLogin(req, res) {
    res.json({message: "Success"})
}

async function postLogin (req, res) {
    const { username, password } = req.body;
    const existingUser = await db.findUser(username);
    if (existingUser) {
        const match = await passwordUtils.verifyPassword(password, existingUser.hashedPassword);
        if (match) {

            // send JWT token
            const token = jwt.sign({
                sub: existingUser.id
            }, process.env.SECRET, { expiresIn: '7d'}); // expires in 1 hour

            res.cookie('token', token, {
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                httpOnly: true,       // JS cannot read it
                secure: false,        // must be false for localhost/HTTP
                sameSite: 'Lax'       // allows sending cookie in requests from React dev server
            });

            return res.json({
                success: true,
                message: `Login success. Token: ${token}`,
                auth: { token }
            });
        }
        else {
            return res.json({
                success: false,
                message: "Password incorrect"
            });
        }
    }
    else {
        return res.json({
            success: false,
            message: "User does not exist"
        });
    }
}

async function getSignUp(req, res) {
    res.json({message: "Success"})
}


module.exports = {
    getSignUp,
    postSignUp,
    getLogin,
    postLogin,
}
