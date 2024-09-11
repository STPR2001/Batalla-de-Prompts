const express = require("express");

const router = express.Router();
const game_controller = require("../controllers//GameController");

router.post("/create", game_controller.game_create);
router.get("/findById/:id", game_controller.game_findById);
router.post("/game/updateWinner/:id", game_controller.game_updateWinner);

module.exports = router;
