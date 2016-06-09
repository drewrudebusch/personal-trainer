angular.module('PersonalTrainerCtrls', ['PersonalTrainerServices'])
.controller('HomeCtrl', ['$scope', '$location', 'Auth', function($scope, $location, Auth) {
  $scope.location = $location.path()
  $scope.Auth = Auth;
  $scope.currentUser = Auth.currentUser();
}])

.controller('ExercisesCtrl', ['$scope', '$stateParams', 'Exercise', function($scope, $stateParams, Exercise) {
  $scope.exercises = [];

  Exercise.query(function success(data) {
    console.log(data);
    $scope.exercises = data;
  }, function error(data) {
    console.log(data);
  });
}])

.controller('ExerciseShowCtrl', ['$scope', '$stateParams', 'Exercise', '$location', function($scope, $stateParams, Exercise, $location) {
  $scope.exercise = {};

  Exercise.get({id: $stateParams.id}, function success(data) {
    $scope.exercise = data;
  }, function error(data) {
    console.log(data);
  });

  $scope.deleteExercise = function(exercise) {
    Exercise.delete({ id: exercise._id }, function success(data) {
      console.log('Deleted from server');
      console.log('data: ', data);
      $location.path('/exercises');
    });
  }
}])

.controller('ExerciseNewCtrl', ['$scope', '$location', 'Exercise', 'Cache', function($scope, $location, Exercise, Cache) {
  $scope.exercise = {
    name: '',
    description: '',
    images: [{'id': 1, 'link': ''}],
    video: '',
    muscleGroups: []
  };

  $scope.showImageLabel = function (image) {
    console.log('showImageLabel')
    return image.id === $scope.exercise.images[0].id;
  };
  $scope.showAddImage = function(image) {
    return image.id === $scope.exercise.images[0].id;
  };
  $scope.addNewImage = function() {
    console.log('$scope.exercise: ', $scope.exercise)
    var newItemNo = $scope.exercise.images[$scope.exercise.images.length-1].id;
    console.log(newItemNo);
    $scope.exercise.images.push({'id':newItemNo + 1});
  };
  $scope.removeNewImage = function(image) {
    var removeIndex;
    for (var i = 0; i < $scope.exercise.images.length; i++) {
      if ($scope.exercise.images[i].id === image.id) {
        removeIndex = i;
        break;
      }
    }
    $scope.exercise.images.splice(removeIndex, 1);
    console.log('$scope.exercise: ', $scope.exercise);
  }

  $scope.createExercise = function() {
    console.log($scope.exercise)
    Exercise.save($scope.exercise, function success(data) {
      console.log(data);
      Cache.invalidate('/api/exercises');
      $location.path('/exercises');
    }, function error(data) {
      console.log(data);
    });
  }
}])

.controller('AuthCtrl', ['$scope', '$http', '$location', 'Auth', '$rootScope', 'Cache',
                function($scope, $http, $location, Auth, $rootScope, Cache) {
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

  console.log('$scope.location: ', $scope.location);
  console.log('$rootScope.location: ', $rootScope.location);
  // $scope.location = $location.path()
  $scope.Auth = Auth;
  $scope.currentUser = Auth.currentUser();
  if ($scope.currentUser) {
    $scope.currentUserFirstName = $scope.currentUser._doc.name.split(' ')[0]
      // Only allow user to see the sign in page if not currently signed in
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
    console.log('User Signup should be firing');
    Cache.invalidate('/api/user');
    $http.post('/api/users', $scope.user).then(function success(res) {
      console.log('response: ', res);
    }, function error(res) {
      console.log('error: ', res);
    });
    $scope.userLogin();
  }

  $scope.userLogin = function() {
    console.log('$scope.user', $scope.user);
    $http.post('/api/auth', $scope.user).then(function success(res) {
      Auth.saveToken(res.data.token);
      $scope.currentUser = Auth.currentUser();
      // $scope.location = '/home'
      $location.path('/profile');
    }, function error(res) {
      console.log(res);
    });
  }

  // $scope.changePassword = function() {
  //   update the User database with new password
    
  // }
}])

