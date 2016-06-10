var app = angular.module('PersonalTrainerApp', ['ui.router', 'PersonalTrainerCtrls']);

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}])

app.run(function($rootScope, $location, Auth) {
  $rootScope.$on('$viewContentLoading', function(event, viewConfig){ 
    $rootScope.location = $location.path();
  });
  $rootScope.$on('$stateChangeSuccess', function(event) {
    $rootScope.location = $location.path();
  });
})

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
  .state('admin', {
    url: '/admin',
    templateUrl: 'app/views/admin.html',
    controller: 'AdminCtrl'
  })
  .state('adminWorkouts', {
    url: '/admin/workouts',
    templateUrl: 'app/views/adminWorkouts.html',
    controller: 'AdminWorkoutsCtrl'
  })
  .state('adminWorkoutDetail', {
    url: '/admin/workouts/view/:id',
    templateUrl: 'app/views/adminWorkoutDetail.html',
    controller: 'AdminWorkoutDetailCtrl'
  })
  .state('adminWorkoutEdit', {
    url: '/admin/workouts/edit/:id',
    templateUrl: 'app/views/adminWorkoutDetail.html',
    controller: 'AdminWorkoutEditCtrl'
  })
  .state('adminWorkoutNew', {
    url: '/admin/workouts/new',
    templateUrl: 'app/views/adminWorkoutNew.html',
    controller: 'AdminWorkoutNewCtrl'
  })
  .state('adminUsers', {
    url: '/admin/users',
    templateUrl: 'app/views/adminUsers.html',
    controller: 'AdminUsersCtrl'
  })
  .state('adminUserEdit', {
    url: '/admin/users/edit/:id',
    templateUrl: 'app/views/adminUserEdit.html',
    controller: 'ProfileCtrl'
  })
  .state('adminUserDetail', {
    url: '/admin/users/view/:id',
    templateUrl: 'app/views/adminUserDetail.html',
    controller: 'ProfileCtrl'
  })
  .state('profile', {
    url: '/profile',
    templateUrl: 'app/views/profile.html',
    controller: 'ProfileCtrl'
  })
  .state('profileEdit', {
    url: '/profile/edit',
    templateUrl: 'app/views/profileEdit.html',
    controller: 'ProfileCtrl'
  })
  .state('changePassword', {
    url: '/profile/change-password',
    templateUrl: 'app/views/changePassword.html',
    controller: 'AuthCtrl'
  })
  .state('exerciseNew', {
    url: '/exercises/new',
    templateUrl: 'app/views/exerciseNew.html',
    controller: 'ExerciseNewCtrl'
  })
  .state('exercises', {
    url: '/exercises',
    templateUrl: 'app/views/exercises.html',
    controller: 'ExercisesCtrl'
  })
  .state('exerciseShow', {
    url: '/exercises/:id',
    templateUrl: 'app/views/exerciseShow.html',
    controller: 'ExerciseShowCtrl'
  })
  .state('profileWorkouts', {
    url: '/profile/workouts',
    templateUrl: 'app/views/workouts.html',
    controller: 'WorkoutCtrl'
  })
  .state('profileWorkoutShow', {
    url: '/profile/workouts/:id',
    templateUrl: 'app/views/workoutShow.html',
    controller: 'WorkoutShowCtrl'
  })
  .state('404', {
    url: '/404',
    templateUrl: 'app/views/404.html'
  });

  $locationProvider.html5Mode(true);
}]);
