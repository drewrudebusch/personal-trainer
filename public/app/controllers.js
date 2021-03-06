angular.module('PersonalTrainerCtrls', ['PersonalTrainerServices', 'angularMoment'])
.controller('HomeCtrl', ['$scope', '$location', 'Auth', function($scope, $location, Auth) {
  $scope.location = $location.path()
  $scope.Auth = Auth;
  $scope.currentUser = Auth.currentUser();
}])

.controller('ExercisesCtrl', ['$scope', '$stateParams', 'Exercise', 'Auth', function($scope, $stateParams, Exercise, Auth) {
  $scope.exercises = [];

  $scope.auth = Auth;

  Exercise.query(function success(data) {
    console.log(data);
    $scope.exercises = data;
  }, function error(data) {
    console.log(data);
  });
}])

.controller('ExerciseShowCtrl', ['$scope', '$stateParams', 'Exercise', '$location', 'Auth', function($scope, $stateParams, Exercise, $location, Auth) {
  $scope.exercise = {};

  $scope.Auth = Auth;
  // $scope.currentUser = Auth.currentUser();

  $scope.isAdmin = function(user){
    if (user) {
      if (user._doc.accountType === 'Admin') {
        return true;
      } return false;
    }
  }

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
    password: '',
    accountType: ''
  };

  $scope.pwChange = {
    oldPw1: '',
    oldPw2: '',
    newPw: ''
  }

  $rootScope.currentUser = Auth.currentUser();
  if ($rootScope.currentUser) {
    $rootScope.currentUser.firstName = $scope.currentUser._doc.name.split(' ')[0];
    $rootScope.currentUser.isAdmin = $scope.currentUser._doc.accountType === 'Admin' ? true : false;
  }

  $scope.isLoggedIn = function() {
    return Auth.isLoggedIn();
  }
  $scope.Auth = Auth;
  $scope.getCurrentUserFirstName = function() {
    if ($location.path() !== '/' ) {
    var currentUser = Auth.currentUser();
    return currentUser._doc.name.split(' ')[0];
  } else {
    return null
  }
}
  // if ($scope.currentUser) {
  //   $scope.currentUserFirstName = $scope.currentUser._doc.name.split(' ')[0]
  //       // Only allow user to see the sign in page if not currently signed in
  //     // if ($location.path() === '/') {
  //     //   $scope.location = '/home';
  //     //   $location.path('/home')
  //     // }
  //   }

  $scope.logout = function() {
    Auth.removeToken();
    $scope.location = '/'
    $location.path('/');
  }

  $scope.userSignup = function() {
    console.log('User Signup should be firing');
    Cache.invalidate('/api/user');
    $scope.user.accountType = 'User';
    $scope.user.accountStatus = 'Active'
    $http.post('/api/users', $scope.user).then(
      function success(res) {
        console.log('response: ', res);
        $scope.userLogin();
    }, 
      function error(res) {
        if (res.data.code === 11000) {
          console.log('Duplicate error caught');
        }
        console.log('error: ', res);
    });
  }

  $scope.userLogin = function() {
    $http.post('/api/auth', $scope.user).then(function success(res) {
      console.log('login res: ', res)
      if (res.data.user.accountStatus === 'Active') {
        Auth.saveToken(res.data.token);
        $rootScope.currentUser = Auth.currentUser();
        $rootScope.currentUser.firstName = $scope.currentUser._doc.name.split(' ')[0]
        $rootScope.currentUser.isAdmin = $scope.currentUser._doc.accountType === 'Admin' ? true : false;
            // Only allow user to see the sign in page if not currently signed in
          // if ($location.path() === '/') {
          //   $scope.location = '/home';
          //   $location.path('/home')
          // }
        $location.path('/profile/workouts');
      } else {
        console.log('login error: account inactive');
        // !!! Insert flash alert for inactive account
      }
      
      
    }, function error(res) {
      console.log(res);
    });
  }

  // $scope.changePassword = function() {
  //   update the User database with new password
    
  // }
}])

.controller('AdminCtrl', ['$scope', 'User', 'Workout', function($scope, User, Workout) {
  $scope.users = [];

  User.query(function success(data) {
      console.log('users: ',data);
      $scope.users = data;
    }, function error(data) {
      console.log('Users error: ', data);
    });
  Workout.query(function success(data) {
      console.log('workouts: ', data);
      $scope.workouts = data.filter(function (workout) {
      return workout.userId === 'template';
    });
    }, function error(data) {
      console.log('Workouts error: ', data);
    });

}])
.controller('AdminWorkoutsCtrl', ['$scope', 'User', 'Workout', 'Exercise', function($scope, User, Workout, Exercise) {
  $scope.workouts = [];
  $scope.exercises = [];

  Exercise.query(function success(data) {
      console.log('Exercise data: ',data);
      $scope.exercises = data;
  })
  Workout.query(function success(data) {
      console.log('Workouts data: ', data);
      $scope.workouts = data;
    }, function error(data) {
      console.log('Workouts error: ',data);
    });

  $scope.isTemplate = function(workout) {
    // Do some tests
    if(workout.userId === 'template')
    {
        return true; // this will be listed in the results
    }
    return false; // otherwise it won't be within the results
  };
    // data.map(function(x) {return x._id; }).indexOf(exercise.exerciseId);
    //   // target = $scope.exercises.filter(function (cooldown) {
    //   //   return exercise.exerciseId === cooldown._id ;
    //   // });
    //   return index
    //   }
}])

