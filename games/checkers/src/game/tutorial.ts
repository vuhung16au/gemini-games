import { BOARD_SIZE } from './constants';
import type { BoardGrid, GameState, Piece } from './types';

export const CHECKERS_TUTORIAL_STEPS = [
  'Step 1 of 3: Select Red at Row 5 Col 2 and move diagonally to Row 4 Col 3.',
  'Step 2 of 3: Mandatory Capture! Jump Red from Row 4 Col 3 over Black to Row 2 Col 5.',
  'Step 3 of 3: Advance Red into the top row (Row 1) to crown a King!',
] as const;

export function createCheckersTutorialState(): GameState {
  const board: BoardGrid = Array.from({ length: BOARD_SIZE }, () =>
    Array<Piece | null>(BOARD_SIZE).fill(null),
  );
  board[4][1] = { id: 1, player: 'red', isKing: false };
  board[2][3] = { id: 2, player: 'black', isKing: false };
  board[5][6] = { id: 3, player: 'black', isKing: false };

  return {
    board,
    currentPlayer: 'red',
    selected: { row: 4, col: 1 },
    forcedJumpFrom: null,
    hintMove: null,
    mode: 'two-player',
    difficulty: 'medium',
    status: 'PLAYING',
    winner: null,
    moveCount: 0,
    history: [],
  };
}

export function getCheckersTutorialProgress(state: GameState): {
  step: number;
  completed: boolean;
} {
  for (let c = 0; c < BOARD_SIZE; c++) {
    const p = state.board[0][c];
    if (p?.player === 'red' && p.isKing) {
      return { step: 2, completed: true };
    }
  }

  // Black at (2, 3) captured -> Step 2
  if (state.board[2][3] === null) {
    return { step: 2, completed: false };
  }

  // Red moved to (3, 2) -> Step 1
  if (state.board[3][2]?.player === 'red') {
    return { step: 1, completed: false };
  }

  return { step: 0, completed: false };
}
