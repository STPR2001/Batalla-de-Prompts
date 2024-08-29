document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita el envío del formulario de manera tradicional

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    try {
      // Realiza la solicitud POST a la API
      let response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (!response.ok) {
        let errorMsg = await response.text();
        console.log(errorMsg); // Captura el mensaje de error si es posible
        throw new Error("Credenciales incorrectas");
      }

      let data = await response.json();

      // Suponiendo que la API devuelve un token en 'data.token'
      let token = data.token;
      console.log("Token:", token);

      // Guarda el token en localStorage o sessionStorage
      //localStorage.setItem("authToken", token);

      window.location.href = "./lobbyAdmin/lobbyAdmin.html";
      // Aquí puedes manejar lo que sucede después del login, sin redirección automática
    } catch (error) {
      // Muestra el error en la página
      document.getElementById("error-message").style.display = "block";
      document.getElementById("error-message").textContent = error.message;
    }
  });

function redirigirLobby() {
  window.location.href = "./lobbyJugador/lobbyJugador.html";
}
