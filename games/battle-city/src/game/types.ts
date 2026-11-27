export type GameMode = '1p' | '2p';

export type GamePhase = 'title' | 'playing' | 'paused' | 'stage_clear' | 'game_over';

export type Direction = 'up' | 'right' | 'down' | 'left';

export type SubTileKind =
  | 'empty'
  | 'brick'
  | 'steel'
  | 'forest'
  | 'water'
  | 'ice'
  | 'eagle'
  | 'eagle_dead';

export type EnemyKind = 'basic' | 'fast' | 'power' | 'armor';

export type PowerUpKind = 'star' | 'helmet' | 'clock' | 'shovel' | 'grenade' | 'tank';

export interface PlayerInput {
  dir: Direction | null;
  fire: boolean;
}

export interface BattleInput {
  p1: PlayerInput;
  p2: PlayerInput;
}

export interface PlayerTank {
  id: 1 | 2;
  active: boolean;
  alive: boolean;
  x: number;
  y: number;
  dir: Direction;
  lives: number;
  stars: number; // 0..3
  score: number;
  kills: Record<EnemyKind, number>;
  shieldTimer: number;
  stunTimer: number; // 2P friendly-fire stun
  respawnTimer: number;
  fireCooldown: number;
  velX: number;
  velY: number;
  treadPhase: number;
}

export interface EnemyTank {
  uid: number;
  kind: EnemyKind;
  x: number;
  y: number;
  dir: Direction;
  hp: number;
  maxHp: number;
  bonus: boolean;
  fireCooldown: number;
  turnTimer: number;
  treadPhase: number;
}

export interface EnemySpawn {
  uid: number;
  kind: EnemyKind;
  bonus: boolean;
  x: number;
  y: number;
  timer: number;
}

export interface Bullet {
  uid: number;
  owner: 'p1' | 'p2' | 'enemy';
  x: number;
  y: number;
  dir: Direction;
  speed: number;
  canBreakSteel: boolean;
}

export interface PowerUpItem {
  uid: number;
  kind: PowerUpKind;
  x: number;
  y: number;
  timer: number;
}

export interface ExplosionEffect {
  uid: number;
  x: number;
  y: number;
  big: boolean;
  timer: number;
  duration: number;
}

export interface ScorePopup {
  uid: number;
  x: number;
  y: number;
  value: number;
  timer: number;
}

export type SoundEvent =
  | 'stage_start'
  | 'fire'
  | 'brick'
  | 'steel'
  | 'explosion'
  | 'powerup'
  | 'oneup'
  | 'eagle_dead'
  | 'game_over';

export interface BattleState {
  mode: GameMode;
  phase: GamePhase;
  stage: number;
  isTutorial: boolean;
  grid: SubTileKind[]; // 26 * 26
  players: [PlayerTank, PlayerTank];
  enemies: EnemyTank[];
  pendingSpawns: EnemySpawn[];
  enemyQueue: Array<{ kind: EnemyKind; bonus: boolean }>;
  spawnTimer: number;
  nextSpawnSlot: number;
  bullets: Bullet[];
  powerUps: PowerUpItem[];
  explosions: ExplosionEffect[];
  popups: ScorePopup[];
  freezeTimer: number; // Clock power-up
  shovelTimer: number; // Shovel steel fortress
  stageClearTimer: number;
  highScore: number;
  bricksBroken: number;
  powerUpsCollected: number;
  nextUid: number;
  elapsed: number;
  soundQueue: SoundEvent[];
}

export interface BattleHint {
  title: string;
  message: string;
}

export interface TutorialStep {
  id: string;
  title: string;
  instruction: string;
  check: (state: BattleState) => boolean;
}
