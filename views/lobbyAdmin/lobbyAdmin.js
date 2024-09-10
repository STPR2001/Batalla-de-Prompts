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
      document.getElementById("temaInput").value = ""; // Limpiar el campo de entrada
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

  const jugador1 = null; // ver aca
  const jugador2 = null; // ver aca
  const tiempoJuego = document.getElementById("tiempoJuego").value;
  const cantidadImagenes = document.getElementById("cantidadImagenes").value;

  const data = {
    player1: jugador1,
    player2: jugador2,
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
        window.location.href = `/partida/partida.html?id=${partidaId}`; //redirige con el id de partida como paramaetro
      }

      //redirigir?
    } else {
      const errorMsg = await response.text();
      console.error("Error al crear partida:", errorMsg);
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("Ocurrió un error al conectar con el servidor.");
  }
}
