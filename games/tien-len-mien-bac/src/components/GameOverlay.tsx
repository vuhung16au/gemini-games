import React from 'react';
import type { RoundScoreEntry } from '../game/types';

interface GameOverlayProps {
  winnerNameVi: string;
  winnerNameEn: string;
  roundScores: RoundScoreEntry[];
  onPlayAgain: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  winnerNameVi,
  winnerNameEn,
  roundScores,
  onPlayAgain,
}) => {
  return (
    <div className="game-overlay-backdrop" data-testid="game-over-overlay">
      <div className="game-card tl-result-card">
        <div className="tl-result-badge">KẾT THÚC VÁN / ROUND OVER</div>
        <h2 className="tl-result-title">
          🏆 {winnerNameVi} Về Nhất! / {winnerNameEn} Wins!
        </h2>

        <table className="tl-score-table">
          <thead>
            <tr>
              <th>Người chơi / Player</th>
              <th>Còn / Left</th>
              <th>Thối 2 / Quads</th>
              <th>Chặt Heo</th>
              <th>Điểm / Delta</th>
            </tr>
          </thead>
          <tbody>
            {roundScores.map((entry) => (
              <tr
                key={entry.playerId}
                className={entry.isWinner ? 'tl-score-winner' : ''}
              >
                <td>
                  {entry.nameVi} / {entry.nameEn}
                  {entry.thoi2Loss && (
                    <span className="tl-tag-thoi">Thối 2</span>
                  )}
                </td>
                <td>{entry.cardsLeft}</td>
                <td>
                  {entry.thoi2Count > 0 || entry.thoiTuQuyCount > 0
                    ? `${entry.thoi2Count}×2 / ${entry.thoiTuQuyCount}×TQ`
                    : '—'}
                </td>
                <td>
                  {entry.chatHeoPoints >= 0
                    ? `+${entry.chatHeoPoints}`
                    : entry.chatHeoPoints}
                </td>
                <td className={entry.delta >= 0 ? 'tl-delta-pos' : 'tl-delta-neg'}>
                  {entry.delta >= 0 ? `+${entry.delta}` : entry.delta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          className="game-btn game-btn-primary"
          onClick={onPlayAgain}
          data-testid="play-again-btn"
        >
          Ván mới / Play Again
        </button>
      </div>
    </div>
  );
};
