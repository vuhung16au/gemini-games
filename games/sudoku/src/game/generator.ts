import {
  BOARD_SIZE,
  BOX_SIZE,
  DIFFICULTY_CLUES,
  type Difficulty,
} from './constants';

function cloneGrid(grid: number[][]): number[][] {
  return grid.map((row) => [...row]);
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Check whether placing `num` at (row, col) obeys Sudoku row/col/box constraints. */
export function isValidPlacement(
  grid: number[][],
  row: number,
  col: number,
  num: number,
): boolean {
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (grid[row][i] === num || grid[i][col] === num) {
      return false;
    }
  }

  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = 0; r < BOX_SIZE; r++) {
    for (let c = 0; c < BOX_SIZE; c++) {
      if (grid[boxRow + r][boxCol + c] === num) {
        return false;
      }
    }
  }

  return true;
}

function findNextEmpty(grid: number[][]): [number, number] | null {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (grid[r][c] === 0) return [r, c];
    }
  }
  return null;
}

/** Solve a 9x9 Sudoku grid in-place using backtracking. */
export function solveGrid(
  grid: number[][],
  rng: () => number = Math.random,
): boolean {
  const empty = findNextEmpty(grid);
  if (!empty) return true;

  const [row, col] = empty;
  const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng);

  for (const num of digits) {
    if (isValidPlacement(grid, row, col, num)) {
      grid[row][col] = num;
      if (solveGrid(grid, rng)) {
        return true;
      }
      grid[row][col] = 0;
    }
  }

  return false;
}

/** Count solutions up to `limit` (used to guarantee a unique solution). */
export function countSolutions(grid: number[][], limit = 2): number {
  const work = cloneGrid(grid);

  function backtrack(): number {
    const empty = findNextEmpty(work);
    if (!empty) return 1;

    const [row, col] = empty;
    let total = 0;

    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(work, row, col, num)) {
        work[row][col] = num;
        total += backtrack();
        work[row][col] = 0;
        if (total >= limit) {
          return total;
        }
      }
    }

    return total;
  }

  return backtrack();
}

/** Generate a complete valid 9x9 Sudoku solution grid. */
export function generateSolution(rng: () => number = Math.random): number[][] {
  const grid = Array.from({ length: BOARD_SIZE }, () =>
    Array<number>(BOARD_SIZE).fill(0),
  );
  solveGrid(grid, rng);
  return grid;
}

/** Generate a uniquely solvable Sudoku puzzle + solution for the given difficulty. */
export function generatePuzzle(
  difficulty: Difficulty,
  rng: () => number = Math.random,
): { puzzle: number[][]; solution: number[][] } {
  const solution = generateSolution(rng);
  const puzzle = cloneGrid(solution);
  const targetClues = DIFFICULTY_CLUES[difficulty];

  const coords = shuffle(
    Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, idx) => ({
      row: Math.floor(idx / BOARD_SIZE),
      col: idx % BOARD_SIZE,
    })),
    rng,
  );

  let remainingClues = BOARD_SIZE * BOARD_SIZE;

  for (const { row, col } of coords) {
    if (remainingClues <= targetClues) break;

    const backup = puzzle[row][col];
    puzzle[row][col] = 0;

    if (countSolutions(puzzle, 2) !== 1) {
      puzzle[row][col] = backup;
    } else {
      remainingClues -= 1;
    }
  }

  return { puzzle, solution };
}
