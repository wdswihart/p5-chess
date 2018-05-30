let socket;

let cellSize = 60;
let canvasSize = cellSize * 8;
let messageP;
let surrenderButton;
let newGameButton;
let queensideCastleButton;
let kingsideCastleButton;
let enPasseButton;

let grid;
let playerColor = '';
let opponentColor = '';
let turnPlayerColor = 'white';
let kingI;
let kingJ;
let queenI;
let isGameOver = false;
let kingHasMoved = false;
let leftRookHasMoved = false;
let rightRookHasMoved = false;
let enPasseCapturer;
let enPasseCapturedPiece;

function evaluateCastling() {
  if (!kingHasMoved) {
    if (queenI < kingI) {
      if (!leftRookHasMoved) {
        queensideCastleButton.removeAttribute('disabled');
        for (let i = kingI - 1; i > 0; i--) {
          if (grid[i][7].piece != null) {
            queensideCastleButton.attribute('disabled', true);
          }
        }
      }
      if (!rightRookHasMoved) {
        kingsideCastleButton.removeAttribute('disabled');
        for (let i = kingI + 1; i < grid.length - 1; i++) {
          if (grid[i][7].piece != null) {
            kingsideCastleButton.attribute('disabled', true);
          }
        }
      }
    } else {
      if (!leftRookHasMoved) {
        kingsideCastleButton.removeAttribute('disabled');
        for (let i = kingI - 1; i > 0; i--) {
          if (grid[i][7].piece != null) {
            kingsideCastleButton.attribute('disabled', true);
          }
        }
      }
      if (!rightRookHasMoved) {
        queensideCastleButton.removeAttribute('disabled');
        for (let i = kingI + 1; i < grid.length - 1; i++) {
          if (grid[i][7].piece != null) {
            queensideCastleButton.attribute('disabled', true);
          }
        }
      }
    }
  }
}

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
                        evaluateCastling();
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

  enPasseButton.attribute('disabled', true);
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

  if (playerColor === 'white') {
    kingI = 3;
    queenI = 4;
  } else {
    kingI = 4;
    queenI = 3;
  }
  kingJ = 7;

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
  turnPlayerColor = 'white';
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

function setupCastlingButtons() {
  kingsideCastleButton = createButton('Kingside Castle');
  kingsideCastleButton.attribute('disabled', true);
  kingsideCastleButton.mousePressed(() => {
    let oldRookI, newRookI;
    let oldKingI = kingI;
    if (turnPlayerColor === playerColor) {
      if (queenI > kingI) {
        grid = grid[kingI][kingJ].piece.move(grid, 1, 7);
        grid = grid[0][7].piece.move(grid, 2, 7);
        kingI = 1;
        oldRookI = 0;
        newRookI = 2;
        leftRookHasMoved = true;
      } else {
        grid = grid[kingI][kingJ].piece.move(grid, 6, 7);
        grid = grid[7][7].piece.move(grid, 5, 7);
        kingI = 6;
        oldRookI = 7;
        newRookI = 5;
        rightRookHasMoved = true;
      }
      kingHasMoved = true;      
      kingsideCastleButton.attribute('disabled', true);      
      switchTurn();
      socket.emit('move', {
        color: playerColor,
        oldI: oldKingI,
        oldJ: 7,
        newI: kingI,
        newJ: 7,
        capture: null
      });
      socket.emit('move', {
        color: playerColor,
        oldI: oldRookI,
        oldJ: 7,
        newI: newRookI,
        newJ: 7,
        capture: null
      });
      socket.emit('move', null);
    }
  });
  queensideCastleButton = createButton('Queenside Castle');
  queensideCastleButton.attribute('disabled', true); 
  queensideCastleButton.mousePressed(() => {
    if (turnPlayerColor === playerColor) {
      let newKingI, oldRookI, newRookI;
      let oldKingI = kingI;
      if (queenI < kingI) {
        grid = grid[kingI][kingJ].piece.move(grid, 2, 7);
        grid = grid[0][7].piece.move(grid, 3, 7);
        oldRookI = 0;
        newRookI = 3;
        kingI = 2;
        leftRookHasMoved = true;
      } else {
        grid = grid[kingI][kingJ].piece.move(grid, 5, 7);
        grid = grid[7][7].piece.move(grid, 4, 7);
        kingI = 5;
        oldRookI = 7;
        newRookI = 4;
        rightRookHasMoved = true;
      }
      kingHasMoved = true;
      queensideCastleButton.attribute('disabled', true);
      switchTurn();
      socket.emit('move', {
        color: playerColor,
        oldI: oldKingI,
        oldJ: 7,
        newI: kingI,
        newJ: 7,
        capture: null
      });
      socket.emit('move', {
        color: playerColor,
        oldI: oldRookI,
        oldJ: 7,
        newI: newRookI,
        newJ: 7,
        capture: null
      });
      socket.emit('move', null);
    }
  });
}

