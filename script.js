const gridContainer = document.getElementById('grid-container');
const gridSizeSelect = document.getElementById('grid-size');
const startGameButton = document.getElementById('start-game');

const colors = ['#FFB6C1', '#ADD8E6', '#90EE90', '#FFD700', '#FF69B4', '#FFA07A', '#20B2AA', '#9370DB', '#F08080', '#778899'];
let numRows, numCols, grid, zones;

const levels = [
    { gridSize: 4, numQueens: 4 },
    { gridSize: 5, numQueens: 5 },
    { gridSize: 6, numQueens: 6 },
    { gridSize: 7, numQueens: 7 },
    { gridSize: 8, numQueens: 8 },
    { gridSize: 9, numQueens: 9 },
    { gridSize: 10, numQueens: 10 }
];

let currentLevel = 0;

startGameButton.addEventListener('click', startGame);

function startGame() {
    numRows = levels[currentLevel].gridSize;
    numCols = numRows;
    grid = Array.from({ length: numRows }, () => Array(numCols).fill(null));
    zones = generateZones(numRows, numCols);
    initializeGrid();
}

function generateZones(rows, cols) {
    const zones = Array.from({ length: rows }, () => Array(cols).fill(null));
    let zoneIndex = 0;

    const zoneShapes = [
        { shape: [[1]], color: colors[0] },
        { shape: [[1, 1]], color: colors[1] },
        { shape: [[1, 1, 1]], color: colors[2] },
        { shape: [[1, 0], [1, 1]], color: colors[3] },
        { shape: [[1, 0, 0], [1, 1, 1]], color: colors[4] },
        { shape: [[1, 0, 0, 0], [1, 1, 1, 1]], color: colors[5] },
        { shape: [[1, 1], [1, 1]], color: colors[6] },
        { shape: [[1, 1, 0], [0, 1, 1]], color: colors[7] },
        { shape: [[1, 1, 1]], color: colors[8] },
        { shape: [[1, 1, 1], [0, 1, 0]], color: colors[9] }
    ];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            zones[row][col] = zoneIndex;
            zoneIndex = (zoneIndex + 1) % zoneShapes.length;
        }
    }

    return zones;
}

function initializeGrid() {
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.dataset.status = 'empty';
            cell.style.backgroundColor = zones[row][col] !== null ? colors[zones[row][col]] : 'white';
            cell.addEventListener('click', handleCellClick);
            gridContainer.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const cell = event.target;
    const status = cell.dataset.status;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (status === 'empty' && isValidPlacement(row, col)) {
        cell.dataset.status = 'queen';
        cell.classList.add('queen');
        cell.innerText = '👸';
        placeAutomaticCrosses(row, col);
    } else if (status === 'queen') {
        cell.dataset.status = 'empty';
        cell.classList.remove('queen');
        cell.innerText = '';
    }

    checkVictory();
}

function placeAutomaticCrosses(row, col) {
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    directions.forEach(([dx, dy]) => {
        let newRow = row + dx;
        let newCol = col + dy;

        while (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
            const adjacentCell = gridContainer.querySelector(`[data-row='${newRow}'][data-col='${newCol}']`);
            if (adjacentCell && adjacentCell.dataset.status === 'empty') {
                adjacentCell.dataset.status = 'x';
                adjacentCell.classList.add('x');
                adjacentCell.innerText = 'X';
            }
            newRow += dx;
            newCol += dy;
        }
    });
}

function isValidPlacement(row, col) {
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
            const adjacentCell = gridContainer.querySelector(`[data-row='${newRow}'][data-col='${newCol}']`);
            if (adjacentCell && adjacentCell.dataset.status === 'queen') {
                return false;
            }
        }
    }
    return true;
}

function checkVictory() {
    // Logique pour vérifier si le joueur a gagné
    // À implémenter selon vos critères de victoire
}

// Fonction pour passer au niveau suivant
function nextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        startGame();
    } else {
        alert('Félicitations, vous avez complété tous les niveaux !');
    }
}

// Initialisation de la grille au chargement de la page
startGame();
