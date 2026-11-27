import type { DifficultyPreset } from './types';

export const STORAGE_KEY = 'minesweeper_v1';

export interface MinesweeperSaveData {
  bestTimes: Partial<Record<Exclude<DifficultyPreset, 'custom'>, number>>;
  difficulty: DifficultyPreset;
  muted: boolean;
}

const DEFAULT_SAVE: MinesweeperSaveData = {
  bestTimes: {},
  difficulty: 'easy',
  muted: false,
};

function getDefaultStorage(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

export function loadMinesweeperSave(
  storage: Storage | null = getDefaultStorage(),
): MinesweeperSaveData {
  if (!storage) return { ...DEFAULT_SAVE, bestTimes: {} };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE, bestTimes: {} };
    const parsed = JSON.parse(raw) as Partial<MinesweeperSaveData>;
    const diff: DifficultyPreset =
      parsed.difficulty === 'medium' ||
      parsed.difficulty === 'hard' ||
      parsed.difficulty === 'custom'
        ? parsed.difficulty
        : 'easy';
    const bestTimes: MinesweeperSaveData['bestTimes'] = {};
    if (parsed.bestTimes && typeof parsed.bestTimes === 'object') {
      for (const k of ['easy', 'medium', 'hard'] as const) {
        const val = parsed.bestTimes[k];
        if (typeof val === 'number' && Number.isFinite(val) && val >= 0) {
          bestTimes[k] = Math.floor(val);
        }
      }
    }
    return {
      bestTimes,
      difficulty: diff,
      muted: Boolean(parsed.muted),
    };
  } catch {
    return { ...DEFAULT_SAVE, bestTimes: {} };
  }
}

export function saveMinesweeperData(
  data: MinesweeperSaveData,
  storage: Storage | null = getDefaultStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}
