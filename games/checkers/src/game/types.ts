import type { AIDifficulty, GameMode } from './constants';

export type Player = 'red' | 'black';

export interface Coord {
  row: number;
  col: number;
}

export interface Piece {
  id: number;
  player: Player;
  isKing: boolean;
}

export type BoardGrid = (Piece | null)[][];

export interface Move {
  from: Coord;
  to: Coord;
  captures: Coord[];
}

export type GameStatus = 'PLAYING' | 'FINISHED';

export interface HistorySnapshot {
  board: BoardGrid;
  currentPlayer: Player;
  forcedJumpFrom: Coord | null;
  moveCount: number;
}

export interface GameState {
  board: BoardGrid;
  currentPlayer: Player;
  selected: Coord | null;
  forcedJumpFrom: Coord | null;
  hintMove: Move | null;
  mode: GameMode;
  difficulty: AIDifficulty;
  status: GameStatus;
  winner: Player | null;
  moveCount: number;
  history: HistorySnapshot[];
}

export interface MoveOutcome {
  state: GameState;
  captured: boolean;
  crowned: boolean;
  continuesJump: boolean;
  gameEnded: boolean;
}

export interface SaveData {
  wins: number;
  losses: number;
  muted: boolean;
  mode: GameMode;
  difficulty: AIDifficulty;
}
