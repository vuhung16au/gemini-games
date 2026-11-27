import { checkGroundCollision, checkPipeCollision } from './collision';
import {
  BIRD_HITBOX_RADIUS,
  BIRD_START_Y,
  BIRD_X,
  FIXED_DT,
  FLAP_VELOCITY,
  FLASH_DURATION,
  GRAVITY,
  LOGICAL_WIDTH,
  MAX_FRAME_DT,
  PIPE_CAP_OVERHANG,
  PIPE_MIN_MARGIN,
  PIPE_SPEED,
  PIPE_WIDTH,
  PLAYABLE_HEIGHT,
  RESTART_COOLDOWN_MS,
  SHAKE_DURATION,
  SPAWN_INTERVAL,
  TERMINAL_VELOCITY,
  getPipeGap,
} from './constants';
import type { GameState, Particle, PipePair, StepEvents } from './types';

const UPWARD_TILT_RAD = (-25 * Math.PI) / 180;
const DOWNWARD_TILT_RAD = (90 * Math.PI) / 180;

/** Create a fresh initial game state. */
export function createInitialState(
  bestScore = 0,
  options: { isTutorial?: boolean; hintEnabled?: boolean } = {},
): GameState {
  return {
    phase: 'START',
    bird: {
      x: BIRD_X,
      y: BIRD_START_Y,
      vy: 0,
      rotation: 0,
      wingPhase: 0,
    },
    pipes: [],
    particles: [],
    nextPipeId: 1,
    score: 0,
    bestScore,
    isNewBest: false,
    elapsed: 0,
    spawnTimer: 0,
    accumulator: 0,
    groundOffset: 0,
    cloudOffset: 0,
    cityOffset: 0,
    gameOverElapsedMs: 0,
    flashTimer: 0,
    shakeTimer: 0,
    isTutorial: Boolean(options.isTutorial),
    tutorialCompleted: false,
    hintEnabled: Boolean(options.hintEnabled),
  };
}

function spawnFlapParticles(state: GameState, rng: () => number): void {
  const count = 4;
  for (let i = 0; i < count; i++) {
    const angle = Math.PI + (rng() - 0.5) * 1.1;
    const speed = 45 + rng() * 65;
    const maxLife = 0.28 + rng() * 0.16;
    const particle: Particle = {
      x: state.bird.x - 10 + (rng() - 0.5) * 6,
      y: state.bird.y + 4 + (rng() - 0.5) * 6,
      vx: Math.cos(angle) * speed - 30,
      vy: Math.sin(angle) * speed + 20,
      radius: 2.5 + rng() * 2,
      life: maxLife,
      maxLife,
    };
    state.particles.push(particle);
  }
}

function spawnPipe(state: GameState, rng: () => number): void {
  const gapHeight = state.isTutorial ? 190 : getPipeGap(state.score);
  const minGapY = PIPE_MIN_MARGIN + gapHeight / 2;
  const maxGapY = PLAYABLE_HEIGHT - PIPE_MIN_MARGIN - gapHeight / 2;
  const gapY = minGapY + rng() * Math.max(0, maxGapY - minGapY);

  const pipe: PipePair = {
    id: state.nextPipeId++,
    x: LOGICAL_WIDTH + PIPE_CAP_OVERHANG,
    gapY,
    gapHeight,
    passed: false,
  };
  state.pipes.push(pipe);
}

function triggerGameOver(state: GameState, events: StepEvents): void {
  state.phase = 'GAME_OVER';
  state.gameOverElapsedMs = 0;
  state.flashTimer = FLASH_DURATION;
  state.shakeTimer = SHAKE_DURATION;
  events.hit = true;
  events.stateChanged = true;

  if (state.score > state.bestScore) {
    state.bestScore = state.score;
    state.isNewBest = true;
  }
}

/** Apply a flap input. Starts the game if currently in START. */
export function flap(
  state: GameState,
  rng: () => number = Math.random,
): StepEvents {
  const events: StepEvents = {
    flapped: false,
    scored: false,
    hit: false,
    stateChanged: false,
  };

  if (state.phase === 'GAME_OVER') {
    return events;
  }

  if (state.phase === 'START') {
    state.phase = 'PLAYING';
    state.spawnTimer = 0.25;
    events.stateChanged = true;
  }

  state.bird.vy = FLAP_VELOCITY;
  state.bird.rotation = UPWARD_TILT_RAD;
  spawnFlapParticles(state, rng);
  events.flapped = true;

  return events;
}

/** Attempt to restart from GAME_OVER once the 400ms cooldown has elapsed. */
export function tryRestart(state: GameState): boolean {
  if (state.phase !== 'GAME_OVER') {
    return false;
  }
  if (state.gameOverElapsedMs < RESTART_COOLDOWN_MS) {
    return false;
  }

  const bestScore = state.bestScore;
  const fresh = createInitialState(bestScore, {
    isTutorial: state.isTutorial,
    hintEnabled: state.hintEnabled,
  });
  Object.assign(state, fresh);
  return true;
}

function updateParticles(state: GameState, dt: number): void {
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 180 * dt;
    p.life -= dt;
    if (p.life <= 0) {
      state.particles.splice(i, 1);
    }
  }
}

