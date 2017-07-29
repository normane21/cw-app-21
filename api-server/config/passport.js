var JwtStrategy = require('passport-jwt').Strategy;  
var ExtractJwt = require('passport-jwt').ExtractJwt;  
var AdminUser = require('../app/models/adminuser');  
var config = require('../config/main');

// Setup work and export for the JWT passport strategy
module.exports = function(passport) {  
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    AdminUser.findOne({id: jwt_payload.id}, function(err, user) {
      console.log(user);
      if (err) {
        console.log(err);
        return done(err, false);
      }
      if (user) {
        console.log(user);
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};