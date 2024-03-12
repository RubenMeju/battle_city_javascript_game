class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 15;
    this.size = 48;
    this.speed = 3;
    this.clipX = 225;
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
    let newX = this.x;
    let newY = this.y;

    if (this.direction === "right") {
      this.clipX = 225;
      newX += this.speed;
    } else if (this.direction === "left") {
      this.clipX = 160;
      newX -= this.speed;
    } else if (this.direction === "up") {
      this.clipX = 128;

      newY -= this.speed;
    } else if (this.direction === "down") {
      this.clipX = 192;

      newY += this.speed;
    }

    // Verificar si el nuevo movimiento está dentro de los límites del canvas y no hay colisión
    if (
      newX >= 0 &&
      newX + this.size <= canvas.width &&
      newY >= 0 &&
      newY + this.size <= canvas.height &&
      !this.isCollision(newX, newY)
    ) {
      this.x = newX;
      this.y = newY;
    } else {
      this.changeDirection();
    }
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
