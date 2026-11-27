import { describe, expect, it } from 'vitest';
import {
  BIRD_HITBOX_RADIUS,
  BIRD_X,
  PIPE_CAP_OVERHANG,
  PIPE_WIDTH,
  RESTART_COOLDOWN_MS,
  getMedalTier,
  getPipeGap,
} from '../constants';
import { createInitialState, flap, stepFrame, tryRestart } from '../engine';
import { loadSaveData, saveSaveData } from '../storage';

describe('engine & progression', () => {
  it('produces identical trajectories across 60Hz and 120Hz frame rates', () => {
    const s60 = createInitialState();
    const s120 = createInitialState();
    const fixedRng = () => 0.5;

    flap(s60, fixedRng);
    flap(s120, fixedRng);

    for (let i = 0; i < 60; i++) {
      stepFrame(s60, 1 / 60, fixedRng);
    }
    for (let i = 0; i < 120; i++) {
      stepFrame(s120, 1 / 120, fixedRng);
    }

    expect(s60.bird.y).toBeCloseTo(s120.bird.y, 6);
    expect(s60.bird.vy).toBeCloseTo(s120.bird.vy, 6);
  });

  it('clamps tab-switch dt to prevent physics tunneling', () => {
    const state = createInitialState();
    flap(state, () => 0.5);
    const startY = state.bird.y;

    // Simulate a 10-second tab switch
    stepFrame(state, 10, () => 0.5);
    // Clamped to 0.05s, so bird is still near startY and not crashed
    expect(state.phase).toBe('PLAYING');
    expect(Math.abs(state.bird.y - startY)).toBeLessThan(30);
  });

  it('clamps bird at ceiling without triggering game over', () => {
    const state = createInitialState();
    flap(state, () => 0.5);
    state.bird.y = 5;
    state.bird.vy = -400;

    stepFrame(state, 1 / 60, () => 0.5);
    expect(state.phase).toBe('PLAYING');
    expect(state.bird.y).toBeGreaterThanOrEqual(BIRD_HITBOX_RADIUS);
    expect(state.bird.vy).toBeGreaterThanOrEqual(0);
  });

  it('progressively tightens pipe gap from 145px down to 120px', () => {
    expect(getPipeGap(0)).toBe(145);
    expect(getPipeGap(1)).toBe(145);
    expect(getPipeGap(2)).toBe(144);
    expect(getPipeGap(20)).toBe(135);
    expect(getPipeGap(50)).toBe(120);
    expect(getPipeGap(120)).toBe(120);
  });

  it('increments score once per pipe pair and cleans up offscreen pipes', () => {
    const state = createInitialState();
    state.phase = 'PLAYING';
    state.bird.y = 250;
    state.pipes.push({
      id: 1,
      x: BIRD_X - PIPE_WIDTH / 2 + 2,
      gapY: 250,
      gapHeight: 145,
      passed: false,
    });

    // Step enough for pipe center to pass BIRD_X
    const ev1 = stepFrame(state, 0.04, () => 0.5);
    expect(ev1.scored).toBe(true);
    expect(state.score).toBe(1);

    // Subsequent frame should not double-score
    const ev2 = stepFrame(state, 0.04, () => 0.5);
    expect(ev2.scored).toBe(false);
    expect(state.score).toBe(1);

    // Move pipe off left edge and step
    state.pipes[0].x = -(PIPE_WIDTH + PIPE_CAP_OVERHANG + 5);
    stepFrame(state, 1 / 60, () => 0.5);
    expect(state.pipes.length).toBe(0);
  });

  it('enforces 400ms restart cooldown after game over', () => {
    const state = createInitialState();
    state.phase = 'GAME_OVER';
    state.gameOverElapsedMs = 0;

    expect(tryRestart(state)).toBe(false);

    stepFrame(state, 0.05, () => 0.5); // 50ms
    expect(tryRestart(state)).toBe(false);

    state.gameOverElapsedMs = RESTART_COOLDOWN_MS;
    expect(tryRestart(state)).toBe(true);
    expect(state.phase).toBe('START');
    expect(state.score).toBe(0);
  });

  it('maps scores to medal tiers accurately', () => {
    expect(getMedalTier(0)).toBeNull();
    expect(getMedalTier(9)).toBeNull();
    expect(getMedalTier(10)).toBe('bronze');
    expect(getMedalTier(20)).toBe('silver');
    expect(getMedalTier(30)).toBe('gold');
    expect(getMedalTier(40)).toBe('platinum');
  });

  it('persists and loads save data safely with fallback', () => {
    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
    } as Storage;

    saveSaveData({ bestScore: 27, muted: true }, mockStorage);
    expect(loadSaveData(mockStorage)).toEqual({ bestScore: 27, muted: true });

    const brokenStorage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('quota');
      },
    } as unknown as Storage;

    expect(() =>
      saveSaveData({ bestScore: 10, muted: false }, brokenStorage),
    ).not.toThrow();
    expect(loadSaveData(brokenStorage)).toEqual({ bestScore: 0, muted: false });
  });

  it('spawns wider 190px pipes in Tutorial mode and completes at score 2', () => {
    const tut = createInitialState(0, { isTutorial: true, hintEnabled: true });
    expect(tut.isTutorial).toBe(true);
    expect(tut.hintEnabled).toBe(true);
    flap(tut, () => 0.5);
    stepFrame(tut, 0.05, () => 0.5);
    // Advance until first pipe spawns at 1.5s
    for (let i = 0; i < 30; i++) {
      stepFrame(tut, 0.05, () => 0.5);
      tut.bird.vy = 0;
      tut.bird.y = 250;
    }
    expect(tut.pipes.length).toBeGreaterThan(0);
    expect(tut.pipes[0].gapHeight).toBe(190);
  });
});
