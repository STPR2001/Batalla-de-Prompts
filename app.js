var express = require("express");
const bodyParser = require("body-parser");
var app = express();
var db = require("./config/db");
global.__root = __dirname + "/";
var server = require("http").createServer(app);
var io = require("socket.io")(server);

const user = require("./routes/user.route");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res, next) {
  res.sendFile(__dirname + "/views/home/page.html");
});

app.use("/api/auth", user);

app.get("/api", function (req, res) {
  res.status(200).send("API works.");
});

module.exports = app;
