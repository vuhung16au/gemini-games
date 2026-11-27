import { STORAGE_KEY } from './constants';
import type { GameMode, PlayerCount, StoredTaLaStats } from './types';

export const DEFAULT_STATS: StoredTaLaStats = {
  bestScore: 0,
  totalScore: 0,
  gamesPlayed: 0,
  wins: 0,
  uWins: 0,
  muted: false,
  playerCount: 4,
  mode: 'vs-ai',
};

function isValidPlayerCount(val: unknown): val is PlayerCount {
  return val === 2 || val === 3 || val === 4;
}

function isValidMode(val: unknown): val is GameMode {
  return val === 'vs-ai' || val === 'pass-and-play';
}

export function loadStoredStats(): StoredTaLaStats {
  if (typeof window === 'undefined') return { ...DEFAULT_STATS };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw) as Partial<StoredTaLaStats>;
    return {
      bestScore: typeof parsed.bestScore === 'number' && Number.isFinite(parsed.bestScore) ? parsed.bestScore : 0,
      totalScore: typeof parsed.totalScore === 'number' && Number.isFinite(parsed.totalScore) ? parsed.totalScore : 0,
      gamesPlayed: typeof parsed.gamesPlayed === 'number' && parsed.gamesPlayed >= 0 ? parsed.gamesPlayed : 0,
      wins: typeof parsed.wins === 'number' && parsed.wins >= 0 ? parsed.wins : 0,
      uWins: typeof parsed.uWins === 'number' && parsed.uWins >= 0 ? parsed.uWins : 0,
      muted: typeof parsed.muted === 'boolean' ? parsed.muted : false,
      playerCount: isValidPlayerCount(parsed.playerCount) ? parsed.playerCount : 4,
      mode: isValidMode(parsed.mode) ? parsed.mode : 'vs-ai',
    };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveStoredStats(stats: StoredTaLaStats): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage quota or private-browsing errors
  }
}
