class Knight {
  constructor(color, i, j, size) {
    this.piece = new Piece(color, i, j, size);
    if (this.piece.color === 'black') {
      this.img = loadImage('assets/b-knight.png');
    } else {
      this.img = loadImage('assets/w-knight.png');
    }
  }

  revealMoves(grid) {
    if (this.piece.i - 2 >= 0 && this.piece.j - 1 >= 0) {
      if (grid[this.piece.i - 2][this.piece.j - 1].piece === null) {
        grid[this.piece.i - 2][this.piece.j - 1].hasMove = true;
      } else if (grid[this.piece.i - 2][this.piece.j - 1].piece.piece.color != this.piece.color) {
        grid[this.piece.i - 2][this.piece.j - 1].hasMove = true;
        grid[this.piece.i - 2][this.piece.j - 1].hasCapture = true;
      }
    }
    if (this.piece.i - 2 >= 0 && this.piece.j + 1 < grid[this.piece.i].length) {
      if (grid[this.piece.i - 2][this.piece.j + 1].piece === null) {
        grid[this.piece.i - 2][this.piece.j + 1].hasMove = true;
      } else if (grid[this.piece.i - 2][this.piece.j + 1].piece.piece.color != this.piece.color) {
        grid[this.piece.i - 2][this.piece.j + 1].hasMove = true;
        grid[this.piece.i - 2][this.piece.j + 1].hasCapture = true;
      }
    }
    if (this.piece.i - 1 >= 0 && this.piece.j - 2 >= 0) {
      if (grid[this.piece.i - 1][this.piece.j - 2].piece === null) {
        grid[this.piece.i - 1][this.piece.j - 2].hasMove = true;
      } else if (grid[this.piece.i - 1][this.piece.j - 2].piece.piece.color != this.piece.color) {
        grid[this.piece.i - 1][this.piece.j - 2].hasMove = true;
        grid[this.piece.i - 1][this.piece.j - 2].hasCapture = true;
      }
    }
    if (this.piece.i - 1 >= 0 && this.piece.j + 2 < grid[this.piece.i].length) {
      if (grid[this.piece.i - 1][this.piece.j + 2].piece === null) {
        grid[this.piece.i - 1][this.piece.j + 2].hasMove = true;
      } else if (grid[this.piece.i - 1][this.piece.j + 2].piece.piece.color != this.piece.color) {
        grid[this.piece.i - 1][this.piece.j + 2].hasMove = true;
        grid[this.piece.i - 1][this.piece.j + 2].hasCapture = true;
      }
    }
    if (this.piece.i + 1 < grid.length && this.piece.j - 2 >= 0) {
      if (grid[this.piece.i + 1][this.piece.j - 2].piece === null) {
        grid[this.piece.i + 1][this.piece.j - 2].hasMove = true;
      } else if (grid[this.piece.i + 1][this.piece.j - 2].piece.piece.color != this.piece.color) {
        grid[this.piece.i + 1][this.piece.j - 2].hasMove = true;
        grid[this.piece.i + 1][this.piece.j - 2].hasCapture = true;
      }
    }
    if (this.piece.i + 1 < grid.length && this.piece.j + 2 < grid[this.piece.i].length) {
      if (grid[this.piece.i + 1][this.piece.j + 2].piece === null) {
        grid[this.piece.i + 1][this.piece.j + 2].hasMove = true;
      } else if (grid[this.piece.i + 1][this.piece.j + 2].piece.piece.color != this.piece.color) {
        grid[this.piece.i + 1][this.piece.j + 2].hasMove = true;
        grid[this.piece.i + 1][this.piece.j + 2].hasCapture = true;
      }
    }
    if (this.piece.i + 2 < grid.length && this.piece.j - 1 >= 0) {
      if (grid[this.piece.i + 2][this.piece.j - 1].piece === null) {
        grid[this.piece.i + 2][this.piece.j - 1].hasMove = true;
      } else if (grid[this.piece.i + 2][this.piece.j - 1].piece.piece.color != this.piece.color) {
        grid[this.piece.i + 2][this.piece.j - 1].hasMove = true;
        grid[this.piece.i + 2][this.piece.j - 1].hasCapture = true;
      }
    }
    if (this.piece.i + 2 < grid.length && this.piece.j + 1 < grid[this.piece.i].length) {
      if (grid[this.piece.i + 2][this.piece.j + 1].piece === null) {
        grid[this.piece.i + 2][this.piece.j + 1].hasMove = true;
      } else if (grid[this.piece.i + 2][this.piece.j + 1].piece.piece.color != this.piece.color) {
        grid[this.piece.i + 2][this.piece.j + 1].hasMove = true;
        grid[this.piece.i + 2][this.piece.j + 1].hasCapture = true;
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
