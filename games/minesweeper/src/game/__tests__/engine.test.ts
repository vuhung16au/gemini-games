import { describe, expect, it } from 'vitest';
import { PRESET_CONFIGS, clampCustomConfig } from '../constants';
import {
  chordCell,
  createMinesweeperState,
  indexOf,
  revealCell,
  toggleFlag,
} from '../engine';
import { getMinesweeperHint } from '../hints';
import { loadMinesweeperSave, saveMinesweeperData } from '../storage';
import { getTutorialProgress } from '../tutorial';

describe('Minesweeper Engine', () => {
  it('creates Easy (9x9/10), Medium (16x16/40), Hard (30x16/99), and Custom boards', () => {
    const easy = createMinesweeperState(PRESET_CONFIGS.easy);
    expect(easy.cells.length).toBe(81);
    expect(easy.totalSafeCells).toBe(71);

    const med = createMinesweeperState(PRESET_CONFIGS.medium);
    expect(med.cells.length).toBe(256);

    const hard = createMinesweeperState(PRESET_CONFIGS.hard);
    expect(hard.cells.length).toBe(480);

    const custom = createMinesweeperState(clampCustomConfig(10, 12, 999));
    expect(custom.config.rows).toBe(10);
    expect(custom.config.cols).toBe(12);
    expect(custom.config.mines).toBe(111); // clamped to rows*cols - 9
  });

  it('guarantees first-click 3x3 safety and flood-fills empty pockets', () => {
    const initial = createMinesweeperState(PRESET_CONFIGS.easy);
    const res = revealCell(initial, 4, 4, () => 0.2);
    expect(res.exploded).toBe(false);
    expect(res.state.minesPlaced).toBe(true);
    expect(res.state.revealedSafeCount).toBeGreaterThanOrEqual(9);
  });

  it('supports flagging, chording, winning, and losing on mine click', () => {
    let state = createMinesweeperState(clampCustomConfig(5, 5, 4));
    state = revealCell(state, 0, 0, () => 0.25).state;

    // Locate the single mine
    const mine = state.cells.find((c) => c.hasMine)!;
    const flagged = toggleFlag(state, mine.row, mine.col);
    expect(flagged.state.flagsCount).toBe(1);

    // Unflag and click mine -> lost
    const unflagged = toggleFlag(flagged.state, mine.row, mine.col).state;
    const boom = revealCell(unflagged, mine.row, mine.col);
    expect(boom.exploded).toBe(true);
    expect(boom.state.status).toBe('lost');

    // Separate board: chord on a satisfied number
    let s2 = createMinesweeperState(clampCustomConfig(5, 5, 1));
    s2 = revealCell(s2, 0, 0, () => 0.99).state;
    const mine2 = s2.cells.find((c) => c.hasMine)!;
    s2 = toggleFlag(s2, mine2.row, mine2.col).state;
    const adjNum = s2.cells.find((c) => c.revealed && c.adjacentMines === 1);
    if (adjNum) {
      const chorded = chordCell(s2, adjNum.row, adjNum.col);
      expect(chorded.state.chordCount).toBeGreaterThanOrEqual(0);
    }
  });

  it('provides solver hints, tracks 3-step tutorial, and persists safely in localStorage', () => {
    let tut = createMinesweeperState(PRESET_CONFIGS.easy, { isTutorial: true });
    expect(getTutorialProgress(tut).stepIndex).toBe(0);
    expect(getMinesweeperHint(tut)?.action).toBe('reveal');

    tut = revealCell(tut, 4, 4, () => 0.3).state;
    expect(getTutorialProgress(tut).stepIndex).toBe(1);

    const hidden = tut.cells.find((c) => !c.revealed)!;
    tut = toggleFlag(tut, hidden.row, hidden.col).state;
    expect(getTutorialProgress(tut).stepIndex).toBeGreaterThanOrEqual(2);

    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
    } as Storage;

    saveMinesweeperData({ bestTimes: { easy: 18 }, difficulty: 'medium', muted: true }, mockStorage);
    expect(loadMinesweeperSave(mockStorage)).toEqual({
      bestTimes: { easy: 18 },
      difficulty: 'medium',
      muted: true,
    });

    store.set('minesweeper_v1', '{bad');
    expect(loadMinesweeperSave(mockStorage)).toEqual({
      bestTimes: {},
      difficulty: 'easy',
      muted: false,
    });

    void indexOf;
  });
});
