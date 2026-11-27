import React from 'react';
import { formatCoins, formatDuration } from '../game/economy';
import { OfflineSummary } from '../game/types';

interface WelcomeBackModalProps {
  summary: OfflineSummary;
  onCollect: () => void;
}

export const WelcomeBackModal: React.FC<WelcomeBackModalProps> = ({ summary, onCollect }) => {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="modal-card pixel-box">
        <h2 id="welcome-title" className="modal-title">
          🥐 Welcome Back!
        </h2>
        <p className="modal-subtitle">
          Your bakery staff kept the ovens warm while you were away for{' '}
          <strong>{formatDuration(summary.elapsedSeconds)}</strong>
          {summary.capped ? ' (8h offline cap reached)' : ''}.
        </p>

        <div className="offline-reward-box">
          <div className="reward-coins">🪙 +{formatCoins(summary.coinsEarned)}</div>
          <div className="reward-meta">
            ~{formatCoins(summary.itemsSold)} pastries sold · {summary.coinsPerSec.toFixed(1)} coins/sec
          </div>
        </div>

        <button type="button" className="pixel-btn btn-bake" onClick={onCollect}>
          COLLECT COINS!
        </button>
      </div>
    </div>
  );
};
