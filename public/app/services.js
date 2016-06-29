angular.module('PersonalTrainerServices', ['ngResource'])
.factory('Exercise', ['$resource', function($resource) {
  return $resource('/api/exercises/:id', { id: '@_id'}, {
    query: {method: 'GET', cache: true, isArray: true},
    get: {method: 'GET', cache: false, isArray: false},
    update: {method: 'PUT', cache: false, isArray: false},
    delete: {method:'DELETE'}
  });
}])

.factory('Cache', function ($cacheFactory) {
  var $httpDefaultCache = $cacheFactory.get('$http');
  return {
    invalidate: function (key) {
        $httpDefaultCache.remove(key);
    }
  }
})

.factory('Workout', ['$resource', function($resource) {
  return $resource('/api/workouts/:id', { id: '@_id'}, {
    query: {method: 'GET', cache: false, isArray: true},
    get: {method: 'GET', cache: false, isArray: false},
    update: {method: 'PUT', cache: false, isArray: false},
    delete: {method:'DELETE'}
  });
}])

.factory('User', ['$resource', function($resource) {
  return $resource('/api/users/:id', { id: '@_id' }, {
    query: {method: 'GET', cache: true, isArray: true},
    get: {method: 'GET', cache: false, isArray: false},
    update: {method: 'PUT', cache: false, isArray: false}
  });
}])

.factory('Auth', ['$window', function($window) {
  return {
    saveToken: function(token) {
      $window.localStorage['pt-user-token'] = token;
    },
    getToken: function() {
      return $window.localStorage['pt-user-token'];
    },
    removeToken: function() {
      $window.localStorage.removeItem('pt-user-token');
    },
    isLoggedIn: function() {
      var token = this.getToken();
      // console.log('Get token returned: ', token)
      return token ? true : false;
    },
    currentUser: function() {
      if (this.isLoggedIn()) {
        var token = this.getToken();
        try {
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          return payload;
        } catch(err) {
          return false;
        }
      }
    },
    isAdmin: function(user){
      console.log("isadmin: ", user);
      if (user._doc.accountType === 'Admin') {
        return true;
      } return false;
    }
  }
}])

.factory('AuthInterceptor', ['Auth', function(Auth) {
  return {
    request: function(config) {
      var token = Auth.getToken();
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  }
}])
