import type { LevelId } from './types';

export const VIEW_WIDTH = 512;
export const VIEW_HEIGHT = 384;
export const TILE_SIZE = 32;
export const LEVEL_HEIGHT_TILES = 12;

export const GRAVITY = 1520;
export const MAX_FALL_SPEED = 620;
export const JUMP_VELOCITY = -530;
export const STOMP_BOUNCE_VELOCITY = -340;
export const COYOTE_TIME = 0.09;

export const WALK_ACCEL = 760;
export const RUN_ACCEL = 1150;
export const WALK_MAX_SPEED = 165;
export const RUN_MAX_SPEED = 245;
export const FRICTION = 820;

export const SMALL_WIDTH = 24;
export const SMALL_HEIGHT = 30;
export const SUPER_WIDTH = 26;
export const SUPER_HEIGHT = 54;

export const STAR_DURATION = 10;
export const INVULN_DURATION = 2.0;
export const DEFAULT_TIME_LIMIT = 400;

export const WORLD_1_LEVELS: LevelId[] = ['1-1', '1-2', '1-3', '1-4'];
// TODO: Add Worlds 2-8 level progression list here.
