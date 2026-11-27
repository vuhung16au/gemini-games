import {
  BASE_SPEED,
  CRASH_QUIPS,
  DINO_DUCK_HEIGHT,
  DINO_DUCK_WIDTH,
  DINO_STANDING_HEIGHT,
  DINO_STANDING_WIDTH,
  DINO_X,
  FAST_FALL_GRAVITY,
  GRAVITY,
  GROUND_Y,
  HSC_FORMULAS,
  JUMP_VELOCITY,
  LOGICAL_WIDTH,
  MAX_SPEED,
  RESTART_COOLDOWN_MS,
  SPEED_INCREMENT,
  TUTORIAL_SPEED,
} from './constants';
import type { DinoObstacle, DinoState, DinoTheme } from './types';

function makeClouds() {
  return [
    { x: 120, y: 42, width: 46, speedFactor: 0.14 },
    { x: 340, y: 28, width: 54, speedFactor: 0.11 },
    { x: 520, y: 54, width: 42, speedFactor: 0.17 },
  ];
}

function makeFormulas() {
  return [
    { x: 110, y: 38, text: HSC_FORMULAS[0], speedFactor: 0.14 },
    { x: 330, y: 26, text: HSC_FORMULAS[1], speedFactor: 0.11 },
    { x: 510, y: 50, text: HSC_FORMULAS[2], speedFactor: 0.17 },
  ];
}

export function createDinoState(options?: {
  highScore?: number;
  theme?: DinoTheme;
  isTutorial?: boolean;
}): DinoState {
  const theme = options?.theme ?? 'classic';
  const isTutorial = Boolean(options?.isTutorial);
  return {
    status: isTutorial ? 'running' : 'idle',
    theme,
    isTutorial,
    dinoY: GROUND_Y - DINO_STANDING_HEIGHT,
    dinoVy: 0,
    isGrounded: true,
    isDucking: false,
    speed: isTutorial ? TUTORIAL_SPEED : BASE_SPEED,
    score: 0,
    highScore: options?.highScore ?? 0,
    lastMilestone: 0,
    milestoneFlashTimer: 0,
    isNight: false,
    animTimer: 0,
    animFrame: 0,
    spawnTimer: isTutorial ? 0.65 : 0.85,
    gameOverAt: 0,
    obstaclesCleared: 0,
    hasJumped: false,
    hasDuckedOrFastFell: false,
    obstacles: [],
    clouds: makeClouds(),
    formulas: makeFormulas(),
    groundTicks: Array.from({ length: 18 }, (_, i) => i * 38),
    crashQuip: CRASH_QUIPS[0],
    nextUid: 1,
    soundQueue: [],
  };
}

export function startDinoRun(
  prev: DinoState,
  options?: { isTutorial?: boolean; theme?: DinoTheme },
): DinoState {
  return {
    ...createDinoState({
      highScore: prev.highScore,
      theme: options?.theme ?? prev.theme,
      isTutorial: options?.isTutorial ?? false,
    }),
    status: 'running',
  };
}

export function triggerJump(prev: DinoState, nowMs: number): DinoState {
  if (prev.status === 'idle') {
    const started = startDinoRun(prev, { isTutorial: prev.isTutorial });
    return {
      ...started,
      dinoVy: JUMP_VELOCITY,
      isGrounded: false,
      hasJumped: true,
      soundQueue: ['jump'],
    };
  }

  if (prev.status === 'gameover') {
    if (nowMs - prev.gameOverAt < RESTART_COOLDOWN_MS) return prev;
    const restarted = startDinoRun(prev, { isTutorial: prev.isTutorial });
    return {
      ...restarted,
      dinoVy: JUMP_VELOCITY,
      isGrounded: false,
      hasJumped: true,
      soundQueue: ['jump'],
    };
  }

  if (prev.status === 'running' && prev.isGrounded) {
    return {
      ...prev,
      dinoVy: JUMP_VELOCITY,
      isGrounded: false,
      isDucking: false,
      hasJumped: true,
      soundQueue: ['jump'],
    };
  }

  return prev;
}

export function setDucking(prev: DinoState, ducking: boolean): DinoState {
  if (prev.status !== 'running') return prev;
  return {
    ...prev,
    isDucking: ducking,
    hasDuckedOrFastFell: prev.hasDuckedOrFastFell || ducking,
  };
}

