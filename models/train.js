// require mongoose
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// define log schema
var TrainSchema = new Schema({
  goal: String,
  description: String
});

// create and export Log model
var Train = mongoose.model('Train', TrainSchema);

module.exports = Train;