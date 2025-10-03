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


module.exports = passport;