function spawnObstacle(state: DinoState, rollA: number, rollB: number): DinoObstacle {
  const uid = state.nextUid;
  state.nextUid += 1;

  if (state.isTutorial) {
    // Tutorial alternates easy cactus and mid-height pterodactyl
    if (uid % 2 === 0) {
      return {
        uid,
        kind: state.theme === 'classic' ? 'pterodactyl' : 'flyingSign',
        label: state.theme === 'classic' ? '' : '−',
        x: LOGICAL_WIDTH + 20,
        y: GROUND_Y - 52,
        width: 38,
        height: 24,
        passed: false,
      };
    }
    return {
      uid,
      kind: state.theme === 'classic' ? 'cactus_small' : 'sigma',
      label: state.theme === 'classic' ? '' : '∑',
      x: LOGICAL_WIDTH + 20,
      y: GROUND_Y - 34,
      width: 22,
      height: 34,
      passed: false,
    };
  }

  if (state.theme === 'classic') {
    if (state.score >= 180 && rollA > 0.72) {
      const heights = [GROUND_Y - 28, GROUND_Y - 50, GROUND_Y - 72];
      const y = heights[Math.floor(rollB * heights.length) % heights.length];
      return {
        uid,
        kind: 'pterodactyl',
        label: '',
        x: LOGICAL_WIDTH + 20,
        y,
        width: 42,
        height: 24,
        passed: false,
      };
    }
    if (rollA > 0.65 && state.score > 60) {
      return {
        uid,
        kind: 'cactus_cluster',
        label: '',
        x: LOGICAL_WIDTH + 20,
        y: GROUND_Y - 38,
        width: 46,
        height: 38,
        passed: false,
      };
    }
    if (rollA > 0.34) {
      return {
        uid,
        kind: 'cactus_tall',
        label: '',
        x: LOGICAL_WIDTH + 20,
        y: GROUND_Y - 46,
        width: 24,
        height: 46,
        passed: false,
      };
    }
    return {
      uid,
      kind: 'cactus_small',
      label: '',
      x: LOGICAL_WIDTH + 20,
      y: GROUND_Y - 34,
      width: 20,
      height: 34,
      passed: false,
    };
  }

  // 404 Math Proof Runner obstacles
  if (state.score >= 180 && rollA > 0.72) {
    const heights = [GROUND_Y - 28, GROUND_Y - 50, GROUND_Y - 70];
    const labels = ['−', '÷0', '−x'];
    return {
      uid,
      kind: 'flyingSign',
      label: labels[Math.floor(rollB * labels.length) % labels.length],
      x: LOGICAL_WIDTH + 20,
      y: heights[Math.floor(rollB * heights.length) % heights.length],
      width: 34,
      height: 22,
      passed: false,
    };
  }
  if (rollA > 0.68 && state.score > 70) {
    const labels = ['[ A ]', 'x²+y²', '∂/∂x'];
    return {
      uid,
      kind: 'matrix',
      label: labels[Math.floor(rollB * labels.length) % labels.length],
      x: LOGICAL_WIDTH + 20,
      y: GROUND_Y - 32,
      width: 50,
      height: 32,
      passed: false,
    };
  }
  if (rollA > 0.35) {
    return {
      uid,
      kind: 'integral',
      label: '∫',
      x: LOGICAL_WIDTH + 20,
      y: GROUND_Y - 42,
      width: 24,
      height: 42,
      passed: false,
    };
  }
  const sigmaLabels = ['∑', 'π', '√x'];
  return {
    uid,
    kind: 'sigma',
    label: sigmaLabels[Math.floor(rollB * sigmaLabels.length) % sigmaLabels.length],
    x: LOGICAL_WIDTH + 20,
    y: GROUND_Y - 30,
    width: 26,
    height: 30,
    passed: false,
  };
}

