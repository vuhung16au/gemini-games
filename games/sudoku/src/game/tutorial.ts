import { createBoardFromPuzzle } from './engine';
import type { GameState } from './types';

export const SUDOKU_TUTORIAL_STEPS = [
  'Step 1 of 3: Click Row 1 Col 1 (highlighted) and enter 5.',
  'Step 2 of 3: Toggle Notes ON (N), select Row 1 Col 2, and add a pencil note (3).',
  'Step 3 of 3: Turn Notes OFF and use 💡 Hint (or enter 3 & 4) to finish!',
] as const;

const TUTORIAL_SOLUTION: number[][] = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

export function createSudokuTutorialState(): GameState {
  const puzzle = TUTORIAL_SOLUTION.map((r) => [...r]);
  puzzle[0][0] = 0; // 5
  puzzle[0][1] = 0; // 3
  puzzle[0][2] = 0; // 4

  return {
    difficulty: 'easy',
    board: createBoardFromPuzzle(puzzle),
    solution: TUTORIAL_SOLUTION,
    selected: { row: 0, col: 0 },
    notesMode: false,
    mistakes: 0,
    hintsUsed: 0,
    elapsedSeconds: 0,
    status: 'PLAYING',
    history: [],
  };
}

export function getSudokuTutorialProgress(state: GameState): {
  step: number;
  completed: boolean;
} {
  if (state.status === 'WON') {
    return { step: 2, completed: true };
  }
  const firstSolved =
    state.board[0][0].value === 5 && !state.board[0][0].isError;
  if (!firstSolved) {
    return { step: 0, completed: false };
  }
  const notedOrSolvedSecond =
    state.notesMode ||
    state.board[0][1].notes.length > 0 ||
    (state.board[0][1].value === 3 && !state.board[0][1].isError);
  if (!notedOrSolvedSecond) {
    return { step: 1, completed: false };
  }
  return { step: 2, completed: false };
}
