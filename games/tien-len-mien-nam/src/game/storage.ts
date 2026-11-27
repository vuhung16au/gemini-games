import { STORAGE_KEY } from './constants';
import type { GameMode, PlayerCount } from './types';

export interface PersistedData {
  wins: number;
  bestScore: number;
  totalScore: number;
  gamesPlayed: number;
  muted: boolean;
  playerCount: PlayerCount;
  mode: GameMode;
}

const DEFAULT_DATA: PersistedData = {
  wins: 0,
  bestScore: 0,
  totalScore: 0,
  gamesPlayed: 0,
  muted: false,
  playerCount: 4,
  mode: 'vs-ai',
};

export function loadPersistedData(): PersistedData {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...DEFAULT_DATA };
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    const parsed = JSON.parse(raw) as Partial<PersistedData>;
    return {
      wins: typeof parsed.wins === 'number' && parsed.wins >= 0 ? parsed.wins : 0,
      bestScore:
        typeof parsed.bestScore === 'number' ? parsed.bestScore : 0,
      totalScore:
        typeof parsed.totalScore === 'number' ? parsed.totalScore : 0,
      gamesPlayed:
        typeof parsed.gamesPlayed === 'number' && parsed.gamesPlayed >= 0
          ? parsed.gamesPlayed
          : 0,
      muted: Boolean(parsed.muted),
      playerCount:
        parsed.playerCount === 2 ||
        parsed.playerCount === 3 ||
        parsed.playerCount === 4
          ? parsed.playerCount
          : 4,
      mode:
        parsed.mode === 'pass-and-play' || parsed.mode === 'vs-ai'
          ? parsed.mode
          : 'vs-ai',
    };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export function savePersistedData(data: PersistedData): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}
