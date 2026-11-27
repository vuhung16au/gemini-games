export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameStatus = 'PLAYING' | 'WON' | 'GAME_OVER';

export interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
  mergedFrom?: [Tile, Tile];
}

export interface HistoryEntry {
  tiles: Tile[];
  score: number;
  status: GameStatus;
  hasWon: boolean;
}

export interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  lastScoreDelta: number;
  moveCount: number;
  status: GameStatus;
  hasWon: boolean;
  nextTileId: number;
  history: HistoryEntry[];
}

export interface MoveResult {
  state: GameState;
  moved: boolean;
  merged: boolean;
  wonNow: boolean;
  gameOverNow: boolean;
  scoreGained: number;
}

export interface SaveData {
  bestScore: number;
  muted: boolean;
}
