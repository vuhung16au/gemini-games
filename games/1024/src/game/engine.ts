import {
  GRID_SIZE,
  MAX_UNDO_HISTORY,
  SPAWN_TWO_PROBABILITY,
  STARTING_TILES,
  TARGET_TILE,
} from './constants';
import type {
  Direction,
  GameState,
  GameStatus,
  HistoryEntry,
  MoveResult,
  Tile,
} from './types';

function stripTileFlags(tile: Tile): Tile {
  return {
    id: tile.id,
    value: tile.value,
    row: tile.row,
    col: tile.col,
  };
}

/** Return all unoccupied board coordinates. */
export function getEmptyCells(
  tiles: Tile[],
): Array<{ row: number; col: number }> {
  const occupied = new Set<string>();
  for (const tile of tiles) {
    occupied.add(`${tile.row},${tile.col}`);
  }

  const empty: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!occupied.has(`${row},${col}`)) {
        empty.push({ row, col });
      }
    }
  }
  return empty;
}

/** Spawn a random 1 (90%) or 2 (10%) tile in an empty cell. */
export function spawnRandomTile(
  tiles: Tile[],
  nextTileId: number,
  rng: () => number = Math.random,
): { tile: Tile | null; nextTileId: number } {
  const empty = getEmptyCells(tiles);
  if (empty.length === 0) {
    return { tile: null, nextTileId };
  }

  const cellIndex = Math.min(
    empty.length - 1,
    Math.floor(rng() * empty.length),
  );
  const cell = empty[cellIndex];
  const value = rng() < SPAWN_TWO_PROBABILITY ? 2 : 1;

  return {
    tile: {
      id: nextTileId,
      value,
      row: cell.row,
      col: cell.col,
      isNew: true,
    },
    nextTileId: nextTileId + 1,
  };
}

/** Check whether any move (empty space or adjacent matching pair) remains. */
export function hasAvailableMoves(tiles: Tile[]): boolean {
  if (tiles.length < GRID_SIZE * GRID_SIZE) {
    return true;
  }

  const grid: number[][] = Array.from({ length: GRID_SIZE }, () =>
    Array<number>(GRID_SIZE).fill(0),
  );
  for (const tile of tiles) {
    grid[tile.row][tile.col] = tile.value;
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const val = grid[r][c];
      if (r + 1 < GRID_SIZE && grid[r + 1][c] === val) return true;
      if (c + 1 < GRID_SIZE && grid[r][c + 1] === val) return true;
    }
  }

  return false;
}

/** Create a fresh initial game state with 2 starting tiles. */
export function createInitialState(
  bestScore = 0,
  rng: () => number = Math.random,
): GameState {
  const tiles: Tile[] = [];
  let nextTileId = 1;

  for (let i = 0; i < STARTING_TILES; i++) {
    const spawned = spawnRandomTile(tiles, nextTileId, rng);
    if (spawned.tile) {
      tiles.push(spawned.tile);
      nextTileId = spawned.nextTileId;
    }
  }

  return {
    tiles,
    score: 0,
    bestScore,
    lastScoreDelta: 0,
    moveCount: 0,
    status: 'PLAYING',
    hasWon: false,
    nextTileId,
    history: [],
  };
}

function getLineCoordinate(
  direction: Direction,
  lineIndex: number,
  slotIndex: number,
): { row: number; col: number } {
  switch (direction) {
    case 'left':
      return { row: lineIndex, col: slotIndex };
    case 'right':
      return { row: lineIndex, col: GRID_SIZE - 1 - slotIndex };
    case 'up':
      return { row: slotIndex, col: lineIndex };
    case 'down':
      return { row: GRID_SIZE - 1 - slotIndex, col: lineIndex };
  }
}

