const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  lastName2: String,
  phone: String,
  username: String,
  password: String,
});

module.exports = mongoose.model("User", UserSchema);
