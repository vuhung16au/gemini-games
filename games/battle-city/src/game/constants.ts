import type { EnemyKind } from './types';

export const GRID_SUBTILES = 26; // 13x13 full tiles -> 26x26 half-tiles
export const SUBTILE_PX = 16;
export const CANVAS_SIZE = GRID_SUBTILES * SUBTILE_PX; // 416
export const TANK_SIZE = 28;
export const BULLET_SIZE = 6;

export const PLAYER_SPEED = 96; // px/s
export const PLAYER_BULLET_SPEED_BASE = 220;
export const PLAYER_BULLET_SPEED_FAST = 310;

export const ENEMY_STATS: Record<
  EnemyKind,
  { hp: number; speed: number; bulletSpeed: number; points: number; label: string }
> = {
  basic: { hp: 1, speed: 62, bulletSpeed: 195, points: 100, label: 'Basic Tank' },
  fast: { hp: 1, speed: 108, bulletSpeed: 215, points: 200, label: 'Fast Tank' },
  power: { hp: 1, speed: 74, bulletSpeed: 300, points: 300, label: 'Power Tank' },
  armor: { hp: 4, speed: 64, bulletSpeed: 215, points: 400, label: 'Armored Tank' },
};

export const POWERUP_SCORE = 500;
export const HELMET_DURATION = 10;
export const CLOCK_DURATION = 10;
export const SHOVEL_DURATION = 15;
export const STUN_DURATION = 2.5;
export const SPAWN_ANIM_DURATION = 0.9;
export const MAX_ACTIVE_ENEMIES = 4;

export const TOTAL_STAGES = 10;

export const EAGLE_SUBTILES: ReadonlyArray<readonly [number, number]> = [
  [12, 24],
  [13, 24],
  [12, 25],
  [13, 25],
];

export const FORTRESS_SUBTILES: ReadonlyArray<readonly [number, number]> = [
  [11, 25],
  [11, 24],
  [11, 23],
  [12, 23],
  [13, 23],
  [14, 23],
  [14, 24],
  [14, 25],
];

export const ENEMY_SPAWN_COORDS: ReadonlyArray<{ x: number; y: number }> = [
  { x: 0, y: 0 },
  { x: 12 * SUBTILE_PX, y: 0 },
  { x: 24 * SUBTILE_PX, y: 0 },
];

export const P1_SPAWN = { x: 8 * SUBTILE_PX, y: 24 * SUBTILE_PX };
export const P2_SPAWN = { x: 16 * SUBTILE_PX, y: 24 * SUBTILE_PX };
