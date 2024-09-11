const express = require("express");

const router = express.Router();
const topic_controller = require("../controllers/TopicController");

router.post("/create", topic_controller.topic_create);
router.get("/findById/:id", topic_controller.topic_findById);

module.exports = router;
