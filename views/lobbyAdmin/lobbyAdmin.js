console.log("hola mundo");

const socket = io();

socket.on("actualizarListaJugadores1", (jugadores) => {
  const listaJugadores1 = document.getElementById("listaJugadores1");
  listaJugadores1.innerHTML = ""; // Limpiar la lista

  jugadores.forEach((jugador) => {
    const option = document.createElement("option");
    option.value = jugador;
    option.text = jugador;
    listaJugadores1.appendChild(option);
  });
});

socket.on("actualizarListaJugadores2", (jugadores) => {
  const listaJugadores = document.getElementById("listaJugadores2");
  listaJugadores2.innerHTML = ""; // Limpiar la lista

  jugadores.forEach((jugador) => {
    const option = document.createElement("option");
    option.value = jugador;
    option.text = jugador;
    listaJugadores2.appendChild(option);
  });
});

async function cargarTema(event) {
  event.preventDefault();

  const temaInput = document.getElementById("temaInput").value;

  if (!temaInput) {
    alert("Por favor, ingresa un tema.");
    return;
  }

  const data = {
    topic: temaInput,
  };

  try {
    const response = await fetch("http://localhost:3000/api/topic/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log("Tema cargado con éxito:", result);
      } else {
        const resultText = await response.text();
        console.log("Tema cargado con éxito:", resultText);
      }

      alert("Tema cargado con éxito.");
      document.getElementById("temaInput").value = "";
    } else {
      const errorMsg = await response.text();
      console.error("Error al cargar el tema:", errorMsg);
      alert(`Error al cargar el tema: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("Ocurrió un error al conectar con el servidor.");
  }
}

async function iniciarPartida(event) {
  event.preventDefault();

  const jugador1 = document.getElementById("listaJugadores1");
  const selectedPlayer1 = Array.from(jugador1.selectedOptions).map(
    (option) => option.value
  );
  const jugador2 = document.getElementById("listaJugadores2");
  const selectedPlayer2 = Array.from(jugador2.selectedOptions).map(
    (option) => option.value
  );

  const tiempoJuego = document.getElementById("tiempoJuego").value;
  const cantidadImagenes = document.getElementById("cantidadImagenes").value;

  const data = {
    player1: selectedPlayer1[0],
    player2: selectedPlayer2[0],
    time: tiempoJuego,
    cant_img: cantidadImagenes,
  };

  try {
    const response = await fetch("http://localhost:3000/api/game/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log("Partida creada con éxito:", result);

        const partidaId = result;

        socket.emit(
          "redirigirJugadores",
          selectedPlayer1[0],
          selectedPlayer2[0],
          `/partida1/partida1.html?id=${partidaId}`,
          `/partida2/partida2.html?id=${partidaId}`
        );

        window.location.href = `/partida/partida.html?id=${partidaId}`;
      }
    } else {
      const errorMsg = await response.text();
      console.error("Error al crear partida:", errorMsg);
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("Ocurrió un error al conectar con el servidor.");
  }
}