function scrollParallax(state: GameState, dt: number): void {
  state.groundOffset = (state.groundOffset + PIPE_SPEED * dt) % 48;
  state.cityOffset = (state.cityOffset + PIPE_SPEED * 0.4 * dt) % LOGICAL_WIDTH;
  state.cloudOffset = (state.cloudOffset + PIPE_SPEED * 0.15 * dt) % LOGICAL_WIDTH;
}

/** Advance simulation by one fixed physics timestep. */
export function stepFixed(
  state: GameState,
  dt: number,
  rng: () => number = Math.random,
): StepEvents {
  const events: StepEvents = {
    flapped: false,
    scored: false,
    hit: false,
    stateChanged: false,
  };

  state.elapsed += dt;
  if (state.flashTimer > 0) state.flashTimer = Math.max(0, state.flashTimer - dt);
  if (state.shakeTimer > 0) state.shakeTimer = Math.max(0, state.shakeTimer - dt);
  updateParticles(state, dt);

  if (state.phase === 'START') {
    state.bird.y = BIRD_START_Y + Math.sin(state.elapsed * 4.5) * 8;
    state.bird.rotation = 0;
    state.bird.wingPhase += dt * 10;
    scrollParallax(state, dt);
    return events;
  }

  if (state.phase === 'GAME_OVER') {
    state.gameOverElapsedMs += dt * 1000;
    const maxY = PLAYABLE_HEIGHT - BIRD_HITBOX_RADIUS;
    if (state.bird.y < maxY) {
      state.bird.vy = Math.min(TERMINAL_VELOCITY, state.bird.vy + GRAVITY * dt);
      state.bird.y = Math.min(maxY, state.bird.y + state.bird.vy * dt);
      state.bird.rotation = Math.min(
        DOWNWARD_TILT_RAD,
        state.bird.rotation + 6 * dt,
      );
    } else {
      state.bird.y = maxY;
      state.bird.vy = 0;
      state.bird.rotation = DOWNWARD_TILT_RAD;
    }
    return events;
  }

  // PLAYING state
  scrollParallax(state, dt);

  // Bird kinematics
  state.bird.vy = Math.min(TERMINAL_VELOCITY, state.bird.vy + GRAVITY * dt);
  state.bird.y += state.bird.vy * dt;

  // Non-lethal ceiling clamp
  if (state.bird.y < BIRD_HITBOX_RADIUS) {
    state.bird.y = BIRD_HITBOX_RADIUS;
    if (state.bird.vy < 0) {
      state.bird.vy = 0;
    }
  }

  // Bird pitch & wing speed
  if (state.bird.vy < 120) {
    state.bird.rotation = UPWARD_TILT_RAD;
    state.bird.wingPhase += dt * 16;
  } else {
    const fallRatio = Math.min(
      1,
      (state.bird.vy - 120) / (TERMINAL_VELOCITY - 120),
    );
    const targetRot =
      UPWARD_TILT_RAD + fallRatio * (DOWNWARD_TILT_RAD - UPWARD_TILT_RAD);
    state.bird.rotation += (targetRot - state.bird.rotation) * Math.min(1, dt * 10);
    state.bird.wingPhase += dt * 6;
  }

  // Pipe spawning
  state.spawnTimer += dt;
  if (state.spawnTimer >= SPAWN_INTERVAL) {
    state.spawnTimer -= SPAWN_INTERVAL;
    spawnPipe(state, rng);
  }

  // Pipe movement, scoring & cleanup
  const activePipeSpeed = state.isTutorial ? 120 : PIPE_SPEED;
  for (let i = state.pipes.length - 1; i >= 0; i--) {
    const pipe = state.pipes[i];
    pipe.x -= activePipeSpeed * dt;

    if (!pipe.passed && pipe.x + PIPE_WIDTH / 2 < state.bird.x) {
      pipe.passed = true;
      state.score += 1;
      if (state.isTutorial && state.score >= 2) {
        state.tutorialCompleted = true;
      }
      events.scored = true;
    }

    if (pipe.x + PIPE_WIDTH + PIPE_CAP_OVERHANG < 0) {
      state.pipes.splice(i, 1);
    }
  }

  // Collision detection (pipes + ground)
  if (checkGroundCollision(state.bird)) {
    state.bird.y = PLAYABLE_HEIGHT - BIRD_HITBOX_RADIUS;
    state.bird.vy = 0;
    triggerGameOver(state, events);
    return events;
  }

  for (const pipe of state.pipes) {
    if (checkPipeCollision(state.bird, pipe)) {
      triggerGameOver(state, events);
      return events;
    }
  }

  return events;
}

/**
 * Advance simulation for a variable frame delta using a fixed-timestep accumulator.
 * Ensures identical physics across 60Hz, 120Hz, and 144Hz+ displays.
 */
export function stepFrame(
  state: GameState,
  rawDt: number,
  rng: () => number = Math.random,
): StepEvents {
  const clampedDt = Math.max(0, Math.min(MAX_FRAME_DT, rawDt));
  state.accumulator += clampedDt;

  const aggregated: StepEvents = {
    flapped: false,
    scored: false,
    hit: false,
    stateChanged: false,
  };

  while (state.accumulator >= FIXED_DT) {
    state.accumulator -= FIXED_DT;
    const stepEv = stepFixed(state, FIXED_DT, rng);
    aggregated.flapped ||= stepEv.flapped;
    aggregated.scored ||= stepEv.scored;
    aggregated.hit ||= stepEv.hit;
    aggregated.stateChanged ||= stepEv.stateChanged;
  }

  return aggregated;
}
