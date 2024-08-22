//ADMIN

var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  password: String,
});
mongoose.model("User", UserSchema);

module.exports = mongoose.model("User");
