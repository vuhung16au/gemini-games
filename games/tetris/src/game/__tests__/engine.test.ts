import { describe, expect, it } from 'vitest';
import { BOARD_COLS, BOARD_ROWS, PIECE_TYPES } from '../constants';
import {
  canPlace,
  createGameState,
  createShuffledBag,
  getGhostRow,
  hardDrop,
  holdCurrentPiece,
  moveHorizontal,
  rotatePiece,
  softDrop,
  stepFrame,
} from '../engine';
import { findBestPlacement } from '../hints';
import { loadSaveData, saveSaveData } from '../storage';
import { createTutorialState } from '../tutorial';

describe('Tetris engine', () => {
  it('generates a complete 7-bag permutation of all Tetrominoes', () => {
    const bag = createShuffledBag(() => 0.37);
    expect(bag).toHaveLength(7);
    expect(new Set(bag)).toEqual(new Set(PIECE_TYPES));
  });

  it('supports SRS rotation with wall kicks against the right wall', () => {
    const state = createGameState(0, true, () => 0.5);
    state.phase = 'PLAYING';
    // T at rotation 3 (colOffsets 0,1) fits at col 8 (cols 8..9),
    // and rotating 3->0 requires kicking left to col 7 (cols 7..9)
    state.active = { type: 'T', rotation: 3, row: 5, col: BOARD_COLS - 2 };
    const rotated = rotatePiece(state, 1);
    expect(rotated).toBe(true);
    expect(state.active.rotation).toBe(0);
    expect(state.active.col).toBe(BOARD_COLS - 3);
    expect(
      canPlace(
        state.board,
        state.active.type,
        state.active.rotation,
        state.active.row,
        state.active.col,
      ),
    ).toBe(true);
  });

  it('computes ghost row, soft drops, and hard drops with line clear & level up', () => {
    const state = createGameState(0, true, () => 0.5);
    state.phase = 'PLAYING';
    // Fill row 19 except column 9
    for (let c = 0; c < BOARD_COLS - 1; c++) {
      state.board[BOARD_ROWS - 1][c] = 'J';
    }
    state.active = { type: 'I', rotation: 1, row: 0, col: 7 }; // colOffset 2 => col 9
    expect(getGhostRow(state.board, state.active)).toBe(16);

    const softEv = softDrop(state);
    expect(softEv.moved).toBe(true);
    expect(state.score).toBe(1);

    const hardEv = hardDrop(state);
    expect(hardEv.locked).toBe(true);
    expect(hardEv.linesCleared).toBe(1);
    expect(state.lines).toBe(1);
    expect(state.score).toBeGreaterThan(100);
  });

  it('allows Hold once per drop and swaps pieces cleanly', () => {
    const state = createGameState(0, true, () => 0.5);
    state.phase = 'PLAYING';
    const firstType = state.active!.type;
    const nextType = state.nextQueue[0];

    expect(holdCurrentPiece(state)).toBe(true);
    expect(state.hold).toBe(firstType);
    expect(state.active?.type).toBe(nextType);
    expect(state.canHold).toBe(false);

    // Second hold before lock is blocked
    expect(holdCurrentPiece(state)).toBe(false);

    // Locking re-enables Hold
    hardDrop(state);
    expect(state.canHold).toBe(true);
  });

  it('keeps fixed-timestep gravity deterministic across 60Hz and 120Hz', () => {
    const s60 = createGameState(0, true, () => 0.2);
    const s120 = createGameState(0, true, () => 0.2);
    s60.phase = 'PLAYING';
    s120.phase = 'PLAYING';

    for (let i = 0; i < 60; i++) stepFrame(s60, 1 / 60, () => 0.2);
    for (let i = 0; i < 120; i++) stepFrame(s120, 1 / 120, () => 0.2);

    expect(s60.active?.row).toBe(s120.active?.row);
  });

  it('finds placement hints, completes 3-step tutorial, and persists save data safely', () => {
    const tut = createTutorialState(100, true);
    expect(tut.tutorialStep).toBe(0);

    // Step 1: Rotate I-piece vertically
    expect(rotatePiece(tut, 1)).toBe(true);
    expect(tut.tutorialStep).toBe(1);

    // Hint points to col 7 (vertical col 9)
    const hint = findBestPlacement(tut);
    expect(hint?.col).toBe(7);

    // Step 2: Move to col 7 and hard drop to clear row 19
    while (tut.active!.col < 7) {
      moveHorizontal(tut, 1);
    }
    const dropEv = hardDrop(tut);
    expect(dropEv.linesCleared).toBe(1);
    expect(tut.tutorialStep).toBe(2);

    // Step 3: Hold completes tutorial
    expect(holdCurrentPiece(tut)).toBe(true);
    expect(tut.tutorialCompleted).toBe(true);

    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
    } as Storage;

    saveSaveData(
      { highScore: 2400, bestLines: 22, bestLevel: 3, muted: true, ghostEnabled: false },
      mockStorage,
    );
    expect(loadSaveData(mockStorage)).toEqual({
      highScore: 2400,
      bestLines: 22,
      bestLevel: 3,
      muted: true,
      ghostEnabled: false,
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
      highScore: 0,
      bestLines: 0,
      bestLevel: 1,
      muted: false,
      ghostEnabled: true,
    });
  });
});
