class Queen {
  constructor(color, i, j, size) {
    this.piece = new Piece(color, i, j, size);
    if (this.piece.color === 'black') {
      this.img = loadImage('assets/b-queen.png');
    } else {
      this.img = loadImage('assets/w-queen.png');
    }
  }

  revealMoves(grid) {
    grid = (
      new Bishop(this.piece.color, this.piece.i, this.piece.j, this.piece.size)
    ).revealMoves(grid);
    grid = (
      new Rook(this.piece.color, this.piece.i, this.piece.j, this.piece.size)
    ).revealMoves(grid);
    return grid;
  }

  move(grid, i, j) {
    grid[this.piece.i][this.piece.j].piece = null;
    this.piece.i = i;
    this.piece.j = j;
    grid[i][j].piece = this;
    return grid;
  }

  draw() {
    image(
      this.img,
      this.piece.i * this.piece.size,
      this.piece.j * this.piece.size
    );
  }
}
