const sprites = new Image();
sprites.src = "./sprites.png";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

canvas.width = 728;
canvas.height = 728;

const cellSize = 28;

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
      }
    }
  }
}

const tank = new Tank((canvas.width - 16) / 3, canvas.height - 50);
const enemy1 = new Enemy(0, 0);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function init() {
  document.addEventListener("keydown", (event) => tank.keyDownHandler(event));
  document.addEventListener("keyup", (event) => tank.keyUpHandler(event));
}

function update() {
  clearCanvas();
  drawMap();

  //Jugador
  tank.draw();
  tank.move();

  tank.bullets.forEach((bullet) => {
    bullet.draw();
    bullet.move();
  });

  //Enemigos
  enemy1.draw();
  enemy1.move();
  requestAnimationFrame(update);
}

update();
init();
