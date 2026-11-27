import type { GameState } from './types';

export const TUTORIAL_STEPS = [
  'Step 1 of 3: Press Left (←) or swipe left to merge 1 + 1 into 2!',
  'Step 2 of 3: Press Down (↓) or swipe down to merge 2 + 2 into 4!',
  'Step 3 of 3: Press Down (↓) again to merge 4 + 4 into 8 and finish!',
] as const;

/** Deterministic 3-step tutorial deal teaching merges (1+1 -> 2 -> 4 -> 8). */
export function createTutorialBoardState(bestScore = 0): GameState {
  return {
    tiles: [
      { id: 1, value: 1, row: 0, col: 0, isNew: true },
      { id: 2, value: 1, row: 0, col: 1, isNew: true },
      { id: 3, value: 2, row: 1, col: 0, isNew: true },
      { id: 4, value: 4, row: 3, col: 0, isNew: true },
    ],
    score: 0,
    bestScore,
    lastScoreDelta: 0,
    moveCount: 0,
    status: 'PLAYING',
    hasWon: false,
    nextTileId: 5,
    history: [],
  };
}

export function getTutorialProgress(state: GameState): {
  step: number;
  completed: boolean;
} {
  if (state.tiles.some((t) => t.value >= 8) || state.score >= 14) {
    return { step: 2, completed: true };
  }
  if (state.score >= 6) {
    return { step: 2, completed: false };
  }
  if (state.score >= 2) {
    return { step: 1, completed: false };
  }
  return { step: 0, completed: false };
}
