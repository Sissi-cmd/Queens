const gridContainer = document.getElementById('grid-container');

// Initialisation de la grille
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.dataset.status = 'empty';
        cell.addEventListener('click', handleCellClick);
        gridContainer.appendChild(cell);
    }
}

function handleCellClick(event) {
    const cell = event.target;
    const status = cell.dataset.status;

    if (status === 'empty') {
        cell.dataset.status = 'x';
        cell.classList.add('x');
        cell.innerText = 'X';
    } else if (status === 'x') {
        cell.dataset.status = 'queen';
        cell.classList.remove('x');
        cell.classList.add('queen');
        cell.innerText = '👸';
    } else {
        cell.dataset.status = 'empty';
        cell.classList.remove('queen');
        cell.innerText = '';
    }
}

// Vérification des conditions de victoire
function checkVictory() {
    // Ajoutez ici les vérifications pour déterminer si le joueur a gagné
}
