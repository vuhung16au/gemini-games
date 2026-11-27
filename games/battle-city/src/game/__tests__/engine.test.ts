import { describe, expect, it } from 'vitest';
import {
  GRID_SUBTILES,
  P1_SPAWN,
  P2_SPAWN,
  POWERUP_SCORE,
  STUN_DURATION,
  SUBTILE_PX,
} from '../constants';
import {
  createBattleState,
  createTutorialBattleState,
  getTotalKills,
  stepBattle,
} from '../engine';
import { getBattleHint } from '../hints';
import { loadBattleSave, saveBattleData } from '../storage';
import { getTutorialProgress } from '../tutorial';
import type { BattleInput } from '../types';

const IDLE_INPUT: BattleInput = {
  p1: { dir: null, fire: false },
  p2: { dir: null, fire: false },
};

describe('Battle City (1985) Engine', () => {
  it('initializes 1P and 2P modes with 20-enemy queues and Eagle HQ', () => {
    const s1 = createBattleState('1p', 1);
    expect(s1.players[0].active).toBe(true);
    expect(s1.players[1].active).toBe(false);
    expect(s1.enemyQueue.length).toBe(20);
    expect(s1.grid[24 * GRID_SUBTILES + 12]).toBe('eagle');

    const s2 = createBattleState('2p', 2);
    expect(s2.players[0].active).toBe(true);
    expect(s2.players[1].active).toBe(true);
    expect(s2.players[0].x).toBe(P1_SPAWN.x);
    expect(s2.players[1].x).toBe(P2_SPAWN.x);
  });

  it('destroys brick subtiles with bullets and only breaks steel at 3 stars', () => {
    let state = createBattleState('1p', 1);
    // Place a brick at (8, 22) and steel at (8, 20) directly above P1 (8*16, 24*16)
    state.grid[22 * GRID_SUBTILES + 8] = 'brick';
    state.grid[20 * GRID_SUBTILES + 8] = 'steel';

    state = stepBattle(state, { p1: { dir: 'up', fire: true }, p2: { dir: null, fire: false } }, 0.016);
    for (let i = 0; i < 15; i++) {
      state = stepBattle(state, IDLE_INPUT, 0.03);
    }
    expect(state.grid[22 * GRID_SUBTILES + 8]).toBe('empty');
    expect(state.bricksBroken).toBeGreaterThanOrEqual(1);

    // 0-star bullet cannot break steel
    state.players[0].fireCooldown = 0;
    state = stepBattle(state, { p1: { dir: 'up', fire: true }, p2: { dir: null, fire: false } }, 0.016);
    for (let i = 0; i < 20; i++) {
      state = stepBattle(state, IDLE_INPUT, 0.03);
    }
    expect(state.grid[20 * GRID_SUBTILES + 8]).toBe('steel');

    // 3-star bullet breaks steel
    state.players[0].stars = 3;
    state.players[0].fireCooldown = 0;
    state = stepBattle(state, { p1: { dir: 'up', fire: true }, p2: { dir: null, fire: false } }, 0.016);
    for (let i = 0; i < 20; i++) {
      state = stepBattle(state, IDLE_INPUT, 0.03);
    }
    expect(state.grid[20 * GRID_SUBTILES + 8]).toBe('empty');
  });

  it('triggers immediate game over when the Eagle HQ is hit', () => {
    let state = createBattleState('1p', 1);
    state.bullets.push({
      uid: 999,
      owner: 'enemy',
      x: 12 * SUBTILE_PX + 4,
      y: 23 * SUBTILE_PX + 10,
      dir: 'down',
      speed: 200,
      canBreakSteel: false,
    });

    state = stepBattle(state, IDLE_INPUT, 0.04);
    expect(state.phase).toBe('game_over');
    expect(state.grid[24 * GRID_SUBTILES + 12]).toBe('eagle_dead');
  });

  it('applies 2P friendly-fire stun without killing teammate', () => {
    let state = createBattleState('2p', 1);
    state.players[1].shieldTimer = 0;
    state.bullets.push({
      uid: 777,
      owner: 'p1',
      x: state.players[1].x + 8,
      y: state.players[1].y + 8,
      dir: 'right',
      speed: 220,
      canBreakSteel: false,
    });

    state = stepBattle(state, IDLE_INPUT, 0.016);
    expect(state.players[1].alive).toBe(true);
    expect(state.players[1].lives).toBe(3);
    expect(state.players[1].stunTimer).toBeCloseTo(STUN_DURATION, 1);
  });

  it('handles power-up collection (Star, Shovel, Grenade) and scoring', () => {
    let state = createBattleState('1p', 1);
    state.enemies.push({
      uid: 500,
      kind: 'basic',
      x: 100,
      y: 100,
      dir: 'down',
      hp: 1,
      maxHp: 1,
      bonus: false,
      fireCooldown: 2,
      turnTimer: 2,
      treadPhase: 0,
    });
    state.powerUps.push({
      uid: 501,
      kind: 'grenade',
      x: state.players[0].x,
      y: state.players[0].y,
      timer: 10,
    });

    state = stepBattle(state, IDLE_INPUT, 0.016);
    expect(state.enemies.length).toBe(0);
    expect(state.players[0].score).toBe(POWERUP_SCORE);
    expect(state.powerUpsCollected).toBe(1);
  });

  it('tracks tutorial progression, hints, and safe localStorage persistence', () => {
    let tut = createTutorialBattleState();
    expect(getTutorialProgress(tut).stepIndex).toBe(0);
    expect(getBattleHint(tut).title.length).toBeGreaterThan(0);

    tut.bricksBroken = 1;
    expect(getTutorialProgress(tut).stepIndex).toBe(1);

    tut.players[0].kills.basic = 1;
    expect(getTutorialProgress(tut).stepIndex).toBe(2);
    expect(getTotalKills(tut.players[0])).toBe(1);

    tut.powerUpsCollected = 1;
    expect(getTutorialProgress(tut).stepIndex).toBe(3);

    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
    } as Storage;

    saveBattleData({ highScore: 24500, highestStage: 4, muted: true }, mockStorage);
    expect(loadBattleSave(mockStorage)).toEqual({
      highScore: 24500,
      highestStage: 4,
      muted: true,
    });

    store.set('battle_city_v1', 'bad-json');
    expect(loadBattleSave(mockStorage)).toEqual({
      highScore: 20000,
      highestStage: 1,
      muted: false,
    });
  });
});
