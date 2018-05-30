class Pawn {
  constructor(color, i, j, size) {
    this.piece = new Piece(color, i, j, size);
    this.hasMoved = false;
    if (this.piece.color === 'black') {
      this.img = loadImage('assets/b-pawn.png');
    } else {
      this.img = loadImage('assets/w-pawn.png');
    }
  }

  revealMoves(grid) {
    if (
      this.piece.j > 1 &&
      grid[this.piece.i][this.piece.j - 1].piece === null
    ) {
      grid[this.piece.i][this.piece.j - 1].hasMove = true;
      if (!this.hasMoved) {
        if (this.piece.j > 1) {
          if (grid[this.piece.i][this.piece.j - 2].piece === null) {
            grid[this.piece.i][this.piece.j - 2].hasMove = true;
          }
        }
      }
    }
    if (
      this.piece.i > 0 &&
      this.piece.j > 1 &&
      grid[this.piece.i - 1][this.piece.j - 1].piece != null &&
      grid[this.piece.i - 1][this.piece.j - 1].piece.piece.color != this.piece.color
    ) {
      grid[this.piece.i - 1][this.piece.j - 1].hasCapture = true;
      grid[this.piece.i - 1][this.piece.j - 1].hasMove = true;
      if (grid[this.piece.i - 1][this.piece.j - 1].piece.constructor.name === 'King') {
        grid[this.piece.i - 1][this.piece.j - 1].piece.isInCheck = true;
        this.piece.isChecking = true;
      } else if (grid[this.piece.i - 1][this.piece.j - 1].piece.piece.isChecking) {
        this.piece.canSave = true;
      }
    }
    if (
      this.piece.i < grid.length - 1 &&
      this.piece.j > 1 &&
      grid[this.piece.i + 1][this.piece.j - 1].piece != null &&
      grid[this.piece.i + 1][this.piece.j - 1].piece.piece.color != this.piece.color
    ) {
      grid[this.piece.i + 1][this.piece.j - 1].hasCapture = true;
      grid[this.piece.i + 1][this.piece.j - 1].hasMove = true;
      if (grid[this.piece.i + 1][this.piece.j - 1].piece.constructor.name === 'King') {
        this.piece.isChecking = true;
      } else if (grid[this.piece.i + 1][this.piece.j - 1].piece.piece.isChecking) {
        this.piece.canSave = true;
      }
    }

    return grid;
  }

  move(grid, i, j) {
    if (j === 6) {
      this.hasMoved = false;
    } else {
      this.hasMoved = true;
    }
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
