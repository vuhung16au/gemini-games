import React from 'react';

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="bc-modal-backdrop" role="dialog" aria-modal="true" aria-label="How to Play Battle City">
      <div className="bc-modal-card">
        <div className="bc-modal-head">
          <h2>How to Play Battle City (1985)</h2>
          <button type="button" className="bc-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="bc-modal-body">
          <section>
            <h3>Objective</h3>
            <p>
              Destroy all <strong>20 enemy tanks</strong> in each stage while protecting your{' '}
              <strong>Eagle HQ (🦅)</strong> at the bottom-center. If any shell—enemy or friendly—hits
              the Eagle, the game ends immediately!
            </p>
          </section>

          <section>
            <h3>Controls</h3>
            <ul>
              <li>
                <strong>1-Player Mode:</strong> <code>WASD</code> or <code>Arrow Keys</code> to
                move, <code>Space</code> / <code>Enter</code> / <code>F</code> to fire.
              </li>
              <li>
                <strong>2-Player Local Co-op:</strong> Player 1 (Gold) uses <code>WASD</code> +{' '}
                <code>Space</code>; Player 2 (Green) uses <code>Arrow Keys</code> +{' '}
                <code>Enter</code>. Friendly shots stun your partner for 2.5s!
              </li>
              <li>
                <strong>Pause:</strong> <code>P</code> or <code>Escape</code>
              </li>
            </ul>
          </section>

          <section>
            <h3>Power-Ups (+500 pts)</h3>
            <ul>
              <li>
                <strong>★ Star:</strong> Upgrade tank (1★ fast shot · 2★ rapid double-shot · 3★
                breaks Steel walls)
              </li>
              <li>
                <strong>⛑ Helmet:</strong> Temporary invulnerability shield
              </li>
              <li>
                <strong>⏱ Clock:</strong> Freezes all enemy tanks for 10s
              </li>
              <li>
                <strong>⛏ Shovel:</strong> Fortifies Eagle walls with Steel for 15s
              </li>
              <li>
                <strong>💣 Grenade:</strong> Destroys all active enemies on screen
              </li>
              <li>
                <strong>1UP Tank:</strong> Grants +1 extra life
              </li>
            </ul>
          </section>
        </div>

        <div className="bc-modal-foot">
          <button type="button" className="bc-primary-btn" onClick={onClose}>
            Back to Battle
          </button>
        </div>
      </div>
    </div>
  );
};
