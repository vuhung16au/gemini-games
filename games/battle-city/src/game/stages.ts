import { EAGLE_SUBTILES, FORTRESS_SUBTILES, GRID_SUBTILES, TOTAL_STAGES } from './constants';
import type { EnemyKind, SubTileKind } from './types';

/**
 * Helper to paint a 2x2 subtile block (equivalent to 1 full 13x13 tile)
 * onto the 26x26 subtile grid.
 */
function paintBlock(
  grid: SubTileKind[],
  tx: number,
  ty: number,
  kind: SubTileKind,
): void {
  const sx = tx * 2;
  const sy = ty * 2;
  for (let dy = 0; dy < 2; dy++) {
    for (let dx = 0; dx < 2; dx++) {
      const x = sx + dx;
      const y = sy + dy;
      if (x >= 0 && y >= 0 && x < GRID_SUBTILES && y < GRID_SUBTILES) {
        grid[y * GRID_SUBTILES + x] = kind;
      }
    }
  }
}

function paintHalfBlock(
  grid: SubTileKind[],
  tx: number,
  ty: number,
  half: 'top' | 'bottom' | 'left' | 'right',
  kind: SubTileKind,
): void {
  const sx = tx * 2;
  const sy = ty * 2;
  const coords: Array<[number, number]> =
    half === 'top'
      ? [
          [sx, sy],
          [sx + 1, sy],
        ]
      : half === 'bottom'
        ? [
            [sx, sy + 1],
            [sx + 1, sy + 1],
          ]
        : half === 'left'
          ? [
              [sx, sy],
              [sx, sy + 1],
            ]
          : [
              [sx + 1, sy],
              [sx + 1, sy + 1],
            ];
  for (const [x, y] of coords) {
    if (x >= 0 && y >= 0 && x < GRID_SUBTILES && y < GRID_SUBTILES) {
      grid[y * GRID_SUBTILES + x] = kind;
    }
  }
}

function applyEagleAndClearSpawns(grid: SubTileKind[]): void {
  // Clear enemy spawns (0,0), (6,0), (12,0) full tiles and player spawns (4,12), (8,12)
  paintBlock(grid, 0, 0, 'empty');
  paintBlock(grid, 6, 0, 'empty');
  paintBlock(grid, 12, 0, 'empty');
  paintBlock(grid, 4, 12, 'empty');
  paintBlock(grid, 8, 12, 'empty');

  for (const [x, y] of FORTRESS_SUBTILES) {
    grid[y * GRID_SUBTILES + x] = 'brick';
  }
  for (const [x, y] of EAGLE_SUBTILES) {
    grid[y * GRID_SUBTILES + x] = 'eagle';
  }
}

