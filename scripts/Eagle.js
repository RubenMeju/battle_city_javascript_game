class Eagle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isDestroyed = false;
  }
  // DIBUJAR EL AGUILA
  draw() {
    ctx.drawImage(
      sprites,
      304,
      32,
      16, // el tamaño del recorte
      16, // el tamaño del recorte
      canvas.width / 2 - cellSize, // posición X del dibujo
      canvas.height - 55, // posición X del dibujo
      55, // ancho del dibujo
      55 // ancho del dibujo
    );
  }
}
