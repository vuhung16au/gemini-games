import React from 'react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-label="How to Play Cozy Town Tycoon"
      onClick={onClose}
    >
      <div
        className="modal-card pixel-box howto-pixel-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">HOW TO PLAY</h2>
        <div className="howto-pixel-body">
          <p>
            Run your own neighborhood bakery! Bake fresh pastries, serve
            townsfolk, and reinvest coins to grow.
          </p>
          <ul>
            <li>
              <strong>Tap to Bake:</strong> Click the bakery scene or Bake
              button to fill the display counter.
            </li>
            <li>
              <strong>Customers:</strong> Townsfolk automatically walk in and
              buy your highest-value stocked pastries.
            </li>
            <li>
              <strong>Upgrades &amp; Staff:</strong> Unlock Croissants &amp;
              Berry Tarts, upgrade ovens, and hire staff to automate baking and
              earn offline coins (up to 8h).
            </li>
          </ul>
        </div>
        <button type="button" className="pixel-btn btn-primary" onClick={onClose}>
          GOT IT!
        </button>
      </div>
    </div>
  );
};
