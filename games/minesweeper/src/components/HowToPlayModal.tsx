import React from 'react';

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="ms-modal-backdrop" role="dialog" aria-modal="true" aria-label="How to Play Minesweeper">
      <div className="ms-modal-card">
        <div className="ms-modal-head">
          <h2>How to Play Minesweeper</h2>
          <button type="button" className="ms-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="ms-modal-body">
          <section>
            <h3>Objective</h3>
            <p>
              Reveal every safe tile on the board without detonating a hidden mine. Each revealed
              number tells you how many mines are hidden in the 8 surrounding tiles. Your first
              click is always guaranteed safe!
            </p>
          </section>

          <section>
            <h3>Controls</h3>
            <ul>
              <li>
                <strong>Left Click / Tap:</strong> Reveal a tile (or plant a flag when{' '}
                <strong>Flag Mode</strong> is active)
              </li>
              <li>
                <strong>Right Click:</strong> Plant or remove a warning flag (<code>🚩</code>)
              </li>
              <li>
                <strong>Chord (Click a Revealed Number):</strong> If its adjacent flags match its
                number, reveals all remaining unflagged neighbors automatically
              </li>
            </ul>
          </section>

          <section>
            <h3>Difficulty Levels &amp; Custom Boards</h3>
            <ul>
              <li>
                <strong>Easy (Default):</strong> 9×9 board, 10 mines
              </li>
              <li>
                <strong>Medium:</strong> 16×16 board, 40 mines
              </li>
              <li>
                <strong>Hard:</strong> 30×16 board, 99 mines
              </li>
              <li>
                <strong>Custom:</strong> Choose your own rows (5–24), columns (5–36), and mine count
              </li>
            </ul>
          </section>
        </div>

        <div className="ms-modal-foot">
          <button type="button" className="ms-primary-btn" onClick={onClose}>
            Back to Board
          </button>
        </div>
      </div>
    </div>
  );
};
