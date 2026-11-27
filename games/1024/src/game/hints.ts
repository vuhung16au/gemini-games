import { getEmptyCells, move } from './engine';
import type { Direction, GameState } from './types';

export interface DirectionHint {
  direction: Direction;
  scoreGained: number;
  reason: string;
}

const DIRECTIONS: Direction[] = ['left', 'down', 'right', 'up'];

const DIRECTION_LABELS: Record<Direction, string> = {
  left: 'Left (←)',
  right: 'Right (→)',
  up: 'Up (↑)',
  down: 'Down (↓)',
};

/** Evaluate all 4 slide directions and recommend the strongest move. */
export function findBestDirection(state: GameState): DirectionHint | null {
  if (state.status !== 'PLAYING') return null;

  let best: DirectionHint | null = null;
  let bestScore = -Infinity;

  for (const dir of DIRECTIONS) {
    const res = move(state, dir, () => 0.5);
    if (!res.moved) continue;

    const emptyCount = getEmptyCells(res.state.tiles).length;
    let maxVal = 0;
    let maxInCorner = false;
    for (const t of res.state.tiles) {
      if (t.value > maxVal) {
        maxVal = t.value;
        maxInCorner =
          (t.row === 0 || t.row === 3) && (t.col === 0 || t.col === 3);
      }
    }

    const heuristic =
      res.scoreGained * 2 + emptyCount * 14 + (maxInCorner ? 18 : 0);

    if (heuristic > bestScore) {
      bestScore = heuristic;
      best = {
        direction: dir,
        scoreGained: res.scoreGained,
        reason:
          res.scoreGained > 0
            ? `Slide ${DIRECTION_LABELS[dir]} to merge for +${res.scoreGained} pts.`
            : `Slide ${DIRECTION_LABELS[dir]} to open space and align tiles.`,
      };
    }
  }

  return best;
}
