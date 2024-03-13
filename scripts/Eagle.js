class Eagle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.clipX = 304;
    this.clipY = 32;
    this.isDestroyed = false;
  }

  // DIBUJAR EL AGUILA
  draw() {
    if (this.isDestroyed) {
      this.clipX = 322;
    }

    ctx.drawImage(
      sprites,
      this.clipX,
      this.clipY,
      16, // el tamaño del recorte
      16, // el tamaño del recorte
      canvas.width / 2 - cellSize, // posición X del dibujo
      canvas.height - 55, // posición X del dibujo
      55, // ancho del dibujo
      55 // ancho del dibujo
    );
  }
}
