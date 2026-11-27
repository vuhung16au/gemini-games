import type { Difficulty } from './constants';

export type GameStatus = 'PLAYING' | 'PAUSED' | 'WON' | 'LOST';

export interface CellCoord {
  row: number;
  col: number;
}

export interface CellState {
  row: number;
  col: number;
  value: number;
  given: boolean;
  notes: number[];
  isError: boolean;
}

export interface HistorySnapshot {
  board: CellState[][];
}

export interface GameState {
  difficulty: Difficulty;
  board: CellState[][];
  solution: number[][];
  selected: CellCoord | null;
  notesMode: boolean;
  mistakes: number;
  hintsUsed: number;
  elapsedSeconds: number;
  status: GameStatus;
  history: HistorySnapshot[];
}

export interface InputResult {
  state: GameState;
  changed: boolean;
  isMistake: boolean;
  wonNow: boolean;
  lostNow: boolean;
}

export interface SaveData {
  bestTimes: Partial<Record<Difficulty, number>>;
  gamesWon: number;
  muted: boolean;
  difficulty: Difficulty;
}
