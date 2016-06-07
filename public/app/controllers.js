angular.module('PersonalTrainerCtrls', ['PersonalTrainerServices'])
.controller('HomeCtrl', ['$scope', '$location', 'Auth', function($scope, $location, Auth) {
  $scope.location = $location.path()
  $scope.Auth = Auth;
  $scope.currentUser = Auth.currentUser();
}])

.controller('ProfileCtrl', ['$scope', 'Auth', 'User', '$http', '$location', function($scope, Auth, User, $http, $location) {
  $scope.currentUser = Auth.currentUser();
  $scope.currentUserFirstName = $scope.currentUser._doc.name.split(' ')[0]
  $scope.profile = {
      "_id": '',
      "name": '',
      "firstName": '',
      "email": '',
      "accountType": '',
      "gender": '',
      "heightFeet": '',
      "heightInches": '',
      "weight": ''
    }

  User.get({id: $scope.currentUser._doc._id}, function success(data) {
    console.log('api data returned:', data);
    $scope.profile = {
      "_id": data.id,
      "name": data.name,
      "firstName": data.name.split(' ')[0],
      "email": data.email,
      "accountType": data.accountType,
      "gender": data.gender,
      "heightFeet": data.heightFeet ? data.heightFeet : 0,
      "heightInches": data.heightInches ? data.heightInches : 0,
      "weight": data.weight ? data.weight : 0
    }
    console.log('profile: ', $scope.profile);
  }, function error(data) {
    console.log(data);
  });

  $scope.updateProfile = function(id) {
    $http.put('/api/users/' + $scope.profile._id, $scope.profile).then(
      function success(res) {
        $location.path('/profile');
    },
      function error(res) {
      var data = res
      console.log(data);
    });
  }
}])

.controller('ShowCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
  $scope.recipe = {};

  Recipe.get({id: $stateParams.id}, function success(data) {
    $scope.recipe = data;
  }, function error(data) {
    console.log(data);
  });
}])
.controller('NewCtrl', ['$scope', '$location', function($scope, $location) {
  $scope.recipe = {
    title: '',
    description: '',
    image: ''
  };

  $scope.createRecipe = function() {
    Recipe.save($scope.recipe, function success(data) {
      $location.path('/');
    }, function error(data) {
      console.log(data);
    });
  }
}])

.controller('EditProfileCtrl', ['$scope', '$location', 'Auth', function($scope, $location, Auth) {
  $scope.currentUser = Auth.currentUser();
  
}])


.controller('AuthCtrl', ['$scope', '$http', '$location', 'Auth',
                function($scope, $http, $location, Auth) {
  $scope.user = {
    name: '',
    email: '',
    password: ''
  };

  $scope.pwChange = {
    oldPw1: '',
    oldPw2: '',
    newPw: ''
  }

  $scope.location = $location.path()
  $scope.Auth = Auth;
  $scope.currentUser = Auth.currentUser();
  if ($scope.currentUser) {
    $scope.currentUserFirstName = $scope.currentUser._doc.name.split(' ')[0]
    // if ($location.path() === '/') {
    //   $scope.location = '/home';
    //   $location.path('/home')
    // }
  }

  $scope.logout = function() {
    Auth.removeToken();
    console.log('My token:', Auth.getToken());
    $scope.location = '/'
    $location.path('/');
  }

  $scope.userSignup = function() {
    $http.post('/api/users', $scope.user).then(function success(res) {
    }, function error(res) {
      console.log(res);
    });
    $scope.userLogin();
  }

  $scope.userLogin = function() {
    console.log('$scope.user', $scope.user);
    $http.post('/api/auth', $scope.user).then(function success(res) {
      Auth.saveToken(res.data.token);
      $scope.currentUser = Auth.currentUser();
      $scope.location = '/home'
      $location.path('/home');
    }, function error(res) {
      console.log(res);
    });
  }

  $scope.changePassword = function() {
    // update the User database with new password
    // 
  }
}])