import type { DinoTheme } from './types';

export const STORAGE_KEY = 'dino_run_v1';

export interface DinoSaveData {
  highScore: number;
  theme: DinoTheme;
  muted: boolean;
}

const DEFAULT_SAVE: DinoSaveData = {
  highScore: 0,
  theme: 'classic',
  muted: false,
};

function getDefaultStorage(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

export function loadDinoSave(storage: Storage | null = getDefaultStorage()): DinoSaveData {
  if (!storage) return { ...DEFAULT_SAVE };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    const parsed = JSON.parse(raw) as Partial<DinoSaveData>;
    return {
      highScore:
        typeof parsed.highScore === 'number' && Number.isFinite(parsed.highScore)
          ? Math.max(0, Math.round(parsed.highScore))
          : DEFAULT_SAVE.highScore,
      theme: parsed.theme === 'math404' ? 'math404' : 'classic',
      muted: Boolean(parsed.muted),
    };
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

export function saveDinoData(
  data: DinoSaveData,
  storage: Storage | null = getDefaultStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}
