var express = require('express');
var Workout = require('../models/workout');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    Workout.find(function(err, exercises) {
      if (err) return res.status(500).send(err);
      res.send(exercises);
    });
  })
  .post(function(req, res) {
    Workout.create(req.body, function(err, exercise) {
      if (err) return res.status(500).send(err);
      res.send(exercise);
    });
  });

router.route('/:id')
  .get(function(req, res) {
    Workout.findById(req.params.id, function(err, exercise) {
      if (err) return res.status(500).send(err);
      res.send(exercise);
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
