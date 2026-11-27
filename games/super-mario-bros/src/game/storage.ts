import type { LevelId } from './types';

export const STORAGE_KEY = 'super_mario_bros_v1';

export interface MarioSaveData {
  highScore: number;
  highestLevel: LevelId;
  muted: boolean;
}

const DEFAULT_SAVE: MarioSaveData = {
  highScore: 0,
  highestLevel: '1-1',
  muted: false,
};

const VALID_LEVELS = new Set<LevelId>(['1-1', '1-2', '1-3', '1-4']);

function getDefaultStorage(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

export function loadMarioSave(storage: Storage | null = getDefaultStorage()): MarioSaveData {
  if (!storage) return { ...DEFAULT_SAVE };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    const parsed = JSON.parse(raw) as Partial<MarioSaveData>;
    return {
      highScore:
        typeof parsed.highScore === 'number' && Number.isFinite(parsed.highScore)
          ? Math.max(0, Math.round(parsed.highScore))
          : DEFAULT_SAVE.highScore,
      highestLevel:
        parsed.highestLevel && VALID_LEVELS.has(parsed.highestLevel)
          ? parsed.highestLevel
          : DEFAULT_SAVE.highestLevel,
      muted: Boolean(parsed.muted),
    };
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

export function saveMarioData(
  data: MarioSaveData,
  storage: Storage | null = getDefaultStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota / security errors
  }
}
