import { BOARD_COLS } from './constants';
import { createEmptyBoard, createShuffledBag } from './engine';
import type { GameState } from './types';

export const TUTORIAL_STEPS = [
  'Step 1 of 3: Press Up Arrow (or Rotate ↻) to rotate the falling I-piece vertically.',
  'Step 2 of 3: Move the vertical I-piece to the right gap and press Space (or Drop ⤓) to clear a line!',
  'Step 3 of 3: Press C (or Hold) to store your current piece in the Hold slot and finish!',
] as const;

/** Guided 3-step tutorial deal teaching rotation, hard-drop line clear, and Hold. */
export function createTutorialState(
  highScore = 0,
  ghostEnabled = true,
): GameState {
  const board = createEmptyBoard();
  // Pre-fill row 19 columns 0..8, leaving col 9 open for a vertical I-piece line clear
  for (let c = 0; c < BOARD_COLS - 1; c++) {
    board[19][c] = c % 2 === 0 ? 'J' : 'L';
  }

  return {
    phase: 'PLAYING',
    board,
    active: {
      type: 'I',
      rotation: 0,
      row: 0,
      col: 3,
    },
    bag: createShuffledBag(),
    nextQueue: ['T', 'O', 'L'],
    hold: null,
    canHold: true,
    score: 0,
    highScore,
    lines: 0,
    level: 1,
    backToBack: false,
    gravityTimer: 0,
    lockTimer: 0,
    accumulator: 0,
    flashRows: [],
    flashTimer: 0,
    gameOverElapsedMs: 0,
    ghostEnabled,
    isTutorial: true,
    tutorialStep: 0,
    tutorialCompleted: false,
    tutorialRotated: false,
  };
}
