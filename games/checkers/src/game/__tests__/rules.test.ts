import { describe, expect, it } from 'vitest';
import { chooseBestMove, getTurnSequences } from '../ai';
import { BOARD_SIZE } from '../constants';
import {
  countPieces,
  createInitialState,
  executeMove,
  getLegalMovesForPlayer,
  isDarkSquare,
  undoMove,
} from '../rules';
import { loadSaveData, saveSaveData } from '../storage';
import {
  createCheckersTutorialState,
  getCheckersTutorialProgress,
} from '../tutorial';
import type { BoardGrid, GameState, Piece } from '../types';

function emptyBoard(): BoardGrid {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array<Piece | null>(BOARD_SIZE).fill(null),
  );
}

function makeCustomState(
  board: BoardGrid,
  overrides: Partial<GameState> = {},
): GameState {
  return {
    board,
    currentPlayer: 'red',
    selected: null,
    forcedJumpFrom: null,
    hintMove: null,
    mode: 'two-player',
    difficulty: 'medium',
    status: 'PLAYING',
    winner: null,
    moveCount: 0,
    history: [],
    ...overrides,
  };
}

describe('Checkers rules & AI', () => {
  it('initializes 12 red and 12 black pieces on dark squares', () => {
    const state = createInitialState();
    expect(countPieces(state.board)).toEqual({ red: 12, black: 12 });

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (state.board[r][c]) {
          expect(isDarkSquare(r, c)).toBe(true);
        }
      }
    }
  });

  it('enforces mandatory captures when a jump is available', () => {
    const board = emptyBoard();
    board[5][2] = { id: 1, player: 'red', isKing: false };
    board[4][3] = { id: 2, player: 'black', isKing: false };
    board[5][6] = { id: 3, player: 'red', isKing: false }; // would have step moves

    const moves = getLegalMovesForPlayer(board, 'red');
    expect(moves).toHaveLength(1);
    expect(moves[0].captures).toEqual([{ row: 4, col: 3 }]);
    expect(moves[0].to).toEqual({ row: 3, col: 4 });
  });

  it('forces multi-jump continuation until chain ends', () => {
    const board = emptyBoard();
    board[6][1] = { id: 1, player: 'red', isKing: false };
    board[5][2] = { id: 2, player: 'black', isKing: false };
    board[3][4] = { id: 3, player: 'black', isKing: false };
    board[0][1] = { id: 4, player: 'black', isKing: false };

    const state = makeCustomState(board);
    const firstJump = getLegalMovesForPlayer(state.board, 'red')[0];
    const outcome1 = executeMove(state, firstJump);

    expect(outcome1.captured).toBe(true);
    expect(outcome1.continuesJump).toBe(true);
    expect(outcome1.state.currentPlayer).toBe('red');
    expect(outcome1.state.forcedJumpFrom).toEqual({ row: 4, col: 3 });

    const secondJump = getLegalMovesForPlayer(
      outcome1.state.board,
      'red',
      outcome1.state.forcedJumpFrom,
    )[0];
    const outcome2 = executeMove(outcome1.state, secondJump);

    expect(outcome2.captured).toBe(true);
    expect(outcome2.continuesJump).toBe(false);
    expect(outcome2.state.currentPlayer).toBe('black');
    expect(outcome2.state.forcedJumpFrom).toBeNull();
  });

  it('crowns pieces reaching the back rank and ends the turn', () => {
    const board = emptyBoard();
    board[2][1] = { id: 1, player: 'red', isKing: false };
    board[1][2] = { id: 2, player: 'black', isKing: false };
    board[1][4] = { id: 3, player: 'black', isKing: false }; // backward jump would exist if kinged mid-turn
    board[6][1] = { id: 4, player: 'black', isKing: false };

    const state = makeCustomState(board);
    const jumpToBackRank = getLegalMovesForPlayer(state.board, 'red')[0];
    const outcome = executeMove(state, jumpToBackRank);

    expect(outcome.crowned).toBe(true);
    expect(outcome.continuesJump).toBe(false);
    expect(outcome.state.board[0][3]?.isKing).toBe(true);
    expect(outcome.state.currentPlayer).toBe('black');
  });

  it('detects win when last opponent piece is captured', () => {
    const board = emptyBoard();
    board[4][3] = { id: 1, player: 'red', isKing: false };
    board[3][4] = { id: 2, player: 'black', isKing: false };

    const state = makeCustomState(board);
    const move = getLegalMovesForPlayer(state.board, 'red')[0];
    const outcome = executeMove(state, move);

    expect(outcome.gameEnded).toBe(true);
    expect(outcome.state.status).toBe('FINISHED');
    expect(outcome.state.winner).toBe('red');
  });

  it('AI expands multi-jump sequences and chooses capture', () => {
    const board = emptyBoard();
    board[1][2] = { id: 1, player: 'black', isKing: false };
    board[2][3] = { id: 2, player: 'red', isKing: false };
    board[4][5] = { id: 3, player: 'red', isKing: false };

    const sequences = getTurnSequences(board, 'black');
    expect(sequences).toHaveLength(1);
    expect(sequences[0]).toHaveLength(2);

    const best = chooseBestMove(board, 'black', 'medium');
    expect(best?.to).toEqual({ row: 3, col: 4 });
  });

  it('undoes back to red player turn in vs-ai mode and persists save data safely', () => {
    let state = createInitialState('vs-ai', 'medium');
    const redMove = getLegalMovesForPlayer(state.board, 'red')[0];
    state = executeMove(state, redMove).state;
    const blackMove = getLegalMovesForPlayer(state.board, 'black')[0];
    state = executeMove(state, blackMove).state;

    const undone = undoMove(state);
    expect(undone.currentPlayer).toBe('red');
    expect(undone.moveCount).toBe(0);

    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
    } as Storage;

    saveSaveData(
      { wins: 4, losses: 1, muted: true, mode: 'two-player', difficulty: 'hard' },
      mockStorage,
    );
    expect(loadSaveData(mockStorage)).toEqual({
      wins: 4,
      losses: 1,
      muted: true,
      mode: 'two-player',
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
      wins: 0,
      losses: 0,
      muted: false,
      mode: 'vs-ai',
      difficulty: 'medium',
    });
  });

  it('completes the 3-step Checkers tutorial (move -> jump -> crown)', () => {
    let tut = createCheckersTutorialState();
    expect(getCheckersTutorialProgress(tut)).toEqual({ step: 0, completed: false });

    const step1 = getLegalMovesForPlayer(tut.board, 'red').find(
      (m) => m.to.row === 3 && m.to.col === 2,
    )!;
    tut = { ...executeMove(tut, step1).state, currentPlayer: 'red' };
    expect(getCheckersTutorialProgress(tut).step).toBe(1);

    const step2 = getLegalMovesForPlayer(tut.board, 'red')[0];
    tut = { ...executeMove(tut, step2).state, currentPlayer: 'red' };
    expect(getCheckersTutorialProgress(tut).step).toBe(2);

    const step3 = getLegalMovesForPlayer(tut.board, 'red').find(
      (m) => m.to.row === 0,
    )!;
    tut = executeMove(tut, step3).state;
    expect(getCheckersTutorialProgress(tut)).toEqual({ step: 2, completed: true });
  });
});
