console.log("hola mundo");

const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor");
});

function unirseAlLobby() {
  const nombreJugador = document.getElementById("nombreJugador").value;
  if (nombreJugador) {
    socket.emit("unirseAlLobby", nombreJugador);
    document.getElementById("nombreJugador").value = "";
  }
}
