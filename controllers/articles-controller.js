var fs = require('fs');
var config = require('../config/config.js');
//var mongoose = require('mongoose');
//var Article = mongoose.model('Article');
var Article = require(config.baseDir + "/models/article.js");

var ArticlesController = {

  list: function(req, res) {
    Article.findAll(req.query).then(function(articles) {
      var resp = req.accepts('html') ? res.getHtml({articles: articles}) : articles;
      res.send(200, resp);
    }, function(err, res) {
      res.send(500, {error: err});
    });
  },

  create: function (req, res) {
    if (req.method == "GET") {
      res.send(200, res.getHtml({article: new Article()}));
    } else {
      var article = new Article(req.body);
      article.save(function (err) { 
        err && res.send(500, {error: err});
        !err && res.send(201, {id: article._id, message: 'created successfully'});
      });
    }
  },

  read : function(req, res) {
    Article.findById(req.params.id, function(err, article) {
      err && res.send(500, {error: err});
      var resp = req.accepts('html') ? res.getHtml({article: article}) : article;
      !err && res.send(200, resp);
    });
  },

  update: function(req, res) {
    if (req.method == "GET") {
      Article.findById(req.params.id, function(err, article) {
        err && res.send(500, {error: err});
        !err && res.send(200, res.getHtml({article: article}));
      });
    } else {
      delete req.body._id;
      Article.findByIdAndUpdate(req.params.id, req.body, function (err, updated_article) {
        err && res.send(500, {error: err});
        !err && res.send(200, updated_article);
      });
    }
  },

  destroy: function(req, res) {
    if (req.method == "GET") {
      Article.findById(req.params.id, function(err, article) {
        err && res.send(500, {error: err});
        !err && res.send(200, res.getHtml({article: article}));
      });
    } else {
      Article.findByIdAndRemove(req.params.id, function (err) {
        err && res.send(500, {error: err});
        !err && res.send(204, 'Removed');
      });
    }
  }

};
ArticlesController.new = ArticlesController.create;
ArticlesController.show = ArticlesController.read;
ArticlesController.edit = ArticlesController.update;

module.exports = ArticlesController;
