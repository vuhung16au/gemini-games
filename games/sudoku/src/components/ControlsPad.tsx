import React from 'react';

interface ControlsPadProps {
  notesMode: boolean;
  canUndo: boolean;
  remainingCounts: Record<number, number>;
  onUndo: () => void;
  onErase: () => void;
  onToggleNotes: () => void;
  onHint: () => void;
  onEnterDigit: (digit: number) => void;
}

export const ControlsPad: React.FC<ControlsPadProps> = ({
  notesMode,
  canUndo,
  remainingCounts,
  onUndo,
  onErase,
  onToggleNotes,
  onHint,
  onEnterDigit,
}) => {
  return (
    <div className="controls-pad">
      <div className="tool-row">
        <button
          type="button"
          className="game-btn game-btn-secondary tool-btn"
          disabled={!canUndo}
          onClick={onUndo}
          title="Undo (Z)"
        >
          <span>↩</span>
          <span>Undo</span>
        </button>

        <button
          type="button"
          className="game-btn game-btn-secondary tool-btn"
          onClick={onErase}
          title="Erase (Backspace)"
        >
          <span>⌫</span>
          <span>Erase</span>
        </button>

        <button
          type="button"
          className={`game-btn tool-btn ${
            notesMode ? 'game-btn-primary' : 'game-btn-secondary'
          }`}
          aria-pressed={notesMode}
          onClick={onToggleNotes}
          title="Toggle Notes (N)"
        >
          <span>✎</span>
          <span>Notes {notesMode ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          className="game-btn game-btn-secondary tool-btn"
          onClick={onHint}
          title="Hint (H)"
        >
          <span>💡</span>
          <span>Hint</span>
        </button>
      </div>

      <div className="numpad-row" role="group" aria-label="Number pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
          const left = remainingCounts[digit] ?? 0;
          const isComplete = left === 0;
          return (
            <button
              key={digit}
              type="button"
              className={`numpad-btn ${isComplete ? 'is-complete' : ''}`}
              onClick={() => onEnterDigit(digit)}
              aria-label={`Enter ${digit}`}
            >
              <span className="numpad-digit">{digit}</span>
              <span className="numpad-left">{left}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
