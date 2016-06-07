var mongoose = require('mongoose');

var ExerciseSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [],
  video: String,
  muscleGroups: []
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
