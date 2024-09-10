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
      temaAleatorio.innerHTML = data.topic; //muestra el id, hay que mostrar la descripcion

      iniciarTemporizador(data.time);
    } else {
      console.error("Error al encontrar partida", response.statusText);
    }
  } catch (error) {
    console.error("Error al encontrar partida: ", error);
  }
}

async function generarImagen(jugador) {
  const inputId = `input${jugador}`;
  const imagenesDiv = document.getElementById(`imagenes${jugador}`);
  const prompt = document.getElementById(inputId).value;

  console.log(prompt);

  if (!prompt) {
    alert("Por favor, ingresa un texto.");
    return;
  }

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}`;

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (response.ok) {
      const imageUrl = response.url;

      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      imgElement.alt = `Imagen generada para ${jugador}`;
      imgElement.className = "img-thumbnail m-2";
      imgElement.style.width = "100px";

      imagenesDiv.appendChild(imgElement);
    } else {
      console.error("Error en la API:", response.statusText);
      alert(`Error al generar la imagen: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error de conexión:", error);
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
    } else {
      tiempoRestante--;
    }
  }, 1000);
}
