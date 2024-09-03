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
