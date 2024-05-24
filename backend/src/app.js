const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Correct the path to serve static files from the correct directory
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'src')));

// Initial game state
let game = {
  board: Array(9).fill(null),
  currentPlayer: '🚀', 
  playerSymbol: '🚀',
  computerSymbol: '👾',
};

// Endpoint to reset the game
app.post('/api/reset', (req, res) => {
  game = {
    board: Array(9).fill(null),
    currentPlayer: '🚀', 
    playerSymbol: '🚀',
    computerSymbol: '👾',
  };
  res.json({ message: 'Game has been reset successfully!', game });
});

// Endpoint to handle player's move
app.post('/api/move', (req, res) => {
  const { position } = req.body;

  if (game.board[position] !== null || !Number.isInteger(position) || position < 0 || position > 8) {
    return res.status(400).json({ message: 'Move not allowed!' });
  }

  game.board[position] = game.currentPlayer;
  if (checkWin(game.board, game.currentPlayer)) {
    return res.json({ winner: 'Player', board: game.board });
  }

  if (!game.board.includes(null)) {
    return res.json({ winner: 'Tie', board: game.board });
  }

  game.currentPlayer = game.computerSymbol;
  const openPositions = game.board.filter(v => v === null);
  const randomMove = openPositions[Math.floor(Math.random() * openPositions.length)];
  game.board[randomMove] = game.currentPlayer;

  if (checkWin(game.board, game.currentPlayer)) {
    return res.json({ winner: 'Computer', board: game.board });
  }

  game.currentPlayer = game.playerSymbol;
  res.json({ board: game.board, currentPlayer: '🚀' });
});

// Function to check win conditions
function checkWin(board, player) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return lines.some(line => line.every(index => board[index] === player));
}

// Adjust path for fallback route to correctly serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'src', 'index.html'));
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
