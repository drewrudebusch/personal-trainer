var mongoose = require('mongoose');

var ExerciseSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: [],
  video: String
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