.controller('AdminWorkoutDetailCtrl', ['$scope', 'User', 'Workout', 'Exercise', '$stateParams',
                              function($scope, User, Workout, Exercise, $stateParams) {
  $scope.workout = {};
  $scope.exercises = [];

  // GET all exercises in current workout (?) 
  Exercise.query(function success(data) {
      console.log(data);
      $scope.exercises = data;
  })
  Workout.get({id: $stateParams.id}, function success(data) {
      console.log(data);
      $scope.workout = data;
    }, function error(data) {
      console.log(data);
    });

  $scope.exerciseIndex = function(exercise) {
      console.log('exercise: ', exercise);
      var index = '';
      index = $scope.exercises.map(function(x) {return x._id; }).indexOf(exercise.exerciseId);
      // target = $scope.exercises.filter(function (cooldown) {
      //   return exercise.exerciseId === cooldown._id ;
      // });
      return index
      }

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

}])

.controller('AdminWorkoutNewCtrl', ['$scope', 'Auth', 'User', 'Exercise', 'Workout', '$http', 'Cache', '$location', function($scope, Auth, User, Exercise, Workout, $http, Cache, $location) {

  Exercise.query(function success(data) {
      console.log(data);
      $scope.exercises = data;
  })
  User.query(function success(data) {
      $scope.users = data;
      $scope.users.unshift({'id': 'template', 'name': 'Template'})
      console.log('Users: ', $scope.users);
  })
  
  $scope.workout = {
    title: '',
    date: '',
    description: '',
    warmups: [],
    workouts: [],
    cooldowns: [],
    userId: ''
  };
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
    if ($scope.workout.userId === 'template') {
      $scope.workout.date = '';
    }
    $http.post('/api/workouts', $scope.workout).then(
      function success(res) {
        console.log('response: ', res);
        $location.path('/admin/workouts');
      },
      function error(res) {
        console.log('error: ', res);
      });
  }
  $scope.printWorkout = function() {
    console.log('$scope.workout: ', $scope.workout);
  }
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

.controller('ProfileCtrl',
  ['$scope', 'Auth', 'User', '$http', '$location', '$rootScope', '$stateParams',
  function($scope, Auth, User, $http, $location, $rootScope, $stateParams) {

  $scope.primaryGymExpanded = false;

  $scope.Auth = Auth;
  console.log('currentUser: ', $rootScope.currentUser);
  $scope.profile = {
      "_id": '',
      "name": '',
      "firstName": '',
      "email": '',
      "accountType": '',
      "gender": '',
      "heightFeet": '',
      "heightInches": '',
      "weight": '',
      "accountType": '',
      "accountStatus": ''
    }

  var userId = '';
  var currentLocation = $rootScope.location.split('/')[1]
  if (currentLocation === 'profile') {
    userId = $rootScope.currentUser._doc._id
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
      "weight": data.weight ? data.weight : 0,
      "accountType": data.accountType,
      "accountStatus": data.accountStatus
    }
    console.log('currentUser profile: ', $scope.profile);
  }, function error(data) {
    console.log(data);
  });

  $scope.updateProfile = function(id) {
    console.log('profile at update: ', $scope.profile);
    $http.put('/api/users/' + $scope.profile._id, $scope.profile).then(
      function success(res) {
        if (currentLocation === 'admin') {
          $location.path('/admin/users/view/' + $scope.profile._id)
        } else {
          $location.path('/profile');
        }
    },
      function error(res) {
      var data = res
      console.log(data);
    });
  }
}])

.controller('WorkoutCtrl',
  ['$scope', 'Workout', '$http', '$location', 'moment', '$rootScope',
  function($scope, Workout, $http, $location, moment, $rootScope) {
  
  console.log('currentUser: ', $rootScope.currentUser);

  // Exercise.query(function success(data) {
  //     console.log('exercises: ', data);
  //     $scope.exercises = data;
  // })
  $scope.workouts
  Workout.query(function success(data) {
    console.log('workouts: ', data);
    console.log('currentUser workout load: ', $rootScope.currentUser)
    // $scope.workouts = data;
    $scope.workouts = data.filter(function (workout) {
      return workout.userId === $rootScope.currentUser._doc._id;
    })
  });
  console.log('workouts end result: ', $scope.workouts);
  $scope.now = new moment().toISOString();
  console.log('Now: ', $scope.now);

  $scope.upcoming = function(workout) {
    // Do some tests
    if(workout.date.toISOString() > $scope.now)
    {
        return true; // this will be listed in the results
    }
    return false; // otherwise it won't be within the results
  };
    // data.map(function(x) {return x._id; }).indexOf(exercise.exerciseId);
    //   // target = $scope.exercises.filter(function (cooldown) {
    //   //   return exercise.exerciseId === cooldown._id ;
    //   // });
    //   return index
    //   }

    $scope.upcomingExpanded = true;
    $scope.pastExpanded = false;
}])

.controller('WorkoutShowCtrl',
          ['$scope', 'Exercise', 'Workout', '$stateParams', '$http', '$location',
  function($scope, Auth, User, Exercise, Workout, $stateParams, $http, $location) {

    $scope.exercises = {};

    Exercise.query(function success(data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          $scope.exercises[data[i]._id] = {
            'name': data[i].name,
            'description': data[i].description,
            'muscleGroups': data[i].muscleGroups,
            'images': data[i].images,
            'video': data[i].video            
        }
      }
      console.log('exercises: ', $scope.exercises);
    })
    $scope.warmupExpanded = false;
    $scope.workoutExpanded = false;
    $scope.cooldownExpanded = false;

    Workout.get({id: $stateParams.id}, function success(data) {
      console.log('workout data: ', data)
      $scope.workout = data;
    }, function error(data) {
      console.log(data);
    });
}])