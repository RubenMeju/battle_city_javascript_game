const spritesMenu = new Image();
spritesMenu.src = "./sprites/initialDisplay.png";

const canvasMenu = document.querySelector("#canvasMenu");
const ctxMenu = canvasMenu.getContext("2d");

canvasMenu.width = 256 * 3;
canvasMenu.height = 222 * 3;

function drawMenu() {
  ctxMenu.drawImage(
    spritesMenu,
    0,
    0,
    256, // el tamaño del recorte
    222, // el tamaño del recorte
    0, // posición X del dibujo
    0, // posición X del dibujo
    canvasMenu.width, // ancho del dibujo
    canvasMenu.height // ancho del dibujo
  );
}

function drawSelectorMenu() {
  ctxMenu.drawImage(
    sprites,
    96,
    0,
    16, // el tamaño del recorte
    15, // el tamaño del recorte
    canvasMenu.width / 4, // posición X del dibujo
    canvasMenu.height / 1.8, // posición X del dibujo
    48, // ancho del dibujo
    48 // ancho del dibujo
  );
}

function menu() {
  drawMenu();
  drawSelectorMenu();
}

// Obtener elementos del DOM
const menuContainer = document.getElementById("contMenu");
const gameContainer = document.getElementById("game-container");
const playButton = document.getElementById("playButton");

// Función para iniciar el juego
function startGame() {
  // Ocultar el menú
  menuContainer.style.display = "none";
  // Mostrar el contenedor del juego principal
  gameContainer.style.display = "block";
  // Iniciar el juego (puedes llamar a la función de inicio de juego aquí si es necesario)
  playGame();
}
