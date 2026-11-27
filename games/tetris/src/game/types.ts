import type { PieceType } from './constants';

export type Rotation = 0 | 1 | 2 | 3;
export type GamePhase = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
export type BoardGrid = (PieceType | null)[][];

export interface ActivePiece {
  type: PieceType;
  rotation: Rotation;
  row: number;
  col: number;
}

export interface PlacementHint {
  type: PieceType;
  rotation: Rotation;
  row: number;
  col: number;
  cells: Array<[number, number]>;
  reason: string;
}

export interface GameState {
  phase: GamePhase;
  board: BoardGrid;
  active: ActivePiece | null;
  bag: PieceType[];
  nextQueue: PieceType[];
  hold: PieceType | null;
  canHold: boolean;
  score: number;
  highScore: number;
  lines: number;
  level: number;
  backToBack: boolean;
  gravityTimer: number;
  lockTimer: number;
  accumulator: number;
  flashRows: number[];
  flashTimer: number;
  gameOverElapsedMs: number;
  ghostEnabled: boolean;
  isTutorial: boolean;
  tutorialStep: number;
  tutorialCompleted: boolean;
  tutorialRotated: boolean;
}

export interface StepEvents {
  moved: boolean;
  rotated: boolean;
  locked: boolean;
  linesCleared: number;
  gameOver: boolean;
  stateChanged: boolean;
}

export interface SaveData {
  highScore: number;
  bestLines: number;
  bestLevel: number;
  muted: boolean;
  ghostEnabled: boolean;
}
