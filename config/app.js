var express = require("express");
var app = express();
var db = require("./db");
global.__root = __dirname + "/";
var server = require("http").createServer(app);
var io = require("socket.io")(server);

var UserController = require("../controllers/UserController");
app.use("/api/users", UserController);

app.get("/api", function (req, res) {
  res.status(200).send("API works.");
});

//var AuthController = require("./auth/AuthController");
//app.use("/api/auth", AuthController);

module.exports = app;
