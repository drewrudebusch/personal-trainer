var mongoose = require('mongoose');

var WorkoutSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  warmup: [],
  workout: [],
  cooldown: [],
  userId: String
});

module.exports = mongoose.model('Workout', WorkoutSchema);
