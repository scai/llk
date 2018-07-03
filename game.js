const gameState = {
  selectedTile: null,
  highlight:null,
  fpsLabel:null,
  paused:false
};

const TILE_W = 50;

const main = () => {
    const board = document.getElementById('board');
    gameState.fpsLabel = document.getElementById('fps');
    for (let col = 0; col < 10; col++) {
        for (let row = 0; row <10; row++) {
            const tile = document.createElement('tile');
            tile.id = ['tile', col, row].join('-');
            moveTileTo(tile, row, col);
            const classname = 'type-' + Math.round(1 + Math.random() * 5);
            tile.classList.add(classname);
            board.append(tile);
            tile.addEventListener('click', onTileClick);
        }
    }
    gameState.highlight = document.getElementById('highlight');
    window.addEventListener('keypress', (event)=>{
        if (event.key === 'p') {
            gameState.paused = !gameState.paused;
            document.getElementById("pause").style.display =
                gameState.paused ? 'block' : 'none';
        }
    });
    window.requestAnimationFrame((t)=>{onAnimationFrame(t, 0);});
    selectTile(document.getElementById('tile-5-5'));
};

const selectTile = (tile) => {
    const prevTile = gameState.selectedTile;
    gameState.selectedTile = tile;
    if (!prevTile) {
        return;
    }
    prevTile.classList.remove('selected');
    tile.classList.add('selected');

    const highlightTarget = swap(prevTile, tile) ? prevTile : tile;
    moveTileTo(gameState.highlight,
               highlightTarget.dataset.row,
               highlightTarget.dataset.col);
}

const swap = (prevTile, currTile) => {
    let canSwap = false;
    if (prevTile.dataset.col == currTile.dataset.col) {
        // same column
        if (Math.abs(prevTile.dataset.row - currTile.dataset.row) == 1) {
            canSwap = true;
        }
    } else if (prevTile.dataset.row == currTile.dataset.row) {
        // same row
        if (Math.abs(prevTile.dataset.col - currTile.dataset.col) == 1) {
            canSwap = true;
        }
    }
    if (canSwap) {
        const row = currTile.dataset.row;
        const col = currTile.dataset.col;
        console.log("Selected: " + row + "-" + col + ". Swap with: " + prevTile.dataset.row + "-" + prevTile.dataset.col);
        moveTileTo(currTile, prevTile.dataset.row, prevTile.dataset.col);
        moveTileTo(prevTile, row, col);
        gameState.selectedTile = prevTile;
    }
    return canSwap;
}

const moveTileTo = (tile, row, col) => {
    tile.dataset.row = row;
    tile.dataset.col = col;
    tile.style.top = row * TILE_W + 'px';
    tile.style.left = col * TILE_W + 'px';
}

const onTileClick = (event) => {
    selectTile(event.target);
};

const blinkTile = () => {

}

const onAnimationFrame = (timestamp, last_ts) => {
    const ms_elapsed = timestamp - last_ts;
    render(ms_elapsed);
    window.requestAnimationFrame((t)=>{
        onAnimationFrame(t, timestamp);
    });
}

const render = (ms_elapsed) => {
    if (!gameState.paused) {
        gameState.fpsLabel.innerText = Math.round(1000/ms_elapsed);
    }
}

window.addEventListener("load", main);