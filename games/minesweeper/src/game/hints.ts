import { getNeighbors, indexOf } from './engine';
import type { MinesweeperHint, MinesweeperState } from './types';

export function getMinesweeperHint(state: MinesweeperState): MinesweeperHint | null {
  if (state.status === 'won' || state.status === 'lost') return null;

  const { rows, cols } = state.config;
  if (!state.minesPlaced) {
    const cr = Math.floor(rows / 2);
    const cc = Math.floor(cols / 2);
    return {
      row: cr,
      col: cc,
      action: 'reveal',
      message: `Start near the center (${cr + 1}, ${cc + 1}) — your first click is always 100% mine-free!`,
    };
  }

  // Deterministic logical deductions from revealed numbered cells
  for (const cell of state.cells) {
    if (!cell.revealed || cell.adjacentMines === 0) continue;
    const neighbors = getNeighbors(cell.row, cell.col, rows, cols).map(
      (n) => state.cells[indexOf(n.row, n.col, cols)],
    );
    const hiddenUnflagged = neighbors.filter((n) => !n.revealed && !n.flagged);
    const flagged = neighbors.filter((n) => n.flagged);

    if (hiddenUnflagged.length === 0) continue;

    // All adjacent mines are already flagged -> safe to chord/reveal
    if (flagged.length === cell.adjacentMines) {
      const safe = hiddenUnflagged[0];
      return {
        row: safe.row,
        col: safe.col,
        action: 'reveal',
        message: `Cell (${cell.row + 1}, ${cell.col + 1}) has all ${cell.adjacentMines} mine(s) flagged — (${safe.row + 1}, ${safe.col + 1}) is safe to reveal!`,
      };
    }

    // Remaining unflagged neighbors must all be mines
    if (flagged.length + hiddenUnflagged.length === cell.adjacentMines) {
      const mine = hiddenUnflagged[0];
      return {
        row: mine.row,
        col: mine.col,
        action: 'flag',
        message: `All remaining neighbors of (${cell.row + 1}, ${cell.col + 1}) are mines — flag (${mine.row + 1}, ${mine.col + 1})!`,
      };
    }
  }

  // Fallback: suggest a guaranteed safe unrevealed cell
  const safeCell = state.cells.find((c) => !c.revealed && !c.flagged && !c.hasMine);
  if (safeCell) {
    return {
      row: safeCell.row,
      col: safeCell.col,
      action: 'reveal',
      message: `No trivial deduction on the border—try opening (${safeCell.row + 1}, ${safeCell.col + 1}).`,
    };
  }

  return null;
}
