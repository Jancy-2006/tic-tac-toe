// ========================================
// TIC TAC TOE GAME
// ========================================


// Game variables

let board = Array(9).fill(null);

let currentPlayer = "X";

let gameOver = false;


// Score variables

let stats = {
    X: 0,
    O: 0,
    draws: 0
};


// Get HTML elements

const cells = document.querySelectorAll(".cell");

const messageEl = document.getElementById("message");

const scoreX = document.getElementById("scoreX");

const scoreO = document.getElementById("scoreO");

const scoreDraws = document.getElementById("scoreDraws");

const rematchBtn = document.getElementById("rematchBtn");

const resetBtn = document.getElementById("resetBtn");


// Winning combinations

const winningCombinations = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];


// ========================================
// CELL CLICK
// ========================================

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index = Number(cell.dataset.index);

        handleClick(index);

    });

});


// ========================================
// HANDLE PLAYER MOVE
// ========================================

function handleClick(index) {

    // Don't allow moves after game ends

    if (gameOver) {
        return;
    }


    // Don't allow already occupied cells

    if (board[index] !== null) {
        return;
    }


    // Put X or O on board

    board[index] = currentPlayer;

    cells[index].textContent = currentPlayer;

    cells[index].classList.add("disabled");


    // Check winner

    const winningLine = checkWinner();


    if (winningLine) {

        gameOver = true;

        highlightCells(winningLine);

        updateStats(currentPlayer);

        messageEl.textContent =
            `Player ${currentPlayer} wins!`;

        return;
    }


    // Check draw

    if (board.every(cell => cell !== null)) {

        gameOver = true;

        updateStats("draw");

        messageEl.textContent =
            "It's a draw!";

        return;
    }


    // Change player

    currentPlayer =
        currentPlayer === "X" ? "O" : "X";


    updateMessage();


    // Check if AI mode

    const selectedMode =
        document.querySelector(
            'input[name="mode"]:checked'
        ).value;


    // If AI's turn

    if (
        selectedMode === "pve" &&
        currentPlayer === "O" &&
        !gameOver
    ) {

        setTimeout(aiMove, 500);

    }

}


// ========================================
// CHECK WINNER
// ========================================

function checkWinner() {

    for (const combination of winningCombinations) {

        const [a, b, c] = combination;


        if (
            board[a] !== null &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return combination;

        }

    }


    return null;
}


// ========================================
// HIGHLIGHT WINNING CELLS
// ========================================

function highlightCells(winningLine) {

    winningLine.forEach(index => {

        const cell =
            document.querySelector(
                `.cell[data-index="${index}"]`
            );


        if (cell) {

            cell.classList.add("winning-cell");

        }

    });

}


// ========================================
// AI MOVE
// ========================================

function aiMove() {

    if (gameOver) {
        return;
    }


    // Find empty cells

    const emptyCells = board
        .map((value, index) => {

            if (value === null) {
                return index;
            }

            return null;

        })
        .filter(value => value !== null);


    if (emptyCells.length === 0) {
        return;
    }


    // Random AI move

    const randomIndex =
        Math.floor(
            Math.random() * emptyCells.length
        );


    const choice =
        emptyCells[randomIndex];


    handleClick(choice);

}


// ========================================
// REMATCH
// ========================================

function rematchGame() {

    // Clear board

    board = Array(9).fill(null);


    // X always starts

    currentPlayer = "X";


    // Game is active

    gameOver = false;


    // Clear screen

    clearUI();


    // Update message

    updateMessage();

}


// ========================================
// RESET GAME
// ========================================

function resetGame() {

    // Start new game

    rematchGame();


    // Reset scores

    stats = {
        X: 0,
        O: 0,
        draws: 0
    };


    // Display scores

    renderStats();

}


// ========================================
// CLEAR BOARD UI
// ========================================

function clearUI() {

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "disabled",
            "winning-cell"
        );

    });

}


// ========================================
// UPDATE SCORE
// ========================================

function updateStats(result) {

    if (result === "X") {

        stats.X++;

    }

    else if (result === "O") {

        stats.O++;

    }

    else if (result === "draw") {

        stats.draws++;

    }


    renderStats();

}


// ========================================
// DISPLAY SCORE
// ========================================

function renderStats() {

    scoreX.textContent = stats.X;

    scoreO.textContent = stats.O;

    scoreDraws.textContent = stats.draws;

}


// ========================================
// UPDATE TURN MESSAGE
// ========================================

function updateMessage() {

    if (gameOver) {
        return;
    }


    messageEl.textContent =
        `Player ${currentPlayer}'s turn`;

}


// ========================================
// GAME MODE CHANGE
// ========================================

document
    .querySelectorAll('input[name="mode"]')
    .forEach(radio => {

        radio.addEventListener("change", () => {

            rematchGame();

        });

    });


// ========================================
// BUTTON EVENTS
// ========================================

rematchBtn.addEventListener(
    "click",
    rematchGame
);


resetBtn.addEventListener(
    "click",
    resetGame
);


// ========================================
// START GAME
// ========================================

renderStats();

updateMessage();


// ========================================
// DEBUGGING
// ========================================

window._ttt = {

    getState: () => ({

        board,

        currentPlayer,

        gameOver,

        stats

    })

};