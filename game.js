const boardsize = 10;
const minecount = 2;
let amountFlagged = 0;
let gameStarted = false;
let timerInterval = null;
let startTime = null;
const boardElement = document.getElementById("board");

let board = [];

function createBoard() {
    amountFlagged = 0;
    board = [];
    clearInterval(timerInterval);
    timerInterval = null;
    startTime = null;
    updateTimerDisplay(0);
    gameStarted = false; // Reset game state
    boardElement.innerHTML = ""; // Clear the board
    boardElement.style.gridTemplateColumns = `repeat(${boardsize}, 1fr)`;
    for (let y = 0; y < boardsize; y++) {
        for (let x = 0; x < boardsize; x++) {
            const cell = {
                x: x,
                y: y,
                mine: false,
                revealed: false,
                element: document.createElement("div"),
                neighborMines: 0,
            };

            cell.element.classList.add("cell");
            cell.element.dataset.x = x;
            cell.element.dataset.y = y;

            cell.element.addEventListener("click", () => handleCellClick(cell));
            cell.element.addEventListener("contextmenu", (event) => {
                event.preventDefault(); // Prevent the context menu from appearing
                handleRightClick(cell);
            });
            boardElement.appendChild(cell.element);
            board.push(cell);
        }
    }

    updateMinesLeft();
}

function placeMines(firstClickX, firstClickY) {
    let placedMines = 0;
    while (placedMines < minecount) {
        const randomIndex = Math.floor(Math.random() * board.length);
        const cell = board[randomIndex];
        // Skip if already a mine
        if (cell.mine) continue;

        // Skip the first clicked cell and its neighbors
        const dx = Math.abs(cell.x - firstClickX);
        const dy = Math.abs(cell.y - firstClickY);
        if (dx <= 1 && dy <= 1) continue;

        cell.mine = true;
        placedMines++;
    }
}

function getNeighbors(cell) {
    const neighbors = [];
    for (let y = cell.y - 1; y <= cell.y + 1; y++) {
        for (let x = cell.x - 1; x <= cell.x + 1; x++) {
            if (x === cell.x && y === cell.y) continue; // Skip the cell itself
            const neighbor = board.find(c => c.x === x && c.y === y);
            if (neighbor) neighbors.push(neighbor);
        }
    }
    return neighbors;
}

function calculateNeighborMines() {
    board.forEach(cell => {
        if (cell.mine) return;
        const neighbors = getNeighbors(cell);
        cell.neighborMines = neighbors.filter(n => n.mine).length;
    });
}

function handleCellClick(cell) {
    if (!gameStarted) {
        placeMines(cell.x, cell.y); // Place mines only once when the first cell is clicked
        calculateNeighborMines();
        gameStarted = true; // Set the game as started
        // Start timer:
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedMs = Date.now() - startTime;
            updateTimerDisplay(elapsedMs);
        }, 50);  // update every 50ms for smooth display
    }
    if (cell.revealed || cell.flagged) return; // Ignore if already revealed
    cell.flagged = false; // Unflag the cell if it was flagged
    cell.revealed = true; // Mark the cell as revealed
    cell.element.classList.add("revealed");
    if (cell.neighborMines > 0) {
        cell.element.textContent = cell.neighborMines;
    }
    if (cell.mine) {
        clearInterval(timerInterval);

        cell.element.classList.add("mine");
        alert("Game Over! You clicked on a mine.");
        // reveal all mines
        board.forEach(c => {
            if (c.mine) {
                c.element.classList.add("mine");
            }
            c.flagged = false; // Unflag all cells
            c.revealed = true; // Mark all cells as revealed
        });
        return;
    }

    if (cell.neighborMines === 0) {
        const neighbors = getNeighbors(cell);
        neighbors.forEach(n => handleCellClick(n));
    }

}

function handleRightClick(cell) {
    if (cell.revealed) return; // Ignore if the cell is already revealed
    cell.flagged = !cell. flagged; // Toggle flagged state
    if (cell.flagged) {
        cell.element.classList.add("flagged");
        cell.element.textContent = "🚩"; // Show flag emoji
        
    }
    else {
        cell.element.classList.remove("flagged");
        cell.element.textContent = ""; // Clear the flag
    }
    updateMinesLeft();
    checkWin(); // Check for win condition after flagging
}
function updateMinesLeft() {
    const flaggedCount = board.filter(cell => cell.flagged).length;
    const minesLeft = minecount - flaggedCount;
    const minesLeftElement = document.getElementById("mines-left");
    minesLeftElement.textContent = `Mines left: ${minesLeft}`;
}

function checkWin() {
    const allRevealed = board.every(cell => cell.revealed || cell.mine);
    const allMinesFlagged = board.filter(cell => cell.mine).every(cell => cell.flagged);
    if (allRevealed || allMinesFlagged) {
        clearInterval(timerInterval);
        alert("Congratulations! You've cleared the minefield!");
    }
    
}
function updateTimerDisplay(elapsedMs) {
    const timerElement = document.getElementById("timer");
    // Convert ms to seconds with 3 decimals:
    const seconds = (elapsedMs / 1000).toFixed(3);
    timerElement.textContent = `Time: ${seconds}s`;
}
document.addEventListener("DOMContentLoaded", () => {
  createBoard();
});
const resetBtn = document.getElementById("reset-button");
resetBtn.addEventListener("click", () => {
  resetGame();
});
function resetGame() {
  gameStarted = false;
  board = [];
  
  // Stop timer if running
  clearInterval(timerInterval);
  timerInterval = null;
  startTime = null;
  updateTimerDisplay(0);

  createBoard();
  updateMinesLeft();
}
