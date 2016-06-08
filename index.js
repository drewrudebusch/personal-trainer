var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var app = express();

var secret = "mysupersecretpassword";

var mongoose = require('mongoose');
var User = require('./models/user');
mongoose.connect('mongodb://localhost/personal-trainer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/exercises', expressJWT({secret: secret}));
app.use('/api/users', expressJWT({secret: secret})
.unless({path: ['/api/users'], method: 'post'}));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({message: 'You need an authorization token to view this information.'})
  }
});

app.use('/api/exercises', require('./controllers/exercises'));
app.use('/api/users', require('./controllers/users'));

app.post('/api/auth', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    console.log(user);
    if (err || !user) {
      console.log('401 Error: User not found');
      return res.status(401).send({message: 'User not found'});
    }
    user.authenticated(req.body.password, function(err, result) {
      if (err || !result) {
        console.log('401 Error: User not authenticated');
        return res.status(401).send({message: 'User not authenticated'});
      }
      var token = jwt.sign(user, secret);
      console.log('token:', token);
      res.send({user: user, token: token});
    });
  });
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(3000);
