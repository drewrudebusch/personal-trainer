var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) return res.status(500).send(err);
      res.send(users);
    });
  })
  .post(function(req, res) {
    User.create(req.body, function(err, user) {
      if (err) return res.status(500).send(err);
      res.send(user);
    });
  });

router.get('/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return res.status(500).send(err);
    res.send(user);
  });
});

router.put('/:id', function(req, res) {
  var id = req.params.id;
  console.log('req.body: ', req.body);
  var profile = req.body;
  var query = {_id: id}
  User.update(query, {$set: {
        name: profile.name,
        email: profile.email,
        gender: profile.gender,
        heightFeet: profile.heightFeet,
        heightInches: profile.heightInches,
        weight: profile.weight
    }},
    {new: true}, function(err, doc) {
      if (err) {
        res.status(500).send(err);
      } else {
        console.log(doc);
        res.json(doc);
      }
    });
  // User.findById(id, function(err, user) {
  //   if (err) {
  //     return res.status(500).send(err);
  //   } else {
  //     user.airports = req.body.airports
  //     user.save(function err(msg, user, count) {
  //       console.log("save error:", msg)
  //       console.log(user)
  //        res.send(user);
  //     });
  //   }
   
  // });
});

module.exports = router;
