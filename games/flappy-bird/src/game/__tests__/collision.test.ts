import { describe, expect, it } from 'vitest';
import {
  checkGroundCollision,
  checkPipeCollision,
  circleIntersectsAABB,
} from '../collision';
import {
  BIRD_HITBOX_RADIUS,
  BIRD_X,
  PIPE_CAP_OVERHANG,
  PIPE_WIDTH,
  PLAYABLE_HEIGHT,
} from '../constants';
import type { Bird, PipePair } from '../types';

function makeBird(y: number): Bird {
  return {
    x: BIRD_X,
    y,
    vy: 0,
    rotation: 0,
    wingPhase: 0,
  };
}

describe('collision', () => {
  it('detects circle-vs-AABB overlap accurately', () => {
    const rect = { x: 100, y: 100, width: 50, height: 50 };
    expect(circleIntersectsAABB(125, 125, 10, rect)).toBe(true);
    expect(circleIntersectsAABB(85, 125, 10, rect)).toBe(false);
    expect(circleIntersectsAABB(92, 125, 10, rect)).toBe(true);
    // Corner miss vs corner hit
    expect(circleIntersectsAABB(90, 90, 10, rect)).toBe(false);
    expect(circleIntersectsAABB(94, 94, 10, rect)).toBe(true);
  });

  it('allows bird safely through the center of a pipe gap', () => {
    const pipe: PipePair = {
      id: 1,
      x: BIRD_X - PIPE_WIDTH / 2,
      gapY: 250,
      gapHeight: 145,
      passed: false,
    };
    const bird = makeBird(250);
    expect(checkPipeCollision(bird, pipe)).toBe(false);
  });

  it('detects collision with top pipe cap overhang', () => {
    const pipe: PipePair = {
      id: 1,
      x: BIRD_X + BIRD_HITBOX_RADIUS + PIPE_CAP_OVERHANG - 2,
      gapY: 250,
      gapHeight: 145,
      passed: false,
    };
    // Top pipe bottom is 250 - 72.5 = 177.5; cap spans [153.5, 177.5]
    const bird = makeBird(165);
    expect(checkPipeCollision(bird, pipe)).toBe(true);
  });

  it('detects collision with bottom pipe shaft', () => {
    const pipe: PipePair = {
      id: 1,
      x: BIRD_X - PIPE_WIDTH / 2,
      gapY: 200,
      gapHeight: 145,
      passed: false,
    };
    const bird = makeBird(330);
    expect(checkPipeCollision(bird, pipe)).toBe(true);
  });

  it('detects ground collision at PLAYABLE_HEIGHT', () => {
    expect(checkGroundCollision(makeBird(PLAYABLE_HEIGHT - BIRD_HITBOX_RADIUS - 1))).toBe(false);
    expect(checkGroundCollision(makeBird(PLAYABLE_HEIGHT - BIRD_HITBOX_RADIUS))).toBe(true);
  });
});
