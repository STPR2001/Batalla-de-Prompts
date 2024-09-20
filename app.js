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
app.use("/api/game", game);

app.get("/api", function (req, res) {
  res.status(200).send("API works.");
});

const jugadores = [];

// Configurar express-session
const sessionMiddleware = session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Asegúrate de configurar 'secure: true' si estás usando HTTPS
});

app.use(sessionMiddleware);

// Compartir la sesión de express con Socket.io
io.use(
  sharedSession(sessionMiddleware, {
    autoSave: true,
  })
);

io.on("connection", (socket) => {
  var llegoImg1;
  var llegoImg2;
  var imagen1;
  var imagen2;

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

  socket.on("imagenSeleccionada", (data) => {
    console.log(`Imagen seleccionada por ${data.jugador}: ${data.imagen}`);
    io.emit("actualizarImagen", data);
  });

  socket.on("imagenSeleccionadaJugador1", (data) => {
    llegoImg1 = true;
    if (llegoImg2 == true) {
      console.log("ENTRO APP IF1");
      socket.emit("SeSeleccionaron", {
        imagen1: data.imagen,
        imagen2: imagen2,
      });
    } else {
      imagen1 = data.imagen;
    }
  });

  socket.on("imagenSeleccionadaJugador2", (data) => {
    console.log("Entro 2");
    llegoImg2 = true;
    if (llegoImg1 == true) {
      console.log("ENTRO APP IF2");
      socket.emit("SeSeleccionaron", {
        imagen1: imagen1,
        imagen2: data.imagen,
      });
    } else {
      imagen2 = data.imagen;
    }
  });

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

module.exports = app;
