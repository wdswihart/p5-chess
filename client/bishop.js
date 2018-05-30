class Bishop {
  constructor(color, i, j, size) {
    this.piece = new Piece(color, i, j, size);
    this.img;
    if (this.piece.color === 'black') {
      this.img = loadImage('assets/b-bishop.png');
    } else {
      this.img = loadImage('assets/w-bishop.png');
    }
  }

  revealMoves(grid) {
    let i = this.piece.i + 1;
    let j = this.piece.j + 1;
    while (i < grid.length && j < grid[this.piece.i].length) {
      if (grid[i][j].piece === null) {
        grid[i][j].hasMove = true;
      } else {
        if (grid[i][j].piece.piece.color != this.piece.color) {
          grid[i][j].hasMove = true;
          grid[i][j].hasCapture = true;
        }
        i = grid.length;
      }
      i += 1;
      j += 1;
    }
    i = this.piece.i + 1;
    j = this.piece.j - 1;
    while (i < grid.length && j >= 0) {
      if (grid[i][j].piece === null) {
        grid[i][j].hasMove = true;
      } else {
        if (grid[i][j].piece.piece.color != this.piece.color) {
          grid[i][j].hasMove = true;
          grid[i][j].hasCapture = true;
        }
        i = grid.length;
      }
      i += 1;
      j -= 1;
    }
    i = this.piece.i - 1;
    j = this.piece.j + 1;
    while (i >= 0 && j < grid[this.piece.i].length) {
      if (grid[i][j].piece === null) {
        grid[i][j].hasMove = true;
      } else {
        if (grid[i][j].piece.piece.color != this.piece.color) {
          grid[i][j].hasMove = true;
          grid[i][j].hasCapture = true;
        }
        i = -1;
      }
      i -= 1;
      j += 1;
    }
    i = this.piece.i - 1;
    j = this.piece.j - 1;
    while (i >= 0 && j >= 0) {
      if (grid[i][j].piece === null) {
        grid[i][j].hasMove = true;
      } else {
        if (grid[i][j].piece.piece.color != this.piece.color) {
          grid[i][j].hasMove = true;
          grid[i][j].hasCapture = true;
        }
        i = -1;
      }
      i -= 1;
      j -= 1;
    }

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
