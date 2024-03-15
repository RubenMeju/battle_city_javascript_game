class Bullet {
  constructor(x, y, direction, owner) {
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 4;
    this.speed = 5;
    this.direction = direction;
    this.owner = owner;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x - 4, this.y, this.width, this.height);
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
      // console.log("Contacto aguila");
      eagle.isDestroyed = true;
      this.destroy();
      reproducirUnaVez(gameOverFX);
    }

    // Si la bala sale del canvas la destruimos
    if (
      this.y < 0 ||
      this.y > canvas.height ||
      this.x < 0 ||
      this.x > canvas.width
    ) {
      this.destroy();
      reproducirUnaVez(shootCanvasFX);
    }

    // Destruir la bala si el muro es indestructible
    if (level[cellY] && level[cellY][cellX] === 1) {
      this.destroy();
      this.destroyWall();
      //drawExplosion(this.x, this.y);
    }

    // Destruir la bala si el muro es indestructible
    if (level[cellY] && level[cellY][cellX] === 2) {
      this.destroy();
      //drawExplosion(this.x, this.y);
    }

    //Destruir al enemigo si la bala colisiona con el.
    if (this.owner === "player") {
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
          //drawExplosion(enemies[i].x, enemies[i].y);
          reproducirUnaVez(destroyFX);
          // eliminar el enemigo del array enemies
          enemies.splice(i, 1);
          // descontar el enemigo de totalEnemies
          totalEnemies -= 1;
        }
      }
      // Verificar si la celda contiene un muro (valor igual a 1 en la matriz level)
      return level[cellY] && level[cellY][cellX] === 1;
    }
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
    drawExplosion(this.x, this.y);
    if (this.owner === "player") {
      const bulletIndex = tank.bullets.indexOf(this);
      if (bulletIndex !== -1) {
        tank.bullets.splice(bulletIndex, 1);
        //drawExplosion(this.x, this.y);
      }
    } else if (this.owner === "enemy") {
      // Itera sobre cada instancia de Enemy para encontrar la que contiene esta bala
      for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const bulletIndex = enemy.bullets.indexOf(this);
        if (bulletIndex !== -1) {
          enemy.bullets.splice(bulletIndex, 1);
          //drawExplosion();
          break; // Una vez que la bala es eliminada, puedes salir del bucle
        }
      }
    }
  }
}
