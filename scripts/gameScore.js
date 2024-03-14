/// PUNTUACION SCORE
const scoreBoard = document.getElementById("scoreBoard");
const ctx1 = scoreBoard.getContext("2d");

scoreBoard.width = 120;
scoreBoard.height = 728;
scoreBoard.style.paddingLeft = "40px";

function listEnemies() {
  // Establecer estilos CSS para el canvas contenedor

  for (i = 0; i < totalEnemies; i++) {
    // Calcular la posición de cada enemigo
    var x = (i % 2) * 40;
    var y = Math.floor(i / 2) * 40;

    // Dibujar el enemigo en la posición calculada
    ctx1.drawImage(sprites, 320, 192, 9, 8, x, y, 32, 32);
  }
}
