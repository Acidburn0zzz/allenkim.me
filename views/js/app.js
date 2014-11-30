var app = angular.module('app', [
  'ngMaterial',
  'angularjsAuth', // for role-based auth.
                   //   . it sets $rootScope.Auth 
                   //   . it sets header, 'x-access-token', for all http request
                   //   . it broadcast 'auth-required' for 401 response
  'ngd',            // collection of directives
  'ngMap'
]);

app.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});

app.run(function($rootScope, $window) {
  $rootScope.window = $window;
  $rootScope.location = $window.location;
  $rootScope.locationEncoded = $window.encodeURIComponent($window.location.href);
  $rootScope.rand = Math.floor(Math.random()*1000000);
});
