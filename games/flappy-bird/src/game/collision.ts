import {
  BIRD_HITBOX_RADIUS,
  PIPE_CAP_HEIGHT,
  PIPE_CAP_OVERHANG,
  PIPE_WIDTH,
  PLAYABLE_HEIGHT,
} from './constants';
import type { Bird, PipePair } from './types';

export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Test whether a circle intersects an axis-aligned bounding box. */
export function circleIntersectsAABB(
  cx: number,
  cy: number,
  radius: number,
  rect: AABB,
): boolean {
  const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy < radius * radius;
}

/** Build the four AABBs (top shaft, top cap, bottom cap, bottom shaft) for a pipe pair. */
export function getPipeAABBs(pipe: PipePair): AABB[] {
  const topPipeBottom = pipe.gapY - pipe.gapHeight / 2;
  const bottomPipeTop = pipe.gapY + pipe.gapHeight / 2;
  const capWidth = PIPE_WIDTH + PIPE_CAP_OVERHANG * 2;
  const capX = pipe.x - PIPE_CAP_OVERHANG;

  const rects: AABB[] = [];

  if (topPipeBottom > PIPE_CAP_HEIGHT) {
    rects.push({
      x: pipe.x,
      y: 0,
      width: PIPE_WIDTH,
      height: topPipeBottom - PIPE_CAP_HEIGHT,
    });
  }
  if (topPipeBottom > 0) {
    rects.push({
      x: capX,
      y: topPipeBottom - PIPE_CAP_HEIGHT,
      width: capWidth,
      height: PIPE_CAP_HEIGHT,
    });
  }

  if (bottomPipeTop < PLAYABLE_HEIGHT) {
    rects.push({
      x: capX,
      y: bottomPipeTop,
      width: capWidth,
      height: PIPE_CAP_HEIGHT,
    });
  }
  const bottomShaftY = bottomPipeTop + PIPE_CAP_HEIGHT;
  if (bottomShaftY < PLAYABLE_HEIGHT) {
    rects.push({
      x: pipe.x,
      y: bottomShaftY,
      width: PIPE_WIDTH,
      height: PLAYABLE_HEIGHT - bottomShaftY,
    });
  }

  return rects;
}

/** Check if the bird's circular hitbox overlaps any part of a pipe pair. */
export function checkPipeCollision(bird: Bird, pipe: PipePair): boolean {
  const rects = getPipeAABBs(pipe);
  for (const rect of rects) {
    if (circleIntersectsAABB(bird.x, bird.y, BIRD_HITBOX_RADIUS, rect)) {
      return true;
    }
  }
  return false;
}

/** Check if the bird has hit the ground plane. */
export function checkGroundCollision(bird: Bird): boolean {
  return bird.y + BIRD_HITBOX_RADIUS >= PLAYABLE_HEIGHT;
}
