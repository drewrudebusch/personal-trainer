var express = require('express');
var Exercise = require('../models/exercise');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    Exercise.find(function(err, exercises) {
      if (err) return res.status(500).send(err);
      res.send(exercises);
    });
  })
  .post(function(req, res) {
    Exercise.create(req.body, function(err, exercise) {
      if (err) return res.status(500).send(err);
      res.send(exercise);
    });
  });

router.route('/:id')
  .get(function(req, res) {
    Exercise.findById(req.params.id, function(err, exercise) {
      if (err) return res.status(500).send(err);
      res.send(exercise);
    });
  })
  .put(function(req, res) {
    Exercise.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  })
  .delete(function(req, res) {
    Exercise.findByIdAndRemove(req.params.id, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  });

module.exports = router;
