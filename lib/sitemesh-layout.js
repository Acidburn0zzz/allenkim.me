/**
 * SiteMesh Layout Class
 */
var debug=0;
var SiteMeshLayout = function(layoutHtml) {
  this.layout = layoutHtml;
  this.tags = [];
  var matches = this.layout.match(/\s*<sitemesh:write\s+property=['"][a-z]+['"]\s*\/>/g);
  if (matches) {
    for (var i=0; i<matches.length; i++) {
      var tagName = matches[i].match(/property=['"]([a-z]+)['"]/)[1];
      var indent  = matches[i].match(/([\t\ ]*)[^\s]/)[1];
      this.tags.push({ name: tagName, html: matches[i], indent: indent});
    }
  }
  debug && console.log('sitemesh tags', this.tags);

  this.compile = function(contentsHtml) {
    /**
     * <pre>...</pre> must not be indented, thus save and restore after indent
     */
    var preTagsSaved = contentsHtml.match(/<pre[\s\S]*?<\/pre>/gm);
    contentsHtml = contentsHtml.replace(/<pre[\s\S]*?<\/pre>/gm, "<pre>SAVED</pre>");

    var replacements = {};
    for (var i=0; i<this.tags.length; i++) {
      var tag = this.tags[i];
      var contentsTagRe = "<" + tag.name + ">([\\s\\S]*?)<\/" + tag.name + ">";
      var contentsMatches = contentsHtml.match(new RegExp(contentsTagRe));
      var contentsIndent = "";
      (contentsMatches)  && 
        (contentsIndent= contentsMatches[1].match(/([\t\ ]*)[^\s]/)[1]);
      replacements[tag.name] = {
        layoutPart : tag.html,
        contentsMatches : contentsMatches,
        tagIndent: tag.indent,
        contentsIndent: contentsIndent
      }
    }
    debug && console.log('replacements', replacements);

    var outputHtml = this.layout;
    var tmpHtml = contentsHtml;
    var replacement;
    for (var key in replacements) {
      replacement = replacements[key];
      if (replacement.contentsMatches) {
        var extraIndent = replacement.tagIndent.replace(replacement.contentsIndent,"");
        var indentedOutput = replacement.contentsMatches[1].replace(/\n/g, "\n"+extraIndent);
        outputHtml = outputHtml.replace(replacement.layoutPart, indentedOutput);
        // remove the matching part from the original to see what's left over
        tmpHtml = contentsHtml.replace(replacement.contentsMatches[0],""); 
      }
      debug && console.log('outputHtml', outputHtml);
      debug && console.log('tmpHtml', tmpHtml);
    }

    // if contents does not have <body>.., then make body with left-over
    if (!replacements.body.contentsMathches) {
      replacement = replacements.body;
      replacement.contentsIndent= tmpHtml.match(/([\t\ ]*)[^\s]/)[1];
      var additionalIndent = replacement.tagIndent.replace(replacement.contentsIndent, "");
      debug && console.log('additional >>>>'+additionalIndent+'<<<<<<');
      var indentedBody = tmpHtml.replace(/\n/g, "\n"+additionalIndent);
      outputHtml = outputHtml.replace(replacements.body.layoutPart, indentedBody);
    }

    /**
     * <pre>...</pre> must not be indented, thus restoring
     */
    outputHtml = outputHtml.replace(/<pre>SAVED<\/pre>/g, function() {
      return preTagsSaved.shift();
    });
    return outputHtml;
  }
};

module.exports = SiteMeshLayout;

