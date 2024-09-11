var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var Topic = require("../models/topic");

exports.topic_create = async function (req, res, next) {
  try {
    let topic = new Topic({
      _id: new mongoose.Types.ObjectId(),
      description: req.body.description,
    });
    await topic.save();
    res.send("Tema creado ok");
  } catch (err) {
    return next(err);
  }
};

exports.topic_findById = async function (req, res) {
  try {
    const topic = await Topic.findById(req.params.id).exec();
    if (!topic) {
      return res.status(404).send("Topic no encontrado");
    }
    res.json(topic);
  } catch (err) {
    res.status(500).send(err.message);
  }
};