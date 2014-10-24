app.controller('ArticlesDestroyController', function($scope, $http, $window, NgdFlash) {
  $scope.destroy = function() {
    $http['delete']('/articles/'+$scope.article._id).then(function(resp) {
      NgdFlash.push("Deleted successfully");
      $window.location.href = "/articles"; 
    }, function(error) {
      alert(JSON.stringify(error));
    });
  };
});