.controller('AdminCtrl', ['$scope', 'User', function($scope, User) {
  $scope.users = [];

  User.query(function success(data) {
      console.log(data);
      $scope.users = data;
    }, function error(data) {
      console.log(data);
    });

  $scope.workouts = [{
    _id: '57573ce5fde5b9252bad8555',
    title: 'Monday Strength Routine',
    date: '2016-06-22',
    description: 'Bench, Squat, Cleans, Sit-ups',
    warmups: [{'_id': '57573ce5fde5b9252bad8943', 'sets': 1, 'reps': 10, 'note': 'get warm'}, {'_id': '575743314bb2e27835207b99', 'sets': 1, 'reps': 20, 'note': 'get warmer'}],
    workouts: [{'_id': '575743314bb2e27835207b99', 'sets': 2, 'reps': 20, 'note': 'try hard'}, {'_id': '57573ce5fde5b9252bad8943', 'sets': 2, 'reps': 10, 'note': 'try harder'}],
    cooldowns: [{'_id': '57573ce5fde5b9252bad8943', 'sets': 1, 'reps': 5, 'note': 'start cooling down'}, {'_id': '575743314bb2e27835207b99', 'sets': 1, 'reps': 10, 'note': 'cooled down'}],
    userId: 'template'
  }];
}])
.controller('AdminWorkoutsCtrl', ['$scope', 'User', 'Workout', 'Exercise', function($scope, User, Workout, Exercise) {
  $scope.workouts = [];
  $scope.exercises = [];

  Exercise.query(function success(data) {
      console.log(data);
      $scope.exercises = data;
  })
  Workout.query(function success(data) {
      console.log(data);
      $scope.users = data;
    }, function error(data) {
      console.log(data);
    });
  $scope.workouts = [{
    title: 'Monday Strength Routine',
    description: 'Bench, Squat, Cleans, Sit-ups',
    date: '2016-06-20',
    warmup: [{'_id': '57573ce5fde5b9252bad8943', 'sets': 1, 'reps': 10, 'note': 'get warm'}, {'_id': '575743314bb2e27835207b99', 'sets': 1, 'reps': 20, 'note': 'get warmer'}],
    workout: [{'_id': '575743314bb2e27835207b99', 'sets': 2, 'reps': 20, 'note': 'try hard'}, {'_id': '57573ce5fde5b9252bad8943', 'sets': 2, 'reps': 10, 'note': 'try harder'}],
    cooldown: [{'_id': '57573ce5fde5b9252bad8943', 'sets': 1, 'reps': 5, 'note': 'start cooling down'}, {'_id': '575743314bb2e27835207b99', 'sets': 1, 'reps': 10, 'note': 'cooled down'}],
    userId: 'template'
  }];
}])

.controller('AdminWorkoutDetailCtrl', ['$scope', 'User', 'Workout', 'Exercise', function($scope, User, Workout, Exercise) {
  // $scope.workout = {};
  $scope.exercises = [];

  // GET all exercises in current workout (?) 
  Exercise.query(function success(data) {
      console.log(data);
      $scope.exercises = data;
  })
  // Workout.get({id: $stateParams.id}, function success(data) {
  //     console.log(data);
  //     $scope.users = data;
  //   }, function error(data) {
  //     console.log(data);
  //   });
  $scope.workout = {
    _id: '57573ce5fde5b9252bad8555',
    title: 'Monday Strength Routine',
    description: 'Bench, Squat, Cleans, Sit-ups',
    warmups: [{'_id': '57573ce5fde5b9252bad8943', 'sets': 1, 'reps': 10, 'note': 'get warm'}, {'_id': '575743314bb2e27835207b99', 'sets': 1, 'reps': 20, 'note': 'get warmer'}],
    workouts: [{'_id': '575743314bb2e27835207b99', 'sets': 2, 'reps': 20, 'note': 'try hard'}, {'_id': '57573ce5fde5b9252bad8943', 'sets': 2, 'reps': 10, 'note': 'try harder'}],
    cooldowns: [{'_id': '57573ce5fde5b9252bad8943', 'sets': 1, 'reps': 5, 'note': 'start cooling down'}, {'_id': '575743314bb2e27835207b99', 'sets': 1, 'reps': 10, 'note': 'cooled down'}],
    userId: 'template'
  };
}])

