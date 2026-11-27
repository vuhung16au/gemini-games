import type { SUITS } from './constants';

export type Suit = (typeof SUITS)[number];
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type DrawMode = 1 | 3;
export type GameStatus = 'PLAYING' | 'PAUSED' | 'WON';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export type CardLocation =
  | { zone: 'waste'; pileIndex: 0; cardIndex: number }
  | { zone: 'tableau'; pileIndex: number; cardIndex: number }
  | { zone: 'foundation'; pileIndex: number; cardIndex: number };

export type DropTarget =
  | { zone: 'tableau'; pileIndex: number }
  | { zone: 'foundation'; pileIndex: number };

export type MoveHint =
  | {
      type: 'move';
      from: CardLocation;
      to: DropTarget;
      reason: string;
    }
  | {
      type: 'draw';
      reason: string;
    };

export interface HistorySnapshot {
  stock: Card[];
  waste: Card[];
  foundations: Card[][];
  tableau: Card[][];
  score: number;
  moves: number;
  tutorialStep: number;
  tutorialCompleted: boolean;
}

export interface GameState {
  stock: Card[];
  waste: Card[];
  foundations: Card[][];
  tableau: Card[][];
  drawMode: DrawMode;
  score: number;
  moves: number;
  elapsedSeconds: number;
  status: GameStatus;
  isTutorial: boolean;
  tutorialStep: number;
  tutorialCompleted: boolean;
  history: HistorySnapshot[];
}

export interface MoveResult {
  state: GameState;
  moved: boolean;
  toFoundation: boolean;
  wonNow: boolean;
}

export interface SaveData {
  gamesWon: number;
  bestScore: number;
  bestTimeSeconds: number | null;
  drawMode: DrawMode;
  muted: boolean;
}