export function buildStageGrid(stageNumber: number): SubTileKind[] {
  const idx = ((stageNumber - 1) % TOTAL_STAGES) + 1;
  const grid: SubTileKind[] = new Array(GRID_SUBTILES * GRID_SUBTILES).fill('empty');

  if (idx === 1) {
    // Classic 1985 Stage 1 brick columns
    for (const tx of [1, 3, 9, 11]) {
      for (let ty = 1; ty <= 4; ty++) paintBlock(grid, tx, ty, 'brick');
      for (let ty = 8; ty <= 11; ty++) paintBlock(grid, tx, ty, 'brick');
    }
    for (const tx of [5, 7]) {
      for (let ty = 1; ty <= 3; ty++) paintBlock(grid, tx, ty, 'brick');
      for (let ty = 9; ty <= 10; ty++) paintBlock(grid, tx, ty, 'brick');
    }
    paintBlock(grid, 6, 3, 'steel');
    paintBlock(grid, 0, 6, 'steel');
    paintBlock(grid, 12, 6, 'steel');
    paintHalfBlock(grid, 2, 6, 'bottom', 'brick');
    paintHalfBlock(grid, 3, 6, 'bottom', 'brick');
    paintHalfBlock(grid, 9, 6, 'bottom', 'brick');
    paintHalfBlock(grid, 10, 6, 'bottom', 'brick');
    paintBlock(grid, 5, 5, 'brick');
    paintBlock(grid, 7, 5, 'brick');
    paintBlock(grid, 6, 7, 'brick');
  } else if (idx === 2) {
    // River Crossing & Forest Ambush
    for (let tx = 0; tx <= 12; tx++) {
      if (tx !== 2 && tx !== 6 && tx !== 10) {
        paintBlock(grid, tx, 5, 'water');
      }
    }
    for (const tx of [1, 3, 9, 11]) {
      paintBlock(grid, tx, 2, 'forest');
      paintBlock(grid, tx, 3, 'forest');
    }
    for (const tx of [2, 6, 10]) {
      paintBlock(grid, tx, 7, 'brick');
      paintBlock(grid, tx, 8, 'brick');
    }
    paintBlock(grid, 4, 3, 'steel');
    paintBlock(grid, 8, 3, 'steel');
  } else if (idx === 3) {
    // Steel Fortress
    for (let tx = 2; tx <= 10; tx += 2) {
      paintBlock(grid, tx, 2, 'steel');
      paintBlock(grid, tx, 8, 'brick');
    }
    for (let ty = 4; ty <= 6; ty++) {
      paintBlock(grid, 1, ty, 'brick');
      paintBlock(grid, 6, ty, 'steel');
      paintBlock(grid, 11, ty, 'brick');
    }
    paintBlock(grid, 3, 5, 'forest');
    paintBlock(grid, 9, 5, 'forest');
  } else if (idx === 4) {
    // Ice Valley
    for (let ty = 3; ty <= 8; ty++) {
      for (let tx = 3; tx <= 9; tx++) {
        if ((tx + ty) % 2 === 0) paintBlock(grid, tx, ty, 'ice');
      }
    }
    for (const tx of [1, 5, 7, 11]) {
      paintBlock(grid, tx, 2, 'brick');
      paintBlock(grid, tx, 9, 'brick');
    }
    paintBlock(grid, 0, 5, 'steel');
    paintBlock(grid, 12, 5, 'steel');
  } else if (idx === 5) {
    // Twin Bridges
    for (let ty = 2; ty <= 9; ty++) {
      paintBlock(grid, 4, ty, 'water');
      paintBlock(grid, 8, ty, 'water');
    }
    paintBlock(grid, 4, 5, 'empty');
    paintBlock(grid, 8, 5, 'empty');
    for (let tx = 1; tx <= 11; tx += 2) {
      paintBlock(grid, tx, 3, 'brick');
      paintBlock(grid, tx, 7, 'brick');
    }
    paintBlock(grid, 6, 4, 'steel');
  } else {
    // Procedural symmetric battlefields for Stages 6..10
    const seed = idx * 17;
    for (let ty = 1; ty <= 10; ty++) {
      for (let tx = 0; tx <= 6; tx++) {
        const h = (tx * 31 + ty * 19 + seed) % 13;
        let kind: SubTileKind = 'empty';
        if (h === 1 || h === 2 || h === 3) kind = 'brick';
        else if (h === 4 && ty >= 2 && ty <= 8) kind = 'steel';
        else if (h === 5) kind = 'forest';
        else if (h === 6 && ty >= 4 && ty <= 7) kind = 'water';
        else if (h === 7 && ty >= 3 && ty <= 8) kind = 'ice';

        if (kind !== 'empty') {
          paintBlock(grid, tx, ty, kind);
          paintBlock(grid, 12 - tx, ty, kind);
        }
      }
    }
  }

  applyEagleAndClearSpawns(grid);
  return grid;
}

export function buildTutorialGrid(): SubTileKind[] {
  const grid: SubTileKind[] = new Array(GRID_SUBTILES * GRID_SUBTILES).fill('empty');
  // Simple brick line right in front of P1 so Step 1 (Break Brick) is immediate
  paintBlock(grid, 4, 9, 'brick');
  paintBlock(grid, 5, 9, 'brick');
  paintBlock(grid, 6, 9, 'brick');
  paintBlock(grid, 7, 9, 'brick');
  paintBlock(grid, 8, 9, 'brick');
  paintBlock(grid, 2, 5, 'forest');
  paintBlock(grid, 10, 5, 'forest');
  applyEagleAndClearSpawns(grid);
  return grid;
}

export function buildStageEnemyQueue(
  stageNumber: number,
): Array<{ kind: EnemyKind; bonus: boolean }> {
  const idx = ((stageNumber - 1) % TOTAL_STAGES) + 1;
  const counts: Record<EnemyKind, number> =
    idx === 1
      ? { basic: 18, fast: 2, power: 0, armor: 0 }
      : idx === 2
        ? { basic: 14, fast: 4, power: 2, armor: 0 }
        : idx === 3
          ? { basic: 10, fast: 4, power: 4, armor: 2 }
          : idx <= 6
            ? { basic: 8, fast: 5, power: 4, armor: 3 }
            : { basic: 4, fast: 6, power: 5, armor: 5 };

  const raw: EnemyKind[] = [];
  for (let i = 0; i < counts.basic; i++) raw.push('basic');
  for (let i = 0; i < counts.fast; i++) raw.push('fast');
  for (let i = 0; i < counts.power; i++) raw.push('power');
  for (let i = 0; i < counts.armor; i++) raw.push('armor');

  // Interleave deterministically so waves feel lively
  const mixed: Array<{ kind: EnemyKind; bonus: boolean }> = [];
  const step = 3;
  const used = new Array(raw.length).fill(false);
  let cursor = 0;
  while (mixed.length < raw.length) {
    while (used[cursor]) cursor = (cursor + 1) % raw.length;
    used[cursor] = true;
    const waveIndex = mixed.length;
    const bonus = waveIndex === 3 || waveIndex === 10 || waveIndex === 17;
    mixed.push({ kind: raw[cursor], bonus });
    cursor = (cursor + step) % raw.length;
  }

  return mixed;
}
