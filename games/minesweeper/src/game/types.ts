export type DifficultyPreset = 'easy' | 'medium' | 'hard' | 'custom';

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export interface BoardConfig {
  difficulty: DifficultyPreset;
  rows: number;
  cols: number;
  mines: number;
}

export interface MineCell {
  row: number;
  col: number;
  hasMine: boolean;
  adjacentMines: number;
  revealed: boolean;
  flagged: boolean;
  exploded: boolean;
}

export interface MinesweeperState {
  config: BoardConfig;
  status: GameStatus;
  cells: MineCell[];
  minesPlaced: boolean;
  flagsCount: number;
  revealedSafeCount: number;
  totalSafeCells: number;
  elapsedSeconds: number;
  movesCount: number;
  chordCount: number;
  isTutorial: boolean;
}

export interface MinesweeperHint {
  row: number;
  col: number;
  action: 'reveal' | 'flag' | 'chord';
  message: string;
}

export interface TutorialStep {
  id: string;
  title: string;
  instruction: string;
  check: (state: MinesweeperState) => boolean;
}
