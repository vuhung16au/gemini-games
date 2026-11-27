import { BOARD_COLS, BOARD_ROWS } from './constants';
import {
  canPlace,
  cloneBoard,
  getGhostRow,
  getPieceCells,
} from './engine';
import type { BoardGrid, GameState, PlacementHint, Rotation } from './types';

function evaluateSimulatedBoard(board: BoardGrid): number {
  let cleared = 0;
  const remaining: BoardGrid = [];
  for (let r = 0; r < BOARD_ROWS; r++) {
    if (board[r].every((c) => c !== null)) {
      cleared += 1;
    } else {
      remaining.push(board[r]);
    }
  }
  while (remaining.length < BOARD_ROWS) {
    remaining.unshift(Array(BOARD_COLS).fill(null));
  }

  const heights = Array<number>(BOARD_COLS).fill(0);
  let holes = 0;

  for (let c = 0; c < BOARD_COLS; c++) {
    let seenBlock = false;
    for (let r = 0; r < BOARD_ROWS; r++) {
      if (remaining[r][c] !== null) {
        if (!seenBlock) {
          heights[c] = BOARD_ROWS - r;
          seenBlock = true;
        }
      } else if (seenBlock) {
        holes += 1;
      }
    }
  }

  const aggregateHeight = heights.reduce((a, b) => a + b, 0);
  let bumpiness = 0;
  for (let c = 0; c < BOARD_COLS - 1; c++) {
    bumpiness += Math.abs(heights[c] - heights[c + 1]);
  }

  return cleared * 140 - holes * 38 - aggregateHeight * 4 - bumpiness * 6;
}

/** Compute the highest-scoring drop placement for the active piece. */
export function findBestPlacement(state: GameState): PlacementHint | null {
  if (state.phase !== 'PLAYING' || !state.active) return null;

  const { type } = state.active;

  if (state.isTutorial && state.tutorialStep === 1 && type === 'I') {
    const cells = getPieceCells('I', 1, 16, 7);
    if (canPlace(state.board, 'I', 1, 16, 7)) {
      return {
        type: 'I',
        rotation: 1,
        row: 16,
        col: 7,
        cells,
        reason: 'Slide right to column 10 and press Space to clear the bottom row!',
      };
    }
  }

  let best: PlacementHint | null = null;
  let bestScore = -Infinity;

  for (const rot of [0, 1, 2, 3] as Rotation[]) {
    for (let col = -2; col < BOARD_COLS + 2; col++) {
      if (!canPlace(state.board, type, rot, 0, col)) continue;
      const dropRow = getGhostRow(state.board, {
        type,
        rotation: rot,
        row: 0,
        col,
      });

      const simBoard = cloneBoard(state.board);
      const cells = getPieceCells(type, rot, dropRow, col);
      let valid = true;
      for (const [r, c] of cells) {
        if (r < 0 || r >= BOARD_ROWS || c < 0 || c >= BOARD_COLS) {
          valid = false;
          break;
        }
        simBoard[r][c] = type;
      }
      if (!valid) continue;

      const score = evaluateSimulatedBoard(simBoard);
      if (score > bestScore) {
        bestScore = score;
        best = {
          type,
          rotation: rot,
          row: dropRow,
          col,
          cells,
          reason: 'Best low-hole drop position highlighted in purple.',
        };
      }
    }
  }

  return best;
}
