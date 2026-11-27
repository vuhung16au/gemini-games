import type { GameMode, PlayerCount, SaveData } from './types';

export const STORAGE_KEY = 'tien_len_mien_bac_v1';

export const DEFAULT_SAVE_DATA: SaveData = {
  wins: 0,
  gamesPlayed: 0,
  bestScore: 0,
  totalScore: 0,
  muted: false,
  playerCount: 4,
  mode: 'ai',
};

function sanitizePlayerCount(val: unknown): PlayerCount {
  return val === 2 || val === 3 || val === 4 ? val : 4;
}

function sanitizeMode(val: unknown): GameMode {
  return val === 'ai' || val === 'hotseat' ? val : 'ai';
}

export function loadSaveData(): SaveData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE_DATA };
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return {
      wins: typeof parsed.wins === 'number' && parsed.wins >= 0 ? parsed.wins : 0,
      gamesPlayed:
        typeof parsed.gamesPlayed === 'number' && parsed.gamesPlayed >= 0
          ? parsed.gamesPlayed
          : 0,
      bestScore: typeof parsed.bestScore === 'number' ? parsed.bestScore : 0,
      totalScore: typeof parsed.totalScore === 'number' ? parsed.totalScore : 0,
      muted: Boolean(parsed.muted),
      playerCount: sanitizePlayerCount(parsed.playerCount),
      mode: sanitizeMode(parsed.mode),
    };
  } catch {
    return { ...DEFAULT_SAVE_DATA };
  }
}

export function saveSaveData(data: SaveData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}
