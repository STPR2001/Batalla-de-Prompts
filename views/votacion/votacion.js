//SIN TERMINAR

window.onload = function () {
    const imagenJugador1 = sessionStorage.getItem("seleccionJugador1");
    const imagenJugador2 = sessionStorage.getItem("seleccionJugador2");
  
    document.getElementById("imagenJugador1").src = imagenJugador1;
    document.getElementById("imagenJugador2").src = imagenJugador2;
  
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
        window.location.href = "pantalla-final.html";
      } else {
        alert("Error al seleccionar ganador.");
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  }
  