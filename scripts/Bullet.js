class Bullet {
  constructor(x, y, direction, owner) {
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 4;
    this.speed = 5;
    this.direction = direction;
    this.owner = owner;
    // ANIMACIONES DE LA BALA
    this.animationFrame = 0;
    this.animationCounter = 0;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  drawExplosion() {
    const animationCoordinates = [
      [258, 130], // Frame 1
      [295, 130], // Frame 2
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

    //this.animationCounter++;
    //console.log(this.animationCounter);
    if (this.animationCounter >= 10) {
      this.animationCounter = 0;
      this.animationFrame = (this.animationFrame + 1) % 2;
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

    // Verificar colisiones
    this.isCollision();
  }

  isCollision() {
    // Calcular el índice de la celda en la que se encuentra la bala
    const cellX = Math.floor(this.x / cellSize);
    const cellY = Math.floor(this.y / cellSize);

    //Una bala alcanza el aguila
    if (level[cellY] && level[cellY][cellX] === 4) {
      console.log("Contacto aguila");
      eagle.isDestroyed = true;
      this.destroy();
    }

    // Si la bala sale del canvas la destruimos
    if (
      this.y < 0 ||
      this.y > canvas.height ||
      this.x < 0 ||
      this.x > canvas.width
    ) {
      // activamos la animacion de la bala

      this.destroy();
    }

    // Destruir la bala si el muro es indestructible
    if (level[cellY] && level[cellY][cellX] === 1) {
      this.destroy();
      this.destroyWall();
      this.drawExplosion();
    }

    // Destruir la bala si el muro es indestructible
    if (level[cellY] && level[cellY][cellX] === 2) {
      this.destroy();
      this.drawExplosion();
    }

    //Destruir al enemigo si la bala colisiona con el.
    for (let i = 0; enemies.length > i; i++) {
      if (
        this.x < enemies[i].x + enemies[i].size &&
        this.x + this.width > enemies[i].x &&
        this.y < enemies[i].y + enemies[i].size &&
        this.y + this.height > enemies[i].y
      ) {
        //destruir la bala
        this.destroy();
        //mostrar animacion
        this.drawExplosion();
        // eliminar el enemigo del array enemies
        enemies[i].destroy();
      }
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
    if (this.owner === "player") {
      const bulletIndex = tank.bullets.indexOf(this);
      if (bulletIndex !== -1) {
        tank.bullets.splice(bulletIndex, 1);
        this.drawExplosion();
      }
    } else if (this.owner === "enemy") {
      // Itera sobre cada instancia de Enemy para encontrar la que contiene esta bala
      for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const bulletIndex = enemy.bullets.indexOf(this);
        if (bulletIndex !== -1) {
          enemy.bullets.splice(bulletIndex, 1);
          this.drawExplosion();
          break; // Una vez que la bala es eliminada, puedes salir del bucle
        }
      }
    }
  }
}
