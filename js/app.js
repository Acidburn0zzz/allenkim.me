(function() {
  'use strict';
  angular.module('blog',['ngTouch', 'ui.router']);

  angular.module('blog').config(function($stateProvider, $locationProvider, $urlRouterProvider) {
    //$locationProvider.html5Mode(true);
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'partials/home.html',
        controller: 'homeCtrl'
      })
      .state('post', {
        url: '/posts/:post',
        templateUrl: 'partials/post.html',
        controller: 'postCtrl'
      });

    $urlRouterProvider.otherwise('/');
  });

  angular.module('blog').run(function($rootScope, $http) {
    $http.get('api/page1.json').success(function(data) {
      $rootScope.posts = data.posts;
    });
  });

  angular.module('blog').run( function ($rootScope, $state, $window) {
    $rootScope.$state = $state;
    angular.element($window).bind('scroll', function() {
      $rootScope.winTop = $window.pageYOffset;
      $rootScope.winBottom = $window.pageYOffset + $window.innerHeight;
      $rootScope.winHeight = $window.innerHeight;
      $rootScope.$apply();
    });
  });

  angular.module('blog').controller('homeCtrl', function($scope, $http) {
  });

  angular.module('blog').controller('postCtrl', function($scope, $rootScope, $stateParams, filterFilter) {
    $scope.post = $stateParams.post;
    document.title = $scope.post.
      replace(/\.html$/, '').
      replace(/^(.*)[0-9]+/, '').
      replace(/-([a-z])/gi, function(_, $1) { 
        return ' ' + $1.toUpperCase();
      });
    $scope.random = Math.floor(Math.random()*12);
  });
})();
