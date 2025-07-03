const boardsize = 10;
const minecount = 10;
const boardElement = document.getElementById("board");

let board = [];

function createBoard() {
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
            boardElement.appendChild(cell.element);
            board.push(cell);
        }
    }
    placeMines();
    calculateNeighborMines();
}

function placeMines() {
    let placedMines = 0;
    while (placedMines < minecount) {
        const randomIndex = Math.floor(Math.random() * board.length);
        const cell = board[randomIndex];
        if (!cell.mine) {
            cell.mine = true;
            placedMines++;
        }
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
    if (cell.revealed || cell.flagged) return; // Ignore if already revealed
    cell.revealed = true;
    cell.element.classList.add("revealed");

    if (cell.mine) {
        cell.element.classList.add("mine");
        alert("Game Over! You clicked on a mine.");
        // reveal all mines

        return;
    }

    if (cell.neighborMines > 0) {
        const neighbors = getNeighbors(cell);
        neighbors.forEach(neighbor => handleCellClick(neighbor));
    }
}
document.addEventListener("DOMContentLoaded", () => {
  createBoard();
});
