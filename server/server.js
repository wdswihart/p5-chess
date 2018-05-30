const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const socketio = require('socket.io');

const app = express();

app.use(cors());
app.use(express.static('client'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const port = process.env.port || '3000';
app.set('port', port);

const server = http.createServer(app);
const io = socketio(server);
let players = [];
let moves = [];
let winner = '';
let newGameRequests = [];

io.on('connection', socket => {
  if (!players.includes('white')) {
    players.push('white');
    console.log('White joined.');
    io.emit('player joined', 'white');
    console.log(players);
  } else if (!players.includes('black')) {
    players.push('black');
    console.log('Black joined.');
    io.emit('player joined', 'black');
    console.log(players);
  }

  socket.join('updates');
  if (moves.length > 0) {
    console.log('updating player\'s board...');
    for (let move of moves) {
      io.to('updates').emit('move', move);
    }
  }
  if (winner != '') {
    io.to('updates').emit('game over', winner);
  }
  socket.leave('updates');

  socket.on('disconnect', () => {
    console.log('User disconnected.');
    io.emit('player left');
    if (players.length == 1) {
      players = [];
      moves = [];
      console.log('No remaining players.', players);
    }
  });

  socket.on('remaining player', player => {
    console.log('Remaining player: ' + player);
    if (player === 'white') {
      players.splice(players.indexOf('black'), 1);
    } else {
      players.splice(players.indexOf('white'), 1);
    }
    console.log(players);
  });

  socket.on('move', data => {
    moves.push(data);
    socket.broadcast.emit('move', data);
  });

  socket.on('game over', winnerColor => {
    winner = winnerColor;
    io.emit('game over', winner);
  });

  socket.on('request new game', playerColor => {
    if (!newGameRequests.includes(playerColor)) {
      newGameRequests.push(playerColor);
      if (newGameRequests.length === 2) {
        winner = '';
        moves = [];
        newGameRequests = [];
        io.emit('new game');
      }
    }
  });

  socket.on('chat', message => {
    socket.broadcast.emit('chat', message);
  });
});

server.listen(port, () => {
  console.log('Express server started on port ' + port + '.');
});
