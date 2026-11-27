export type LevelId = '1-1' | '1-2' | '1-3' | '1-4' | 'tutorial';
// TODO: Expand LevelId union with '2-1'..'8-4' when Worlds 2-8 are implemented.

export type LevelTheme = 'overworld' | 'underground' | 'athletic' | 'castle';

export type GamePhase =
  | 'title'
  | 'playing'
  | 'paused'
  | 'stage_clear'
  | 'victory'
  | 'game_over';

export type MarioForm = 'small' | 'super' | 'fire';

export type TileKind =
  | 'empty'
  | 'ground'
  | 'brick'
  | 'question'
  | 'used'
  | 'pipe_tl'
  | 'pipe_tr'
  | 'pipe_bl'
  | 'pipe_br'
  | 'hard'
  | 'bridge'
  | 'lava'
  | 'castle_wall'
  | 'hidden_1up';

export type QuestionReward = 'coin' | 'mushroom' | 'star' | 'oneup';

export type EnemyKind = 'goomba' | 'koopa' | 'shell' | 'piranha' | 'bowser';

export type ItemKind = 'coin' | 'mushroom' | 'flower' | 'star' | 'oneup';

export interface PlayerInput {
  left: boolean;
  right: boolean;
  crouch: boolean;
  jumpPressed: boolean;
  jumpHeld: boolean;
  run: boolean;
  firePressed: boolean;
}

export interface PlayerEntity {
  id: 1 | 2;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  facing: 1 | -1;
  form: MarioForm;
  onGround: boolean;
  crouching: boolean;
  coyoteTimer: number;
  starTimer: number;
  invulnTimer: number;
  stompCombo: number;
  walkPhase: number;
  alive: boolean;
  lives: number;
  score: number;
  coins: number;
}

export interface EnemyEntity {
  uid: number;
  kind: EnemyKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  alive: boolean;
  hp: number;
  baseY?: number; // For Piranha Plant pipe cycle
  timer?: number;
  shellMoving?: boolean;
}

export interface ItemEntity {
  uid: number;
  kind: ItemKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
}

export interface FireballEntity {
  uid: number;
  owner: 'player' | 'bowser';
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface MovingPlatform {
  uid: number;
  x: number;
  y: number;
  width: number;
  height: number;
  axis: 'x' | 'y';
  min: number;
  max: number;
  speed: number;
  dir: 1 | -1;
  dx: number;
  dy: number;
}

export interface FireBar {
  uid: number;
  cx: number;
  cy: number;
  length: number;
  angle: number;
  speed: number;
}

export interface ParticleEffect {
  uid: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  timer: number;
}

export interface ScorePopup {
  uid: number;
  x: number;
  y: number;
  text: string;
  timer: number;
}

export interface LevelDefinition {
  id: LevelId;
  name: string;
  theme: LevelTheme;
  widthTiles: number;
  heightTiles: number;
  timeLimit: number;
  tiles: TileKind[];
  rewards: Record<string, QuestionReward>;
  enemies: Array<{ kind: EnemyKind; tx: number; ty: number }>;
  coins: Array<{ tx: number; ty: number }>;
  platforms: Array<{
    tx: number;
    ty: number;
    widthTiles: number;
    axis: 'x' | 'y';
    rangeTiles: number;
    speed: number;
  }>;
  fireBars: Array<{ tx: number; ty: number; balls: number; speed: number }>;
  goalType: 'flagpole' | 'axe';
  goalTx: number;
  goalTy: number;
}

export type SoundEvent =
  | 'jump'
  | 'coin'
  | 'powerup'
  | 'oneup'
  | 'brick'
  | 'bump'
  | 'stomp'
  | 'fireball'
  | 'flagpole'
  | 'castle_clear'
  | 'hurt'
  | 'game_over';

export interface MarioState {
  levelId: LevelId;
  theme: LevelTheme;
  phase: GamePhase;
  isTutorial: boolean;
  widthTiles: number;
  heightTiles: number;
  tiles: TileKind[];
  rewards: Record<string, QuestionReward>;
  /**
   * Array of players so 2-Player Simultaneous Co-op (TODO) can drop in cleanly.
   * v1 uses players[0] (Mario).
   */
  players: PlayerEntity[];
  enemies: EnemyEntity[];
  items: ItemEntity[];
  fireballs: FireballEntity[];
  platforms: MovingPlatform[];
  fireBars: FireBar[];
  particles: ParticleEffect[];
  popups: ScorePopup[];
  goalType: 'flagpole' | 'axe';
  goalX: number;
  goalY: number;
  bridgeCollapsing: boolean;
  cameraX: number;
  timeLeft: number;
  highScore: number;
  blocksHit: number;
  mushroomsCollected: number;
  enemiesStomped: number;
  nextUid: number;
  elapsed: number;
  soundQueue: SoundEvent[];
}

export interface MarioHint {
  title: string;
  message: string;
}

export interface TutorialStep {
  id: string;
  title: string;
  instruction: string;
  check: (state: MarioState) => boolean;
}
