import { PRESET_CONFIGS, clampCustomConfig } from './constants';
import type { BoardConfig, MineCell, MinesweeperState } from './types';

export function indexOf(row: number, col: number, cols: number): number {
  return row * cols + col;
}

export function getNeighbors(
  row: number,
  col: number,
  rows: number,
  cols: number,
): Array<{ row: number; col: number }> {
  const out: Array<{ row: number; col: number }> = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        out.push({ row: nr, col: nc });
      }
    }
  }
  return out;
}

export function createMinesweeperState(
  config: BoardConfig = PRESET_CONFIGS.easy,
  options?: { isTutorial?: boolean },
): MinesweeperState {
  const normalized =
    config.difficulty === 'custom'
      ? clampCustomConfig(config.rows, config.cols, config.mines)
      : PRESET_CONFIGS[config.difficulty];

  const cells: MineCell[] = [];
  for (let r = 0; r < normalized.rows; r++) {
    for (let c = 0; c < normalized.cols; c++) {
      cells.push({
        row: r,
        col: c,
        hasMine: false,
        adjacentMines: 0,
        revealed: false,
        flagged: false,
        exploded: false,
      });
    }
  }

  return {
    config: normalized,
    status: 'idle',
    cells,
    minesPlaced: false,
    flagsCount: 0,
    revealedSafeCount: 0,
    totalSafeCells: normalized.rows * normalized.cols - normalized.mines,
    elapsedSeconds: 0,
    movesCount: 0,
    chordCount: 0,
    isTutorial: Boolean(options?.isTutorial),
  };
}

function placeMinesSafely(
  cells: MineCell[],
  rows: number,
  cols: number,
  mines: number,
  safeRow: number,
  safeCol: number,
  rng: () => number,
): void {
  const safeSet = new Set<number>();
  safeSet.add(indexOf(safeRow, safeCol, cols));
  for (const n of getNeighbors(safeRow, safeCol, rows, cols)) {
    safeSet.add(indexOf(n.row, n.col, cols));
  }

  const candidates: number[] = [];
  for (let i = 0; i < cells.length; i++) {
    if (!safeSet.has(i)) candidates.push(i);
  }

  // Fisher-Yates partial shuffle
  const count = Math.min(mines, candidates.length);
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(rng() * (candidates.length - i));
    const tmp = candidates[i];
    candidates[i] = candidates[j];
    candidates[j] = tmp;
    cells[candidates[i]].hasMine = true;
  }

  // Compute adjacent mine counts
  for (const cell of cells) {
    if (cell.hasMine) continue;
    let adj = 0;
    for (const n of getNeighbors(cell.row, cell.col, rows, cols)) {
      if (cells[indexOf(n.row, n.col, cols)].hasMine) adj++;
    }
    cell.adjacentMines = adj;
  }
}

