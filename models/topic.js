var mongoose = require("mongoose");

var TopicSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  description: String,
});
mongoose.model("Topic", TopicSchema);

module.exports = mongoose.model("Topic");
