const gameBoard = document.querySelector('.game-board');
const restartButton = document.getElementById('restart');
const startGameButton = document.getElementById('startGame');
const playerSetup = document.querySelector('.player-setup');
const winnerAnnouncement = document.getElementById('winnerAnnouncement');
let currentPlayerIndex = 0;
let gameActive = true;
let gameState = [];
let players = [];
let gridSize = 3;

const generateWinningConditions = (gridSize) => {
    const winningConditions = [];

    // Rows and Columns for winning with 3 in a row in 4x4 grid
    if (gridSize === 4) {
        // Rows
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j <= gridSize - 3; j++) {
                winningConditions.push([i * gridSize + j, i * gridSize + j + 1, i * gridSize + j + 2]);
            }
        }

        // Columns
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j <= gridSize - 3; j++) {
                winningConditions.push([j * gridSize + i, (j + 1) * gridSize + i, (j + 2) * gridSize + i]);
            }
        }

        // Diagonals (top-left to bottom-right)
        for (let i = 0; i <= gridSize - 3; i++) {
            for (let j = 0; j <= gridSize - 3; j++) {
                winningConditions.push([i * gridSize + j, (i + 1) * gridSize + j + 1, (i + 2) * gridSize + j + 2]);
            }
        }

        // Diagonals (top-right to bottom-left)
        for (let i = 0; i <= gridSize - 3; i++) {
            for (let j = 2; j < gridSize; j++) {
                winningConditions.push([i * gridSize + j, (i + 1) * gridSize + j - 1, (i + 2) * gridSize + j - 2]);
            }
        }
    } else {
        // For a 3x3 grid or others, use full row, column, and diagonal
        // Rows
        for (let i = 0; i < gridSize; i++) {
            const row = [];
            for (let j = 0; j < gridSize; j++) {
                row.push(i * gridSize + j);
            }
            winningConditions.push(row);
        }

        // Columns
        for (let i = 0; i < gridSize; i++) {
            const column = [];
            for (let j = 0; j < gridSize; j++) {
                column.push(i + j * gridSize);
            }
            winningConditions.push(column);
        }

        // Diagonal 1 (top-left to bottom-right)
        const diagonal1 = [];
        for (let i = 0; i < gridSize; i++) {
            diagonal1.push(i * gridSize + i);
        }
        winningConditions.push(diagonal1);

        // Diagonal 2 (top-right to bottom-left)
        const diagonal2 = [];
        for (let i = 0; i < gridSize; i++) {
            diagonal2.push((i + 1) * gridSize - (i + 1));
        }
        winningConditions.push(diagonal2);
    }

    return winningConditions;
};

let winningConditions = generateWinningConditions(gridSize);

function setupPlayers() {
    const numPlayers = document.getElementById('numPlayers').value;
    const playerInputs = document.getElementById('playerInputs');
    playerInputs.innerHTML = '';

    for (let i = 1; i <= numPlayers; i++) {
        playerInputs.innerHTML += `
            <div>
                <label for="player${i}Name">Player ${i} Name:</label>
                <input type="text" id="player${i}Name" placeholder="Player ${i}">
                <label for="player${i}Symbol">Symbol:</label>
                <input type="text" id="player${i}Symbol" maxlength="1" value="${i === 1 ? 'X' : (i === 2 ? 'O' : (i === 3 ? 'Z' : 'A'))}">
            </div>
        `;
    }
}

document.getElementById('numPlayers').addEventListener('change', setupPlayers);
setupPlayers();

startGameButton.addEventListener('click', () => {
    const numPlayers = document.getElementById('numPlayers').value;
    players = [];

    for (let i = 1; i <= numPlayers; i++) {
        const name = document.getElementById(`player${i}Name`).value || `Player ${i}`;
        const symbol = document.getElementById(`player${i}Symbol`).value || (i === 1 ? 'X' : (i === 2 ? 'O' : (i === 3 ? 'Z' : 'A')));
        players.push({ name, symbol });
    }

    gridSize = numPlayers === 2 ? 3 : 4;
    gameState = Array(gridSize * gridSize).fill("");
    winningConditions = generateWinningConditions(gridSize);

    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;
    gameBoard.innerHTML = '';
    for (let i = 0; i < gameState.length; i++) {
        gameBoard.innerHTML += `<div class="cell" data-index="${i}"></div>`;
    }

    gameBoard.classList.remove('hidden');
    playerSetup.classList.add('hidden');
    winnerAnnouncement.classList.add('hidden');
    restartButton.classList.remove('hidden');
    gameActive = true;
    currentPlayerIndex = 0;

    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
});

function handleCellClick(event) {
    const cellIndex = event.target.getAttribute('data-index');

    if (gameState[cellIndex] !== "" || !gameActive) {
        return;
    }

    gameState[cellIndex] = players[currentPlayerIndex].symbol;
    event.target.innerText = players[currentPlayerIndex].symbol;

    if (checkWin()) {
        announceWinner(players[currentPlayerIndex]);
        gameActive = false;
    } else if (!gameState.includes("")) {
        announceWinner(null);
    } else {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }
}

function checkWin() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            document.querySelector(`[data-index="${a}"]`).classList.add('win');
            document.querySelector(`[data-index="${b}"]`).classList.add('win');
            document.querySelector(`[data-index="${c}"]`).classList.add('win');
            return true;
        }
    }
    return false;
}

function announceWinner(winner) {
    if (winner) {
        winnerAnnouncement.innerText = `${winner.name} wins with "${winner.symbol}"!`;
    } else {
        winnerAnnouncement.innerText = "It's a draw!";
    }
    winnerAnnouncement.classList.remove('hidden');
}

restartButton.addEventListener('click', () => {
    gameBoard.classList.add('hidden');
    playerSetup.classList.remove('hidden');
    winnerAnnouncement.classList.add('hidden');
    restartButton.classList.add('hidden');
});
