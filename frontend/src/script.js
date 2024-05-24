function startGame() {
    document.getElementById("usernameForm").classList.add("d-none");
    document.getElementById("gameBoard").classList.remove("d-none");
    document.getElementById("resetButton").classList.remove("d-none");
    // Assume it starts with human turn
    window.isHumanTurn = true;
}

function makeMove(position) {
    if (!window.isHumanTurn) {
        alert("Wait for your turn!");
        return;
    }

    fetch('/api/move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position }),
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(result => {
        if (result.status === 200) {
            updateBoard(result.body.board);
            // Toggle turn
            window.isHumanTurn = !window.isHumanTurn;
            if (result.body.winner) {
                let winText = result.body.winner === 'Computer' ? "👾 wins!" : `🚀 wins!`;
                alert(winText);
            } else {
                // If no winner, check if it's computer's turn and initiate move
                if (!window.isHumanTurn) {
                    makeComputerMove();
                }
            }
        } else {
            throw new Error(`Failed to make move: ${result.body.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert(error.message);
    });
}

function updateBoard(board) {
    board.forEach((cell, index) => {
        const cellDiv = document.getElementsByClassName("game-cell")[index];
        cellDiv.textContent = cell;
    });
}

function makeComputerMove() {
    setTimeout(() => {
        fetch('/api/computer-move', {
            method: 'POST'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            updateBoard(data.board);
            window.isHumanTurn = true; // Hand turn back to the human
            if (data.winner) {
                let winText = data.winner === 'Computer' ? "👾 wins!" : `🚀 wins!`;
                alert(winText);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to make computer move.');
        });
    }, 1000); // Delay the computer move by 1 second
}


function resetGame() {
    fetch('/api/reset', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        updateBoard(Array(9).fill(null));
        document.getElementById("usernameForm").classList.remove("d-none");
        document.getElementById("gameBoard").classList.add("d-none");
        document.getElementById("resetButton").classList.add("d-none");
        window.isHumanTurn = true; // Reset to human turn
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to reset the game.');
    });
}