export function revealCell(
  prev: MinesweeperState,
  row: number,
  col: number,
  rng: () => number = Math.random,
): { state: MinesweeperState; changed: boolean; exploded: boolean; won: boolean } {
  if (prev.status === 'won' || prev.status === 'lost') {
    return { state: prev, changed: false, exploded: false, won: false };
  }

  const { rows, cols, mines } = prev.config;
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    return { state: prev, changed: false, exploded: false, won: false };
  }

  const cells = prev.cells.map((c) => ({ ...c }));
  const targetIdx = indexOf(row, col, cols);
  const target = cells[targetIdx];

  if (target.revealed || target.flagged) {
    return { state: prev, changed: false, exploded: false, won: false };
  }

  let minesPlaced = prev.minesPlaced;
  if (!minesPlaced) {
    placeMinesSafely(cells, rows, cols, mines, row, col, rng);
    minesPlaced = true;
  }

  if (cells[targetIdx].hasMine) {
    cells[targetIdx].revealed = true;
    cells[targetIdx].exploded = true;
    for (const c of cells) {
      if (c.hasMine) c.revealed = true;
    }
    return {
      state: {
        ...prev,
        cells,
        minesPlaced,
        status: 'lost',
        movesCount: prev.movesCount + 1,
      },
      changed: true,
      exploded: true,
      won: false,
    };
  }

  // BFS flood-fill for 0-adjacent cells
  const queue: number[] = [targetIdx];
  let head = 0;
  let newlyRevealed = 0;

  while (head < queue.length) {
    const idx = queue[head++];
    const c = cells[idx];
    if (c.revealed || c.flagged || c.hasMine) continue;
    c.revealed = true;
    newlyRevealed++;

    if (c.adjacentMines === 0) {
      for (const n of getNeighbors(c.row, c.col, rows, cols)) {
        const nIdx = indexOf(n.row, n.col, cols);
        if (!cells[nIdx].revealed && !cells[nIdx].flagged) {
          queue.push(nIdx);
        }
      }
    }
  }

  const revealedSafeCount = prev.revealedSafeCount + newlyRevealed;
  const won = revealedSafeCount >= prev.totalSafeCells;
  if (won) {
    for (const c of cells) {
      if (c.hasMine && !c.flagged) {
        c.flagged = true;
      }
    }
  }

  return {
    state: {
      ...prev,
      cells,
      minesPlaced,
      status: won ? 'won' : 'playing',
      revealedSafeCount,
      flagsCount: won ? prev.config.mines : prev.flagsCount,
      movesCount: prev.movesCount + 1,
    },
    changed: newlyRevealed > 0,
    exploded: false,
    won,
  };
}

export function toggleFlag(
  prev: MinesweeperState,
  row: number,
  col: number,
): { state: MinesweeperState; changed: boolean } {
  if (prev.status === 'won' || prev.status === 'lost') {
    return { state: prev, changed: false };
  }
  const { rows, cols } = prev.config;
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    return { state: prev, changed: false };
  }

  const cells = prev.cells.map((c) => ({ ...c }));
  const target = cells[indexOf(row, col, cols)];
  if (target.revealed) {
    return { state: prev, changed: false };
  }

  target.flagged = !target.flagged;
  return {
    state: {
      ...prev,
      cells,
      flagsCount: prev.flagsCount + (target.flagged ? 1 : -1),
    },
    changed: true,
  };
}

export function chordCell(
  prev: MinesweeperState,
  row: number,
  col: number,
): { state: MinesweeperState; changed: boolean; exploded: boolean; won: boolean } {
  if (prev.status !== 'playing') {
    return { state: prev, changed: false, exploded: false, won: false };
  }
  const { rows, cols } = prev.config;
  const center = prev.cells[indexOf(row, col, cols)];
  if (!center || !center.revealed || center.adjacentMines === 0) {
    return { state: prev, changed: false, exploded: false, won: false };
  }

  const neighbors = getNeighbors(row, col, rows, cols);
  let flagCount = 0;
  for (const n of neighbors) {
    if (prev.cells[indexOf(n.row, n.col, cols)].flagged) flagCount++;
  }

  if (flagCount !== center.adjacentMines) {
    return { state: prev, changed: false, exploded: false, won: false };
  }

  let cur = prev;
  let anyChanged = false;
  for (const n of neighbors) {
    const cell = cur.cells[indexOf(n.row, n.col, cols)];
    if (!cell.revealed && !cell.flagged) {
      const res = revealCell(cur, n.row, n.col);
      cur = res.state;
      anyChanged = anyChanged || res.changed;
      if (res.exploded || res.won) {
        return {
          state: { ...cur, chordCount: prev.chordCount + 1 },
          changed: true,
          exploded: res.exploded,
          won: res.won,
        };
      }
    }
  }

  return {
    state: anyChanged ? { ...cur, chordCount: prev.chordCount + 1 } : prev,
    changed: anyChanged,
    exploded: false,
    won: false,
  };
}
