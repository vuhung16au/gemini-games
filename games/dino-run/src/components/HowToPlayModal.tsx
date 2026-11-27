import React from 'react';

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="dino-modal-backdrop" role="dialog" aria-modal="true" aria-label="How to Play Dino Run">
      <div className="dino-modal-card">
        <div className="dino-modal-head">
          <h2>How to Play Dino Run (404 Runner)</h2>
          <button type="button" className="dino-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="dino-modal-body">
          <section>
            <h3>Objective</h3>
            <p>
              Inspired by Chrome&apos;s offline 404 dinosaur and the HSC QuestionBanks 404 Proof
              Runner! Leap over ground hazards and duck under flying obstacles as speed climbs.
            </p>
          </section>

          <section>
            <h3>Controls</h3>
            <ul>
              <li>
                <strong>Jump / Start:</strong> <code>Space</code>, <code>Up Arrow</code>,{' '}
                <code>W</code>, or tap the canvas / <strong>Jump</strong> button
              </li>
              <li>
                <strong>Duck / Fast-Fall:</strong> Hold <code>Down Arrow</code>, <code>S</code>, or
                the <strong>Duck</strong> button
              </li>
              <li>
                <strong>Pause:</strong> <code>P</code> or <code>Escape</code>
              </li>
            </ul>
          </section>

          <section>
            <h3>Two Built-In Modes</h3>
            <ul>
              <li>
                <strong>Classic Desert:</strong> Pixel cacti, flapping pterodactyls, and Day/Night
                cycles every 700 points.
              </li>
              <li>
                <strong>404 Math Proof Runner:</strong> Graduation-cap T-Rex dodging{' '}
                <code>∑</code>, <code>∫</code>, <code>[A]</code>, and flying <code>−</code> /{' '}
                <code>÷0</code> obstacles over graph paper!
              </li>
            </ul>
          </section>
        </div>

        <div className="dino-modal-foot">
          <button type="button" className="dino-primary-btn" onClick={onClose}>
            Back to Run
          </button>
        </div>
      </div>
    </div>
  );
};
