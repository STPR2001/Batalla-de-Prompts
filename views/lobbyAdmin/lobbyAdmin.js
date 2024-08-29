console.log("hola mundo");

const socket = io();

socket.on("actualizarListaJugadores", (jugadores) => {
  const listaJugadores = document.getElementById("listaJugadores");
  listaJugadores.innerHTML = ""; // Limpiar la lista

  jugadores.forEach((jugador) => {
    const option = document.createElement("option");
    option.value = jugador;
    option.text = jugador;
    listaJugadores.appendChild(option);
  });
});
