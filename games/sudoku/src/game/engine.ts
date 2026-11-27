import {
  BOARD_SIZE,
  BOX_SIZE,
  MAX_MISTAKES,
  MAX_UNDO_HISTORY,
  type Difficulty,
} from './constants';
import { generatePuzzle } from './generator';
import type {
  CellCoord,
  CellState,
  GameState,
  InputResult,
} from './types';

function cloneBoard(board: CellState[][]): CellState[][] {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      notes: [...cell.notes],
    })),
  );
}

/** Build CellState[][] from raw 9x9 puzzle & solution matrices. */
export function createBoardFromPuzzle(puzzle: number[][]): CellState[][] {
  return puzzle.map((row, r) =>
    row.map((value, c) => ({
      row: r,
      col: c,
      value,
      given: value !== 0,
      notes: [],
      isError: false,
    })),
  );
}

/** Create a new Sudoku game state for the specified difficulty. */
export function createGameState(
  difficulty: Difficulty = 'easy',
  rng: () => number = Math.random,
): GameState {
  const { puzzle, solution } = generatePuzzle(difficulty, rng);
  return {
    difficulty,
    board: createBoardFromPuzzle(puzzle),
    solution,
    selected: null,
    notesMode: false,
    mistakes: 0,
    hintsUsed: 0,
    elapsedSeconds: 0,
    status: 'PLAYING',
    history: [],
  };
}

/** Check whether all 81 cells match the solution grid. */
export function isBoardSolved(
  board: CellState[][],
  solution: number[][],
): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c].value !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
}

/** Count how many instances of each digit (1..9) remain to be placed. */
export function getRemainingDigitCounts(
  board: CellState[][],
): Record<number, number> {
  const counts: Record<number, number> = {};
  for (let d = 1; d <= 9; d++) counts[d] = 9;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = board[r][c];
      if (cell.value >= 1 && cell.value <= 9 && !cell.isError) {
        counts[cell.value] = Math.max(0, counts[cell.value] - 1);
      }
    }
  }

  return counts;
}

/** Clear `digit` from pencil notes in the same row, column, and 3x3 box. */
function clearPeerNotes(
  board: CellState[][],
  row: number,
  col: number,
  digit: number,
): void {
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let i = 0; i < BOARD_SIZE; i++) {
    board[row][i].notes = board[row][i].notes.filter((n) => n !== digit);
    board[i][col].notes = board[i][col].notes.filter((n) => n !== digit);
  }

  for (let r = 0; r < BOX_SIZE; r++) {
    for (let c = 0; c < BOX_SIZE; c++) {
      const cell = board[boxRow + r][boxCol + c];
      cell.notes = cell.notes.filter((n) => n !== digit);
    }
  }
}

export function selectCell(
  state: GameState,
  coord: CellCoord | null,
): GameState {
  return {
    ...state,
    selected: coord,
  };
}

export function toggleNotesMode(state: GameState): GameState {
  if (state.status !== 'PLAYING') return state;
  return {
    ...state,
    notesMode: !state.notesMode,
  };
}

/** Enter a digit (1..9) into the currently selected cell. */
export function enterDigit(state: GameState, digit: number): InputResult {
  if (
    state.status !== 'PLAYING' ||
    !state.selected ||
    digit < 1 ||
    digit > 9
  ) {
    return {
      state,
      changed: false,
      isMistake: false,
      wonNow: false,
      lostNow: false,
    };
  }

  const { row, col } = state.selected;
  const target = state.board[row][col];
  if (target.given) {
    return {
      state,
      changed: false,
      isMistake: false,
      wonNow: false,
      lostNow: false,
    };
  }

  // Notes mode: toggle pencil mark
  if (state.notesMode) {
    if (target.value !== 0 && !target.isError) {
      return {
        state,
        changed: false,
        isMistake: false,
        wonNow: false,
        lostNow: false,
      };
    }

    const prevSnapshot = { board: cloneBoard(state.board) };
    const nextBoard = cloneBoard(state.board);
    const cell = nextBoard[row][col];
    cell.value = 0;
    cell.isError = false;
    cell.notes = cell.notes.includes(digit)
      ? cell.notes.filter((n) => n !== digit)
      : [...cell.notes, digit].sort((a, b) => a - b);

    return {
      state: {
        ...state,
        board: nextBoard,
        history: [...state.history, prevSnapshot].slice(-MAX_UNDO_HISTORY),
      },
      changed: true,
      isMistake: false,
      wonNow: false,
      lostNow: false,
    };
  }

  // Normal mode: if same correct value is already placed, no-op
  if (target.value === digit && !target.isError) {
    return {
      state,
      changed: false,
      isMistake: false,
      wonNow: false,
      lostNow: false,
    };
  }

  const prevSnapshot = { board: cloneBoard(state.board) };
  const nextBoard = cloneBoard(state.board);
  const cell = nextBoard[row][col];
  const isCorrect = state.solution[row][col] === digit;

  cell.value = digit;
  cell.notes = [];
  cell.isError = !isCorrect;

  if (isCorrect) {
    clearPeerNotes(nextBoard, row, col, digit);
  }

  const nextMistakes = isCorrect ? state.mistakes : state.mistakes + 1;
  const wonNow = isCorrect && isBoardSolved(nextBoard, state.solution);
  const lostNow = !isCorrect && nextMistakes >= MAX_MISTAKES;

  const nextStatus = wonNow ? 'WON' : lostNow ? 'LOST' : 'PLAYING';

  return {
    state: {
      ...state,
      board: nextBoard,
      mistakes: nextMistakes,
      status: nextStatus,
      history: [...state.history, prevSnapshot].slice(-MAX_UNDO_HISTORY),
    },
    changed: true,
    isMistake: !isCorrect,
    wonNow,
    lostNow,
  };
}

