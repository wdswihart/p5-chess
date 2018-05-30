class Rook {
  constructor(color, i, j, size) {
    this.piece = new Piece(color, i, j, size);
    if (this.piece.color === 'black') {
      this.img = loadImage('assets/b-rook.png');
    } else {
      this.img = loadImage('assets/w-rook.png');
    }
  }

  revealMoves(grid) {
    for (let i = this.piece.i + 1; i < grid.length; i++) {
      if (grid[i][this.piece.j].piece === null) {
        grid[i][this.piece.j].hasMove = true;
      } else {
        if (grid[i][this.piece.j].piece.piece.color != this.piece.color) {
          grid[i][this.piece.j].hasMove = true;
          grid[i][this.piece.j].hasCapture = true;
        }
        i = grid.length;
      }
    }
    for (let i = this.piece.i - 1; i >= 0; i--) {
      if (grid[i][this.piece.j].piece === null) {
        grid[i][this.piece.j].hasMove = true;
      } else {
        if (grid[i][this.piece.j].piece.piece.color != this.piece.color) {
          grid[i][this.piece.j].hasMove = true;
          grid[i][this.piece.j].hasCapture = true;

        }
        i = -1;
      }
    }
    for (let j = this.piece.j + 1; j < grid[this.piece.i].length; j++) {
      if (grid[this.piece.i][j].piece === null) {
        grid[this.piece.i][j].hasMove = true;
      } else {
        if (grid[this.piece.i][j].piece.piece.color != this.piece.color) {
          grid[this.piece.i][j].hasMove = true;
          grid[this.piece.i][j].hasCapture = true;
        }
        j = grid[this.piece.i].length;
      }
    }
    for (let j = this.piece.j - 1; j >= 0; j--) {
      if (grid[this.piece.i][j].piece === null) {
        grid[this.piece.i][j].hasMove = true;
      } else {
        if (grid[this.piece.i][j].piece.piece.color != this.piece.color) {
          grid[this.piece.i][j].hasMove = true;
          grid[this.piece.i][j].hasCapture = true;
        }
        j = -1;
      }
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
