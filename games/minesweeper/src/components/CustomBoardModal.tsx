import React, { useState } from 'react';
import { MAX_COLS, MAX_ROWS, MIN_COLS, MIN_ROWS, clampCustomConfig } from '../game/constants';
import type { BoardConfig } from '../game/types';

interface CustomBoardModalProps {
  open: boolean;
  initialConfig: BoardConfig;
  onClose: () => void;
  onApply: (config: BoardConfig) => void;
}

export const CustomBoardModal: React.FC<CustomBoardModalProps> = ({
  open,
  initialConfig,
  onClose,
  onApply,
}) => {
  const [rows, setRows] = useState(initialConfig.rows);
  const [cols, setCols] = useState(initialConfig.cols);
  const [mines, setMines] = useState(initialConfig.mines);

  if (!open) return null;

  const maxMines = Math.max(1, rows * cols - 9);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(clampCustomConfig(rows, cols, mines));
  };

  return (
    <div className="ms-modal-backdrop" role="dialog" aria-modal="true" aria-label="Custom Board Size">
      <form className="ms-modal-card" onSubmit={handleSubmit}>
        <div className="ms-modal-head">
          <h2>Custom Board Size</h2>
          <button type="button" className="ms-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="ms-modal-body ms-custom-form">
          <label>
            <span>Rows ({MIN_ROWS}–{MAX_ROWS})</span>
            <input
              type="number"
              min={MIN_ROWS}
              max={MAX_ROWS}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value) || MIN_ROWS)}
              aria-label="Custom rows"
            />
          </label>
          <label>
            <span>Columns ({MIN_COLS}–{MAX_COLS})</span>
            <input
              type="number"
              min={MIN_COLS}
              max={MAX_COLS}
              value={cols}
              onChange={(e) => setCols(Number(e.target.value) || MIN_COLS)}
              aria-label="Custom columns"
            />
          </label>
          <label>
            <span>Mines (1–{maxMines})</span>
            <input
              type="number"
              min={1}
              max={maxMines}
              value={Math.min(mines, maxMines)}
              onChange={(e) => setMines(Number(e.target.value) || 1)}
              aria-label="Custom mines"
            />
          </label>
        </div>

        <div className="ms-modal-foot">
          <button type="button" className="ms-pill-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="ms-primary-btn">
            Start Custom Board
          </button>
        </div>
      </form>
    </div>
  );
};