function captureEnPasse() {
  socket.emit('move', {
    color: playerColor,
    oldI: enPasseCapturer.piece.i,
    newI: enPasseCapturedPiece.piece.i,
    oldJ: 3,
    newJ: 2,
    capture: enPasseCapturedPiece
  });
  grid = enPasseCapturer.move(grid, enPasseCapturedPiece.piece.i, 2);
  grid[enPasseCapturedPiece.piece.i][3].piece = null;
  enPasseCapturer = null;
  enPasseCapturedPiece = null;
  switchTurn();
}

function checkEnPasse(opponentPiece) {
  if (opponentPiece.piece.color != playerColor) {
    if (opponentPiece.constructor.name === 'Pawn') {
      if (opponentPiece.piece.j === 3 && opponentPiece.moveCount === 1) {
        for (let i = 0; i < grid.length; i++) {
          if (grid[i][3].piece != null) {
            if (grid[i][3].piece.piece.color === playerColor) {
              if (grid[i][3].piece.constructor.name === 'Pawn') {
                if (
                  i === opponentPiece.piece.i - 1 || 
                  i === opponentPiece.piece.i + 1
                ) {
                  enPasseCapturer = grid[i][3].piece;
                  enPasseCapturedPiece = opponentPiece;
                  enPasseButton.removeAttribute('disabled');
                }
              }
            }
          }
        }
      }
    }
  }
}

function setupDOM() {
  createCanvas(canvasSize, canvasSize);
  messageP = createP();
  messageP.class('message-p');
  setupCastlingButtons();
  enPasseButton = createButton('En Passe');
  enPasseButton.mousePressed(captureEnPasse);
  enPasseButton.attribute('disabled', true);
  createP('');  
  surrenderButton = createButton('Surrender');
  surrenderButton.mousePressed(surrender); 
}

function setup() {
  setupDOM();

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
    switchTurn();    
    if (data != null) {
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

      if (data.capture != null) {
        if (data.capture.piece.color == playerColor) {
          data.capture.piece.i = grid.length - 1 - data.capture.piece.i;
          data.capture.piece.j = grid[0].length - 1 - data.capture.piece.j;
        }
        if (data.capture.piece.i != newI || data.capture.piece.j != newJ) {
          grid[data.capture.piece.i][data.capture.piece.j].piece = null;
        }
      }
  
      checkEnPasse(grid[newI][newJ].piece);
      if (
        grid[0][7].piece === null ||
        grid[0][7].piece.constructor.name != 'Rook'
      ) {
        leftRookHasMoved = true;
      }
      if (
        grid[7][7].piece === null || 
        grid[7][7].piece.constructor.name != 'Rook'
      ) {
        rightRookHasMoved = true;
      }
      if (
        grid[newI][newJ].piece.constructor.name === 'King' &&
        grid[newI][newJ].piece.piece.color === playerColor
      ) {
        kingI = newI;
        kingJ = newJ;
        kingHasMoved = true;
      }
  
      grid = grid[kingI][kingJ].piece.revealMoves(grid);
      grid = grid[kingI][kingJ].piece.validateMoves(grid);
      if (grid[kingI][kingJ].piece.isInCheck && grid[kingI][kingJ].piece.moveCount === 0) {
        socket.emit('game over', opponentColor);
      }
  
      evaluateCastling();    
      resetGridMarkers();
    }
  });
  socket.on('game over', winnerColor => {
    isGameOver = true;
    turnPlayerColor = '';
    if (grid[kingI][kingJ].piece.isInCheck && grid[kingI][kingJ].piece.moveCount === 0) {
      messageP.html('<b>Checkmate! Your opponent won.</b>')
    } else {
      messageP.html('<b>Game over!</b>');
      if (winnerColor === playerColor) {
        messageP.html(messageP.html() + ' <b>You won!</b>');
      } else {
        messageP.html(messageP.html() + ' <b>Your opponent won.</b>');
      }
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
