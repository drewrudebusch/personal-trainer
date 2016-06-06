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
