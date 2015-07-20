// require mongoose
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// define log schema
var GoalSchema = new Schema({
  goal: String,
  description: String
});

// create and export Log model
var Goal = mongoose.model('Goal', GoalSchema);

module.exports = Goal;