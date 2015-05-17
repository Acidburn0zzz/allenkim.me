(function() {
  'use strict';
  var fs = require('fs');
  var frontMatter = require('front-matter');
  var glob = require('glob');
  var marked = require('marked');
  var path = require('path');

  var OUTPUT_DIR = 'build';

  /*
   * convert an article to .html and print out to output directory
   */
  var writeHtml = function(articlePath) {
    var contents = fs.readFileSync(articlePath).toString();
    var markdown = contents.replace(/---(.|\n)*---/m,'');
    var html = marked(markdown);
    var htmlPath = path.join(OUTPUT_DIR,
      articlePath.
        replace('posts/','_posts/').
        replace(/\.md$/, '.html')); 
    fs.writeFileSync(htmlPath, html);
  };

  /*
   * return article front-matter data and summary 
   */
  var getArticleData = function(articlePath) {
    var contents = fs.readFileSync(articlePath).toString();
    var frontMatterData = frontMatter(contents);
    var articleData = frontMatterData.attributes || {};

    var markdown = contents.replace(/---(.|\n)*\n---\n/,''); // remove fronMatter data
    var summary = markdown.split('<!--more-->')[0];
    summary = marked(summary).replace(/<[^>]+>/g,'');
    articleData.path = articlePath.replace(/\.md$/, '.html');
    articleData.date = articlePath.match(/\/([0-9]+)-/)[1];
    articleData.summary = summary;
    return articleData;
  };

  /*
   * returns grouped elements from array
   */
  var groupBy = function(collection, groupBy) {
    var groups = [];
    var groupEls = [];
    for (var i=0; i<= collection.length; i++) {
      if (i > 0 && (i % groupBy === 0 || i == collection.length)) {
        groups.push(groupEls);
        groupEls = [];
      }
      groupEls.push(collection[i]);
    }
    return groups;
  };

  /*
   * write index.json, page1.json, etc..
   */
  var writeIndexes = function(articleData) {
    var indexPath = path.join(OUTPUT_DIR, '/api/index.json');
    fs.writeFileSync(indexPath, JSON.stringify(articleData));

    var tocPath = path.join(OUTPUT_DIR, '/toc.html'), html = '';
    for (var i=0; i<articleData.length; i++) {
      var article = articleData[i];
      html +=  '<a href="/#/'+article.path+'">' + article.title + '</a><br/>';
    }
    fs.writeFileSync(tocPath, html);

    var pagedData = groupBy(articleData, 10);
    for (var pageNo=1; pageNo<= pagedData.length; pageNo++) {
      var pagePath = path.join(OUTPUT_DIR, '/api/page'+pageNo+'.json');
      var pageData = {
        posts: pagedData[pageNo-1],
        prev: (pageNo == 1 ? null : pageNo-1), 
        next: (pageNo == pagedData.length ? null : ageNo+1)
      };
      fs.writeFileSync(pagePath, JSON.stringify(pageData));
    }
  };

  glob('posts/*.md', function (err, articles) {
    if (err) { throw err; }

    var allArticles = [], articleData, articlePath;
    for (var i=0; i<articles.length; i++) {
      articlePath = articles[i];
      writeHtml(articlePath);

      articleData = getArticleData(articlePath);
      allArticles.push(articleData);
    }
    //sort by date descending order
    allArticles = allArticles.sort(function(down,up) { 
      return up.date > down.date;
    });

    writeIndexes(allArticles); // index.json, page1.json, ..etc
  });
})();
