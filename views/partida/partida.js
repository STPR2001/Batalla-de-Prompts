const socket = io();
const params = new URLSearchParams(window.location.search);
const partidaId = params.get("id");
console.log("ID de la partida:", partidaId);
traerDatosPartida(partidaId);
socket.emit('joinRoom', partidaId);

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

      const temaAleatorio = document.getElementById("temaAleatorio");
      temaAleatorio.innerHTML = await traerTopic(data.topic);

      const nombreJugador1 = data.player1;
      const nombreJugador2 = data.player2;
      document.querySelector(".nombreJugador1").textContent = nombreJugador1;
      document.querySelector(".nombreJugador2").textContent = nombreJugador2;

      iniciarTemporizador(data.time);
    } else {
      console.error("Error al encontrar partida", response.statusText);
    }
  } catch (error) {
    console.error("Error al encontrar partida: ", error);
  }
}

async function traerTopic(topicId) {
  console.log(topicId);
  const url = `http://localhost:3000/api/topic/findById/${encodeURIComponent(
    topicId
  )}`;

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.description);
      return data.description;
    } else {
      console.error("Error al encontrar topic", response.statusText);
    }
  } catch (error) {
    console.error("Error al encontrar topic: ", error);
  }
}

socket.on("actualizacionAdmin", (data) => {
  const { jugador, prompt } = data;

  if (jugador === "Jugador1") {
    const contenedor = document.getElementById("escribiendoJugador1");
    const texto = document.getElementById("textoJugador1");
    texto.textContent = prompt;
    contenedor.style.display = "block";

    setTimeout(() => {
      contenedor.style.display = "none";
    }, 3000);
  } else if (jugador === "Jugador2") {
    const contenedor = document.getElementById("escribiendoJugador2");
    const texto = document.getElementById("textoJugador2");
    texto.textContent = prompt;
    contenedor.style.display = "block";

    setTimeout(() => {
      contenedor.style.display = "none";
    }, 3000);
  }
});

socket.on("actualizarImagen", (data) => {
  if (data.jugador === "jugador1") {
    const imagenesDiv = document.getElementById(`imagenesJugador1`);
    const imageUrl = data.imagen;

    const imgElement = document.createElement("img");
    imgElement.src = imageUrl;
    imgElement.alt = `Imagen generada para Jugador 1`;
    imgElement.className = "img-thumbnail m-2";
    imgElement.style.width = "100px";

    imagenesDiv.appendChild(imgElement);
    imagenesDiv.appendChild(radioInput);
  } else if (data.jugador === "jugador2") {
    const imagenesDiv = document.getElementById(`imagenesJugador2`);
    const imageUrl = data.imagen;

    const imgElement = document.createElement("img");
    imgElement.src = imageUrl;
    imgElement.alt = `Imagen generada para Jugador 2`;
    imgElement.className = "img-thumbnail m-2";
    imgElement.style.width = "100px";

    imagenesDiv.appendChild(imgElement);
    imagenesDiv.appendChild(radioInput);
  }
});

function iniciarTemporizador(minutos) {
  const timerDisplay = document.getElementById("timerDisplay");
  let tiempoRestante = minutos * 60;

  const intervalo = setInterval(() => {
    const minutosRestantes = Math.floor(tiempoRestante / 60);
    const segundosRestantes = tiempoRestante % 60;

    timerDisplay.textContent = `${minutosRestantes
      .toString()
      .padStart(2, "0")}:${segundosRestantes.toString().padStart(2, "0")}`;

    if (tiempoRestante <= 0) {
      clearInterval(intervalo);
      alert("¡El tiempo ha terminado!");
      finalizarPartida();
    } else {
      tiempoRestante--;
    }
  }, 1000);
}

function irAVotacion() {
  window.location.href = `/votacion/votacion.html?id=${partidaId}`;
}

socket.on("SeSeleccionaron", (data) => {
  console.log("IMAGENES");
  console.log(data.imagen1);
  console.log(data.imagen2);
});
