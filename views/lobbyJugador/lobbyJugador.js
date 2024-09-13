console.log("hola mundo");

const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor");
});

socket.on("redireccionar", (url) => {
  window.location.href = url;
});

function unirseAlLobby() {
  const nombreJugador = document.getElementById("nombreJugador").value;
  if (nombreJugador) {
    socket.emit("unirseAlLobby", nombreJugador);
    document.getElementById("nombreJugador").value = "";
  }
  desactivarBoton();
}

function desactivarBoton() {
  const boton = document.getElementById("botonListo");
  boton.disabled = true;
  boton.style.backgroundColor = "gray";
  boton.textContent = "Esperando por el admin";
}
