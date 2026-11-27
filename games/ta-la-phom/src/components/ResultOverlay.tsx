import React from 'react';
import type { PlayerResult, WinReason } from '../game/types';
import { CardView } from './CardView';

interface ResultOverlayProps {
  results: PlayerResult[];
  winReason: WinReason | null;
  onNewGame: () => void;
}

export const ResultOverlay: React.FC<ResultOverlayProps> = ({
  results,
  winReason,
  onNewGame,
}) => {
  const winner = results[0];

  return (
    <div
      className="game-overlay-backdrop result-backdrop"
      data-testid="result-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Kết quả ván đấu / Hand Result"
    >
      <div className="game-card result-modal">
        <div className="result-header">
          <span className="game-badge">
            {winReason === 'U' ? 'Ù — Thắng tuyệt đối!' : 'Kết thúc vòng 4 / Round 4 Complete'}
          </span>
          <h2>
            {winner.nameVi} ({winner.nameEn}) {winner.isU ? 'Ù!' : 'về Nhất / Wins!'}
          </h2>
        </div>

        <div className="result-list">
          {results.map((res) => (
            <div
              key={res.playerIndex}
              className={`result-row ${res.rank === 1 ? 'is-winner' : ''} ${res.isMom ? 'is-mom' : ''}`}
            >
              <div className="result-row-top">
                <span className="result-rank">#{res.rank}</span>
                <span className="result-name">
                  {res.nameVi} / {res.nameEn}
                </span>
                {res.isU && <span className="result-pill pill-u">Ù!</span>}
                {res.isMom && <span className="result-pill pill-mom">Móm / Cháy</span>}
                <span className="result-pts">
                  {res.deadwoodPoints} điểm rác ·{' '}
                  <strong>
                    {res.matchPointsDelta >= 0 ? `+${res.matchPointsDelta}` : res.matchPointsDelta}
                  </strong>
                </span>
              </div>

              <div className="result-cards-strip">
                {res.melds.map((meld) => (
                  <div key={meld.id} className="result-meld-group">
                    {meld.cards.map((card) => (
                      <CardView key={card.id} card={card} inPhom size="xs" />
                    ))}
                  </div>
                ))}
                {res.deadwood.length > 0 && (
                  <div className="result-deadwood-group">
                    {res.deadwood.map((card) => (
                      <CardView key={card.id} card={card} size="xs" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="result-actions">
          <button
            type="button"
            className="game-btn game-btn-primary"
            data-testid="play-again-btn"
            onClick={onNewGame}
          >
            Ván mới / New Hand
          </button>
        </div>
      </div>
    </div>
  );
};
