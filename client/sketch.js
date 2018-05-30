let socket;

let cellSize = 60;
let canvasSize = cellSize * 8;
let messageP;
let surrenderButton;
let newGameButton;

let grid;
let playerColor = '';
let opponentColor = '';
let turnPlayerColor = 'white';
let isGameOver = false;
let kingI;
let kingJ = 7;

function mouseClicked() {
  if (playerColor === turnPlayerColor && !isGameOver) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (mouseX > i * cellSize && mouseX < i * cellSize + cellSize) {
          if (mouseY > j * cellSize && mouseY < j * cellSize + cellSize) {
            if (grid[i][j].hasMove) {
              for (let k = 0; k < grid.length; k++) {
                for (let l = 0; l < grid[0].length; l++) {
                  if (grid[k][l].piece != null) {
                    if (grid[k][l].piece.piece.isSelected) {
                      let move = {
                        color: playerColor,
                        oldI: k,
                        oldJ: l,
                        newI: i,
                        newJ: j,
                        capture: null
                      };
                      if (grid[i][j].piece != null) {
                        move.capture = grid[i][j].piece;
                      }
                      grid = grid[k][l].piece.move(grid, i, j);
                      if (grid[i][j].piece.constructor.name === 'King') {
                        kingI = i;
                        kingJ = j;
                      }
                      grid = grid[kingI][kingJ].piece.revealMoves(grid);
                      grid = grid[kingI][kingJ].piece.validateMoves(grid);
                      if (grid[kingI][kingJ].piece.isInCheck) {
                        grid = grid[i][j].piece.move(grid, k, l);
                        if (grid[k][l].piece.constructor.name === 'King') {
                          kingI = k;
                          kingJ = l;
                        }
                        if (move.capture != null) {
                          grid[i][j].piece = move.capture;
                        }
                        resetGridMarkers();
                        messageP.html('<b>Your Turn! You must uncheck your king.</b>');
                      } else {
                        socket.emit('move', move);
                        switchTurn();
                        resetGridMarkers();
                      }
                      k = i = grid.length;
                      l = j = grid[0].length;
                    }
                  }
                }
              }
            } else if (grid[i][j].piece != null) {
              resetGridMarkers();
              if (grid[i][j].piece.piece.color === turnPlayerColor) {
                grid[i][j].piece.piece.isSelected = true;
                grid = grid[i][j].piece.revealMoves(grid);
                if (grid[i][j].piece.constructor.name === 'King') {
                  grid = grid[i][j].piece.validateMoves(grid);
                }
               }
            } else {
              resetGridMarkers();
            }
          }
        }
      }
    }
  }
}

function switchTurn() {
  if (turnPlayerColor === 'white') {
    turnPlayerColor = 'black';
  } else {
    turnPlayerColor = 'white';
  }
  if (turnPlayerColor === playerColor) {
    messageP.html('<b>Your Turn!</b>');
    if (grid[kingI][kingJ].piece.isInCheck) {
      messageP.html(messageP.html() + ' <b>You\'re in check!</b>');
    }
  } else {
    messageP.html('<b>Opponent\'s Turn</b>');
  }
}

function resetGridMarkers() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j].hasMove = false;
      grid[i][j].hasCapture = false;
      if (grid[i][j].piece != null) {
        grid[i][j].piece.piece.isSelected = false;
      }
    }
  }
}

function create2DArray(rows, cols) {
  let array = Array(cols);
  for (let i = 0; i < cols; i++) {
    array[i] = Array(rows);
  }
  return array;
}

function initializeGrid() {
  grid = create2DArray(8, 8);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j] = {
        piece: null,
        hasMove: false,
        hasCapture: false,
        color: 0
      };
      if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) {
        grid[i][j].color = 1;
      }
    }
  }

  let queenI;
  if (playerColor === 'white') {
    kingI = 3;
    queenI = 4;
  } else {
    kingI = 4;
    queenI = 3;
  }

  for (let i = 0; i < grid.length; i++) {
    grid[i][1].piece = new Pawn(opponentColor, i, 1, cellSize);
    grid[i][6].piece = new Pawn(playerColor, i, 6, cellSize);
  }

  grid[0][0].piece = new Rook(opponentColor, 0, 0, cellSize);
  grid[0][7].piece = new Rook(playerColor, 0, 7, cellSize);
  grid[1][0].piece = new Knight(opponentColor, 1, 0, cellSize);
  grid[1][7].piece = new Knight(playerColor, 1, 7, cellSize);
  grid[2][0].piece = new Bishop(opponentColor, 2, 0, cellSize);
  grid[2][7].piece = new Bishop(playerColor, 2, 7, cellSize);
  grid[kingI][0].piece = new King(opponentColor, kingI, 0, cellSize);
  grid[kingI][kingJ].piece = new King(playerColor, kingI, kingJ, cellSize);
  grid[queenI][0].piece = new Queen(opponentColor, queenI, 0, cellSize);
  grid[queenI][7].piece = new Queen(playerColor, queenI, 7, cellSize);
  grid[5][0].piece = new Bishop(opponentColor, 5, 0, cellSize);
  grid[5][7].piece = new Bishop(playerColor, 5, 7, cellSize);
  grid[6][0].piece = new Knight(opponentColor, 6, 0, cellSize);
  grid[6][7].piece = new Knight(playerColor, 6, 7, cellSize);
  grid[7][0].piece = new Rook(opponentColor, 7, 0, cellSize);
  grid[7][7].piece = new Rook(playerColor, 7, 7, cellSize);
}

