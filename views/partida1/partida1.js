const socket = io();
const params = new URLSearchParams(window.location.search);
const partidaId = params.get("id");
console.log("ID de la partida:", partidaId);
traerDatosPartida(partidaId);

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
      document.querySelector(".nombreJugador1").textContent = nombreJugador1;

      iniciarTemporizador(data.time);

      //traerSesiones(nombreJugador1, nombreJugador2);

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
        jugador: "jugador1",
        imagen: imageUrl,
      });
    } else {
      alert(`Error al generar la imagen: ${response.statusText}`);
    }
  } catch (error) {
    alert("Ocurrió un error al conectar con la API.");
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
  desactivarBoton("btnJugador1");

  mostrarSelectorImagenes("Jugador1");
}

function mostrarSelectorImagenes(jugador) {
  const imagenesDiv = document.getElementById(`imagenes${jugador}`);
  const seleccionButton = document.createElement("button");
  seleccionButton.textContent = `Seleccionar imagen para ${jugador}`;
  seleccionButton.className = "btn btn-success";

  seleccionButton.onclick = function () {
    const seleccion = document.querySelector(
      `input[name="seleccion${jugador}"]:checked`
    );
    if (seleccion) {
      sessionStorage.setItem(`seleccion${jugador}`, seleccion.value);
      alert(`${jugador} ha seleccionado su imagen.`);

      if (sessionStorage.getItem("seleccionJugador1")) {
        console.log("ENTROOO");
        imagenSeleccionada = seleccion.value;
        socket.emit("imagenSeleccionadaJugador1", {
          imagen: imagenSeleccionada,
        });
      }
    } else {
      alert(`Por favor, selecciona una imagen para ${jugador}.`);
    }
  };

  imagenesDiv.appendChild(seleccionButton);
}

/*

function traerSesiones(nombreJugador1, nombreJugador2) {
  const sockets = io.sockets.sockets;

  for (let [id, socket] of sockets) {
    console.log("Verificando socket con ID:", id);

    if (socket.handshake.session.user) {
      console.log("Sesión encontrada:", socket.handshake.session.user);
      const userName = socket.handshake.session.user.name;

      if (userName == nombreJugador1) {
        //logica para esconder elementos
        console.log("ESCONDER 1");
        disableContainer("container1");
      } else if (userName == nombreJugador2) {
        //logica para esconder elementos
        console.log("ESCONDER 2");
      }
    } else {
      console.log("Sesión no definida para el socket con ID:", id);
    }
  }
}

function disableContainer(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.classList.add("disabled-container");
  }
}
  */
