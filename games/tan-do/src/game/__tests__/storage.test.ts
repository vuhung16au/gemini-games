import { describe, expect, it } from 'vitest';
import { STORAGE_KEY } from '../constants';
import { loadSaveData, saveSaveData } from '../storage';

function createMockStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

describe('tan_do_v1 localStorage persistence', () => {
  it('returns safe defaults when storage is unavailable or corrupted', () => {
    expect(loadSaveData(null)).toEqual({
      wins: 0,
      score: 0,
      gamesPlayed: 0,
      playerCount: 2,
      mode: 'ai',
      muted: false,
    });

    const storage = createMockStorage();
    storage.setItem(STORAGE_KEY, '{bad json');
    expect(loadSaveData(storage)).toEqual({
      wins: 0,
      score: 0,
      gamesPlayed: 0,
      playerCount: 2,
      mode: 'ai',
      muted: false,
    });
  });

  it('persists and sanitizes wins, score, playerCount, mode, and muted', () => {
    const storage = createMockStorage();
    saveSaveData(
      {
        wins: 4,
        score: 520,
        gamesPlayed: 6,
        playerCount: 4,
        mode: 'pass-and-play',
        muted: true,
      },
      storage,
    );

    expect(loadSaveData(storage)).toEqual({
      wins: 4,
      score: 520,
      gamesPlayed: 6,
      playerCount: 4,
      mode: 'pass-and-play',
      muted: true,
    });
  });
});