export function stepDino(
  prev: DinoState,
  rawDt: number,
  nowMs: number,
  rng: () => number = Math.random,
): DinoState {
  if (prev.status !== 'running') {
    return { ...prev, soundQueue: [] };
  }

  const dt = Math.min(0.05, Math.max(0, rawDt));
  const state: DinoState = {
    ...prev,
    obstacles: prev.obstacles.map((o) => ({ ...o })),
    clouds: prev.clouds.map((c) => ({ ...c })),
    formulas: prev.formulas.map((f) => ({ ...f })),
    groundTicks: [...prev.groundTicks],
    soundQueue: [],
  };

  if (!state.isTutorial) {
    state.speed = Math.min(MAX_SPEED, state.speed + SPEED_INCREMENT * dt);
  }

  state.animTimer += dt;
  if (state.animTimer >= 0.1) {
    state.animTimer = 0;
    state.animFrame = state.animFrame === 0 ? 1 : 0;
  }

  const activeHeight =
    state.isGrounded && state.isDucking ? DINO_DUCK_HEIGHT : DINO_STANDING_HEIGHT;
  const groundTop = GROUND_Y - activeHeight;

  if (!state.isGrounded) {
    const g = state.isDucking ? FAST_FALL_GRAVITY : GRAVITY;
    state.dinoVy += g * dt;
    state.dinoY += state.dinoVy * dt;
    if (state.dinoY >= groundTop) {
      state.dinoY = groundTop;
      state.dinoVy = 0;
      state.isGrounded = true;
    }
  } else {
    state.dinoY = groundTop;
  }

  // Ground ticks, clouds & formulas
  for (let i = 0; i < state.groundTicks.length; i++) {
    state.groundTicks[i] -= state.speed * dt;
    if (state.groundTicks[i] < -12) {
      state.groundTicks[i] += 18 * 38;
    }
  }

  for (const c of state.clouds) {
    c.x -= state.speed * c.speedFactor * dt;
    if (c.x + c.width < 0) {
      c.x = LOGICAL_WIDTH + 20 + rng() * 60;
      c.y = 22 + rng() * 44;
    }
  }

  for (const f of state.formulas) {
    f.x -= state.speed * f.speedFactor * dt;
    if (f.x + 120 < 0) {
      f.x = LOGICAL_WIDTH + 20 + rng() * 80;
      f.y = 22 + rng() * 42;
      f.text = HSC_FORMULAS[Math.floor(rng() * HSC_FORMULAS.length) % HSC_FORMULAS.length];
    }
  }

  // Spawn obstacles
  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    state.obstacles.push(spawnObstacle(state, rng(), rng()));
    const minGap = state.isTutorial
      ? 1.45
      : Math.max(0.62, 1.35 - (state.speed - BASE_SPEED) / 600);
    state.spawnTimer = minGap + rng() * (state.isTutorial ? 0.35 : 0.72);
  }

  // Move obstacles & count cleared
  for (const obs of state.obstacles) {
    obs.x -= state.speed * dt;
    if (!obs.passed && obs.x + obs.width < DINO_X) {
      obs.passed = true;
      state.obstaclesCleared += 1;
    }
  }
  state.obstacles = state.obstacles.filter((obs) => obs.x + obs.width > -30);

  // Score & 100-pt milestones + Classic Day/Night cycle
  state.score += dt * 11;
  const floored = Math.floor(state.score);
  const milestone = Math.floor(floored / 100);
  if (milestone > state.lastMilestone && milestone > 0) {
    state.lastMilestone = milestone;
    state.milestoneFlashTimer = 0.45;
    state.soundQueue.push('milestone');
  }
  if (state.milestoneFlashTimer > 0) {
    state.milestoneFlashTimer = Math.max(0, state.milestoneFlashTimer - dt);
  }
  state.isNight = state.theme === 'classic' && Math.floor(floored / 700) % 2 === 1;

  // Collision check
  const dinoW = state.isGrounded && state.isDucking ? DINO_DUCK_WIDTH : DINO_STANDING_WIDTH;
  const dinoH = activeHeight;
  const dinoBox = {
    x: DINO_X + 6,
    y: state.dinoY + 4,
    w: dinoW - 14,
    h: dinoH - 8,
  };

  for (const obs of state.obstacles) {
    const obsBox = {
      x: obs.x + 3,
      y: obs.y + 3,
      w: obs.width - 6,
      h: obs.height - 5,
    };
    const hit =
      dinoBox.x < obsBox.x + obsBox.w &&
      dinoBox.x + dinoBox.w > obsBox.x &&
      dinoBox.y < obsBox.y + obsBox.h &&
      dinoBox.y + dinoBox.h > obsBox.y;

    if (hit) {
      const finalScore = floored;
      state.status = 'gameover';
      state.gameOverAt = nowMs;
      state.score = finalScore;
      state.highScore = Math.max(state.highScore, finalScore);
      state.crashQuip = CRASH_QUIPS[finalScore % CRASH_QUIPS.length];
      state.soundQueue.push('crash');
      break;
    }
  }

  return state;
}
