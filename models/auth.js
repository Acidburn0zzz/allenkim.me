var jwt = require('jwt-simple');
var secret = process.env.TOKEN_SECRET || 'shhhhhhhhhhhhhhhhhhhhhhh';
var authHeaderName = "x-access-token";
var debug = debug || 1;

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
      var token = req.cookies.auth_token ||  // from cookie
        req.param.auth_token ||              // from body, query, param request
        (req.headers[authHeaderName]);       // from header
      debug && console.log('token', token);
      if (token) {
        try {
          var decoded = jwt.decode(token, secret);
          debug && console.log('token decoded', decoded);
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
