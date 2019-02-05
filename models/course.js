const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const courseSchema = new Schema({
  name: String,
  description: String,
  participants: {type: Schema.Types.ObjectId, ref: 'User'}
  }, {
  timestamps: true
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;