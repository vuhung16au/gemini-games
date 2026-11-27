export const BOARD_SIZE = 9;
export const BOX_SIZE = 3;
export const MAX_MISTAKES = 3;
export const MAX_UNDO_HISTORY = 50;
export const STORAGE_KEY = 'sudoku_v1';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export const DIFFICULTY_CLUES: Record<Difficulty, number> = {
  easy: 42,
  medium: 34,
  hard: 28,
  expert: 23,
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
};
