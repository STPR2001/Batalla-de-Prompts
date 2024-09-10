var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var Game = require("../models/game");
var Topic = require("../models/topic");

exports.game_create = async function (req, res, next) {
  try {
    const topics = await Topic.aggregate([{ $sample: { size: 1 } }]);
    if (topics.length === 0) {
      return res.status(404).send("No se encontraron temas disponibles.");
    }
    const randomTopic = topics[0]._id;

    let game = new Game({
      _id: new mongoose.Types.ObjectId(),
      player1: req.body.player1,
      player2: req.body.player2,
      time: req.body.time,
      cant_img: req.body.cant_img,
      topic: randomTopic,
      status: true,
    });

    const savedGame = await game.save();
    res.send(savedGame._id); //devuelvo el id como respuesta
  } catch (err) {
    return next(err);
  }
};

exports.game_findById = async function (req, res) {
  try {
    const game = await Game.findById(req.params.id).exec();
    if (!game) {
      return res.status(404).send("Juego no encontrado");
    }
    res.json(game);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
