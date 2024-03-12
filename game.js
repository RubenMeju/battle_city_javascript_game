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

class Tank {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 15;
    this.size = 48;
    this.sensitivity = 2;
    this.clipX = 0;
    this.clipY = 0;
    this.upPress = false;
    this.downPress = false;
    this.rightPress = false;
    this.leftPress = false;
    this.direction = "up";
    this.bullets = [];
  }

  draw() {
    ctx.drawImage(
      sprites,
      this.clipX,
      this.clipY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.size,
      this.size
    );
  }

  move() {
    let newX = this.x;
    let newY = this.y;

    if (this.rightPress && this.x < canvas.width - this.size) {
      newX = this.x + this.sensitivity;
      this.clipX = 96;
    } else if (this.leftPress && this.x > 2) {
      newX = this.x - this.sensitivity;
      this.clipX = 48;
    } else if (this.upPress && this.y > 0) {
      newY = this.y - this.sensitivity;
      this.clipX = 0;
    } else if (this.downPress && this.y < canvas.height - this.size) {
      newY = this.y + this.sensitivity;
      this.clipX = 80;
    }

    // Verificar colisiones con los muros
    if (!this.isCollision(newX, newY)) {
      this.x = newX;
      this.y = newY;
    } else {
      // Intentar moverse en la dirección perpendicular si hay una colisión
      if (this.rightPress && this.x < canvas.width - this.size) {
        newY = this.y - this.sensitivity;
      } else if (this.leftPress && this.x > 2) {
        newY = this.y + this.sensitivity;
      } else if (this.upPress && this.y > 0) {
        newX = this.x + this.sensitivity;
      } else if (this.downPress && this.y < canvas.height - this.size) {
        newX = this.x - this.sensitivity;
      }

      // Verificar colisiones con los muros nuevamente
      if (!this.isCollision(newX, newY)) {
        this.x = newX;
        this.y = newY;
      }
    }
  }

  isCollision(newX, newY) {
    // Calcular las coordenadas de los bordes del tanque
    const tankLeft = newX;
    const tankRight = newX + this.size;
    const tankTop = newY;
    const tankBottom = newY + this.size;

    // Calcular las celdas que están directamente adyacentes al tanque
    const cellLeft = Math.floor(tankLeft / cellSize);
    const cellRight = Math.floor(tankRight / cellSize);
    const cellTop = Math.floor(tankTop / cellSize);
    const cellBottom = Math.floor(tankBottom / cellSize);

    // Verificar si alguna de las celdas adyacentes contiene una pared (valor igual a 1 en la matriz level)
    for (let i = cellTop; i <= cellBottom; i++) {
      for (let j = cellLeft; j <= cellRight; j++) {
        if (
          (level[i] && level[i][j] === 1) ||
          (level[i] && level[i][j] === 2)
        ) {
          return true; // Hay colisión
        }
      }
    }

    return false; // No hay colisión
  }

  shoot() {
    if (this.bullets.length < 2) {
      // Limitar a dos balas
      let bulletX = this.x + this.size / 2;
      let bulletY = this.y + this.size / 2;

      switch (this.direction) {
        case "up":
          bulletY -= this.size / 2;
          break;
        case "down":
          bulletY += this.size / 2;
          break;
        case "left":
          bulletX -= this.size / 2;
          break;
        case "right":
          bulletX += this.size / 2;
          break;
      }

      const bullet = new Bullet(bulletX, bulletY, this.direction);
      this.bullets.push(bullet);
    }
  }

  keyDownHandler(event) {
    const { key } = event;
    if (key === "right" || key === "ArrowRight") {
      this.rightPress = true;
      this.direction = "right";
    } else if (key === "left" || key === "ArrowLeft") {
      this.leftPress = true;
      this.direction = "left";
    } else if (key === "up" || key === "ArrowUp") {
      this.upPress = true;
      this.direction = "up";
    } else if (key === "down" || key === "ArrowDown") {
      this.downPress = true;
      this.direction = "down";
    } else if (key === " ") {
      this.shoot();
    }
  }

  keyUpHandler(event) {
    const { key } = event;
    if (key === "right" || key === "ArrowRight") {
      this.rightPress = false;
    } else if (key === "left" || key === "ArrowLeft") {
      this.leftPress = false;
    } else if (key === "up" || key === "ArrowUp") {
      this.upPress = false;
    } else if (key === "down" || key === "ArrowDown") {
      this.downPress = false;
    }
  }
}