.controller('AdminWorkoutNewCtrl', ['$scope', 'Auth', 'User', '$http', '$location', 'Exercise',
                    function($scope, Auth, User, $http, $location, Exercise) {
  $scope.currentUser = Auth.currentUser();

  Exercise.query(function success(data) {
      console.log(data);
      $scope.exercises = data;
  })
  User.query(function success(data) {
      $scope.users = data;
      $scope.users.unshift({'_id': 'template', 'name': 'template'})
      console.log('Users: ', $scope.users);
  })
  
  $scope.workout = {
    _id: '',
    title: '',
    date: '',
    description: '',
    warmups: [],
    workouts: [],
    cooldowns: [],
    userId: ''
  };

  // $scope.showImageLabel = function (image) {
  //   console.log('showImageLabel')
  //   return image.id === $scope.exercise.images[0].id;
  // };
  // $scope.showAddImage = function(image) {
  //   return image.id === $scope.exercise.images[0].id;
  // };
  $scope.addNewExercise = function(type) {
    if (type === 'warmup') {
      if ($scope.workout.warmups.length > 0) {
        var newItemNo = $scope.workout.warmups[$scope.workout.warmups.length-1].id + 1;
        $scope.workout.warmups.push({'id':newItemNo, 'exerciseId': ''});
      } else {
        $scope.workout.warmups.push({'id': 1, 'exerciseId': ''});
      }
    } else if (type === 'workout') {
      if ($scope.workout.workouts.length > 0) {
        var newItemNo = $scope.workout.workouts[$scope.workout.workouts.length-1].id + 1;
        $scope.workout.workouts.push({'id':newItemNo, 'exerciseId': ''});
      } else {
        $scope.workout.workouts.push({'id': 1, 'exerciseId': ''});
      }
    } else if (type === 'cooldown') {
      if ($scope.workout.cooldowns.length > 0) {
        var newItemNo = $scope.workout.cooldowns[$scope.workout.cooldowns.length-1].id + 1;
        $scope.workout.cooldowns.push({'id':newItemNo, 'exerciseId': ''});
      } else {
        $scope.workout.cooldowns.push({'id':1, 'exerciseId': ''});
      }
    } else {
      console.log('ruh roh! exercise not added')
    }
    // console.log('$scope.exercise: ', $scope.exercise)
    // console.log(newItemNo);
    // $scope.exercise.images.push({'id':newItemNo});
  };
  $scope.removeExercise = function(type, exerciseId) {
    console.log('type: ', type);
    console.log('exercise: ', exerciseId);
    var removeIndex;
    if (type === 'warmup') {
      for (var i = 0; i < $scope.workout.warmups.length; i++) {
        if ($scope.workout.warmups[i].exerciseId === exerciseId) {
          removeIndex = i;
          break;
        }
      }
      $scope.workout.warmups.splice(removeIndex, 1);
    } else if (type === 'workout') {
      for (var i = 0; i < $scope.workout.warmups.length; i++) {
        if ($scope.workout.workouts[i].exerciseId === exerciseId) {
          removeIndex = i;
          break;
        }
      }
      $scope.workout.workouts.splice(removeIndex, 1);
    } else if (type === 'cooldown') {
      for (var i = 0; i < $scope.workout.warmups.length; i++) {
        if ($scope.workout.cooldowns[i].exerciseId === exerciseId) {
          removeIndex = i;
          break;
        }
      }
      $scope.workout.cooldowns.splice(removeIndex, 1);
    } else {
      console.log('ruh roh! Remove Exercise Failure');
    }
  }

  $scope.createWorkout = function() {
    console.log($scope.workout)
    $scope.workout.warmups = $scope.workout.warmups.filter(function (warmup) {
      return warmup.exerciseId != '';
    });
    $scope.workout.workouts = $scope.workout.workouts.filter(function (workout) {
      return workout.exerciseId != '';
    });
    $scope.workout.cooldowns = $scope.workout.cooldowns.filter(function (cooldown) {
      return cooldown.exerciseId != '' && cooldown.repsGoal > 0 && cooldown.setsGoal > 0
    });
    console.log($scope.workout)
    // Remove all empty warmup, workout, and cooldown objects from array
    // Exercise.save($scope.exercise, function success(data) {
    //   console.log(data);
    //   Cache.invalidate('/api/exercises');
    //   $location.path('/exercises');
    // }, function error(data) {
    //   console.log(data);
    // });
  }
      // {'_id': '57573ce5fde5b9252bad8943', 'sets': 1, 'reps': 10, 'note': 'get warm'}, {'_id': '575743314bb2e27835207b99', 'sets': 1, 'reps': 20, 'note': 'get warmer'}
}])

