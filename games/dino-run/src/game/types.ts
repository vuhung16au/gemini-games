export type GameStatus = 'idle' | 'running' | 'paused' | 'gameover';

export type DinoTheme = 'classic' | 'math404';

export type ObstacleKind =
  | 'cactus_small'
  | 'cactus_tall'
  | 'cactus_cluster'
  | 'pterodactyl'
  | 'sigma'
  | 'integral'
  | 'matrix'
  | 'flyingSign';

export interface DinoObstacle {
  uid: number;
  kind: ObstacleKind;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  passed: boolean;
}

export interface CloudEntity {
  x: number;
  y: number;
  width: number;
  speedFactor: number;
}

export interface FloatingFormula {
  x: number;
  y: number;
  text: string;
  speedFactor: number;
}

export type DinoSoundEvent = 'jump' | 'milestone' | 'crash';

export interface DinoState {
  status: GameStatus;
  theme: DinoTheme;
  isTutorial: boolean;
  dinoY: number;
  dinoVy: number;
  isGrounded: boolean;
  isDucking: boolean;
  speed: number;
  score: number;
  highScore: number;
  lastMilestone: number;
  milestoneFlashTimer: number;
  isNight: boolean;
  animTimer: number;
  animFrame: 0 | 1;
  spawnTimer: number;
  gameOverAt: number;
  obstaclesCleared: number;
  hasJumped: boolean;
  hasDuckedOrFastFell: boolean;
  obstacles: DinoObstacle[];
  clouds: CloudEntity[];
  formulas: FloatingFormula[];
  groundTicks: number[];
  crashQuip: string;
  nextUid: number;
  soundQueue: DinoSoundEvent[];
}

export interface DinoHint {
  title: string;
  message: string;
}

export interface TutorialStep {
  id: string;
  title: string;
  instruction: string;
  check: (state: DinoState) => boolean;
}
