import React from 'react';

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="smb-modal-backdrop" role="dialog" aria-modal="true" aria-label="How to Play Super Mario Bros">
      <div className="smb-modal-card">
        <div className="smb-modal-head">
          <h2>How to Play Super Mario Bros. (1985)</h2>
          <button type="button" className="smb-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="smb-modal-body">
          <section>
            <h3>World 1 Courses</h3>
            <p>
              Run, leap, and power up across <strong>World 1-1 (Overworld)</strong>,{' '}
              <strong>1-2 (Underground)</strong>, <strong>1-3 (Treetop Heights)</strong>, and{' '}
              <strong>1-4 (Bowser&apos;s Castle)</strong>. Reach the Flagpole or grab the Castle
              Axe before time runs out!
            </p>
          </section>

          <section>
            <h3>Controls</h3>
            <ul>
              <li>
                <strong>Move:</strong> <code>A</code> / <code>D</code> or <code>Left</code> /{' '}
                <code>Right</code> Arrow keys
              </li>
              <li>
                <strong>Jump:</strong> <code>W</code>, <code>Up</code> Arrow, <code>Space</code>, or{' '}
                <code>Z</code> (hold longer for higher jumps)
              </li>
              <li>
                <strong>Sprint / Fireball:</strong> <code>Shift</code>, <code>X</code>, or{' '}
                <code>J</code>
              </li>
              <li>
                <strong>Crouch:</strong> <code>S</code> or <code>Down</code> Arrow (Super/Fire)
              </li>
              <li>
                <strong>Pause:</strong> <code>P</code> or <code>Escape</code>
              </li>
            </ul>
          </section>

          <section>
            <h3>Power-Ups &amp; Future Roadmap (TODO)</h3>
            <p>
              Bump <strong>?</strong> blocks for Coins, <strong>Super Mushrooms</strong>,{' '}
              <strong>Fire Flowers</strong>, and <strong>Super Stars</strong>. Two-Player Local
              Co-op and Worlds 2–8 are planned in the <code>TODO</code> roadmap!
            </p>
          </section>
        </div>

        <div className="smb-modal-foot">
          <button type="button" className="smb-primary-btn" onClick={onClose}>
            Back to World 1
          </button>
        </div>
      </div>
    </div>
  );
};
