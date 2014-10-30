var fs = require('fs');
var AngularTemplate = require('angular-template');
var config = require('../config/config.js');
var debug = debug || 0;

var baseDir = config.baseDir;
if (!baseDir) { throw "Invalid base directory defined"; }

/**
 * set req.params.controller when not given
 *  1. get it from parameter
 *  2. or, get it from url
 */
var setController = function(req, options) {
  if (!req.params.controller) { 
    if (options.controller) {  
      req.params.controller = options.controller;
    } else { 
      req.params.controller = req.path.match(/^\/([^\/\.]+)\/?/)[1];
      if (!req.params.controller.match(/s$/))  {
        throw "controller must ends with 's', meaning plural";
      }
    }
  }
};

/**
 * set req.params.action when not given
 *  1. get it from parameter
 *  2. or, get it from id if id is a action
 *  3. or, get it request type
 */
var setAction = function(req, options) {
  var actions = ["create", "read", "update", "destory"];
  if (!req.params.action) {
    if (options.action) { 
      req.params.action = options.action;
    } else if (req.params.id && actions.indexOf(req.params.id) != -1) {
      req.params.action = req.params.id;
    } else if (req.method) {
      req.params.action = 
        req.method == "GET" && !req.params.id ? "list" :
        req.method == "GET" && req.params.id ? "read" :
        req.method == "POST" ? "create" :
        req.method == "PUT" ? "update" :
        req.method == "DELETE" ? "destroy" : null;
    }
  }
};

/**
 * find the first file existing from paths with options in mind
 */
var get1stFileExists = function(paths, options) {
  for (var i=0; i<paths.length; i++) {
    var path = paths[i];
    for (var key in options) {
      var regExp = new RegExp(':'+key, 'g');
      path = path.replace(regExp, options[key]);
    }
    debug && console.log('path', path);
    if (fs.existsSync(path)) {
      return path;
    }
  }
  return false;
}

/**
 * set req.header.accept based on requested format in url
 */
var setAcceptHeader = function(req) {
  if (req.params.format == "json") {
    req.headers.accept = 'application/json';
  } else if (req.params.format == "xml") {
    req.headers.accept = 'application/xml';
  }
}

/**
 * return application context that has
 *   1. req.params
 *   2. layout
 *   3. view paths
 */
var getContext = function(req) {
  var context = req.params;
  context.layout= config.layout || 'layout.html';
  context.viewPaths = [
    config.baseDir+'/views/:filename',
    config.baseDir+'/views/:controller/:filename',
    config.baseDir+'/views/:controller/:action/:filename.html',
    config.baseDir+'/views/:controller/:action.html',
    config.baseDir+'/views/:controller/:controller-:action.html',
    config.baseDir+'/views/:controller/:action/:controller-:action.html'
  ];
  return context;
}

/**
 * Base controller of all application
 */
var ApplicationController = function(options) {
  return function(req, res) {
    options = options || {};

    setController(req, options);
    setAction(req, options);
    setAcceptHeader(req);
    var context = getContext(req);
    //console.log('context', context);
    req.context = context;

    /**
     * options : view, layout, data
     *    i.e. {view: 'foo.html', layout: 'layout.html', {article: article}}
     */
    res.getHtml = function(options) { 
      try {
        options = options || {};
        var context = req.context;
        var contentsFile, layoutFile, searchContext;
        searchContext = context;
        options.view && (searchContext.filename = options.view);
        contentsFile = get1stFileExists(context.viewPaths, searchContext);
        if (!contentsFile) { 
          debug && console.log('searchContext', searchContext);
          throw "Cannot find view file from view paths"; 
        }

        searchContext = {filename: (options.layout || context.layout)};
        layoutFile   = get1stFileExists(context.viewPaths, searchContext);
        if (!layoutFile) { 
          debug && console.log('searchContext', searchContext);
          throw "Cannot find layout file from view paths"; 
        }

        delete options.layout;
        delete options.view;

        var template = AngularTemplate({
          basePath: config.baseDir,
          layout: layoutFile
        });

        var contentsHtml = fs.readFileSync(contentsFile, 'utf8');
        var compiledHtml = template.compile(contentsHtml, options);

        return compiledHtml;
      } catch (e) {
        console.error(e);
        console.error(e.stack);
        res.send(500, e);
      }
    }

    /** 
     * get the controller and apply action
     */
    var controller = require(config.baseDir +
        '/controllers/' + context.controller + '-controller.js');
    debug && console.log('context', context);
    controller[context.action].apply(this, [req, res]);
  }
}
module.exports = ApplicationController;
