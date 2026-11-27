import {
  BOARD_SIZE,
  MAX_UNDO_HISTORY,
  type AIDifficulty,
  type GameMode,
} from './constants';
import type {
  BoardGrid,
  Coord,
  GameState,
  Move,
  MoveOutcome,
  Piece,
  Player,
} from './types';

export function cloneBoard(board: BoardGrid): BoardGrid {
  return board.map((row) =>
    row.map((cell) => (cell ? { ...cell } : null)),
  );
}

export function isDarkSquare(row: number, col: number): boolean {
  return (row + col) % 2 === 1;
}

function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function getMoveRowDirections(piece: Piece): number[] {
  if (piece.isKing) return [-1, 1];
  return piece.player === 'red' ? [-1] : [1];
}

/** Create standard 8x8 American Checkers starting board. */
export function createInitialBoard(): BoardGrid {
  const board: BoardGrid = Array.from({ length: BOARD_SIZE }, () =>
    Array<Piece | null>(BOARD_SIZE).fill(null),
  );

  let nextId = 1;
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!isDarkSquare(row, col)) continue;
      if (row < 3) {
        board[row][col] = { id: nextId++, player: 'black', isKing: false };
      } else if (row > 4) {
        board[row][col] = { id: nextId++, player: 'red', isKing: false };
      }
    }
  }

  return board;
}

export function createInitialState(
  mode: GameMode = 'vs-ai',
  difficulty: AIDifficulty = 'medium',
): GameState {
  return {
    board: createInitialBoard(),
    currentPlayer: 'red',
    selected: null,
    forcedJumpFrom: null,
    hintMove: null,
    mode,
    difficulty,
    status: 'PLAYING',
    winner: null,
    moveCount: 0,
    history: [],
  };
}

/** Get all single-hop capture jumps for a piece at (row, col). */
export function getPieceJumpMoves(
  board: BoardGrid,
  row: number,
  col: number,
): Move[] {
  const piece = board[row]?.[col];
  if (!piece) return [];

  const jumps: Move[] = [];
  const rowDirs = getMoveRowDirections(piece);

  for (const dr of rowDirs) {
    for (const dc of [-1, 1]) {
      const midRow = row + dr;
      const midCol = col + dc;
      const landRow = row + dr * 2;
      const landCol = col + dc * 2;

      if (!isInBounds(landRow, landCol)) continue;
      const midPiece = board[midRow][midCol];
      if (
        midPiece &&
        midPiece.player !== piece.player &&
        board[landRow][landCol] === null
      ) {
        jumps.push({
          from: { row, col },
          to: { row: landRow, col: landCol },
          captures: [{ row: midRow, col: midCol }],
        });
      }
    }
  }

  return jumps;
}

/** Get all non-capturing diagonal step moves for a piece at (row, col). */
export function getPieceStepMoves(
  board: BoardGrid,
  row: number,
  col: number,
): Move[] {
  const piece = board[row]?.[col];
  if (!piece) return [];

  const steps: Move[] = [];
  const rowDirs = getMoveRowDirections(piece);

  for (const dr of rowDirs) {
    for (const dc of [-1, 1]) {
      const toRow = row + dr;
      const toCol = col + dc;
      if (isInBounds(toRow, toCol) && board[toRow][toCol] === null) {
        steps.push({
          from: { row, col },
          to: { row: toRow, col: toCol },
          captures: [],
        });
      }
    }
  }

  return steps;
}

/**
 * Get all legal moves for `player`.
 * Enforces mandatory captures and forced multi-jump continuation.
 */
export function getLegalMovesForPlayer(
  board: BoardGrid,
  player: Player,
  forcedJumpFrom: Coord | null = null,
): Move[] {
  if (forcedJumpFrom) {
    return getPieceJumpMoves(board, forcedJumpFrom.row, forcedJumpFrom.col);
  }

  const jumpMoves: Move[] = [];
  const stepMoves: Move[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (!piece || piece.player !== player) continue;
      jumpMoves.push(...getPieceJumpMoves(board, r, c));
      if (jumpMoves.length === 0) {
        stepMoves.push(...getPieceStepMoves(board, r, c));
      }
    }
  }

  return jumpMoves.length > 0 ? jumpMoves : stepMoves;
}

/** Count remaining pieces for each player. */
export function countPieces(board: BoardGrid): Record<Player, number> {
  let red = 0;
  let black = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p?.player === 'red') red++;
      else if (p?.player === 'black') black++;
    }
  }
  return { red, black };
}

