import React from 'react';
import { isDarkSquare } from '../game/rules';
import type { BoardGrid, Coord, Move } from '../game/types';

interface CheckersBoardProps {
  board: BoardGrid;
  selected: Coord | null;
  legalMoves: Move[];
  hintMove: Move | null;
  forcedJumpFrom: Coord | null;
  disabled: boolean;
  onSquareClick: (coord: Coord) => void;
}

export const CheckersBoard: React.FC<CheckersBoardProps> = ({
  board,
  selected,
  legalMoves,
  hintMove,
  forcedJumpFrom,
  disabled,
  onSquareClick,
}) => {
  const selectedMoves = selected
    ? legalMoves.filter(
        (m) => m.from.row === selected.row && m.from.col === selected.col,
      )
    : [];

  const movablePieceKeys = new Set(
    legalMoves.map((m) => `${m.from.row},${m.from.col}`),
  );

  return (
    <div
      className="checkers-board game-surface"
      role="grid"
      aria-label="Checkers 8 by 8 board"
    >
      {board.map((row, r) =>
        row.map((piece, c) => {
          const dark = isDarkSquare(r, c);
          const isSelected = selected?.row === r && selected?.col === c;
          const targetMove = selectedMoves.find(
            (m) => m.to.row === r && m.to.col === c,
          );
          const isMovable = movablePieceKeys.has(`${r},${c}`);
          const isForced =
            forcedJumpFrom?.row === r && forcedJumpFrom?.col === c;
          const isHintFrom =
            hintMove?.from.row === r && hintMove?.from.col === c;
          const isHintTo = hintMove?.to.row === r && hintMove?.to.col === c;

          const squareClasses = [
            'board-square',
            dark ? 'sq-dark' : 'sq-light',
            isSelected ? 'sq-selected' : '',
            isHintFrom || isHintTo ? 'sq-hint' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={`${r}-${c}`}
              type="button"
              role="gridcell"
              className={squareClasses}
              data-row={r}
              data-col={c}
              data-playable={dark ? 'true' : 'false'}
              disabled={disabled || !dark}
              aria-label={`Row ${r + 1} Column ${c + 1}${
                piece
                  ? `, ${piece.player} ${piece.isKing ? 'king' : 'piece'}`
                  : ''
              }`}
              onClick={() => onSquareClick({ row: r, col: c })}
            >
              {piece && (
                <span
                  className={[
                    'checker-piece',
                    piece.player === 'red' ? 'piece-red' : 'piece-black',
                    piece.isKing ? 'piece-king' : '',
                    isMovable && !disabled ? 'piece-movable' : '',
                    isForced ? 'piece-forced' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  data-piece={piece.player}
                  data-king={piece.isKing ? 'true' : 'false'}
                >
                  {piece.isKing && <span className="king-crown">♛</span>}
                </span>
              )}

              {targetMove && (
                <span
                  className={`move-dot ${
                    targetMove.captures.length > 0 ? 'is-capture' : ''
                  }`}
                  data-testid={`move-target-${r}-${c}`}
                />
              )}
            </button>
          );
        }),
      )}
    </div>
  );
};
