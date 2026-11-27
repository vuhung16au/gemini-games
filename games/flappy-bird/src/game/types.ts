export type GamePhase = 'START' | 'PLAYING' | 'GAME_OVER';

export interface Bird {
  x: number;
  y: number;
  vy: number;
  /** Pitch angle in radians (-25 deg upward on flap, up to +90 deg nose-dive). */
  rotation: number;
  /** Continuous phase for 3-frame wing animation. */
  wingPhase: number;
}

export interface PipePair {
  id: number;
  x: number;
  gapY: number;
  gapHeight: number;
  passed: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
}

export interface GameState {
  phase: GamePhase;
  bird: Bird;
  pipes: PipePair[];
  particles: Particle[];
  nextPipeId: number;
  score: number;
  bestScore: number;
  isNewBest: boolean;
  elapsed: number;
  spawnTimer: number;
  accumulator: number;
  groundOffset: number;
  cloudOffset: number;
  cityOffset: number;
  gameOverElapsedMs: number;
  flashTimer: number;
  shakeTimer: number;
  isTutorial: boolean;
  tutorialCompleted: boolean;
  hintEnabled: boolean;
}

export interface StepEvents {
  flapped: boolean;
  scored: boolean;
  hit: boolean;
  stateChanged: boolean;
}

export interface SaveData {
  bestScore: number;
  muted: boolean;
}
