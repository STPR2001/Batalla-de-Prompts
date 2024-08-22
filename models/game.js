var mongoose = require("mongoose");

var GameSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  player1: String,
  player2: String,
  date: { type: Date, default: Date.now }, //ver si incluye hora
  winner: String,
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
  },
  status: Boolean, //true = activa
  //imagenes
});
mongoose.model("Game", GameSchema);

module.exports = mongoose.model("Game");