function surrender() {
  if (!isGameOver) {
    messageP.html('<b>You surrendered; you lose.</b>');
    socket.emit('game over', opponentColor);
  }
}

function setupNewGame() {
  isGameOver = false;
  if (playerColor === 'white') {
    opponentColor = 'black';
    messageP.html('<b>Your Turn!</b>');
  } else {
    opponentColor = 'white';
    messageP.html('<b>Opponent\'s Turn</b>');
  }
  if (newGameButton != null) {
    newGameButton.remove();
  }
  surrenderButton.removeAttribute('disabled');
  initializeGrid();
}

function setup() {
  createCanvas(canvasSize, canvasSize);
  messageP = createP();
  messageP.class('message-p');
  surrenderButton = createButton('Surrender');
  surrenderButton.mousePressed(surrender);

  socket = io();
  socket.on('player joined', player => {
    if (playerColor === '') {
      playerColor = player;
      setupNewGame();
    }
  });

  socket.on('player left', () => {
    socket.emit('remaining player', playerColor);
  });

  socket.on('move', data => {
    let oldI, oldJ, newI, newJ;
    if (data.color != playerColor) {
      oldI = grid.length - 1 - data.oldI;
      oldJ = grid[0].length - 1 - data.oldJ;
      newI = grid.length - 1 - data.newI;
      newJ = grid[0].length - 1 - data.newJ;
    } else {
      oldI = data.oldI;
      oldJ = data.oldJ;
      newI = data.newI;
      newJ = data.newJ;
    }
    grid = grid[oldI][oldJ].piece.move(grid, newI, newJ);

    if (
      grid[newI][newJ].piece.constructor.name === 'King' &&
      grid[newI][newJ].piece.piece.color === playerColor
    ) {
      kingI = newI;
      kingJ = newJ;
    }

    grid = grid[kingI][kingJ].piece.revealMoves(grid);
    grid = grid[kingI][kingJ].piece.validateMoves(grid);
    if (grid[kingI][kingJ].piece.isInCheck && grid[kingI][kingJ].piece.moveCount === 0) {
      isGameOver = true;
      messageP.html('Checkmate! You lose.');
    }

    resetGridMarkers();
    switchTurn();
  });

  socket.on('game over', winnerColor => {
    isGameOver = true;
    messageP.html('<b>Game over!</b>');
    if (winnerColor === playerColor) {
      messageP.html(messageP.html() + ' <b>You won!</b>');
    } else {
      messageP.html(messageP.html() + ' <b>Your opponent won.</b>');
    }
    newGameButton = createButton('New Game');
    newGameButton.mousePressed(() => {
      socket.emit('request new game', playerColor);
      newGameButton.attribute('disabled', true);
      messageP.html('<b>Requested new game.</b>')
    });
    surrenderButton.attribute('disabled', true);
  });

  socket.on('new game', () => {
    playerColor = opponentColor;
    setupNewGame();
  });
}

function draw() {
  background(0);
  noStroke();
  if (grid != null) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        grid[i][j].color ? fill(80) : fill(175);
        rect(i * cellSize, j * cellSize, cellSize, cellSize);

        if (grid[i][j].hasCapture) {
          push();
          fill(255, 0, 0, 97);
          rect(i * cellSize, j * cellSize, cellSize, cellSize);
          pop();
        } else if (grid[i][j].hasMove) {
          push();
          fill(0, 255, 0, 90);
          rect(i * cellSize, j * cellSize, cellSize, cellSize);
          pop();
        }

        if (grid[i][j].piece != null) {
          grid[i][j].piece.draw();

          if (grid[i][j].piece.piece.isSelected) {
            push();
            noFill();
            stroke(0, 0, 255);
            strokeWeight(2);
            rect(i * cellSize, j * cellSize, cellSize, cellSize);
            pop();
          }
        }
      }
    }
  }
}
