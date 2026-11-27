export const LOGICAL_WIDTH = 400;
export const LOGICAL_HEIGHT = 600;
export const GROUND_HEIGHT = 96;
export const PLAYABLE_HEIGHT = LOGICAL_HEIGHT - GROUND_HEIGHT; // 504

export const BIRD_X = 110;
export const BIRD_START_Y = 250;
export const BIRD_VISUAL_RADIUS = 16;
export const BIRD_HITBOX_RADIUS = 13; // ~81% forgiving circular hitbox

export const FIXED_DT = 1 / 120;
export const MAX_FRAME_DT = 0.05;

export const GRAVITY = 1400;
export const FLAP_VELOCITY = -420;
export const TERMINAL_VELOCITY = 600;

export const PIPE_SPEED = 160;
export const PIPE_WIDTH = 60;
export const PIPE_CAP_HEIGHT = 24;
export const PIPE_CAP_OVERHANG = 4;
export const PIPE_MIN_MARGIN = 64;
export const PIPE_GAP_START = 145;
export const PIPE_GAP_MIN = 120;
export const SPAWN_INTERVAL = 1.5;

export const RESTART_COOLDOWN_MS = 400;
export const FLASH_DURATION = 0.1;
export const SHAKE_DURATION = 0.15;

export const STORAGE_KEY = 'flappy_bird_v1';

export type MedalTier = 'bronze' | 'silver' | 'gold' | 'platinum' | null;

/** Progressive pipe gap tightening: 145px down to 120px (-1px per 2 points). */
export function getPipeGap(score: number): number {
  const safeScore = Math.max(0, Math.floor(score));
  return Math.max(PIPE_GAP_MIN, PIPE_GAP_START - Math.floor(safeScore / 2));
}

/** Determine medal tier earned for a given score. */
export function getMedalTier(score: number): MedalTier {
  if (score >= 40) return 'platinum';
  if (score >= 30) return 'gold';
  if (score >= 20) return 'silver';
  if (score >= 10) return 'bronze';
  return null;
}
