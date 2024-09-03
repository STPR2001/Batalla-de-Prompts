const express = require("express");

const router = express.Router();
const topic_controller = require("../controllers/TopicController");

router.post("/create", topic_controller.topic_create);

module.exports = router;
