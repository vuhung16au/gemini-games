import { STORAGE_KEY, type Difficulty } from './constants';
import type { SaveData } from './types';

const DEFAULT_SAVE: SaveData = {
  bestTimes: {},
  gamesWon: 0,
  muted: false,
  difficulty: 'easy',
};

function getDefaultStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

function isValidDifficulty(val: unknown): val is Difficulty {
  return val === 'easy' || val === 'medium' || val === 'hard' || val === 'expert';
}

export function loadSaveData(
  storage: Storage | null = getDefaultStorage(),
): SaveData {
  if (!storage) return { ...DEFAULT_SAVE, bestTimes: {} };

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE, bestTimes: {} };
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    const bestTimes: Partial<Record<Difficulty, number>> = {};

    if (parsed.bestTimes && typeof parsed.bestTimes === 'object') {
      for (const diff of ['easy', 'medium', 'hard', 'expert'] as const) {
        const val = parsed.bestTimes[diff];
        if (typeof val === 'number' && Number.isFinite(val) && val >= 0) {
          bestTimes[diff] = Math.floor(val);
        }
      }
    }

    return {
      bestTimes,
      gamesWon:
        typeof parsed.gamesWon === 'number' &&
        Number.isFinite(parsed.gamesWon) &&
        parsed.gamesWon >= 0
          ? Math.floor(parsed.gamesWon)
          : 0,
      muted: typeof parsed.muted === 'boolean' ? parsed.muted : false,
      difficulty: isValidDifficulty(parsed.difficulty)
        ? parsed.difficulty
        : 'easy',
    };
  } catch {
    return { ...DEFAULT_SAVE, bestTimes: {} };
  }
}

export function saveSaveData(
  data: SaveData,
  storage: Storage | null = getDefaultStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota / private mode errors
  }
}
