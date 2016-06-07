var app = angular.module('PersonalTrainerApp', ['ui.router', 'PersonalTrainerCtrls']);

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}])

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise('/404');

  $stateProvider
  .state('signin', {
    url: '/',
    templateUrl: 'app/views/signin.html',
    controller: 'AuthCtrl'
  })
  .state('home', {
    url: '/home',
    templateUrl: 'app/views/home.html',
    controller: 'HomeCtrl'
  })
  .state('profile', {
    url: '/profile',
    templateUrl: 'app/views/profile.html',
    controller: 'ProfileCtrl'
  })
  .state('profileEdit', {
    url: '/profile/edit',
    templateUrl: 'app/views/editProfile.html',
    controller: 'ProfileCtrl'
  })
  .state('changePassword', {
    url: '/profile/change-password',
    templateUrl: 'app/views/changePassword.html',
    controller: 'AuthCtrl'
  })
  .state('recipeShow', {
    url: '/recipes/:id',
    templateUrl: 'app/views/showRecipe.html',
    controller: 'ShowCtrl'
  })
  .state('404', {
    url: '/404',
    templateUrl: 'app/views/404.html'
  });

  $locationProvider.html5Mode(true);
}]);
