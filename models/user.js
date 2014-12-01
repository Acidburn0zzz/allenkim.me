var crypto = require('crypto');

var users = [{
  username: '21232f297a57a5a743894a0e4a801fc3',
  password: '9d51b3f14e6d6763bd11fd73cf470bf1',
  roles: ['admin']
}];
var md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

var User = {
  find: function(username, password) {
    for (var i=0; i<users.length; i++) {
      var user = users[i];
      if (user.username == md5(username||"") && 
          user.password == md5(password||"")) {
        return user;
      }
    }
    return false;
  }
}

module.exports = User;
