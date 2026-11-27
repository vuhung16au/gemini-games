import { STORAGE_KEY } from './constants';
import type { GameMode, PlayerCount, SaveData } from './types';

const DEFAULT_SAVE: SaveData = {
  wins: 0,
  score: 0,
  gamesPlayed: 0,
  playerCount: 2,
  mode: 'ai',
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

function isValidPlayerCount(val: unknown): val is PlayerCount {
  return val === 2 || val === 3 || val === 4;
}

function isValidMode(val: unknown): val is GameMode {
  return val === 'ai' || val === 'pass-and-play';
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
      score:
        typeof parsed.score === 'number' &&
        Number.isFinite(parsed.score) &&
        parsed.score >= 0
          ? Math.floor(parsed.score)
          : 0,
      gamesPlayed:
        typeof parsed.gamesPlayed === 'number' &&
        Number.isFinite(parsed.gamesPlayed) &&
        parsed.gamesPlayed >= 0
          ? Math.floor(parsed.gamesPlayed)
          : 0,
      playerCount: isValidPlayerCount(parsed.playerCount)
        ? parsed.playerCount
        : 2,
      mode: isValidMode(parsed.mode) ? parsed.mode : 'ai',
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
    // Ignore quota or private mode storage restrictions
  }
}
