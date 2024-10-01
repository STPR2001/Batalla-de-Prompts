document.getElementById("imagenGanador").src = localStorage.getItem("ganador");

function inicio(){
    window.location.href = `/`;
}

document.getElementById("ganador").innerText = "El ganador es "+localStorage.getItem("ganadorJugador");