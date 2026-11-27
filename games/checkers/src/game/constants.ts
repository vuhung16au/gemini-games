export const BOARD_SIZE = 8;
export const MAX_UNDO_HISTORY = 40;
export const STORAGE_KEY = 'checkers_v1';

export type GameMode = 'vs-ai' | 'two-player';
export type AIDifficulty = 'easy' | 'medium' | 'hard';

export const AI_DEPTH: Record<AIDifficulty, number> = {
  easy: 1,
  medium: 3,
  hard: 5,
};
