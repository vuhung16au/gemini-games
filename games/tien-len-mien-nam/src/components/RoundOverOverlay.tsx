import React from 'react';
import type { GameState } from '../game/types';
import { CardView } from './CardView';

interface RoundOverOverlayProps {
  state: GameState;
  onNextRound: () => void;
  onStartFullGame: () => void;
}

export const RoundOverOverlay: React.FC<RoundOverOverlayProps> = ({
  state,
  onNextRound,
  onStartFullGame,
}) => {
  if (state.status !== 'ROUND_OVER' || !state.roundResult) return null;

  const { roundResult, tutorial, players } = state;
  const winner = players[roundResult.winnerId];

  const toiTrangLabel =
    roundResult.toiTrangReason === 'DRAGON_STRAIGHT'
      ? 'Sảnh Rồng (3→A) / Dragon Straight'
      : roundResult.toiTrangReason === 'SIX_PAIRS'
        ? '6 Đôi / Six Pairs'
        : 'Tứ quý 2 / Four 2s';

  return (
    <div
      className="game-overlay-backdrop tl-round-overlay"
      data-testid="round-over-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Round Over"
    >
      <div className="game-card tl-round-card">
        {tutorial.active ? (
          <>
            <span className="game-badge">TUTORIAL COMPLETE</span>
            <h2 className="tl-round-title">
              Hoàn tất hướng dẫn! / Tutorial Complete!
            </h2>
            <p className="tl-round-sub">
              Bạn đã nắm vững Sảnh, Chặt Heo bằng 3 Đôi thông và cách về nhất.
            </p>
            <button
              type="button"
              className="game-btn game-btn-primary"
              onClick={onStartFullGame}
              data-testid="start-full-game-btn"
            >
              Chơi ván mới / Start Full Game
            </button>
          </>
        ) : (
          <>
            <span className="game-badge">
              {roundResult.reason === 'TOI_TRANG'
                ? 'TỚI TRẮNG / INSTANT WIN'
                : 'HẾT BÀI / VICTORY'}
            </span>
            <h2 className="tl-round-title">
              🏆 {winner.nameVi} / {winner.nameEn} Thắng! (+
              {roundResult.pointsEarned} điểm)
            </h2>
            {roundResult.reason === 'TOI_TRANG' && (
              <p className="tl-round-sub">
                Bài tới trắng: <strong>{toiTrangLabel}</strong>
              </p>
            )}

            {roundResult.winningCards && (
              <div className="tl-winning-cards">
                {roundResult.winningCards.map((card) => (
                  <CardView key={card.id} card={card} compact />
                ))}
              </div>
            )}

            <div className="tl-penalty-list">
              {roundResult.penalties.map((p) => (
                <div key={p.playerId} className="tl-penalty-row">
                  <span>
                    {p.nameVi} ({p.remainingCards} lá
                    {p.congPenalty ? ', Cóng ×2' : ''}
                    {p.heoPenalty > 0 ? `, Thối Heo -${p.heoPenalty}` : ''}
                    {p.bombPenalty > 0 ? `, Thối Hàng -${p.bombPenalty}` : ''})
                  </span>
                  <strong className="tl-penalty-delta">{p.totalDelta} đ</strong>
                </div>
              ))}
            </div>

            <div className="tl-round-actions">
              <button
                type="button"
                className="game-btn game-btn-primary"
                onClick={onNextRound}
                data-testid="next-round-btn"
              >
                Ván tiếp theo / Next Round
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
