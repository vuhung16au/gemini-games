import type { BoardConfig, DifficultyPreset } from './types';

export const PRESET_CONFIGS: Record<Exclude<DifficultyPreset, 'custom'>, BoardConfig> = {
  easy: { difficulty: 'easy', rows: 9, cols: 9, mines: 10 },
  medium: { difficulty: 'medium', rows: 16, cols: 16, mines: 40 },
  hard: { difficulty: 'hard', rows: 16, cols: 30, mines: 99 },
};

export const MIN_ROWS = 5;
export const MAX_ROWS = 24;
export const MIN_COLS = 5;
export const MAX_COLS = 36;

export function clampCustomConfig(rows: number, cols: number, mines: number): BoardConfig {
  const r = Math.max(MIN_ROWS, Math.min(MAX_ROWS, Math.floor(rows)));
  const c = Math.max(MIN_COLS, Math.min(MAX_COLS, Math.floor(cols)));
  const maxMines = Math.max(1, r * c - 9);
  const m = Math.max(1, Math.min(maxMines, Math.floor(mines)));
  return {
    difficulty: 'custom',
    rows: r,
    cols: c,
    mines: m,
  };
}
