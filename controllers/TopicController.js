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
