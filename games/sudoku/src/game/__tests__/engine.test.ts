import { describe, expect, it } from 'vitest';
import { DIFFICULTY_CLUES, MAX_MISTAKES } from '../constants';
import {
  createBoardFromPuzzle,
  createGameState,
  enterDigit,
  eraseSelectedCell,
  formatTime,
  getRemainingDigitCounts,
  selectCell,
  toggleNotesMode,
  togglePause,
  undoMove,
  useHint,
} from '../engine';
import { countSolutions, generatePuzzle, isValidPlacement } from '../generator';
import { loadSaveData, saveSaveData } from '../storage';
import {
  createSudokuTutorialState,
  getSudokuTutorialProgress,
} from '../tutorial';
import type { GameState } from '../types';

const SAMPLE_SOLUTION: number[][] = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

function makeNearSolvedState(): GameState {
  const puzzle = SAMPLE_SOLUTION.map((r) => [...r]);
  puzzle[0][0] = 0; // Only (0, 0) = 5 is empty
  return {
    difficulty: 'easy',
    board: createBoardFromPuzzle(puzzle),
    solution: SAMPLE_SOLUTION,
    selected: { row: 0, col: 0 },
    notesMode: false,
    mistakes: 0,
    hintsUsed: 0,
    elapsedSeconds: 12,
    status: 'PLAYING',
    history: [],
  };
}

describe('Sudoku generator & engine', () => {
  it('generates a uniquely solvable puzzle with expected clue count', () => {
    const { puzzle, solution } = generatePuzzle('easy');
    let clues = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (puzzle[r][c] !== 0) {
          clues++;
          expect(puzzle[r][c]).toBe(solution[r][c]);
        }
        const val = solution[r][c];
        solution[r][c] = 0;
        expect(isValidPlacement(solution, r, c, val)).toBe(true);
        solution[r][c] = val;
      }
    }
    expect(clues).toBeGreaterThanOrEqual(DIFFICULTY_CLUES.easy);
    expect(countSolutions(puzzle, 2)).toBe(1);
  });

  it('places correct digit, clears peer notes, and wins on final cell', () => {
    let state = makeNearSolvedState();
    // Add note "5" to a peer in same row and same box
    state.board[0][1].notes = [5];
    state.board[1][1].notes = [5];

    const res = enterDigit(state, 5);
    expect(res.changed).toBe(true);
    expect(res.isMistake).toBe(false);
    expect(res.wonNow).toBe(true);
    expect(res.state.status).toBe('WON');
    expect(res.state.board[0][1].notes).toEqual([]);
    expect(res.state.board[1][1].notes).toEqual([]);
  });

  it('tracks mistakes and transitions to LOST after 3 mistakes', () => {
    let state = makeNearSolvedState();
    for (let i = 1; i <= MAX_MISTAKES; i++) {
      const wrongDigit = i === 1 ? 1 : i === 2 ? 2 : 3;
      const res = enterDigit(state, wrongDigit);
      expect(res.isMistake).toBe(true);
      expect(res.state.mistakes).toBe(i);
      state = res.state;
    }
    expect(state.status).toBe('LOST');
  });

  it('toggles pencil notes, erases, and undoes moves', () => {
    let state = makeNearSolvedState();
    state = toggleNotesMode(state);
    expect(state.notesMode).toBe(true);

    state = enterDigit(state, 5).state;
    state = enterDigit(state, 9).state;
    expect(state.board[0][0].notes).toEqual([5, 9]);

    state = undoMove(state);
    expect(state.board[0][0].notes).toEqual([5]);

    state = eraseSelectedCell(state).state;
    expect(state.board[0][0].notes).toEqual([]);
  });

  it('reveals correct digit on Hint and increments hintsUsed', () => {
    const state = makeNearSolvedState();
    const res = useHint(state);
    expect(res.changed).toBe(true);
    expect(res.wonNow).toBe(true);
    expect(res.state.hintsUsed).toBe(1);
    expect(res.state.board[0][0].value).toBe(5);
  });

  it('computes remaining digit counts and pauses/formats time', () => {
    const state = makeNearSolvedState();
    const counts = getRemainingDigitCounts(state.board);
    expect(counts[5]).toBe(1);
    expect(counts[3]).toBe(0);

    const paused = togglePause(selectCell(state, { row: 0, col: 0 }));
    expect(paused.status).toBe('PAUSED');
    expect(formatTime(65)).toBe('01:05');
  });

  it('creates valid initial game state and persists save data safely', () => {
    const game = createGameState('medium');
    expect(game.board).toHaveLength(9);
    expect(game.status).toBe('PLAYING');

    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
    } as Storage;

    saveSaveData(
      {
        bestTimes: { easy: 95 },
        gamesWon: 3,
        muted: true,
        difficulty: 'hard',
      },
      mockStorage,
    );
    expect(loadSaveData(mockStorage)).toEqual({
      bestTimes: { easy: 95 },
      gamesWon: 3,
      muted: true,
      difficulty: 'hard',
    });

    const brokenStorage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('quota');
      },
    } as unknown as Storage;

    expect(loadSaveData(brokenStorage)).toEqual({
      bestTimes: {},
      gamesWon: 0,
      muted: false,
      difficulty: 'easy',
    });
  });

  it('tracks 3-step Sudoku tutorial progression cleanly', () => {
    let tut = createSudokuTutorialState();
    expect(getSudokuTutorialProgress(tut)).toEqual({ step: 0, completed: false });

    tut = enterDigit(tut, 5).state;
    expect(getSudokuTutorialProgress(tut).step).toBe(1);

    tut = toggleNotesMode(tut);
    expect(getSudokuTutorialProgress(tut).step).toBe(2);

    tut = toggleNotesMode(tut);
    tut = selectCell(tut, { row: 0, col: 1 });
    tut = useHint(tut).state;
    tut = useHint(tut).state;
    expect(getSudokuTutorialProgress(tut)).toEqual({ step: 2, completed: true });
  });
});
