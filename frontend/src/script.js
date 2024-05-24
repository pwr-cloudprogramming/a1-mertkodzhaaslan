const socket = io();

function joinGame() {
    const username = document.getElementById('username').value;
    const room = document.getElementById('room').value;
    socket.emit('join_game', { username, room });
    document.getElementById('loginForm').classList.add('d-none');
    document.getElementById('gameBoard').classList.remove('d-none');
    document.getElementById('resetButton').classList.remove('d-none');
}

socket.on('game_state', (game) => {
    updateBoard(game.board);
    if (game.winner) {
        alert(`${game.winner} wins!`);
    }
});

function makeMove(cell) {
    const index = cell.dataset.index;
    const room = document.getElementById('room').value;
    socket.emit('make_move', { position: index, room });
}

function resetGame() {
    const room = document.getElementById('room').value;
    socket.emit('reset_game', room);
}

function updateBoard(board) {
    board.forEach((cell, index) => {
        const cellDiv = document.querySelector(`.game-cell[data-index='${index}']`);
        cellDiv.textContent = cell;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.game-cell');
    cells.forEach(cell => {
        cell.addEventListener('click', function () {
            makeMove(this);
        });
    });
});
