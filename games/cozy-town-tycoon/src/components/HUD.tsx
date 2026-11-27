import React, { useState } from 'react';
import {
  formatCoins,
  getDisplayCapacity,
  getEstimatedCoinsPerSec,
  getTotalStock,
} from '../game/economy';
import { GameState } from '../game/types';

interface HUDProps {
  state: GameState;
  isTutorial: boolean;
  onStartTutorial: () => void;
  onHint: () => void;
  onOpenHelp: () => void;
  onToggleMute: () => void;
  onReset: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  state,
  isTutorial,
  onStartTutorial,
  onHint,
  onOpenHelp,
  onToggleMute,
  onReset,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const coinsPerSec = getEstimatedCoinsPerSec(state);
  const stockCount = getTotalStock(state);
  const capacity = getDisplayCapacity(state);

  return (
    <header className="hud pixel-box">
      <div className="hud-brand">
        <img
          src="./icons/icon-192.png"
          alt="Cozy Town Tycoon icon"
          className="hud-emblem"
          width={40}
          height={40}
        />
        <div className="hud-brand-text">
          <span className="hud-title">COZY TOWN TYCOON</span>
          <span className="hud-subtitle">Sunny Hearth Bakery</span>
        </div>
      </div>

      <div className="hud-stats">
        <div className="stat-pill stat-coins">
          <span className="stat-label">COINS</span>
          <span className="stat-value">🪙 {formatCoins(state.coins)}</span>
        </div>

        <div className="stat-pill">
          <span className="stat-label">AUTO / SEC</span>
          <span className="stat-value">
            {coinsPerSec > 0 ? `+${coinsPerSec.toFixed(1)}/s` : '0.0/s'}
          </span>
        </div>

        <div className="stat-pill">
          <span className="stat-label">COUNTER</span>
          <span className="stat-value">
            🥐 {stockCount}/{capacity}
          </span>
        </div>
      </div>

      <div className="hud-actions">
        <button
          type="button"
          className="pixel-btn btn-secondary"
          onClick={onOpenHelp}
          aria-label="How to Play"
        >
          ? Help
        </button>

        <button
          type="button"
          className={`pixel-btn ${isTutorial ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onStartTutorial}
        >
          Tutorial
        </button>

        <button
          type="button"
          className="pixel-btn btn-secondary"
          onClick={onHint}
        >
          💡 Hint
        </button>

        <button
          type="button"
          className="pixel-btn btn-secondary"
          onClick={onToggleMute}
          aria-label={state.muted ? 'Unmute SFX' : 'Mute SFX'}
          aria-pressed={state.muted}
          title={state.muted ? 'Unmute SFX' : 'Mute SFX'}
        >
          {state.muted ? '🔇 Muted' : '🔊 SFX'}
        </button>

        {!confirmReset ? (
          <button
            type="button"
            className="pixel-btn btn-danger-outline"
            onClick={() => setConfirmReset(true)}
          >
            Reset
          </button>
        ) : (
          <div className="reset-confirm">
            <button
              type="button"
              className="pixel-btn btn-danger"
              onClick={() => {
                onReset();
                setConfirmReset(false);
              }}
            >
              Confirm?
            </button>
            <button
              type="button"
              className="pixel-btn btn-secondary"
              onClick={() => setConfirmReset(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
