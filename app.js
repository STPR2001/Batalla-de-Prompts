var express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
var app = express();
var db = require("./config/db");
global.__root = __dirname + "/";
var server = require("http").createServer(app);
var io = require("socket.io")(server);

const user = require("./routes/user.route");
app.use("/api/auth", user);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/js", express.static(__dirname + "/views/home"));
app.use(express.static(path.join(__dirname, "/views")));

app.get("/", function (req, res, next) {
  res.sendFile(__dirname + "/views/home/page.html");
});

app.get("/api", function (req, res) {
  res.status(200).send("API works.");
});

const jugadores = [];

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  socket.on("unirseAlLobby", (nombreJugador) => {
    jugadores.push(nombreJugador);
    console.log(`Jugador ${nombreJugador} ha ingresado al lobby`);

    io.emit("actualizarListaJugadores", jugadores);
  });

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});

module.exports = app;
