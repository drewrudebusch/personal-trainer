var mongoose = require('mongoose');

var WorkoutSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  warmups: [],
  workouts: [],
  cooldowns: [],
  userId: String
});

module.exports = mongoose.model('Workout', WorkoutSchema);
