const passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;

const db = require('../models/User.js');

const opts = {}

// Custom extractor to get JWT from cookies
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};

opts.jwtFromRequest = cookieExtractor; // Use the cookie extractor instead
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


