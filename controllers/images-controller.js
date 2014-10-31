var config = require("../config/config.js");
var multiparty = require('multiparty');
var fs = require("fs");
var crypto = require("crypto"); 

var ImagesController = {
  create: function (req, res) {
    var form= new multiparty.Form();

    form.parse(req, function(err, fields, files) {
      var urls = [];
      for(var i=0; i<files.image.length; i++) {
        var file = files.image[i];
        var data = fs.readFileSync(file.path);
        var md5 = crypto.createHash('md5').update(data).digest('hex');
        var ext = file.headers['content-type'].match(/\/([a-z]+)/)[1];
        var dest = config.imageDir + "/" + md5 + "." + ext;
        fs.createReadStream(file.path).pipe(fs.createWriteStream(dest));
        urls.push(dest.replace(/(.*)\/images/, '/static/images'));
      }
      res.send(200, {urls: urls});
    });
  }
};

module.exports = ImagesController;
