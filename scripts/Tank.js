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

      const bullet = new Bullet(bulletX, bulletY, this.direction, "player");
      this.bullets.push(bullet);
      reproducirUnaVez(shootPlayer);
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
