const express = require("express");

const router = express.Router();
const auth_controller = require("../auth/AuthController");

router.post("/register", auth_controller.user_create);

router.post("/login", auth_controller.user_login);

module.exports = router;
