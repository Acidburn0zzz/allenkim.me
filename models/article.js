var debug=0;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Schema
 */
var ArticleSchema = new Schema({
  type:        {type : String, default : '', trim : true},
  body:        {type : String, default : '', trim : true}, 
  createdAt  : {type : Date, default : Date.now},
  updatedAt  : {type : Date, default : Date.now}
});

/**
 * Validations
 */
ArticleSchema.path('type').required(true, 'Article type cannot be blank');
ArticleSchema.path('body').required(true, 'Article body cannot be blank');

/**
 * Custom methods
 */
ArticleSchema.statics.findAll = function(options) {
  var page = parseInt(options.page||1);
  var perPage = 10;
  var skip = (page-1) * perPage;
  var limit = options.limit;

  var findOptions = {};
  for (var key in options) {
    if (key != 'limit' && key != 'page') {
      findOptions[key] = options[key];
    }
  }
  debug && console.log('findOptions', findOptions);

  return this.find(findOptions)
    .limit(limit|| 100)
    .skip(skip || 0)
    .exec();
};

mongoose.model('Article', ArticleSchema);
