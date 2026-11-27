export const STORAGE_KEY = 'battle_city_v1';

export interface BattleSaveData {
  highScore: number;
  highestStage: number;
  muted: boolean;
}

const DEFAULT_SAVE: BattleSaveData = {
  highScore: 20000,
  highestStage: 1,
  muted: false,
};

function getDefaultStorage(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

export function loadBattleSave(storage: Storage | null = getDefaultStorage()): BattleSaveData {
  if (!storage) return { ...DEFAULT_SAVE };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    const parsed = JSON.parse(raw) as Partial<BattleSaveData>;
    return {
      highScore:
        typeof parsed.highScore === 'number' && Number.isFinite(parsed.highScore)
          ? Math.max(0, Math.round(parsed.highScore))
          : DEFAULT_SAVE.highScore,
      highestStage:
        typeof parsed.highestStage === 'number' && Number.isFinite(parsed.highestStage)
          ? Math.max(1, Math.min(10, Math.floor(parsed.highestStage)))
          : DEFAULT_SAVE.highestStage,
      muted: Boolean(parsed.muted),
    };
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

export function saveBattleData(
  data: BattleSaveData,
  storage: Storage | null = getDefaultStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}
