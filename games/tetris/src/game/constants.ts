export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;
export const CELL_SIZE = 28;
export const LOGICAL_WIDTH = BOARD_COLS * CELL_SIZE; // 280
export const LOGICAL_HEIGHT = BOARD_ROWS * CELL_SIZE; // 560

export const FIXED_DT = 1 / 120;
export const MAX_FRAME_DT = 0.05;
export const LOCK_DELAY_SEC = 0.45;
export const CLEAR_FLASH_SEC = 0.18;
export const RESTART_COOLDOWN_MS = 400;
export const STORAGE_KEY = 'tetris_v1';

export const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'] as const;
export type PieceType = (typeof PIECE_TYPES)[number];

export const PIECE_COLORS: Record<PieceType, string> = {
  I: '#0891b2',
  O: '#d97706',
  T: '#3c1053', // bookpurple
  S: '#15803d',
  Z: '#b51825', // lawpurple
  J: '#1d4ed8',
  L: '#ea580c',
};

export const PIECE_SHAPES: Record<PieceType, Array<Array<[number, number]>>> = {
  I: [
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
  ],
  O: [
    [
      [0, 1],
      [0, 2],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [0, 2],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [0, 2],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [0, 2],
      [1, 1],
      [1, 2],
    ],
  ],
  T: [
    [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 1],
    ],
    [
      [0, 1],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
  ],
  S: [
    [
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 2],
    ],
    [
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
  ],
  Z: [
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [1, 2],
      [2, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 1],
      [1, 0],
      [1, 1],
      [2, 0],
    ],
  ],
  J: [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [0, 2],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 0],
      [2, 1],
    ],
  ],
  L: [
    [
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  ],
};

/** SRS wall-kick offsets [dRow, dCol] for J, L, S, T, Z. */
export const JLSTZ_KICKS: Record<string, Array<[number, number]>> = {
  '0->1': [
    [0, 0],
    [0, -1],
    [-1, -1],
    [2, 0],
    [2, -1],
  ],
  '1->0': [
    [0, 0],
    [0, 1],
    [1, 1],
    [-2, 0],
    [-2, 1],
  ],
  '1->2': [
    [0, 0],
    [0, 1],
    [1, 1],
    [-2, 0],
    [-2, 1],
  ],
  '2->1': [
    [0, 0],
    [0, -1],
    [-1, -1],
    [2, 0],
    [2, -1],
  ],
  '2->3': [
    [0, 0],
    [0, 1],
    [-1, 1],
    [2, 0],
    [2, 1],
  ],
  '3->2': [
    [0, 0],
    [0, -1],
    [1, -1],
    [-2, 0],
    [-2, -1],
  ],
  '3->0': [
    [0, 0],
    [0, -1],
    [1, -1],
    [-2, 0],
    [-2, -1],
  ],
  '0->3': [
    [0, 0],
    [0, 1],
    [-1, 1],
    [2, 0],
    [2, 1],
  ],
};

/** SRS wall-kick offsets [dRow, dCol] for I piece. */
export const I_KICKS: Record<string, Array<[number, number]>> = {
  '0->1': [
    [0, 0],
    [0, -2],
    [0, 1],
    [1, -2],
    [-2, 1],
  ],
  '1->0': [
    [0, 0],
    [0, 2],
    [0, -1],
    [-1, 2],
    [2, -1],
  ],
  '1->2': [
    [0, 0],
    [0, -1],
    [0, 2],
    [-2, -1],
    [1, 2],
  ],
  '2->1': [
    [0, 0],
    [0, 1],
    [0, -2],
    [2, 1],
    [-1, -2],
  ],
  '2->3': [
    [0, 0],
    [0, 2],
    [0, -1],
    [-1, 2],
    [2, -1],
  ],
  '3->2': [
    [0, 0],
    [0, -2],
    [0, 1],
    [1, -2],
    [-2, 1],
  ],
  '3->0': [
    [0, 0],
    [0, 1],
    [0, -2],
    [2, 1],
    [-1, -2],
  ],
  '0->3': [
    [0, 0],
    [0, -1],
    [0, 2],
    [-2, -1],
    [1, 2],
  ],
};

export const LINE_SCORES = [0, 100, 300, 500, 800] as const;

export function getGravityInterval(level: number): number {
  return Math.max(0.08, 0.8 * Math.pow(0.86, Math.max(0, level - 1)));
}
