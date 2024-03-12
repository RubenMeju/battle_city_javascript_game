class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 15;
    this.size = 48;
    this.speed = 3;
    this.clipX = 128;
    this.clipY = 0;

    this.direction = "right";
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
    if (this.direction === "right" && this.x < canvas.width - this.size) {
      this.x += this.speed;
    } else if (this.direction === "left" && this.x > 2) {
      this.x -= this.speed;
    } else if (this.direction === "up" && this.y > 0) {
      this.y -= this.speed;
    } else if (
      this.direction === "down" &&
      this.y < canvas.height - this.size
    ) {
      this.y += this.speed;
    } else {
      this.changeDirection();
    }
    console.log(this.direction);
  }
  getRandomDirection() {
    const randomNum = Math.random();
    if (randomNum < 0.25) {
      return "up";
    } else if (randomNum < 0.5) {
      return "down";
    } else if (randomNum < 0.75) {
      return "right";
    } else {
      return "left";
    }
  }
  changeDirection() {
    this.direction = this.getRandomDirection();
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
}
