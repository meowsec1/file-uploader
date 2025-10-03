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


async function getSignUp() {
    return res.send("Sign Up Page Here");
}

const postSignUp = [
    validateSignUp,
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { username, password } = req.body;
        const existingUser = await db.findUser(username);
        if (existingUser) {
            return res.send("Username taken");
        }

        const user = await db.createUser(username, password);
        return res.send(`User created: ${user}`);

    }
]


function getLogin(req, res) {
    res.send("Login Page Here");
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
            }, process.env.SECRET, { expiresIn: 60 * 60}); // expires in 1 hour

            return res.send(`Successful login! Token: ${token}`);
        }
        else {
            return res.send("Password Incorrect!");
        }
    }
    else {
        return res.send("User does not exist!");
    }
}

// async function isAuthenticated(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const jwtToken = authHeader && authHeader.split(' ')[1];
//     if (!jwtToken) return res.status(401).send("Unauthorized!");
//     jwt.verify(jwtToken, process.env.SECRET, function(error, decoded) {
//         if (error) {
//             return res.status(401).send("Unauthorized!");
//         }
//         req.user = decoded
//         next();
//     });
// }

function getProtected(req, res) {
    res.send("Welcome to the protected route!")
}

module.exports = {
    getSignUp,
    postSignUp,
    getLogin,
    postLogin,
    // isAuthenticated,
    getProtected,
}
