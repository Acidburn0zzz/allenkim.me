var app = angular.module('app', [
  'ngSanitize',    // to show converted markdown html safely
  'angularjsAuth', // for role-based auth.
                   //   . it sets $rootScope.Auth 
                   //   . it sets header, 'x-access-token', for all http request
                   //   . it broadcast 'auth-required' for 401 response
  'ngd'            // collection of directives
]);

app.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});

app.run(function($rootScope, $window) {
  $rootScope.location = $window.location;
});
