import { describe, expect, it } from 'vitest';
import {
  createInitialState,
  hasAvailableMoves,
  keepGoing,
  move,
  undo,
} from '../engine';
import { findBestDirection } from '../hints';
import { loadSaveData, saveSaveData } from '../storage';
import { createTutorialBoardState, getTutorialProgress } from '../tutorial';
import type { GameState, Tile } from '../types';

function makeState(
  rows: number[][],
  overrides: Partial<GameState> = {},
): GameState {
  const tiles: Tile[] = [];
  let id = 1;
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      const value = rows[r][c];
      if (value > 0) {
        tiles.push({ id: id++, value, row: r, col: c });
      }
    }
  }
  return {
    tiles,
    score: 0,
    bestScore: 0,
    lastScoreDelta: 0,
    moveCount: 0,
    status: 'PLAYING',
    hasWon: false,
    nextTileId: id,
    history: [],
    ...overrides,
  };
}

function toMatrix(tiles: Tile[]): number[][] {
  const grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (const t of tiles) {
    grid[t.row][t.col] = t.value;
  }
  return grid;
}

describe('1024 engine', () => {
  it('spawns 2 distinct starting tiles with value 1 or 2', () => {
    const state = createInitialState(50, () => 0.25);
    expect(state.tiles).toHaveLength(2);
    expect(state.bestScore).toBe(50);
    expect(state.status).toBe('PLAYING');

    const coords = new Set(state.tiles.map((t) => `${t.row},${t.col}`));
    expect(coords.size).toBe(2);

    for (const tile of state.tiles) {
      expect([1, 2]).toContain(tile.value);
    }
  });

  it('merges 1 + 1 -> 2 and scores +2 on left move', () => {
    const initial = makeState([
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    // rng = 0.99 spawns a 1 in the last empty cell (3, 3)
    const res = move(initial, 'left', () => 0.99);
    expect(res.moved).toBe(true);
    expect(res.merged).toBe(true);
    expect(res.scoreGained).toBe(2);
    expect(res.state.score).toBe(2);

    const grid = toMatrix(res.state.tiles);
    expect(grid[0]).toEqual([2, 0, 0, 0]);
    expect(grid[3][3]).toBe(1);
  });

  it('does not double-merge [2, 2, 2, 2] or chain-merge [2, 2, 4, 0]', () => {
    const initial = makeState([
      [2, 2, 2, 2],
      [2, 2, 4, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    const res = move(initial, 'left', () => 0.99);
    expect(res.scoreGained).toBe(12); // (4 + 4) + 4
    const grid = toMatrix(res.state.tiles);
    expect(grid[0]).toEqual([4, 4, 0, 0]);
    expect(grid[1]).toEqual([4, 4, 0, 0]);
  });

  it('merges closest-to-edge pair first on right/up/down moves', () => {
    const rightState = makeState([
      [0, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const rightRes = move(rightState, 'right', () => 0.99);
    expect(toMatrix(rightRes.state.tiles)[0]).toEqual([0, 0, 2, 4]);

    const upState = makeState([
      [0, 0, 0, 0],
      [4, 0, 0, 0],
      [4, 0, 0, 0],
      [8, 0, 0, 0],
    ]);
    const upRes = move(upState, 'up', () => 0.99);
    const upGrid = toMatrix(upRes.state.tiles);
    expect([upGrid[0][0], upGrid[1][0], upGrid[2][0]]).toEqual([8, 8, 0]);

    const downState = makeState([
      [4, 0, 0, 0],
      [4, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const downRes = move(downState, 'down', () => 0.99);
    const downGrid = toMatrix(downRes.state.tiles);
    expect(downGrid[3][0]).toBe(8);
  });

  it('ignores no-op moves without spawning a tile or recording history', () => {
    const initial = makeState([
      [2, 4, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    const res = move(initial, 'left', () => 0.5);
    expect(res.moved).toBe(false);
    expect(res.state).toBe(initial);
    expect(res.state.history).toHaveLength(0);
    expect(res.state.tiles).toHaveLength(2);
  });

  it('triggers WON on reaching 1024 and allows Keep Going without re-winning', () => {
    const initial = makeState([
      [512, 512, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    const winRes = move(initial, 'left', () => 0.99);
    expect(winRes.wonNow).toBe(true);
    expect(winRes.state.status).toBe('WON');
    expect(winRes.state.hasWon).toBe(true);
    expect(winRes.state.score).toBe(1024);

    // Moves are blocked while WON overlay is visible
    const blocked = move(winRes.state, 'down', () => 0.5);
    expect(blocked.moved).toBe(false);

    // Keep Going resumes play and subsequent merges don't re-trigger WON
    const resumed = keepGoing(winRes.state);
    expect(resumed.status).toBe('PLAYING');

    const withPair = makeState(
      [
        [1024, 2, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      { hasWon: true, score: 1024, bestScore: 1024 },
    );
    const afterResumedMove = move(withPair, 'left', () => 0.99);
    expect(afterResumedMove.wonNow).toBe(false);
    expect(afterResumedMove.state.status).toBe('PLAYING');
  });

  it('detects GAME_OVER only when full board has no adjacent matching tiles', () => {
    const playableFull = makeState([
      [1, 2, 4, 8],
      [16, 32, 64, 128],
      [2, 4, 8, 16],
      [32, 64, 128, 128],
    ]);
    expect(hasAvailableMoves(playableFull.tiles)).toBe(true);

    const deadEndBoard = makeState([
      [1, 2, 4, 8],
      [16, 32, 64, 128],
      [2, 4, 8, 16],
      [32, 64, 2, 2],
    ]);
    // Merging the bottom-right [2, 2] -> [4] and spawning a 1 at (3, 2) leaves no moves
    const res = move(deadEndBoard, 'right', () => 0.99);
    expect(res.moved).toBe(true);
    expect(res.gameOverNow).toBe(true);
    expect(res.state.status).toBe('GAME_OVER');
  });

  it('supports undo while preserving bestScore', () => {
    const initial = makeState(
      [
        [4, 4, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      { score: 10, bestScore: 10 },
    );

    const afterMove = move(initial, 'left', () => 0.99);
    expect(afterMove.state.score).toBe(18);
    expect(afterMove.state.bestScore).toBe(18);
    expect(afterMove.state.history).toHaveLength(1);

    const reverted = undo(afterMove.state);
    expect(reverted.score).toBe(10);
    expect(reverted.bestScore).toBe(18);
    expect(toMatrix(reverted.tiles)[0]).toEqual([4, 4, 0, 0]);
    expect(reverted.history).toHaveLength(0);
  });

  it('persists and loads save data safely with fallback', () => {
    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
    } as Storage;

    saveSaveData({ bestScore: 2048, muted: true }, mockStorage);
    expect(loadSaveData(mockStorage)).toEqual({ bestScore: 2048, muted: true });

    const brokenStorage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('quota');
      },
    } as unknown as Storage;

    expect(() =>
      saveSaveData({ bestScore: 100, muted: false }, brokenStorage),
    ).not.toThrow();
    expect(loadSaveData(brokenStorage)).toEqual({ bestScore: 0, muted: false });
  });

  it('computes smart hints and completes the 3-step tutorial', () => {
    let tut = createTutorialBoardState(20);
    expect(getTutorialProgress(tut)).toEqual({ step: 0, completed: false });

    const hint = findBestDirection(tut);
    expect(hint).not.toBeNull();

    // Step 1: Left merges 1+1 -> 2
    tut = move(tut, 'left', () => 0.99).state;
    expect(getTutorialProgress(tut).step).toBe(1);

    // Step 2: Down merges 2+2 -> 4
    tut = move(tut, 'down', () => 0.99).state;
    expect(getTutorialProgress(tut).step).toBe(2);

    // Step 3: Down merges 4+4 -> 8
    tut = move(tut, 'down', () => 0.99).state;
    expect(getTutorialProgress(tut)).toEqual({ step: 2, completed: true });
  });
});
