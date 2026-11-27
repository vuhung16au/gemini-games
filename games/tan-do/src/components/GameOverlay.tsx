import React from 'react';
import { calculateWinScore } from '../game/engine';
import type { TanDoState } from '../game/types';

interface GameOverlayProps {
  state: TanDoState;
  totalWins: number;
  onPlayAgain: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  state,
  totalWins,
  onPlayAgain,
}) => {
  if (state.status !== 'WON' || state.winnerIndex === null) return null;

  const winner = state.players[state.winnerIndex];
  const earnedScore = calculateWinScore(state);
  const humanWon = !winner.isAI;

  return (
    <div
      className="game-overlay-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Match finished"
      data-testid="win-overlay"
    >
      <div className="game-card overlay-card">
        <span className="game-badge">
          {humanWon ? 'CHIẾN THẮNG / VICTORY' : 'KẾT THÚC / MATCH OVER'}
        </span>
        <h2>
          {winner.nameVi} thắng! / {winner.nameEn} Wins!
        </h2>
        <p className="overlay-subtitle">
          {state.lastEventVi}
          <br />
          <span>{state.lastEventEn}</span>
        </p>

        <div className="overlay-stats">
          <div>
            <strong>Vòng / Rounds</strong>
            <span>{state.roundNumber}</span>
          </div>
          <div>
            <strong>Điểm ván / Match Score</strong>
            <span>+{earnedScore}</span>
          </div>
          <div>
            <strong>Tổng thắng / Total Wins</strong>
            <span>{totalWins}</span>
          </div>
        </div>

        <button
          type="button"
          className="game-btn game-btn-primary"
          data-testid="btn-play-again"
          onClick={onPlayAgain}
        >
          Chơi lại / Play Again
        </button>
      </div>
    </div>
  );
};
