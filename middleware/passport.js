const passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const db = require('../models/User.js');

const opts = {}


opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = process.env.SECRET;


passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        const user = await db.findUserById(jwt_payload.sub);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }
    catch(error) {
        done(error, false);
    }
}));


// custom implementation

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

module.exports = passport;


