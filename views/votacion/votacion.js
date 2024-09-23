const socket = io();
const params = new URLSearchParams(window.location.search);
const partidaId = params.get("id");
traerDatosPartida(partidaId);
let nombreJugador1, nombreJugador2;

async function traerDatosPartida(partidaId) {
  const url = `http://localhost:3000/api/game/findById/${encodeURIComponent(
    partidaId
  )}`;

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      nombreJugador1 = data.player1;
      nombreJugador2 = data.player2;
    } else {
      console.error("Error al encontrar partida", response.statusText);
    }
  } catch (error) {
    console.error("Error al encontrar partida: ", error);
  }
}

window.onload = function () {

    document.getElementById("btnGanadorJugador1").onclick = function () {
      actualizarGanador("Jugador 1");
    };
  
    document.getElementById("btnGanadorJugador2").onclick = function () {
      actualizarGanador("Jugador 2");
    };
  };
  
  async function actualizarGanador(ganador) {
    const params = new URLSearchParams(window.location.search);
    const partidaId = params.get("id");
  
    const url = `http://localhost:3000/api/game/updateWinner/${encodeURIComponent(partidaId)}`;
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ winner: ganador }),
      });
  
      if (response.ok) {
        alert(`${ganador} ha sido seleccionado como el ganador.`);
        socket.emit(
          "redirigirJugadoresAGanador",
          nombreJugador1,
          nombreJugador2,
          `/ganador/ganador.html?id=${partidaId}`,
          document.getElementById("imagenJugador1").src
        );
        if(`${ganador}`==="Jugador 1"){
          localStorage.setItem("ganador", document.getElementById("imagenJugador1").src);
        }else{
          localStorage.setItem("ganador", document.getElementById("imagenJugador2").src);
        }
        window.location.href = `/ganador/ganador.html?id=${partidaId}`;
      } else {
        alert("Error al seleccionar ganador.");
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  }
  
  socket.on("votacion", (data) => {
    if (data.jugador === "jugador1") {
      document.getElementById("imagenJugador1").src = data.imagen;
    } else if (data.jugador === "jugador2"){
      document.getElementById("imagenJugador2").src = data.imagen;
    }
  });