class Bullet {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 4;
    this.speed = 5;
    this.direction = direction;

    // ANIMACIONES DE LA BALA
    this.animationFrame = 0;
    this.animationCounter = 0;

    // explosiones
    this.isExplosion = false;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  drawExplosion() {
    const animationCoordinates = [
      [257, 130], // Frame 1
      [297, 140], // Frame 2
      [337, 130], // Frame 3
    ];

    ctx.drawImage(
      sprites,
      animationCoordinates[this.animationFrame][0], // sx
      animationCoordinates[this.animationFrame][1], // sy
      16,
      16,
      this.x,
      this.y,
      48,
      48
    );

    this.animationCounter++;
    //console.log(this.animationCounter);
    if (this.animationCounter >= 10) {
      this.animationCounter = 0;
      this.animationFrame = (this.animationFrame + 1) % 3;
    }
  }

  move() {
    switch (this.direction) {
      case "up":
        this.y -= this.speed;
        break;
      case "down":
        this.y += this.speed;
        break;
      case "left":
        this.x -= this.speed;
        break;
      case "right":
        this.x += this.speed;
        break;
    }

    this.isCollisionWithBorder();
    // Verificar colisiones con los muros
    if (this.isCollision()) {
      // Realizar acciones cuando haya colisión, como eliminar la bala y destruir parte del muro
      this.destroy();
      this.destroyWall();
    }
  }

  // Si la bala sale del canvas la destruimos
  isCollisionWithBorder() {
    if (
      this.y < 0 ||
      this.y > canvas.height ||
      this.x < 0 ||
      this.x > canvas.width
    ) {
      // activamos la animacion de la bala
      this.isExplosion = true;

      //desactivamos la animacion de la bala
      setInterval(() => {
        this.isExplosion = false;
      }, 5500);
      this.destroy();
    }
  }

  isCollision() {
    // Calcular el índice de la celda en la que se encuentra la bala
    const cellX = Math.floor(this.x / cellSize);
    const cellY = Math.floor(this.y / cellSize);

    // Destruir la bala si el muro es indestructible
    if (level[cellY] && level[cellY][cellX] === 2) {
      this.destroy();
      this.drawExplosion();
      //  return false;
    }

    // Verificar si la celda contiene un muro (valor igual a 1 en la matriz level)
    return level[cellY] && level[cellY][cellX] === 1;
  }

  // Destruir el muro donde golpeo la bala
  destroyWall() {
    // Calcular el índice de la celda en la que golpea la bala
    const cellX = Math.floor(this.x / cellSize);
    const cellY = Math.floor(this.y / cellSize);

    // Establecer el valor de la celda en 0 para eliminar el muro
    level[cellY][cellX] = 0;
  }

  // Destruir la bala despues de impactar
  destroy() {
    // Eliminar la bala
    const bulletIndex = tank.bullets.indexOf(this);
    if (bulletIndex !== -1) {
      tank.bullets.splice(bulletIndex, 1);
      this.drawExplosion();
    }
  }
}

const tank = new Tank((canvas.width - 16) / 3, canvas.height - 50);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function init() {
  document.addEventListener("keydown", (event) => tank.keyDownHandler(event));
  document.addEventListener("keyup", (event) => tank.keyUpHandler(event));
}

function game() {
  clearCanvas();
  drawMap();

  tank.draw();
  tank.move();

  tank.bullets.forEach((bullet) => {
    bullet.draw();
    bullet.move();
  });

  requestAnimationFrame(game);
}

game();
init();
