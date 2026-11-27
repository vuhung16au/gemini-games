import {
  BOARD_COLS,
  BOARD_ROWS,
  CLEAR_FLASH_SEC,
  FIXED_DT,
  I_KICKS,
  JLSTZ_KICKS,
  LINE_SCORES,
  LOCK_DELAY_SEC,
  MAX_FRAME_DT,
  PIECE_SHAPES,
  PIECE_TYPES,
  RESTART_COOLDOWN_MS,
  getGravityInterval,
  type PieceType,
} from './constants';
import type {
  ActivePiece,
  BoardGrid,
  GameState,
  Rotation,
  StepEvents,
} from './types';

function emptyEvents(): StepEvents {
  return {
    moved: false,
    rotated: false,
    locked: false,
    linesCleared: 0,
    gameOver: false,
    stateChanged: false,
  };
}

export function createEmptyBoard(): BoardGrid {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array<PieceType | null>(BOARD_COLS).fill(null),
  );
}

export function cloneBoard(board: BoardGrid): BoardGrid {
  return board.map((row) => [...row]);
}

export function createShuffledBag(
  rng: () => number = Math.random,
): PieceType[] {
  const bag = [...PIECE_TYPES];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

export function getPieceCells(
  type: PieceType,
  rotation: Rotation,
  row: number,
  col: number,
): Array<[number, number]> {
  return PIECE_SHAPES[type][rotation].map(([dr, dc]) => [row + dr, col + dc]);
}

export function canPlace(
  board: BoardGrid,
  type: PieceType,
  rotation: Rotation,
  row: number,
  col: number,
): boolean {
  const cells = getPieceCells(type, rotation, row, col);
  for (const [r, c] of cells) {
    if (c < 0 || c >= BOARD_COLS || r >= BOARD_ROWS) {
      return false;
    }
    if (r >= 0 && board[r][c] !== null) {
      return false;
    }
  }
  return true;
}

export function getGhostRow(board: BoardGrid, piece: ActivePiece): number {
  let row = piece.row;
  while (canPlace(board, piece.type, piece.rotation, row + 1, piece.col)) {
    row += 1;
  }
  return row;
}

function pullFromQueue(
  state: GameState,
  rng: () => number,
): PieceType {
  while (state.nextQueue.length < 4) {
    if (state.bag.length === 0) {
      state.bag = createShuffledBag(rng);
    }
    state.nextQueue.push(state.bag.shift()!);
  }
  const nextType = state.nextQueue.shift()!;
  if (state.bag.length === 0) {
    state.bag = createShuffledBag(rng);
  }
  state.nextQueue.push(state.bag.shift()!);
  return nextType;
}

function spawnPieceForType(type: PieceType): ActivePiece {
  return {
    type,
    rotation: 0,
    row: 0,
    col: 3,
  };
}

export function createGameState(
  highScore = 0,
  ghostEnabled = true,
  rng: () => number = Math.random,
): GameState {
  const bag = createShuffledBag(rng);
  const nextQueue = [bag.shift()!, bag.shift()!, bag.shift()!];
  const firstType = bag.shift()!;

  return {
    phase: 'START',
    board: createEmptyBoard(),
    active: spawnPieceForType(firstType),
    bag,
    nextQueue,
    hold: null,
    canHold: true,
    score: 0,
    highScore,
    lines: 0,
    level: 1,
    backToBack: false,
    gravityTimer: 0,
    lockTimer: 0,
    accumulator: 0,
    flashRows: [],
    flashTimer: 0,
    gameOverElapsedMs: 0,
    ghostEnabled,
    isTutorial: false,
    tutorialStep: 0,
    tutorialCompleted: false,
    tutorialRotated: false,
  };
}

export function startGame(
  state: GameState,
  force = false,
  rng: () => number = Math.random,
): boolean {
  if (state.phase === 'START') {
    state.phase = 'PLAYING';
    return true;
  }
  if (
    state.phase === 'GAME_OVER' &&
    (force || state.gameOverElapsedMs >= RESTART_COOLDOWN_MS)
  ) {
    const fresh = createGameState(state.highScore, state.ghostEnabled, rng);
    fresh.phase = 'PLAYING';
    Object.assign(state, fresh);
    return true;
  }
  if (force) {
    const fresh = createGameState(state.highScore, state.ghostEnabled, rng);
    fresh.phase = 'PLAYING';
    Object.assign(state, fresh);
    return true;
  }
  return false;
}

export function togglePause(state: GameState): boolean {
  if (state.phase === 'PLAYING') {
    state.phase = 'PAUSED';
    return true;
  }
  if (state.phase === 'PAUSED') {
    state.phase = 'PLAYING';
    return true;
  }
  return false;
}

export function moveHorizontal(state: GameState, deltaCol: number): boolean {
  if (state.phase !== 'PLAYING' || !state.active) return false;
  const { type, rotation, row, col } = state.active;
  if (!canPlace(state.board, type, rotation, row, col + deltaCol)) {
    return false;
  }
  state.active.col += deltaCol;
  if (!canPlace(state.board, type, rotation, row + 1, state.active.col)) {
    state.lockTimer = 0;
  }
  return true;
}

export function rotatePiece(state: GameState, dir: 1 | -1): boolean {
  if (state.phase !== 'PLAYING' || !state.active) return false;
  const { type, rotation, row, col } = state.active;
  if (type === 'O') {
    if (state.isTutorial && state.tutorialStep === 0) {
      state.tutorialRotated = true;
      state.tutorialStep = 1;
    }
    return true;
  }

  const nextRotation = (((rotation + dir) % 4 + 4) % 4) as Rotation;
  const kickKey = `${rotation}->${nextRotation}`;
  const kicks =
    type === 'I'
      ? I_KICKS[kickKey] ?? [[0, 0]]
      : JLSTZ_KICKS[kickKey] ?? [[0, 0]];

  for (const [dRow, dCol] of kicks) {
    if (canPlace(state.board, type, nextRotation, row + dRow, col + dCol)) {
      state.active.rotation = nextRotation;
      state.active.row = row + dRow;
      state.active.col = col + dCol;
      if (
        !canPlace(
          state.board,
          type,
          nextRotation,
          state.active.row + 1,
          state.active.col,
        )
      ) {
        state.lockTimer = 0;
      }
      if (state.isTutorial && state.tutorialStep === 0) {
        state.tutorialRotated = true;
        state.tutorialStep = 1;
      }
      return true;
    }
  }

  return false;
}

function lockActiveAndSpawn(
  state: GameState,
  rng: () => number,
  events: StepEvents,
): void {
  if (!state.active) return;

  const cells = getPieceCells(
    state.active.type,
    state.active.rotation,
    state.active.row,
    state.active.col,
  );
  let toppedOut = false;
  for (const [r, c] of cells) {
    if (r < 0) {
      toppedOut = true;
    } else {
      state.board[r][c] = state.active.type;
    }
  }

  events.locked = true;

  // Detect and clear full rows
  const fullRows: number[] = [];
  for (let r = 0; r < BOARD_ROWS; r++) {
    if (state.board[r].every((cell) => cell !== null)) {
      fullRows.push(r);
    }
  }

  if (fullRows.length > 0) {
    state.flashRows = fullRows;
    state.flashTimer = CLEAR_FLASH_SEC;
    const remainingRows = state.board.filter(
      (_, idx) => !fullRows.includes(idx),
    );
    while (remainingRows.length < BOARD_ROWS) {
      remainingRows.unshift(Array<PieceType | null>(BOARD_COLS).fill(null));
    }
    state.board = remainingRows;

    const count = fullRows.length;
    events.linesCleared = count;
    const basePoints = LINE_SCORES[Math.min(4, count)] * state.level;
    const isTetris = count === 4;
    const bonus = isTetris && state.backToBack ? Math.floor(basePoints * 0.5) : 0;
    state.backToBack = isTetris;

    state.score += basePoints + bonus;
    state.lines += count;
    state.level = Math.floor(state.lines / 10) + 1;
    state.highScore = Math.max(state.highScore, state.score);

    if (state.isTutorial && state.tutorialStep === 1) {
      state.tutorialStep = 2;
    }
  } else {
    state.highScore = Math.max(state.highScore, state.score);
  }

  // Spawn next piece
  const nextType = pullFromQueue(state, rng);
  const spawned = spawnPieceForType(nextType);
  if (
    toppedOut ||
    !canPlace(state.board, spawned.type, spawned.rotation, spawned.row, spawned.col)
  ) {
    state.active = null;
    state.phase = 'GAME_OVER';
    state.gameOverElapsedMs = 0;
    events.gameOver = true;
    events.stateChanged = true;
    return;
  }

  state.active = spawned;
  state.canHold = true;
  state.gravityTimer = 0;
  state.lockTimer = 0;
  events.stateChanged = true;
}

export function softDrop(
  state: GameState,
  rng: () => number = Math.random,
): StepEvents {
  const events = emptyEvents();
  if (state.phase !== 'PLAYING' || !state.active) return events;

  const { type, rotation, row, col } = state.active;
  if (canPlace(state.board, type, rotation, row + 1, col)) {
    state.active.row += 1;
    state.score += 1;
    state.highScore = Math.max(state.highScore, state.score);
    state.gravityTimer = 0;
    events.moved = true;
    events.stateChanged = true;
  } else {
    lockActiveAndSpawn(state, rng, events);
  }
  return events;
}

export function hardDrop(
  state: GameState,
  rng: () => number = Math.random,
): StepEvents {
  const events = emptyEvents();
  if (state.phase !== 'PLAYING' || !state.active) return events;

  const ghostRow = getGhostRow(state.board, state.active);
  const dist = Math.max(0, ghostRow - state.active.row);
  state.active.row = ghostRow;
  state.score += dist * 2;
  state.highScore = Math.max(state.highScore, state.score);
  events.moved = dist > 0;
  lockActiveAndSpawn(state, rng, events);
  return events;
}

export function holdCurrentPiece(
  state: GameState,
  rng: () => number = Math.random,
): boolean {
  if (state.phase !== 'PLAYING' || !state.active || !state.canHold) {
    return false;
  }

  const currentType = state.active.type;
  const nextType = state.hold ?? pullFromQueue(state, rng);
  state.hold = currentType;
  state.canHold = false;
  state.gravityTimer = 0;
  state.lockTimer = 0;

  const spawned = spawnPieceForType(nextType);
  if (
    !canPlace(state.board, spawned.type, spawned.rotation, spawned.row, spawned.col)
  ) {
    state.active = null;
    state.phase = 'GAME_OVER';
    state.gameOverElapsedMs = 0;
    return true;
  }

  state.active = spawned;
  if (state.isTutorial && state.tutorialStep === 2) {
    state.tutorialCompleted = true;
  }
  return true;
}

export function stepFixed(
  state: GameState,
  dt: number,
  rng: () => number = Math.random,
): StepEvents {
  const events = emptyEvents();

  if (state.flashTimer > 0) {
    state.flashTimer = Math.max(0, state.flashTimer - dt);
    if (state.flashTimer === 0) state.flashRows = [];
  }

  if (state.phase === 'GAME_OVER') {
    state.gameOverElapsedMs += dt * 1000;
    return events;
  }

  if (state.phase !== 'PLAYING' || !state.active) {
    return events;
  }

  const { type, rotation, row, col } = state.active;
  const canFall = canPlace(state.board, type, rotation, row + 1, col);

  if (canFall) {
    state.lockTimer = 0;
    state.gravityTimer += dt;
    const interval = getGravityInterval(state.level);
    if (state.gravityTimer >= interval) {
      state.gravityTimer -= interval;
      state.active.row += 1;
      events.moved = true;
    }
  } else {
    state.lockTimer += dt;
    if (state.lockTimer >= LOCK_DELAY_SEC) {
      lockActiveAndSpawn(state, rng, events);
    }
  }

  return events;
}

export function stepFrame(
  state: GameState,
  rawDt: number,
  rng: () => number = Math.random,
): StepEvents {
  const clamped = Math.max(0, Math.min(MAX_FRAME_DT, rawDt));
  state.accumulator += clamped;

  const agg = emptyEvents();
  while (state.accumulator >= FIXED_DT) {
    state.accumulator -= FIXED_DT;
    const ev = stepFixed(state, FIXED_DT, rng);
    agg.moved ||= ev.moved;
    agg.rotated ||= ev.rotated;
    agg.locked ||= ev.locked;
    agg.linesCleared += ev.linesCleared;
    agg.gameOver ||= ev.gameOver;
    agg.stateChanged ||= ev.stateChanged;
  }

  return agg;
}
