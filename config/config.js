var path = require('path');
var env = process.env.NODE_ENV || 'development';
var config = {
  baseDir: path.normalize(__dirname + "/.."),
  layout: 'layout.html'
}
// for mongoose, add db as 'mongodb://host:port/database'
// i.e. {db: 'mongodb://user:password@localhost:27017/development'}
var environments = {
  development: {},
  test: {},
  qa: {},
  production: {}
}
for (var key in config) {
  environments[env][key] = config[key];
}
module.exports = environments[env];
