const gridContainer = document.getElementById('grid-container');
const numRows = 10;
const numCols = 10;
const colors = ['#FFB6C1', '#ADD8E6', '#90EE90', '#FFD700', '#FF69B4', '#FFA07A', '#20B2AA', '#9370DB', '#F08080', '#778899'];

// Initialisation des zones de couleur
const zones = Array.from({ length: numRows }, () => Array(numCols).fill(null));
const zoneShapes = [
    { shape: [[1, 1, 1], [1, 0, 0], [1, 0, 0]], color: colors[0] },
    { shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], color: colors[1] },
    { shape: [[1, 1, 0], [0, 1, 1]], color: colors[2] },
    { shape: [[1, 1, 1], [1, 0, 1]], color: colors[3] },
    { shape: [[1, 0, 0], [1, 1, 1]], color: colors[4] },
    { shape: [[0, 1, 0], [1, 1, 1]], color: colors[5] },
    { shape: [[1, 1], [1, 1]], color: colors[6] },
    { shape: [[0, 1, 1], [1, 1, 0]], color: colors[7] },
    { shape: [[1, 0, 0], [1, 1, 1]], color: colors[8] },
    { shape: [[1, 1, 1], [0, 1, 0]], color: colors[9] }
];

function placeZones() {
    let startRow = 0;
    let startCol = 0;
    zoneShapes.forEach((zone, index) => {
        for (let i = 0; i < zone.shape.length; i++) {
            for (let j = 0; j < zone.shape[i].length; j++) {
                if (zone.shape[i][j] === 1) {
                    zones[startRow + i][startCol + j] = index;
                }
            }
        }
        startCol += 3;
        if (startCol >= numCols) {
            startCol = 0;
            startRow += 3;
        }
    });
}

// Initialisation de la grille
function initializeGrid() {
    placeZones();
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.dataset.status = 'empty';
            cell.style.backgroundColor = zones[i][j] !== null ? zoneShapes[zones[i][j]].color : 'white';
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
    } else if (status === 'queen') {
        cell.dataset.status = 'empty';
        cell.classList.remove('queen');
        cell.innerText = '';
    }

    checkVictory();
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

// Vérification des conditions de victoire
function checkVictory() {
    const rows = Array(numRows).fill(0);
    const cols = Array(numCols).fill(0);
    const zoneCount = Array(zoneShapes.length).fill(0);

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        if (cell.dataset.status === 'queen') {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            rows[row]++;
            cols[col]++;
            const zone = zones[row][col];
            if (zone !== null) {
                zoneCount[zone]++;
            }
        }
    });

    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const zone = zones[row][col];
        if (cell.dataset.status === 'queen' && (rows[row] > 1 || cols[col] > 1 || (zone !== null && zoneCount[zone] > 1))) {
            cell.style.backgroundColor = 'red';
            cell.style.textDecoration = 'line-through';
        } else if (zone !== null) {
            cell.style.backgroundColor = zoneShapes[zone].color;
            cell.style.textDecoration = 'none';
        }
    });
}

initializeGrid();
