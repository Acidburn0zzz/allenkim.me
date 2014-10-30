var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/config.js');
var fs = require('fs');
var mongoose = require('mongoose');

var options = {
  server: {
    socketOptions: {
      keepAlive: 1, 
      connectTimeoutMS: 5000  // require some time to upload an image
    }
  }, 
  db: {
    native_parse: true
  }
};

/**
 * Bootstrap db connection
 */
var connect = function() {
  mongoose.connection.on('connected', function() {   // When connected
    console.log("connected to",  config.db);
  });
  mongoose.connection.on('error', function(err) {   // Error handler
    console.log(err);
  });
  mongoose.connection.on('disconnected', function () { // Reconnect when closed
    console.log('mongodb', config.db, 'is disconnected. connecting again');
    mongoose.connect(config.db, options);
  });
  mongoose.connect(config.db, options);
};


/**
 * bootstrap all mongo-db models
 */
var loadModels = function() {
  var modelsDir = config.baseDir + "/models";
  fs.readdirSync(modelsDir).forEach(function (file) {
    file.match(/-mongoose.js$/) && require(modelsDir + '/' + file);
  });
}

module.exports = {
  loadModels : loadModels,
  connect: connect,
  init: function() {
    connect();
    loadModels();
  },
};
