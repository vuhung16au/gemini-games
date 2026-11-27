import { STORAGE_KEY } from './constants';
import type { SaveData } from './types';

const DEFAULT_SAVE: SaveData = {
  bestScore: 0,
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

/** Load persisted bestScore and mute state safely. */
export function loadSaveData(
  storage: Storage | null = getDefaultStorage(),
): SaveData {
  if (!storage) return { ...DEFAULT_SAVE };

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return {
      bestScore:
        typeof parsed.bestScore === 'number' &&
        Number.isFinite(parsed.bestScore) &&
        parsed.bestScore >= 0
          ? Math.floor(parsed.bestScore)
          : 0,
      muted: typeof parsed.muted === 'boolean' ? parsed.muted : false,
    };
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

/** Persist bestScore and mute state safely. */
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
