const express = require('express');
const session = require('express-session');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'src')));
app.use(express.json());
app.use(session({
    secret: 'tic tac toe secret',
    resave: false,
    saveUninitialized: true
}));

let games = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('join_game', ({ username, room }) => {
        socket.join(room);
        if (!games[room]) {
            games[room] = {
                players: {},
                board: Array(9).fill(null),
                currentPlayer: '🚀'
            };
        }
        games[room].players[socket.id] = username;
        io.to(room).emit('game_state', games[room]);
    });

    socket.on('make_move', ({ position, room }) => {
        const game = games[room];
        if (game.board[position] === null) {
            game.board[position] = game.currentPlayer;
            if (checkWin(game.board, game.currentPlayer)) {
                io.to(room).emit('game_state', { board: game.board, winner: game.currentPlayer });
            } else {
                game.currentPlayer = game.currentPlayer === '🚀' ? '👾' : '🚀';
                io.to(room).emit('game_state', game);
            }
        }
    });

    socket.on('reset_game', (room) => {
        games[room].board = Array(9).fill(null);
        games[room].currentPlayer = '🚀';
        io.to(room).emit('game_state', games[room]);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

function checkWin(board, player) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return lines.some(line => line.every(index => board[index] === player));
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'src', 'index.html'));
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
