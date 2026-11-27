import React from 'react';
import { BOX_SIZE } from '../game/constants';
import type { CellCoord, CellState } from '../game/types';

interface SudokuBoardProps {
  board: CellState[][];
  selected: CellCoord | null;
  isPaused: boolean;
  onSelectCell: (coord: CellCoord) => void;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  selected,
  isPaused,
  onSelectCell,
}) => {
  const selectedCell = selected ? board[selected.row][selected.col] : null;
  const selectedValue =
    selectedCell && selectedCell.value !== 0 ? selectedCell.value : null;

  return (
    <div
      className="sudoku-board game-surface"
      role="grid"
      aria-label="Sudoku 9 by 9 grid"
    >
      {board.map((row, r) =>
        row.map((cell, c) => {
          const isSelected = selected?.row === r && selected?.col === c;
          const isSameRowOrCol =
            selected !== null && (selected.row === r || selected.col === c);
          const isSameBox =
            selected !== null &&
            Math.floor(selected.row / BOX_SIZE) === Math.floor(r / BOX_SIZE) &&
            Math.floor(selected.col / BOX_SIZE) === Math.floor(c / BOX_SIZE);
          const isPeer = !isSelected && (isSameRowOrCol || isSameBox);
          const isSameDigit =
            !isSelected && selectedValue !== null && cell.value === selectedValue;

          const classes = [
            'sudoku-cell',
            cell.given ? 'is-given' : 'is-editable',
            isSelected ? 'is-selected' : '',
            isPeer ? 'is-peer' : '',
            isSameDigit ? 'is-same-digit' : '',
            cell.isError ? 'is-error' : '',
            c % 3 === 2 && c !== 8 ? 'box-border-right' : '',
            r % 3 === 2 && r !== 8 ? 'box-border-bottom' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={`${r}-${c}`}
              type="button"
              role="gridcell"
              className={classes}
              data-row={r}
              data-col={c}
              data-given={cell.given ? 'true' : 'false'}
              aria-selected={isSelected}
              aria-label={`Row ${r + 1} Column ${c + 1}${
                cell.value ? `, value ${cell.value}` : ', empty'
              }`}
              onClick={() => onSelectCell({ row: r, col: c })}
            >
              {!isPaused && cell.value !== 0 && (
                <span className="cell-value">{cell.value}</span>
              )}

              {!isPaused && cell.value === 0 && cell.notes.length > 0 && (
                <span className="cell-notes" aria-hidden="true">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <span key={n} className="note-slot">
                      {cell.notes.includes(n) ? n : ''}
                    </span>
                  ))}
                </span>
              )}
            </button>
          );
        }),
      )}
    </div>
  );
};
