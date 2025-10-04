const passport = require('passport');

function redirectIfAuthenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (user) {
      return res.status(200).json({ authenticated: true, message: "User already logged in" });
    }
    
    next();

  })(req, res, next);
}

module.exports = redirectIfAuthenticated;