import { AI_DEPTH, BOARD_SIZE, type AIDifficulty } from './constants';
import {
  applyMoveToBoard,
  getLegalMovesForPlayer,
  getPieceJumpMoves,
} from './rules';
import type { BoardGrid, Coord, Move, Player } from './types';

/** Expand a player's legal moves into complete turn sequences (handling multi-jumps). */
export function getTurnSequences(
  board: BoardGrid,
  player: Player,
  forcedJumpFrom: Coord | null = null,
): Move[][] {
  const initialMoves = getLegalMovesForPlayer(board, player, forcedJumpFrom);
  if (initialMoves.length === 0) return [];

  const sequences: Move[][] = [];

  function expand(currentBoard: BoardGrid, prefix: Move[], lastMove: Move, crowned: boolean) {
    if (lastMove.captures.length > 0 && !crowned) {
      const nextJumps = getPieceJumpMoves(
        currentBoard,
        lastMove.to.row,
        lastMove.to.col,
      );
      if (nextJumps.length > 0) {
        for (const jump of nextJumps) {
          const applied = applyMoveToBoard(currentBoard, jump);
          expand(applied.board, [...prefix, jump], jump, applied.crowned);
        }
        return;
      }
    }
    sequences.push(prefix);
  }

  for (const move of initialMoves) {
    const applied = applyMoveToBoard(board, move);
    expand(applied.board, [move], move, applied.crowned);
  }

  return sequences;
}

/** Heuristic evaluation of `board` from `perspective` player's point of view. */
export function evaluateBoard(board: BoardGrid, perspective: Player): number {
  let score = 0;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      let value = piece.isKing ? 185 : 100;

      // Advancement bonus for men
      if (!piece.isKing) {
        const advancement = piece.player === 'red' ? 7 - r : r;
        value += advancement * 5;
      }

      // Center control bonus
      if (r >= 2 && r <= 5 && c >= 2 && c <= 5) {
        value += 10;
      }

      // Edge safety bonus
      if (c === 0 || c === BOARD_SIZE - 1) {
        value += 6;
      }

      score += piece.player === perspective ? value : -value;
    }
  }

  return score;
}

function applySequence(board: BoardGrid, sequence: Move[]): BoardGrid {
  let current = board;
  for (const m of sequence) {
    current = applyMoveToBoard(current, m).board;
  }
  return current;
}

function minimax(
  board: BoardGrid,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  aiPlayer: Player,
): number {
  const activePlayer: Player = maximizing
    ? aiPlayer
    : aiPlayer === 'red'
      ? 'black'
      : 'red';

  const sequences = getTurnSequences(board, activePlayer);
  if (sequences.length === 0) {
    return maximizing ? -10000 - depth : 10000 + depth;
  }

  if (depth === 0) {
    return evaluateBoard(board, aiPlayer);
  }

  if (maximizing) {
    let best = -Infinity;
    for (const seq of sequences) {
      const nextBoard = applySequence(board, seq);
      const val = minimax(nextBoard, depth - 1, alpha, beta, false, aiPlayer);
      best = Math.max(best, val);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const seq of sequences) {
      const nextBoard = applySequence(board, seq);
      const val = minimax(nextBoard, depth - 1, alpha, beta, true, aiPlayer);
      best = Math.min(best, val);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

/** Choose the next single move (or first hop of a multi-jump) for `player`. */
export function chooseBestMove(
  board: BoardGrid,
  player: Player,
  difficulty: AIDifficulty,
  forcedJumpFrom: Coord | null = null,
  rng: () => number = Math.random,
): Move | null {
  const sequences = getTurnSequences(board, player, forcedJumpFrom);
  if (sequences.length === 0) return null;
  if (sequences.length === 1) return sequences[0][0];

  const depth = AI_DEPTH[difficulty];
  const scored = sequences.map((seq) => {
    const nextBoard = applySequence(board, seq);
    const score = minimax(
      nextBoard,
      Math.max(0, depth - 1),
      -Infinity,
      Infinity,
      false,
      player,
    );
    return { seq, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Easy AI occasionally picks from top 2 moves for a forgiving feel
  if (difficulty === 'easy' && scored.length > 1 && rng() < 0.35) {
    return scored[1].seq[0];
  }

  const bestScore = scored[0].score;
  const tied = scored.filter((item) => item.score === bestScore);
  const chosen = tied[Math.floor(rng() * tied.length)];
  return chosen.seq[0];
}