.controller('AdminUsersCtrl', ['$scope', 'User', function($scope, User) {
  $scope.users = [];

  User.query(function success(data) {
      console.log(data);
      $scope.users = data;
    }, function error(data) {
      console.log(data);
    });

  $scope.sortType     = 'name'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.searchUsers   = '';     // set the default search/filter term
}])

.controller('ProfileCtrl', ['$scope', 'Auth', 'User', '$http', '$location', '$rootScope', '$stateParams',
                    function($scope, Auth, User, $http, $location, $rootScope, $stateParams) {
  $scope.currentUser = Auth.currentUser();
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

  var userId = '';

  if ($rootScope.location.split('/')[1] === 'profile') {
    userId = $scope.currentUser._doc._id
  } else {
    userId = $stateParams.id
  }
  console.log('userId: ', userId);

  User.get({id: userId}, function success(data) {
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

.controller('WorkoutCtrl', ['$scope', 'Auth', 'User', '$http', '$location',
                    function($scope, Auth, User, $http, $location) {
  $scope.currentUser = Auth.currentUser();

  Exercise.query(function success(data) {
      console.log(data);
      $scope.exercises = data;
  })

  $scope.workouts = [{
    _id: '57573ce5fde5b9252bad8555',
    title: 'Monday Strength Routine',
    date: '2016-06-22',
    description: 'Bench, Squat, Cleans, Sit-ups',
    warmups: [{'_id': '57573ce5fde5b9252bad8943', 'sets': 1, 'reps': 10, 'note': 'get warm'}, {'_id': '575743314bb2e27835207b99', 'sets': 1, 'reps': 20, 'note': 'get warmer'}],
    workouts: [{'_id': '575743314bb2e27835207b99', 'sets': 2, 'reps': 20, 'note': 'try hard'}, {'_id': '57573ce5fde5b9252bad8943', 'sets': 2, 'reps': 10, 'note': 'try harder'}],
    cooldowns: [{'_id': '57573ce5fde5b9252bad8943', 'sets': 1, 'reps': 5, 'note': 'start cooling down'}, {'_id': '575743314bb2e27835207b99', 'sets': 1, 'reps': 10, 'note': 'cooled down'}],
    userId: 'template'
  }];
}])

.controller('WorkoutShowCtrl', ['$scope', 'Auth', 'User', '$http', '$location', 'Exercise',
                    function($scope, Auth, User, $http, $location, Exercise) {
  $scope.currentUser = Auth.currentUser();

  Exercise.query(function success(data) {
      console.log(data);
      $scope.exercises = data;
  })
  $scope.warmupExpanded = false;
  $scope.workoutExpanded = false;
  $scope.cooldownExpanded = false;

  $scope.expanded = function(type) {
    if (type == 'warmup') {
      $scope.warmupExpanded = !$scope.warmupExpanded;
    } else if (type == 'workout') {
      $scope.workoutExpanded = !$scope.workoutExpanded;
    } else if (type === 'cooldown') {
      $scope.cooldownExpanded = !$scope.cooldownExpanded;
    } else { console.log('Ruh roh!');}
  }

  $scope.workout = {
    _id: '57573ce5fde5b9252bad8555',
    title: 'Monday Strength Routine',
    date: '2016-06-22',
    description: 'Bench, Squat, Cleans, Sit-ups',
    warmups: [{'_id': '57573ce5fde5b9252bad8943', 'sets': 1, 'reps': 10, 'note': 'get warm'}, {'_id': '575743314bb2e27835207b99', 'sets': 1, 'reps': 20, 'note': 'get warmer'}],
    workouts: [{'_id': '575743314bb2e27835207b99', 'sets': 2, 'reps': 20, 'note': 'try hard'}, {'_id': '57573ce5fde5b9252bad8943', 'sets': 2, 'reps': 10, 'note': 'try harder'}],
    cooldowns: [{'_id': '57573ce5fde5b9252bad8943', 'sets': 1, 'reps': 5, 'note': 'start cooling down'}, {'_id': '575743314bb2e27835207b99', 'sets': 1, 'reps': 10, 'note': 'cooled down'}],
    userId: 'template'
  };
}])