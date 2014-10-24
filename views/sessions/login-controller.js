app.controller('LoginController', function($scope, $http, Auth, $window, NgdFlash) {
  $scope.username="admin";

  $scope.login = function() {
    $http.post("/login", {
      username: $scope.username,
      password: $scope.password,
    }).success(function(data) {
      Auth.create(data);
      console.log('logged in successfully',  Auth.getAll());
      NgdFlash.push("logged in successfully");
      $window.location.href = $window.location.search.replace(/\?redir=/,"");
    }).error(function(data) {
      console.log('err data', data);
      $scope.error = data.err;
    });
  };

  $scope.logout = function() {
    Auth.logout();
    NgdFlash.push("logged out successfully");
    $window.location.href = "/login";
  };
});

