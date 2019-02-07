const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  role: {
    type: String,
    enum: ['BOSS', 'DEVELOPER', 'TA', 'STUDENT'],
    default: 'BOSS'
  },
  password: String,
  facebookID: String,
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;