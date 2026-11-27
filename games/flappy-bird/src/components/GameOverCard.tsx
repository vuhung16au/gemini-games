import React from 'react';
import { getMedalTier, type MedalTier } from '../game/constants';

interface GameOverCardProps {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  canRestart: boolean;
  onRestart: () => void;
}

const MEDAL_LABELS: Record<Exclude<MedalTier, null>, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

export const GameOverCard: React.FC<GameOverCardProps> = ({
  score,
  bestScore,
  isNewBest,
  canRestart,
  onRestart,
}) => {
  const medal = getMedalTier(score);

  return (
    <div className="overlay game-over-overlay" role="dialog" aria-label="Game Over">
      <h2 className="game-over-heading">GAME OVER</h2>

      <div className="scoreboard-card">
        <div className="scoreboard-medal-col">
          <span className="card-label">MEDAL</span>
          <div
            className={`medal-badge ${medal ? `medal-${medal}` : 'medal-none'}`}
            title={medal ? `${MEDAL_LABELS[medal]} Medal` : 'No Medal'}
          >
            {medal ? MEDAL_LABELS[medal][0] : '—'}
          </div>
          <span className="medal-name">
            {medal ? MEDAL_LABELS[medal] : 'None'}
          </span>
        </div>

        <div className="scoreboard-stats-col">
          <div className="stat-block">
            <span className="card-label">SCORE</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-block">
            <span className="card-label">
              BEST
              {isNewBest && <span className="new-badge">NEW</span>}
            </span>
            <span className="stat-value">{bestScore}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="restart-button"
        disabled={!canRestart}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRestart();
        }}
      >
        PLAY AGAIN
      </button>
      <div className="restart-hint">
        {canRestart ? 'Tap or Press Space / Enter' : '...'}
      </div>
    </div>
  );
};
