class King {
  constructor(color, i, j, size) {
    this.piece = new Piece(color, i, j, size);
    this.moveCount = 0;
    this.isInCheck = false;
    if (this.piece.color === 'black') {
      this.img = loadImage('assets/b-king.png');
    } else {
      this.img = loadImage('assets/w-king.png');
    }
  }

  validateMoves(grid) {
    let opponentGrid = Array(grid.length);
    for (let i = 0; i < grid.length; i++) {
      opponentGrid[i] = Array(grid[0].length);
      for (let j = 0; j < grid[0].length; j++) {
        opponentGrid[i][j] = {
          piece: grid[i][j].piece,
          hasMove: false,
          hasCapture: false
        };
      }
    }
    for (let i = 0; i < opponentGrid.length; i++) {
      for (let j = 0; j < opponentGrid[0].length; j++) {
        if (opponentGrid[i][j].piece != null) {
          if (opponentGrid[i][j].piece.piece.color != this.piece.color) {
            if (opponentGrid[i][j].piece.constructor.name === 'Pawn') {
              if (j < grid[0].length - 1) {
                if (i < grid.length - 1) {
                  opponentGrid[i + 1][j + 1].hasCapture = true;
                  opponentGrid[i + 1][j + 1].hasMove = true;
                }
                if (i > 0) {
                  opponentGrid[i - 1][j + 1].hasCapture = true;
                  opponentGrid[i - 1][j + 1].hasMove = true;
                }
              }
            } else {
              opponentGrid = opponentGrid[i][j].piece.revealMoves(opponentGrid);
            }
            if (grid[i][j].hasCapture) {
              let opponentGridCopy = Array(opponentGrid.length);
              for (let i = 0; i < grid.length; i++) {
                opponentGridCopy[i] = Array(opponentGrid[0].length);
                for (let j = 0; j < opponentGrid[0].length; j++) {
                  opponentGridCopy[i][j] = {
                    piece: opponentGrid[i][j].piece,
                    hasMove: opponentGrid[i][j].hasMove,
                    hasCapture: opponentGrid[i][j].hasCapture
                  };
                }
              }
              opponentGridCopy[i][j].piece = null;
              for (let k = 0; k < opponentGridCopy.length; k++) {
                for (let l = 0; l < opponentGridCopy[0].length; l++) {
                  if (opponentGridCopy[k][l].piece != null) {
                    if (opponentGridCopy[k][l].piece.piece.color != this.piece.color) {
                      opponentGridCopy = opponentGridCopy[k][l].piece.revealMoves(opponentGridCopy);
                      if (opponentGridCopy[i][j].hasMove) {
                        grid[i][j].hasMove = false;
                        grid[i][j].hasCapture = false;
                        this.moveCount--;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (opponentGrid[this.piece.i][this.piece.j].hasCapture) {
      this.isInCheck = true;
    } else {
      this.isInCheck = false;
    }
    for (let i = this.piece.i - 1; i < this.piece.i + 2; i++) {
      if (i < grid.length - 1 && i > 0) {
        for (let j = this.piece.j - 1; j < this.piece.j + 2; j++) {
          if (j < grid[0].length - 1 && j > 0) {
            if (grid[i][j].hasMove) {
              if (opponentGrid[i][j].hasMove) {
                grid[i][j].hasMove = false;
                grid[i][j].hasCapture = false;
                this.moveCount--;
              }
            }
          }
        }
      }
    }

    return grid;
  }

  revealMoves(grid) {
    this.moveCount = 0;

    let i = this.piece.i;
    let j = this.piece.j;
    if (i > 0) {
      if (grid[i - 1][j].piece === null) {
        grid[i - 1][j].hasMove = true;
        this.moveCount++;
      } else if (grid[i - 1][j].piece.piece.color != this.piece.color) {
        grid[i - 1][j].hasMove = true;
        grid[i - 1][j].hasCapture = true;
        this.moveCount++;
      }
      if (j > 0) {
        if (grid[i - 1][j - 1].piece === null) {
          grid[i - 1][j - 1].hasMove = true;
          this.moveCount++;
      } else if (grid[i - 1][j - 1].piece.piece.color != this.piece.color) {
          grid[i - 1][j - 1].hasMove = true;
          grid[i - 1][j - 1].hasCapture = true;
          this.moveCount++;
      }
      }
      if (j < grid[0].length - 1) {
        if (grid[i - 1][j + 1].piece === null) {
          grid[i - 1][j + 1].hasMove = true;
          this.moveCount++;
        } else if (grid[i - 1][j + 1].piece.piece.color != this.piece.color) {
          grid[i - 1][j + 1].hasMove = true;
          grid[i - 1][j + 1].hasCapture = true;
          this.moveCount++;
        }
      }
    }
    if (i < grid.length - 1) {
      if (grid[i + 1][j].piece === null) {
        grid[i + 1][j].hasMove = true;
        this.moveCount++;
      } else if (grid[i + 1][j].piece.piece.color != this.piece.color) {
        grid[i + 1][j].hasMove = true;
        grid[i + 1][j].hasCapture = true;
        this.moveCount++;
      }
      if (j > 0) {
        if (grid[i + 1][j - 1].piece === null) {
          grid[i + 1][j - 1].hasMove = true;
          this.moveCount++;
        } else if (grid[i + 1][j - 1].piece.piece.color != this.piece.color) {
          grid[i + 1][j - 1].hasMove = true;
          grid[i + 1][j - 1].hasCapture = true;
          this.moveCount++;
        }
      }
      if (j < grid[0].length - 1) {
        if (grid[i + 1][j + 1].piece === null) {
          grid[i + 1][j + 1].hasMove = true;
          this.moveCount++;
        } else if (grid[i + 1][j + 1].piece.piece.color != this.piece.color) {
          grid[i + 1][j + 1].hasMove = true;
          grid[i + 1][j + 1].hasCapture = true;
          this.moveCount++;
        }
      }
    }
    if (j > 0) {
      if (grid[i][j - 1].piece === null) {
        grid[i][j - 1].hasMove = true;
        this.moveCount++;
      } else if (grid[i][j - 1].piece.piece.color != this.piece.color) {
        grid[i][j - 1].hasMove = true;
        grid[i][j - 1].hasCapture = true;
        this.moveCount++;
      }
    }
    if (j < grid[0].length - 1) {
      if (grid[i][j + 1].piece === null) {
        grid[i][j + 1].hasMove = true;
        this.moveCount++;
      } else if (grid[i][j + 1].piece.piece.color != this.piece.color) {
        grid[i][j + 1].hasMove = true;
        grid[i][j + 1].hasCapture = true;
        this.moveCount++;
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
