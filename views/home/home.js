console.log("hola mundo");

document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita el envío del formulario

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    try {
      // Realiza la solicitud POST a la API
      console.log(email);
      let response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      let data = await response.json();

      // Suponiendo que la API devuelve un token en 'data.token'
      let token = data.token;
      console.log(token);

      // Guarda el token en localStorage o sessionStorage
      localStorage.setItem("authToken", token);

      alert("¡Bienvenido " + email + "!");

      // Redirige al usuario a otra página, por ejemplo:
    } catch (error) {
      document.getElementById("error-message").style.display = "block";
      document.getElementById("error-message").textContent = error.message;
    }
  });
