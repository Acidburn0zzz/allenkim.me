app.controller('ArticlesCreateController', function($scope, $http, $window, NgdFlash) {
  $scope.article = {id: undefined, type: 'markdown', body: ''};

  $scope.save = function() {
    console.log('save clicked');
    $http.post('/articles', $scope.article).then(function(resp) {
      NgdFlash.push("Created successfully");
      $window.location.href = "/articles"; 
    }, function(error) {
      alert(JSON.stringify(error));
    });
  };

  $scope.preview = function() {
    $scope.tab = 'preview';
    $scope.markdownPreview.convert($scope.article.body);
  };

  /* UPLOAD IMAGE FILES */
  $scope.$on('imageDrop', function(e,imageFiles) { $scope.imageFiles = imageFiles; });
  $scope.$on('imagePaste', function(e,imageFiles) {$scope.imageFiles = imageFiles; });

  $scope.uploadImageFiles = function() {
    if ($scope.imageFiles) {
      $scope.imagePreview.add($scope.imageFiles);
      Image.upload({imageFiles: $scope.imageFiles}).then( function(resp) {
        for (var i=0; i < resp.data.urls.length; i++) {
          var imgTag = '<img src="'+resp.data.urls[i]+'" width="300" />';
          $scope.article.body += "\n" + imgTag ;
        }
      }, function(err) {
        alert(err);
      });
    }
  };
});

