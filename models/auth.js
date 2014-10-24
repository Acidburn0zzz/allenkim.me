var jwt = require('jwt-simple');
var secret = process.env.TOKEN_SECRET || 'shhhhhhhhhhhhhhhhhhhhhhh';
var authHeaderName = "x-access-token";

/**
 * Handle Authentication and Authorization
 */
var Auth = {
  getToken: function(user) {
    var token = jwt.encode({
      username: user.username,
      roles: user.roles
    }, secret);
    return token;
  },

  hasRole : function(role) {
    return function(req, res, next) {
      var token = (req.body && req.body.access_token) ||
                  (req.query && req.access_token) ||
                  (req.headers[authHeaderName]);
      if (token) {
        try {
          var decoded = jwt.decode(token, secret);
          if (decoded.roles && decoded.roles.indexOf(role) != -1) {
            next();
          } else {
            res.send(401, {err: 'Invalid role. Action requires '+role+' role.'});
          }
        } catch(err) {
          res.send(401, {err: 'Invalid authorization token'});
        }
      } else {
        res.send(401, {err: 'Invalid authorization token'});
      }
    };
  }
};

module.exports = Auth;
