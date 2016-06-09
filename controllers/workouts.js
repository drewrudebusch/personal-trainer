var express = require('express');
var Workout = require('../models/workout');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    Workout.find(function(err, workouts) {
      if (err) return res.status(500).send(err);
      res.send(workouts);
    });
  })
  .post(function(req, res) {
    Workout.create(req.body, function(err, workout) {
      if (err) return res.status(500).send(err);
      res.send(workout);
    });
  });

router.route('/:id')
  .get(function(req, res) {
    Workout.findById(req.params.id, function(err, workout) {
      if (err) return res.status(500).send(err);
      res.send(workout);
    });
  })
  .put(function(req, res) {
    Workout.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  })
  .delete(function(req, res) {
    Workout.findByIdAndRemove(req.params.id, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  });

module.exports = router;
