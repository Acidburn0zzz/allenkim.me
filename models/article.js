var fs = require('fs');
var config = require('../config/config.js');
var q = require('q');
var lockFile = require('lockfile');
var articleJSON = config.baseDir + "/db/articles.json";
var debug = debug || 0;
var moment = require('moment');
var pagedown = require("pagedown");

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
  /**
   * default values
   */
  this._id = Date.now();
  this.body = '';
  if (!this.createdAt) {
    this.createdAt = new Date().toISOString();
  }
  // set properties
  for (var key in params) {
    this[key] = params[key];
  }
};

Article.prototype.propertyKeys= ["_id", "body", "createdAt", "updatedAt"];

Article.prototype.validate = function() {
  this.errors = {};
  (!this.type) && (this.errors.type = "Article type cannot be blank");
  (!this.body) && (this.errors.body = "Article body cannot be blank");
  return Object.keys(this.errors).length===0;
};

Article.prototype.fromNow = function(date) {
  return moment(date).fromNow();
};

Article.prototype.getProperties = function() {
  var properties = {};
  for (var i=0; i< this.propertyKeys.length; i++) {
    var key = this.propertyKeys[i];
    properties[key] = this[key];
  }
  return properties;
};

Article.prototype.save = function(handler) {
  var all = Article.all();
  all[this._id] = this.getProperties();
  all[this._id].updatedAt = new Date().toISOString(); 
  if (!this.validate) {
    throw "Validation Error on "+Object.keys(this.errors);
  } else {
    updateJSONFile(all, handler);
  }
};

Article.prototype.getTitle = function() {
  return this.body.match(/(.*?)[\r\n]/)[1];
};

Article.prototype.getSummary = function() {
  var summary = this.body;
  summary = summary.replace(/(.*?)[\r\n]/,""); // remove title part
  summary = summary.replace(/<(.*?)>/g,"");    // remove all tags
  summary = summary.replace(/[\=\-\#\*]/g,""); // remove markdown chars
  summary = summary.replace(/\(https?:\/\/.*?\)/g,""); // remove markdown chars
  if (summary.length > 137) { 
    return summary.trim().slice(0,137) + '...';
  }  else {
    return summary.trim();
  }
};

Article.prototype.getBodyHtml = function() {
  var converter = new pagedown.Converter();
  this.bodyHtml = converter.makeHtml(this.body);
  return this.bodyHtml;
};

Article.prototype.getImage = function(encodeUrl) {
  this.bodyHtml = this.bodyHtml || this.getBodyHtml();
  var imgMatches = this.bodyHtml.match(/<img.*?src=['"]?([^'"]+)['"]?/);
  var imgUrl = imgMatches ? imgMatches[1] : "/static/images/pencil.png";
  encodeUrl && (imgUrl = encodeURIComponent(imgUrl));
  return imgUrl;
};

Article.all = function() {
  var txt = fs.readFileSync(articleJSON, 'utf8');
  var all = JSON.parse(txt);
  var articles = {};
  var keys = Object.keys(all).sort().reverse(); //recent one first
  for (var i in keys) {
    var key = keys[i];
    articles[key] = new Article(all[key]);
  }
  debug && console.log('articles', articles);
  return articles;
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
