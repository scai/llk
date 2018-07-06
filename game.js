const gameState = {
  selectedTile: null,
  highlight: null,
  fpsLabel: null,
  paused: false,
  board: [],
  tiles: [],
  shouldUpdateBoard: false,
};

const TILE_W = 50;
const ROWS = 10;
const COLS = 10;

const main = () => {
  const board = document.getElementById('board');
  gameState.fpsLabel = document.getElementById('fps');
  for (let col = 0; col < COLS; col++) {
    gameState.board[col] = [];
    for (let row = 0; row < ROWS; row++) {
      const tile = document.createElement('tile');
      const face = Math.round(1 + Math.random() * 5);
      tile.dataset.face = face;
      moveTileTo(tile, row, col);
      board.append(tile);
      tile.addEventListener('click', onTileClick);

      gameState.tiles.push(tile);
      gameState.board[col][row] = tile;
    }
  }
  gameState.highlight = document.getElementById('highlight');
  window.addEventListener('keypress', (event) => {
    if (event.key === 'p') {
      gameState.paused = !gameState.paused;
      document.getElementById('pause').style.display =
          gameState.paused ? 'block' : 'none';
    }
  });
  window.requestAnimationFrame((t) => {
    onAnimationFrame(t, 0);
  });
  selectTile(gameState.board[3][5]);
};

const selectTile = (tile) => {
  const prevTile = gameState.selectedTile;
  gameState.selectedTile = tile;
  tile.classList.add('selected');

  if (!prevTile) {
    moveTileTo(gameState.highlight, tile.dataset.row, tile.dataset.col);
    return;
  }
  prevTile.classList.remove('selected');

  const highlightTarget = swap(prevTile, tile) ? prevTile : tile;
  moveTileTo(
      gameState.highlight, highlightTarget.dataset.row,
      highlightTarget.dataset.col);
  gameState.shouldUpdateBoard = true;
};

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
//     console.log(
//         'Selected: ' + row + '-' + col +
//         '. Swap with: ' + prevTile.dataset.row + '-' + prevTile.dataset.col);
    moveTileTo(currTile, prevTile.dataset.row, prevTile.dataset.col);
    moveTileTo(prevTile, row, col);
    gameState.selectedTile = prevTile;
  }
  return canSwap;
};

const updateBoard = () => {
  gameState.tiles.forEach((tile) => {
    gameState.board[tile.dataset.col][tile.dataset.row] = tile;
  });

  const checkSameColorTilesQueue = (queue) => {
    if (queue.length > 2) {
      // mark tiles to break
      queue.forEach((tile) => {
        tile.dataset.break = true;  
      });
    }
  }

  // check same color in a row
  for(let col = 0; col < COLS; col++) {
    let sameColorTiles = [gameState.board[col][0]];
    // check row
    for(let row = 1; row < ROWS ; row++) {
      const tile = gameState.board[col][row];

      if (sameColorTiles[0].dataset.face == tile.dataset.face) {
        sameColorTiles.push(tile);
        continue;
      }

      checkSameColorTilesQueue(sameColorTiles);

      // reset same color queue
      sameColorTiles = [tile];
    }
    checkSameColorTilesQueue(sameColorTiles);
  }

  // check same color in a column
  for(let row = 0; row < ROWS; row++) {
    let sameColorTiles = [gameState.board[0][row]];
    // check row
    for(let col = 1; col < COLS ; col++) {
      const tile = gameState.board[col][row];

      if (sameColorTiles[0].dataset.face == tile.dataset.face) {
        sameColorTiles.push(tile);
        continue;
      }
      
      checkSameColorTilesQueue(sameColorTiles);

      // reset same color queue
      sameColorTiles = [tile];
    }
    checkSameColorTilesQueue(sameColorTiles);
  }
}

const moveTileTo = (tile, row, col) => {
  tile.dataset.row = row;
  tile.dataset.col = col;
  tile.style.top = row * TILE_W + 'px';
  tile.style.left = col * TILE_W + 'px';
};

const onTileClick = (event) => {
  selectTile(event.target);
};

const blinkTile = () => {

};

const onAnimationFrame = (timestamp, last_ts) => {
  const ms_elapsed = timestamp - last_ts;
  render(ms_elapsed);
  window.requestAnimationFrame((t) => {
    onAnimationFrame(t, timestamp);
  });
};

const render = (ms_elapsed) => {
  if (!gameState.paused) {
    gameState.fpsLabel.innerText = Math.round(1000 / ms_elapsed);
  }
  if (gameState.shouldUpdateBoard) {
    gameState.shouldUpdateBoard = false;
    updateBoard();
  }
};

window.addEventListener('load', main);
