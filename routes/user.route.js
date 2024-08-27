const express = require("express");

const router = express.Router();
const auth_controller = require("../auth/AuthController");
const verifyToken = require("../auth/VerifyToken");

router.post("/register", auth_controller.user_create);

router.post("/login", auth_controller.user_login);

router.post("/verify", verifyToken.verifyToken);

module.exports = router;
