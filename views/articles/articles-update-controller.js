app.controller('ArticlesUpdateController', function($scope, $http, $window, NgdFlash) {
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
    $scope.markdownPreview.convert($scope.article.body);
  };
});