/** Slide and merge tiles in the requested direction. */
export function move(
  state: GameState,
  direction: Direction,
  rng: () => number = Math.random,
): MoveResult {
  if (state.status !== 'PLAYING') {
    return {
      state,
      moved: false,
      merged: false,
      wonNow: false,
      gameOverNow: false,
      scoreGained: 0,
    };
  }

  const isHorizontal = direction === 'left' || direction === 'right';
  const nextTiles: Tile[] = [];
  let nextTileId = state.nextTileId;
  let scoreGained = 0;
  let moved = false;
  let merged = false;

  for (let line = 0; line < GRID_SIZE; line++) {
    const lineTiles = state.tiles
      .filter((t) => (isHorizontal ? t.row === line : t.col === line))
      .sort((a, b) => {
        switch (direction) {
          case 'left':
            return a.col - b.col;
          case 'right':
            return b.col - a.col;
          case 'up':
            return a.row - b.row;
          case 'down':
            return b.row - a.row;
        }
      });

    let i = 0;
    let slot = 0;

    while (i < lineTiles.length) {
      const dest = getLineCoordinate(direction, line, slot);
      const current = lineTiles[i];
      const next = i + 1 < lineTiles.length ? lineTiles[i + 1] : null;

      if (next && current.value === next.value) {
        const mergedValue = current.value * 2;
        scoreGained += mergedValue;
        moved = true;
        merged = true;

        nextTiles.push({
          id: nextTileId++,
          value: mergedValue,
          row: dest.row,
          col: dest.col,
          isMerged: true,
          mergedFrom: [
            { ...stripTileFlags(current), row: dest.row, col: dest.col },
            { ...stripTileFlags(next), row: dest.row, col: dest.col },
          ],
        });

        i += 2;
        slot += 1;
      } else {
        if (current.row !== dest.row || current.col !== dest.col) {
          moved = true;
        }
        nextTiles.push({
          id: current.id,
          value: current.value,
          row: dest.row,
          col: dest.col,
        });
        i += 1;
        slot += 1;
      }
    }
  }

  if (!moved) {
    return {
      state,
      moved: false,
      merged: false,
      wonNow: false,
      gameOverNow: false,
      scoreGained: 0,
    };
  }

  const historySnapshot: HistoryEntry = {
    tiles: state.tiles.map(stripTileFlags),
    score: state.score,
    status: state.status,
    hasWon: state.hasWon,
  };
  const nextHistory = [...state.history, historySnapshot].slice(
    -MAX_UNDO_HISTORY,
  );

  const spawned = spawnRandomTile(nextTiles, nextTileId, rng);
  if (spawned.tile) {
    nextTiles.push(spawned.tile);
    nextTileId = spawned.nextTileId;
  }

  const nextScore = state.score + scoreGained;
  const nextBestScore = Math.max(state.bestScore, nextScore);

  let nextStatus: GameStatus = state.status;
  let nextHasWon = state.hasWon;
  let wonNow = false;
  let gameOverNow = false;

  if (!state.hasWon && nextTiles.some((t) => t.value >= TARGET_TILE)) {
    nextHasWon = true;
    nextStatus = 'WON';
    wonNow = true;
  } else if (!hasAvailableMoves(nextTiles)) {
    nextStatus = 'GAME_OVER';
    gameOverNow = true;
  }

  const nextState: GameState = {
    tiles: nextTiles,
    score: nextScore,
    bestScore: nextBestScore,
    lastScoreDelta: scoreGained,
    moveCount: state.moveCount + 1,
    status: nextStatus,
    hasWon: nextHasWon,
    nextTileId,
    history: nextHistory,
  };

  return {
    state: nextState,
    moved: true,
    merged,
    wonNow,
    gameOverNow,
    scoreGained,
  };
}

/** Resume playing after reaching the 1024 target tile. */
export function keepGoing(state: GameState): GameState {
  if (state.status !== 'WON') {
    return state;
  }

  return {
    ...state,
    status: hasAvailableMoves(state.tiles) ? 'PLAYING' : 'GAME_OVER',
    hasWon: true,
  };
}

/** Restore the most recent move snapshot while keeping bestScore and nextTileId. */
export function undo(state: GameState): GameState {
  if (state.history.length === 0) {
    return state;
  }

  const previous = state.history[state.history.length - 1];
  return {
    ...state,
    tiles: previous.tiles.map(stripTileFlags),
    score: previous.score,
    lastScoreDelta: 0,
    status: 'PLAYING',
    hasWon: previous.hasWon,
    history: state.history.slice(0, -1),
  };
}
