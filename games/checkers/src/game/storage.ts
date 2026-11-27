import {
  STORAGE_KEY,
  type AIDifficulty,
  type GameMode,
} from './constants';
import type { SaveData } from './types';

const DEFAULT_SAVE: SaveData = {
  wins: 0,
  losses: 0,
  muted: false,
  mode: 'vs-ai',
  difficulty: 'medium',
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

function isValidMode(val: unknown): val is GameMode {
  return val === 'vs-ai' || val === 'two-player';
}

function isValidDifficulty(val: unknown): val is AIDifficulty {
  return val === 'easy' || val === 'medium' || val === 'hard';
}

export function loadSaveData(
  storage: Storage | null = getDefaultStorage(),
): SaveData {
  if (!storage) return { ...DEFAULT_SAVE };

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    const parsed = JSON.parse(raw) as Partial<SaveData>;

    return {
      wins:
        typeof parsed.wins === 'number' &&
        Number.isFinite(parsed.wins) &&
        parsed.wins >= 0
          ? Math.floor(parsed.wins)
          : 0,
      losses:
        typeof parsed.losses === 'number' &&
        Number.isFinite(parsed.losses) &&
        parsed.losses >= 0
          ? Math.floor(parsed.losses)
          : 0,
      muted: typeof parsed.muted === 'boolean' ? parsed.muted : false,
      mode: isValidMode(parsed.mode) ? parsed.mode : 'vs-ai',
      difficulty: isValidDifficulty(parsed.difficulty)
        ? parsed.difficulty
        : 'medium',
    };
  } catch {
    return { ...DEFAULT_SAVE };
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
    // Ignore quota / private browsing errors
  }
}
