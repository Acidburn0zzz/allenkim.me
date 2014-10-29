app.controller('ArticlesListController', function($scope,Article, $location, resp) {
  $scope.articles = resp.data;
  $scope.search = function() {
    $location.search({search: $scope.searchVal});
  }
  $scope.page = function(add) {
    var currentPage = $location.search().page || 1;
    $location.search('page', parseInt(currentPage) + parseInt(add));
  }
});

