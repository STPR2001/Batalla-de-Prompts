var express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
var app = express();
var db = require("./config/db");
global.__root = __dirname + "/";
var server = require("http").createServer(app);
var io = require("socket.io")(server);
const session = require("express-session");
const sharedSession = require("express-socket.io-session");

const user = require("./routes/user.route");
const topic = require("./routes/topic.route");
const game = require("./routes/game.route");

const corsOptions = {
  credentials: true,
  origin: ["https://api.cloudflare.com"],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/js", express.static(__dirname + "/views/home"));
app.use(express.static(path.join(__dirname, "/views")));

app.get("/", function (req, res, next) {
  res.sendFile(__dirname + "/views/home/page.html");
});

app.use("/api/auth", user);
app.use("/api/topic", topic);
app.use("/api/game", game);

app.get("/api", function (req, res) {
  res.status(200).send("API works.");
});

const jugadores = [];
const jugadoresEsperandoVotacion = [];

const sessionMiddleware = session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});

app.use(sessionMiddleware);

io.use(
  sharedSession(sessionMiddleware, {
    autoSave: true,
  })
);

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  socket.on("unirseAlLobby", (nombreJugador) => {
    jugadores.push(nombreJugador);
    console.log(`Jugador ${nombreJugador} ha ingresado al lobby`);

    io.emit("actualizarListaJugadores1", jugadores);
    io.emit("actualizarListaJugadores2", jugadores);

    socket.handshake.session.user = { name: nombreJugador };
    socket.handshake.session.save((err) => {
      if (err) {
        console.error("Error al guardar la sesión:", err);
      } else {
        console.log("Sesión guardada para el jugador:", nombreJugador);
      }
    });
  });

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
});

  socket.on("jugadorEscribiendo", (data) => {
    io.to(data.roomId).emit("actualizacionAdmin", data);
  });

  socket.on(
    "redirigirJugadores",
    (nombreJugador1, nombreJugador2, url1, url2) => {
      const sockets = io.sockets.sockets;

      for (let [id, socket] of sockets) {
        console.log("Verificando socket con ID:", id);

        if (socket.handshake.session.user) {
          console.log("Sesión encontrada:", socket.handshake.session.user);
          const userName = socket.handshake.session.user.name;

          if (userName == nombreJugador1) {
            socket.emit("redireccionar", url1);
          } else if (userName == nombreJugador2) {
            socket.emit("redireccionar", url2);
          }
        } else {
          console.log("Sesión no definida para el socket con ID:", id);
        }
      }
    }
  );

  socket.on("esperarVotacion", (nombreJugador) => {
    jugadoresEsperandoVotacion.push(nombreJugador);
    console.log(`Jugador ${nombreJugador} esta esperando la votación`);

    io.emit("actualizarListaJugadores1", jugadoresEsperandoVotacion);
    io.emit("actualizarListaJugadores2", jugadoresEsperandoVotacion);

    socket.handshake.session.user = { name: nombreJugador };
    socket.handshake.session.save((err) => {
      if (err) {
        console.error("Error al guardar la sesión:", err);
      } else {
        console.log("Sesión guardada para el jugador:", nombreJugador);
      }
    });
  });

  socket.on(
    "redirigirJugadoresAGanador",
    (nombreJugador1, nombreJugador2, url, roomId, imagen) => {
      const sockets2 = io.sockets.sockets;
      for (let [id, socket] of sockets2) {
        console.log("Verificando socket con ID:", id);

        if (socket.handshake.session.user) {
          console.log("Sesión encontrada:", socket.handshake.session.user);
          const userName = socket.handshake.session.user.name;
          io.to(roomId).emit("redireccionar", url);
        } else {
          console.log("Sesión no definida para el socket con ID:", id);
        }
      }
    }
  );

  socket.on("imagenSeleccionada", (data) => {
    console.log(`Imagen seleccionada por ${data.jugador}: ${data.imagen} en la sala ${data.roomId}`);
    io.to(data.roomId).emit("actualizarImagen", data);
  });

  socket.on("imagenFinal", (data) => {
    io.to(data.roomId).emit("votacion", data);
  });

  socket.on("elegirGanador", (data) => {
    io.to(data.roomId).emit("ganador", data);
  });

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

module.exports = app;
