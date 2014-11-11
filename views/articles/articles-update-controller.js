app.controller('ArticlesUpdateController', 
  function($scope, $http, $window, NgdFlash, Image) {
    $scope.save = function() {
      $http.put('/articles/'+$scope.article._id, $scope.article).then(function(resp) {
        NgdFlash.push("Updated successfully");
        $window.location.href = "/articles"; 
      }, function(error) {
        alert(JSON.stringify(error));
      });
    };

    $scope.preview = function() {
      $scope.tab = 'preview';
      $scope.convertMarkdown("pv", $scope.article.body);
    };

    var insertImageTag = function(urls) {
      for (var i=0; i < urls.length; i++) {
        var imgTag = '<img src="'+urls[i]+'" width="'+Image.width+'" />';
        $scope.article.body += "\n" + imgTag ;
      }
    };

    /* UPLOAD IMAGE FILES */
    var imageAdded = function(e, msg) {
      if (msg.files) { // image dropped from file or pasted
        Image.uploadImages(msg.files).then(function(resp) {
          insertImageTag(resp.data.urls);
        });
      } else if (msg.url) { // image dropped from url
        insertImageTag([msg.url]);
      }
    };

    $scope.$on('ngd-image-dropped', imageAdded);
    $scope.$on('ngd-image-pasted', imageAdded); 
  }
);

