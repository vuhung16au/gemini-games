import { STORAGE_KEY } from './constants';
import type { SaveData } from './types';

const DEFAULT_SAVE: SaveData = {
  highScore: 0,
  bestLines: 0,
  bestLevel: 1,
  muted: false,
  ghostEnabled: true,
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

export function loadSaveData(
  storage: Storage | null = getDefaultStorage(),
): SaveData {
  if (!storage) return { ...DEFAULT_SAVE };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return {
      highScore:
        typeof parsed.highScore === 'number' &&
        Number.isFinite(parsed.highScore) &&
        parsed.highScore >= 0
          ? Math.floor(parsed.highScore)
          : 0,
      bestLines:
        typeof parsed.bestLines === 'number' &&
        Number.isFinite(parsed.bestLines) &&
        parsed.bestLines >= 0
          ? Math.floor(parsed.bestLines)
          : 0,
      bestLevel:
        typeof parsed.bestLevel === 'number' &&
        Number.isFinite(parsed.bestLevel) &&
        parsed.bestLevel >= 1
          ? Math.floor(parsed.bestLevel)
          : 1,
      muted: typeof parsed.muted === 'boolean' ? parsed.muted : false,
      ghostEnabled:
        typeof parsed.ghostEnabled === 'boolean' ? parsed.ghostEnabled : true,
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
