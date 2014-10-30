var fs = require('fs');
var config = require('../config/config.js');
var q = require('q');
var lockFile = require('lockfile');
var articleJSON = config.baseDir + "/db/articles.json";

var updateJSONFile = function(data, callback) {
  lockFile.lock('articles.lock', function(err) {
    if (err) {throw "articles are being updated by other";}
    try {
      fs.writeFile(articleJSON, JSON.stringify(data), function(err) {
        if (err) {
          console.log(err.stack) && callback(err, null);
        } else {
          callback(null, this.props);
        }
      });
    } catch(e) {
      throw e;
    } finally {
      lockFile.unlock('articles.lock', function(err){});
    }
  });
};

var Article = function(params) {
  this.props = {
    _id: Date.now(),
    body: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString() 
  };
  var errors = {};

  // set properties
  for (var key in params) {
    this.props[key] = params[key];
  }

  this.validate = function() {
    (!this.props.type) && (errors.type = "Article type cannot be blank");
    (!this.props.body) && (errors.body = "Article body cannot be blank");
    return Object.keys(errors).length===0;
  };

  this.save = function(handler) {
    var all = Article.all();
    all[this.props._id] = this.props;
    all[this.props._id].updatedAt = new Date().toISOString(); 
    if (!this.validate) {
      throw "Validation Error on "+Object.keys(this.errors);
    } else {
      updateJSONFile(all, handler);
    }
  };
};


Article.all = function() {
  var txt = fs.readFileSync(articleJSON, 'utf8');
  return JSON.parse(txt);
};

// currently only support body matching
Article.findAll = function(params) {
  var deferred = q.defer();
  try {
    var all = Article.all(), matches = {};
    for (var key in all) {
      if (params.body && all[key].body.indexOf(params.body)) {
        matches[key] = all[key];
      } else {
        matches[key] = all[key];
      }
    };
    deferred.resolve(matches);
  } catch (e) {
    console.log(e.stack);
    deferred.reject(e);
  }
  return deferred.promise;
};
Article.findById = function(id, handler) {
  try {
    handler(null, Article.all()[id]);
  } catch(e) {
    console.log(e.stack);
    handler(e, null);
  }
};

Article.findByIdAndUpdate = function(id, params,  handler) {
  try {
    var all = Article.all();
    if (!all[id]) {throw "cannot find id: "+id;}
    for (var key in params) {
      all[id][key] = params[key];
    }
    all[id].updatedAt = new Date().toISOString(); 
    updateJSONFile(all, handler);
  } catch(e) {
    console.log(e.stack);
    handler(e, null);
  }
};

Article.findByIdAndRemove = function(id, handler) {
  try {
    var all = Article.all();
    if (!all[id]) {throw "cannot find id: "+id;}
    delete all[id];
    updateJSONFile(all, handler);
  } catch(e) {
    console.log(e.stack);
    handler(e, null);
  }
};

module.exports = Article;
