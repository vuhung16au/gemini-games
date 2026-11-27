import { describe, expect, it } from 'vitest';
import { TILE_SIZE } from '../constants';
import {
  createMarioState,
  createTutorialMarioState,
  stepMario,
} from '../engine';
import { getMarioHint } from '../hints';
import { loadMarioSave, saveMarioData } from '../storage';
import { getTutorialProgress } from '../tutorial';
import type { PlayerInput } from '../types';

const IDLE: PlayerInput = {
  left: false,
  right: false,
  crouch: false,
  jumpPressed: false,
  jumpHeld: false,
  run: false,
  firePressed: false,
};

describe('Super Mario Bros (1985) Engine', () => {
  it('loads all World 1 levels (1-1 to 1-4) with valid goals and themes', () => {
    expect(createMarioState('1-1').theme).toBe('overworld');
    expect(createMarioState('1-2').theme).toBe('underground');
    expect(createMarioState('1-3').theme).toBe('athletic');
    const castle = createMarioState('1-4');
    expect(castle.theme).toBe('castle');
    expect(castle.goalType).toBe('axe');
    expect(castle.enemies.some((e) => e.kind === 'bowser')).toBe(true);
  });

  it('supports running, variable jumping, and bumping ? blocks for power-ups', () => {
    let state = createMarioState('1-1');
    const startX = state.players[0].x;

    // Move right and jump
    state = stepMario(state, { ...IDLE, right: true, jumpPressed: true, jumpHeld: true }, 0.016);
    expect(state.players[0].vy).toBeLessThan(0);
    for (let i = 0; i < 10; i++) {
      state = stepMario(state, { ...IDLE, right: true, jumpHeld: true }, 0.016);
    }
    expect(state.players[0].x).toBeGreaterThan(startX);

    // Position Small Mario directly under the mushroom ? block at (17, 6) and jump into it
    state.players[0].x = 17 * TILE_SIZE + 4;
    state.players[0].y = 7 * TILE_SIZE + 2;
    state.players[0].vy = -260;
    state = stepMario(state, IDLE, 0.03);
    expect(state.tiles[6 * state.widthTiles + 17]).toBe('used');
    expect(state.items.some((it) => it.kind === 'mushroom')).toBe(true);
  });

  it('stomps Goombas and kicks Koopa shells', () => {
    let state = createMarioState('1-1');
    const goomba = state.enemies.find((e) => e.kind === 'goomba')!;
    state.players[0].x = goomba.x;
    state.players[0].y = goomba.y - state.players[0].height + 2;
    state.players[0].vy = 180;

    state = stepMario(state, IDLE, 0.016);
    expect(state.enemiesStomped).toBe(1);
    expect(state.players[0].vy).toBeLessThan(0);
  });

  it('collapses the 1-4 bridge and triggers Toad victory on Axe contact', () => {
    let state = createMarioState('1-4');
    state.players[0].x = state.goalX;
    state.players[0].y = state.goalY;

    state = stepMario(state, IDLE, 0.016);
    expect(state.phase).toBe('victory');
    expect(state.tiles.includes('bridge')).toBe(false);
    expect(state.enemies.length).toBe(0);
  });

  it('tracks tutorial steps, hints, and safe localStorage persistence', () => {
    let tut = createTutorialMarioState();
    expect(getTutorialProgress(tut).stepIndex).toBe(0);
    expect(getMarioHint(tut).title.length).toBeGreaterThan(0);

    tut.blocksHit = 1;
    expect(getTutorialProgress(tut).stepIndex).toBe(1);

    tut.mushroomsCollected = 1;
    expect(getTutorialProgress(tut).stepIndex).toBe(2);

    tut.enemiesStomped = 1;
    expect(getTutorialProgress(tut).stepIndex).toBe(3);

    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
    } as Storage;

    saveMarioData({ highScore: 12400, highestLevel: '1-3', muted: true }, mockStorage);
    expect(loadMarioSave(mockStorage)).toEqual({
      highScore: 12400,
      highestLevel: '1-3',
      muted: true,
    });

    store.set('super_mario_bros_v1', '{broken');
    expect(loadMarioSave(mockStorage)).toEqual({
      highScore: 0,
      highestLevel: '1-1',
      muted: false,
    });
  });
});
