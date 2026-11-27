import { afterEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY } from '../constants';
import { DEFAULT_STATS, loadStoredStats, saveStoredStats } from '../storage';

describe('ta_la_phom_v1 localStorage persistence', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns default stats when window is unavailable or storage is corrupt', () => {
    expect(loadStoredStats()).toEqual(DEFAULT_STATS);

    const getItem = vi.fn(() => '{bad-json');
    vi.stubGlobal('window', { localStorage: { getItem, setItem: vi.fn() } });
    expect(loadStoredStats()).toEqual(DEFAULT_STATS);
  });

  it('saves and restores valid stats safely under ta_la_phom_v1', () => {
    const store = new Map<string, string>();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => store.set(k, v),
      },
    });

    const sample = {
      ...DEFAULT_STATS,
      bestScore: 250,
      totalScore: 400,
      gamesPlayed: 3,
      wins: 2,
      uWins: 1,
      muted: true,
      playerCount: 3 as const,
      mode: 'pass-and-play' as const,
    };

    saveStoredStats(sample);
    expect(store.has(STORAGE_KEY)).toBe(true);
    expect(loadStoredStats()).toEqual(sample);
  });

  it('does not throw when localStorage.setItem fails', () => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem: () => null,
        setItem: () => {
          throw new Error('QuotaExceededError');
        },
      },
    });

    expect(() => saveStoredStats(DEFAULT_STATS)).not.toThrow();
  });
});
