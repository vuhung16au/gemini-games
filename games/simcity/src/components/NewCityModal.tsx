import React from 'react';
import type { MapPreset } from '../game/types';

interface NewCityModalProps {
  open: boolean;
  onClose: () => void;
  onStartMap: (preset: MapPreset) => void;
  onLoadStarterTown: () => void;
}

export const NewCityModal: React.FC<NewCityModalProps> = ({
  open,
  onClose,
  onStartMap,
  onLoadStarterTown,
}) => {
  if (!open) return null;

  return (
    <div className="sim-modal-backdrop" role="dialog" aria-modal="true" aria-label="New City">
      <div className="sim-modal-card">
        <div className="sim-modal-head">
          <h2>Start a New City</h2>
          <button type="button" className="inspector-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="sim-modal-body">
          <p>Choose a 3D terrain preset ($2,500 treasury) or jump straight into a living starter town:</p>

          <div className="preset-grid">
            <button
              type="button"
              className="preset-card"
              onClick={() => onStartMap('riverside')}
            >
              <strong>🏞️ Riverside Valley</strong>
              <span>Winding diagonal river &amp; scenic forests</span>
            </button>

            <button
              type="button"
              className="preset-card"
              onClick={() => onStartMap('islands')}
            >
              <strong>🏝️ Twin Islands</strong>
              <span>Two lush islands ready for bridge networks</span>
            </button>

            <button
              type="button"
              className="preset-card"
              onClick={() => onStartMap('plains')}
            >
              <strong>🌾 Green Plains</strong>
              <span>Wide open terrain for maximum metropolis layout</span>
            </button>

            <button
              type="button"
              className="preset-card highlight"
              onClick={onLoadStarterTown}
            >
              <strong>🏙️ Load Starter Town</strong>
              <span>Pre-built town with roads, power, water &amp; cars</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