/** Erase value and pencil notes from the selected non-given cell. */
export function eraseSelectedCell(state: GameState): InputResult {
  if (state.status !== 'PLAYING' || !state.selected) {
    return {
      state,
      changed: false,
      isMistake: false,
      wonNow: false,
      lostNow: false,
    };
  }

  const { row, col } = state.selected;
  const target = state.board[row][col];
  if (target.given || (target.value === 0 && target.notes.length === 0)) {
    return {
      state,
      changed: false,
      isMistake: false,
      wonNow: false,
      lostNow: false,
    };
  }

  const prevSnapshot = { board: cloneBoard(state.board) };
  const nextBoard = cloneBoard(state.board);
  nextBoard[row][col].value = 0;
  nextBoard[row][col].notes = [];
  nextBoard[row][col].isError = false;

  return {
    state: {
      ...state,
      board: nextBoard,
      history: [...state.history, prevSnapshot].slice(-MAX_UNDO_HISTORY),
    },
    changed: true,
    isMistake: false,
    wonNow: false,
    lostNow: false,
  };
}

/** Reveal the solution value for the selected cell (or first unsolved cell). */
export function useHint(state: GameState): InputResult {
  if (state.status !== 'PLAYING') {
    return {
      state,
      changed: false,
      isMistake: false,
      wonNow: false,
      lostNow: false,
    };
  }

  let targetCoord: CellCoord | null = null;
  if (state.selected) {
    const c = state.board[state.selected.row][state.selected.col];
    if (!c.given && (c.value === 0 || c.isError)) {
      targetCoord = { row: c.row, col: c.col };
    }
  }

  if (!targetCoord) {
    outer: for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const cell = state.board[r][c];
        if (!cell.given && (cell.value === 0 || cell.isError)) {
          targetCoord = { row: r, col: c };
          break outer;
        }
      }
    }
  }

  if (!targetCoord) {
    return {
      state,
      changed: false,
      isMistake: false,
      wonNow: false,
      lostNow: false,
    };
  }

  const { row, col } = targetCoord;
  const correctDigit = state.solution[row][col];
  const prevSnapshot = { board: cloneBoard(state.board) };
  const nextBoard = cloneBoard(state.board);

  nextBoard[row][col].value = correctDigit;
  nextBoard[row][col].notes = [];
  nextBoard[row][col].isError = false;
  clearPeerNotes(nextBoard, row, col, correctDigit);

  const wonNow = isBoardSolved(nextBoard, state.solution);

  return {
    state: {
      ...state,
      board: nextBoard,
      selected: targetCoord,
      hintsUsed: state.hintsUsed + 1,
      status: wonNow ? 'WON' : 'PLAYING',
      history: [...state.history, prevSnapshot].slice(-MAX_UNDO_HISTORY),
    },
    changed: true,
    isMistake: false,
    wonNow,
    lostNow: false,
  };
}

/** Restore the previous board state from history. */
export function undoMove(state: GameState): GameState {
  if (state.status !== 'PLAYING' || state.history.length === 0) {
    return state;
  }

  const prev = state.history[state.history.length - 1];
  return {
    ...state,
    board: cloneBoard(prev.board),
    history: state.history.slice(0, -1),
  };
}

/** Toggle PAUSED <-> PLAYING. */
export function togglePause(state: GameState): GameState {
  if (state.status === 'PLAYING') {
    return { ...state, status: 'PAUSED' };
  }
  if (state.status === 'PAUSED') {
    return { ...state, status: 'PLAYING' };
  }
  return state;
}

/** Increment elapsed timer by 1 second when PLAYING. */
export function tickSecond(state: GameState): GameState {
  if (state.status !== 'PLAYING') return state;
  return {
    ...state,
    elapsedSeconds: state.elapsedSeconds + 1,
  };
}

/** Format seconds as MM:SS. */
export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
