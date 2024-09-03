var express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
var app = express();
var db = require("./config/db");
global.__root = __dirname + "/";
var server = require("http").createServer(app);
var io = require("socket.io")(server);

const user = require("./routes/user.route");
const topic = require("./routes/topic.route");

// Define the CORS options
const corsOptions = {
  credentials: true,
  origin: ["https://api.cloudflare.com"], // Whitelist the domains you want to allow
};

app.use(cors(corsOptions)); // Use the cors middleware with your options

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/js", express.static(__dirname + "/views/home"));
app.use(express.static(path.join(__dirname, "/views")));

app.get("/", function (req, res, next) {
  res.sendFile(__dirname + "/views/home/page.html");
});

app.use("/api/auth", user);
app.use("/api/topic", topic);

app.get("/api", function (req, res) {
  res.status(200).send("API works.");
});

const jugadores = [];

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  socket.on("unirseAlLobby", (nombreJugador) => {
    jugadores.push(nombreJugador);
    console.log(`Jugador ${nombreJugador} ha ingresado al lobby`);

    io.emit("actualizarListaJugadores1", jugadores);
    io.emit("actualizarListaJugadores2", jugadores);
  });

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

module.exports = app;
