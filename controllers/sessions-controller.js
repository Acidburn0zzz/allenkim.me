var config = require('../config/config.js');
var User = require(config.baseDir + "/models/user.js");
var Auth = require(config.baseDir + "/models/auth.js");
var errorFunc = function(err, res) {
  res.send(500, {error: err});
}

var SessionsController = {

  create: function(req, res) {
    if (this.method=="get") { // show login.html
      var html = res.getHtml({view:'login.html'});
      res.send(200, html);
    } else {
      var username = req.params.username || req.query.username || req.body.username || '';
      var password = req.params.password || req.query.password || req.body.password || '';
      var user = User.find(username, password);
      if (user) {
        var token = Auth.getToken(user);
        res.set("x-access-token", token);
        res.send(200, {token: token, username: username, roles: user.roles});
      } else {
        res.send(401, {err: 'invalid user or password'});
      }
    }
  },

  destroy: function(req, res) {
    var resp = "Logout does not need to have server access." +
      "Please simply remove the cookie or sessionStorage, " +
      "then forward to an appropriate page; i.e., login page or home page";
    res.send(200, resp);
  }

};

module.exports = SessionsController;
