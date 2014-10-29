var ngAuth = angular.module('angularjsAuth', ['ngCookies']);

/**
 * Provides Auth. related functions
 */
ngAuth.provider('Auth', function() {
  var storageType = "cookie"; // session, or local

  this.setStorageType = function(arg) {
    storageType = arg;
  };

  this.$get = ['$window', function($window) {
    var Cookie = {
      get: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') { c = c.substring(1,c.length); }
          if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length,c.length); }
        }
        return null;
      },
      set: function(name,value,days) {
        var expires;
        if (days) {
          var date = new Date();
          date.setTime(date.getTime()+(days*24*60*60*1000));
          expires = "; expires="+date.toGMTString();
        }
        else {
          expires = "";
        }
        document.cookie = name+"="+value+expires+"; path=/";
      },
      all: function() {
        var cookies = {};          
        var list = document.cookie.split("; "); // Split into individual name=value pairs
        for(var i = 0; i < list.length; i++) {  // For each cookie
          var cookie = list[i];
          var p = cookie.indexOf("=");        // Find the first = sign
          var name = cookie.substring(0,p);   // Get cookie name
          var value = cookie.substring(p+1);  // Get cookie value
          value = decodeURIComponent(value);  // Decode the value
          cookies[name] = value;              // Store name and value in object
        }
        return cookies;
      }
    };

    var Auth = function() {
      this.storageType =  storageType;
      this.storage =  document.cookie;
      if (storageType == "session") {
        this.storage = $window.sessionStorage;
      } else if (storageType == "local") {
        this.storage = $window.localStorage;
      } else {
        this.storage = document.cookie;
      }

      this.get = function(key) {
        (!key.match(/^auth_/)) && (key = "auth_" + key);
        return this.storageType == 'cookie' ? Cookie.get(key) : this.storage[key];
      };

      this.set = function(key, val, exp) {
        val = typeof val === "string" ? val : JSON.stringify(val);
        var authKey = key.match(/^auth_/) ? key : 'auth_'+key;
        if (this.storageType === "cookie") {
          Cookie.set(authKey, val, exp);
        } else {
          if (exp == -1) {
            delete this.storage[authKey];
          } else {
            this.storage[authKey] = val;
          }
        }
      };

      this.getAll = function() {
        var auths = {};
        var all = this.storageType == "cookie" ? Cookie.all() : this.storage;
        for (var key in all) {
          (key.match(/^auth_/)) && (auths[key] = all[key]);
        }
        return auths;
      };

      this.isLoggedIn = function() {
        return this.get("auth_token");
      };

      this.permittedTo = function(role) {
        var roles = this.get("auth_roles");
        var userRoles = JSON.parse(roles || '[]');
        return (userRoles.indexOf(role) !== -1);
      };

      this.create = function(data) {
        for (var key in data) {
          this.set(key, data[key]);
        }
        console.log('auth. storage updated :', this.storage);
      };

      this.destroy = function() {
        for (var key in this.getAll()) {
          if (key.match(/^auth_/)) {
            this.set(key, "", -1);
          }
        }
        console.log('auth. storage updated :', this.storage);
      };
      this.logout = this.destroy;
    };
    return new Auth();
  }];
});

/**
 * For every single http request, we set auth. header so the server reads it 
 * This module does not register this interceptor, thus
 * You need to register as follows
 * ```
 * app.config(function($httpProvider) {
 *   $httpProvider.interceptors.push('AuthInterceptor');
 * });
 * ```
 * For every single http response with 401 error
 * it broadcase message 'auth_required' with 'http-response-401' param
 * Users can use this to redirect to login page or to show a login block
 * ```
 * $scope.on('auth_required', function(reason) {
 *   if (reason == 'http-response-401') {
 *     $location.url("/login?redir=" + encodeURIComponent($location.url()) );
 *   }
 * });
 * ```
 */
ngAuth.factory('AuthInterceptor', ['$q', '$rootScope', 'Auth',
  function ($q, $rootScope, Auth) {
    return {
  
      /**
       * For every single http request, we add access token to the header
       * so that, the server-side read this token to authorize the access to resource
       */ 
      request: function (config) {
        config.headers = config.headers || {};
        var token = Auth.get('token');
        if(token) {
          config.headers['x-access-token'] = token;
        }
        return config;
      },
  
      responseError: function(rejection) {
        if (rejection.status === 401) {
          $rootScope.$broadcast('auth_required', {
            reason: 'http-response-401', 
            rejection: rejection
          });
        }
        return $q.reject(rejection);
      }
    };
  }
]);

/**
 * listens to rootScope "$routeChangeSuccess" 
 * and broadcast 'auth_required' with params 'route' when a role is required
 * Users can use this to redirect to login page or show login block as follows
 * ``` 
 * $scope.on('auth_required', function(reason) {
 *   if (reason == 'route') {
 *     $location.url("/login?redir=" + encodeURIComponent($location.url()) );
 *   }
 * });
 * ```
 */
ngAuth.run(['$rootScope', 'Auth',
  function($rootScope, Auth, $route) {
    $rootScope.Auth = Auth;
  }
]);

try { 
  angular.module("ngRoute");
  ngAuth.run(['$rootScope', 'Auth', '$route', 
    function($rootScope, Auth, $route) {
      $rootScope.$on("$routeChangeSuccess", function(route) {
        var role = $route.current && 
          $route.current.$$route && 
          $route.current.$$route.authRequired;
        if (role && !Auth.permittedTo(role)) {
          $rootScope.$broadcast('auth_required', {
            reason: 'route', 
            route: $route.current.$$route
          });
        }
      });
    }
  ]);
} catch(err) {
  console.log('ngRoute module is not included. skipping $routeChangeSuccess for ng-auth');
}
