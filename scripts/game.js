const sprites = new Image();
sprites.src = "./sprites/sprites.png";

const shootCanvasFX = new Audio();
shootCanvasFX.src = "../sounds/SFX15.mp3";

const gameOverFX = new Audio();
gameOverFX.src = "../sounds/gameoverFX.mp3";

const destroyFX = new Audio();
destroyFX.src = "../sounds/destroyFX.mp3";

// SONIDOS DEL TANQUE DEL JUGADOR

// movimiento del tanque
const moveFX = new Audio();
moveFX.src = "../sounds/move.mp3";

// tanque parado
const stopFX = new Audio();
stopFX.src = "../sounds/stop.mp3";

const shootPlayer = new Audio();
shootPlayer.src = "../sounds/shootPlayerFX.mp3";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

canvas.width = 728;
canvas.height = 728;
//canvas del marcador

const cellSize = 28;

let totalEnemies = 15;
let enemies = [];

//variable para comenzar el juego
let isPlaying = false;

//DIBUJAR EL MAPA
function drawMap() {
  // Iterar sobre cada celda del mapa
  for (let i = 0; i < level.length; i++) {
    for (let j = 0; j < level[i].length; j++) {
      // Si el valor de la celda es 1 (pared), dibujar el sprite de la pared
      if (level[i][j] === 1) {
        // Calcular las coordenadas de dibujo en el canvas
        let x = j * cellSize;
        let y = i * cellSize;
        ctx.drawImage(
          sprites,
          257,
          0,
          8, // el tamaño del recorte
          8, // el tamaño del recorte
          x, // posición X del dibujo
          y, // posición Y del dibujo
          cellSize, // ancho del dibujo
          cellSize // ancho del dibujo
        );
      } else if (level[i][j] === 2) {
        // Calcular las coordenadas de dibujo en el canvas
        let x = j * cellSize;
        let y = i * cellSize;

        // Dibujar el otro sprite en el canvas (cuando el valor de la celda es 2)
        ctx.drawImage(
          sprites,
          256,
          16,
          8, // el tamaño del recorte
          8, // el tamaño del recorte
          x, // posición X del dibujo
          y, // posición X del dibujo
          cellSize, // ancho del dibujo
          cellSize // ancho del dibujo
        );
      } else if (
        level[i][j] === 4 &&
        j < level[i].length - 1 && // Asegurarse de que estamos dentro de los límites de la matriz
        level[i][j + 1] === 4 &&
        i < level.length - 1 &&
        level[i + 1][j] === 4 &&
        level[i + 1][j + 1] === 4
      ) {
        eagle.draw(j * cellSize, i * cellSize); // Dibujar sprite en la esquina superior izquierda del cuadrado
      }
    }
  }
}

const eagle = new Eagle();

const tank = new Tank((canvas.width - 16) / 3, canvas.height - 50);
// Función para crear un nuevo enemigo y agregarlo a la lista de enemigos
function createEnemy(x, y) {
  const newEnemy = new Enemy(x, y);
  enemies.push(newEnemy);
}

// Función para crear varios enemigos al comienzo
function createInitialEnemies() {
  // Aparecen 3 enemigos al comienzo
  createEnemy(0, 0); // Primer enemigo en la posición (0, 0)

  // Segundo enemigo en la posición central del canvas
  createEnemy(canvas.width / 2 - cellSize, 0);

  // Tercer enemigo en la posición canvasWidth - 100
  createEnemy(canvas.width - 48, 0);
}

//Funcion para añadir mas enemigos
function moreEnemies() {
  createInitialEnemies();
}
// Llamar a esta función para crear los enemigos inicialmente
createInitialEnemies();

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx1.clearRect(0, 0, scoreBoard.width, scoreBoard.height);
}

function init() {
  document.addEventListener("keydown", (event) => tank.keyDownHandler(event));
  document.addEventListener("keyup", (event) => tank.keyUpHandler(event));
}

// GAME OVER
function gameOver() {
  ctx.drawImage(
    sprites, // Imagen de la que se extrae la porción a dibujar
    288, // Coordenada X de inicio de la porción en la imagen
    183, // Coordenada Y de inicio de la porción en la imagen
    32, // Ancho de la porción a extraer de la imagen
    17, // Altura de la porción a extraer de la imagen
    canvas.width / 2 - 35 * 2, // Coordenada X en el lienzo donde se dibujará la porción (centro)
    canvas.height / 2 - 17 * 2, // Coordenada Y en el lienzo donde se dibujará la porción (centro)
    35 * 4, // Ancho de la porción al dibujarla en el lienzo
    17 * 4 // Altura de la porción al dibujarla en el lienzo
  );
}

function update() {
  clearCanvas();
  menu();
  if (isPlaying) {
    drawMap();

    //marcador
    listEnemies();

    if (eagle.isDestroyed) {
      gameOver();
    }

    //Jugador
    tank.draw();
    tank.move();

    tank.bullets.forEach((bullet) => {
      bullet.draw();
      bullet.move();
    });
    // Enemigos
    enemies.forEach((enemy) => {
      enemy.draw();
      enemy.move();

      // Balas del enemigo
      enemy.bullets.forEach((bullet) => {
        bullet.draw();
        bullet.move();
      });
    });

    if (enemies.length === 0 && totalEnemies !== 0) {
      moreEnemies();
    }
  }
  requestAnimationFrame(update);
}

init();
update();

// funcion para los efectos de sonido
function reproducirUnaVez(audio) {
  let isPlaying = false; // Bandera para controlar si el audio está reproduciéndose

  function reproducirAudio() {
    if (!isPlaying) {
      // Si el audio no se está reproduciendo actualmente
      isPlaying = true; // Establecer la bandera a verdadero
      audio.play(); // Reproducir el audio
    }
  }

  audio.addEventListener("ended", function () {
    isPlaying = false; // Establecer la bandera a falso cuando el audio termine
    audio.currentTime = 0; // Reiniciar el audio al principio
  });

  // Llama a esta función para reproducir el audio cuando lo necesites
  reproducirAudio();
}
