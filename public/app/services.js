angular.module('PersonalTrainerServices', ['ngResource'])
.factory('Recipe', ['$resource', function($resource) {
  return $resource('/api/recipes/:id');
}])

.factory('User', ['$resource', function($resource) {
  return $resource('/api/users/:id', { id: '@_id' }, {
    get: {method: 'GET', cache: false, isArray: false},
    update: {
      method: 'PUT', cache: false, isArray: false},
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