/** Apply a single move/hop to a board grid, returning the updated board and crowning flag. */
export function applyMoveToBoard(
  board: BoardGrid,
  move: Move,
): { board: BoardGrid; crowned: boolean } {
  const nextBoard = cloneBoard(board);
  const movingPiece = nextBoard[move.from.row][move.from.col];
  if (!movingPiece) {
    return { board: nextBoard, crowned: false };
  }

  nextBoard[move.from.row][move.from.col] = null;
  for (const cap of move.captures) {
    nextBoard[cap.row][cap.col] = null;
  }

  const shouldCrown =
    !movingPiece.isKing &&
    ((movingPiece.player === 'red' && move.to.row === 0) ||
      (movingPiece.player === 'black' && move.to.row === BOARD_SIZE - 1));

  nextBoard[move.to.row][move.to.col] = {
    ...movingPiece,
    isKing: movingPiece.isKing || shouldCrown,
  };

  return { board: nextBoard, crowned: shouldCrown };
}

/** Execute a legal move on the full GameState. */
export function executeMove(state: GameState, move: Move): MoveOutcome {
  if (state.status !== 'PLAYING') {
    return {
      state,
      captured: false,
      crowned: false,
      continuesJump: false,
      gameEnded: false,
    };
  }

  const snapshot = {
    board: cloneBoard(state.board),
    currentPlayer: state.currentPlayer,
    forcedJumpFrom: state.forcedJumpFrom ? { ...state.forcedJumpFrom } : null,
    moveCount: state.moveCount,
  };

  const { board: nextBoard, crowned } = applyMoveToBoard(state.board, move);
  const captured = move.captures.length > 0;

  // Standard American Checkers: multi-jump continues unless the piece just crowned
  const followUpJumps =
    captured && !crowned
      ? getPieceJumpMoves(nextBoard, move.to.row, move.to.col)
      : [];

  if (followUpJumps.length > 0) {
    return {
      state: {
        ...state,
        board: nextBoard,
        selected: { ...move.to },
        forcedJumpFrom: { ...move.to },
        hintMove: null,
        moveCount: state.moveCount + 1,
        history: [...state.history, snapshot].slice(-MAX_UNDO_HISTORY),
      },
      captured,
      crowned,
      continuesJump: true,
      gameEnded: false,
    };
  }

  const nextPlayer: Player = state.currentPlayer === 'red' ? 'black' : 'red';
  const nextCounts = countPieces(nextBoard);
  const opponentMoves = getLegalMovesForPlayer(nextBoard, nextPlayer, null);
  const gameEnded =
    nextCounts[nextPlayer] === 0 || opponentMoves.length === 0;

  return {
    state: {
      ...state,
      board: nextBoard,
      currentPlayer: gameEnded ? state.currentPlayer : nextPlayer,
      selected: null,
      forcedJumpFrom: null,
      hintMove: null,
      status: gameEnded ? 'FINISHED' : 'PLAYING',
      winner: gameEnded ? state.currentPlayer : null,
      moveCount: state.moveCount + 1,
      history: [...state.history, snapshot].slice(-MAX_UNDO_HISTORY),
    },
    captured,
    crowned,
    continuesJump: false,
    gameEnded,
  };
}

/** Undo the last move (in vs-ai mode, rewinds back to the human player's turn). */
export function undoMove(state: GameState): GameState {
  if (state.history.length === 0) {
    return state;
  }

  const nextHistory = [...state.history];
  let snapshot = nextHistory.pop()!;

  if (state.mode === 'vs-ai') {
    while (
      nextHistory.length > 0 &&
      (snapshot.currentPlayer !== 'red' || snapshot.forcedJumpFrom !== null)
    ) {
      snapshot = nextHistory.pop()!;
    }
  }

  return {
    ...state,
    board: cloneBoard(snapshot.board),
    currentPlayer: snapshot.currentPlayer,
    selected: snapshot.forcedJumpFrom ? { ...snapshot.forcedJumpFrom } : null,
    forcedJumpFrom: snapshot.forcedJumpFrom
      ? { ...snapshot.forcedJumpFrom }
      : null,
    hintMove: null,
    status: 'PLAYING',
    winner: null,
    moveCount: snapshot.moveCount,
    history: nextHistory,
  };
}
