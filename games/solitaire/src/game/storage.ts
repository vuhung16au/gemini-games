import { STORAGE_KEY } from './constants';
import type { DrawMode, SaveData } from './types';

const DEFAULT_SAVE: SaveData = {
  gamesWon: 0,
  bestScore: 0,
  bestTimeSeconds: null,
  drawMode: 1,
  muted: false,
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

function isValidDrawMode(val: unknown): val is DrawMode {
  return val === 1 || val === 3;
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
      gamesWon:
        typeof parsed.gamesWon === 'number' &&
        Number.isFinite(parsed.gamesWon) &&
        parsed.gamesWon >= 0
          ? Math.floor(parsed.gamesWon)
          : 0,
      bestScore:
        typeof parsed.bestScore === 'number' &&
        Number.isFinite(parsed.bestScore) &&
        parsed.bestScore >= 0
          ? Math.floor(parsed.bestScore)
          : 0,
      bestTimeSeconds:
        typeof parsed.bestTimeSeconds === 'number' &&
        Number.isFinite(parsed.bestTimeSeconds) &&
        parsed.bestTimeSeconds >= 0
          ? Math.floor(parsed.bestTimeSeconds)
          : null,
      drawMode: isValidDrawMode(parsed.drawMode) ? parsed.drawMode : 1,
      muted: typeof parsed.muted === 'boolean' ? parsed.muted : false,
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
    // Ignore storage quota or private browsing errors
  }
}
