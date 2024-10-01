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
      socket.emit("esperarVotacion", nombreJugador1);
      document.querySelector(".nombreJugador1").textContent = nombreJugador1;

      iniciarTemporizador(data.time);

      const cantidadImagenes = document.getElementById("cantidadImagenes");
      cantidadImagenes.textContent = `Límite de imágenes: ${data.cant_img}`;

      let contadorJugador1 = 0;
      const maxImagenes = data.cant_img;

      document.getElementById("btnJugador1").onclick = function () {
        if (contadorJugador1 < maxImagenes) {
          generarImagen("Jugador1");
          contadorJugador1++;
          if (contadorJugador1 == maxImagenes) {
            desactivarBoton("btnJugador1");
          }
        }
      };
    } else {
      console.error("Error al encontrar partida", response.statusText);
    }
  } catch (error) {
    console.error("Error al encontrar partida: ", error);
  }
}

function desactivarBoton(botonId) {
  const boton = document.getElementById(botonId);
  boton.disabled = true;
  boton.style.backgroundColor = "gray";
  boton.textContent = "Límite alcanzado";
  mostrarSelectorImagenes("Jugador1");
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

async function generarImagen(jugador) {
  const inputId = `input${jugador}`;
  const imagenesDiv = document.getElementById(`imagenes${jugador}`);
  const prompt = document.getElementById(inputId).value;

  if (!prompt) {
    alert("Por favor, ingresa un texto.");
    return;
  }

  socket.emit("jugadorEscribiendo", { roomId: partidaId, jugador, prompt });

  loader.style.display = "block";

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}`;

  try {
    const response = await fetch(url, { method: "GET" });

    if (response.ok) {
      const imageUrl = response.url;

      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      imgElement.alt = `Imagen generada para ${jugador}`;
      imgElement.className = "img-thumbnail m-2";
      imgElement.style.width = "100px";

      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = `seleccion${jugador}`;
      radioInput.value = imageUrl;

      imagenesDiv.appendChild(imgElement);
      imagenesDiv.appendChild(radioInput);

      socket.emit("imagenSeleccionada", {
        roomId: partidaId,
        jugador: "jugador1",
        imagen: imageUrl,
      });
    } else {
      alert(`Error al generar la imagen: ${response.statusText}`);
    }
  } catch (error) {
    alert("Ocurrió un error al conectar con la API.");
  } finally {
    loader.style.display = "none";
  }
}

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

function finalizarPartida() {
  const boton = document.getElementById(botonId);
  if (boton.disabled == false) {
    desactivarBoton("btnJugador1");
  }
}

function mostrarSelectorImagenes(jugador) {
  const botonSeleccionar = document.getElementById(`botonSeleccionar`);
  const seleccionButton = document.createElement("button");
  seleccionButton.textContent = `Seleccione una imagen`;
  seleccionButton.className = "btn btn-success seleccion";

  seleccionButton.onclick = function () {
    const seleccion = document.querySelector(
      `input[name="seleccion${jugador}"]:checked`
    );
    if (seleccion) {
      sessionStorage.setItem(`seleccion${jugador}`, seleccion.value);
      alert(`Imagen seleccionada`);

      if (sessionStorage.getItem("seleccionJugador1")) {
        imagenSeleccionada = seleccion.value;
        socket.emit("imagenFinal", {
          roomId: partidaId,
          jugador: "jugador1",
          imagen: imagenSeleccionada,
        });
      }
    } else {
      alert(`Por favor, selecciona una imagen para ${jugador}.`);
    }
  };

  botonSeleccionar.appendChild(seleccionButton);
}

socket.on("redireccionar", (url) => {
  window.location.href = url;
});
