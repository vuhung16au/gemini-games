import React from 'react';
import type { Player } from '../game/types';
import { CardBackSvg } from './SuitSvg';

interface OpponentSeatProps {
  player: Player;
  isCurrentTurn: boolean;
  isTrickLeader: boolean;
}

export const OpponentSeat: React.FC<OpponentSeatProps> = ({
  player,
  isCurrentTurn,
  isTrickLeader,
}) => {
  const miniBacks = Math.min(player.hand.length, 5);

  return (
    <div
      className={`tl-opponent ${isCurrentTurn ? 'is-active-turn' : ''} ${
        player.passedThisTrick ? 'is-passed' : ''
      }`}
      data-testid={`opponent-seat-${player.id}`}
    >
      <div className="tl-opponent-meta">
        <span className="tl-opponent-name">
          {player.nameVi} / {player.nameEn}
        </span>
        <span className="tl-opponent-score">{player.score} đ</span>
      </div>

      <div className="tl-opponent-cards-row">
        <div className="tl-mini-fan" aria-hidden="true">
          {Array.from({ length: miniBacks }).map((_, idx) => (
            <div key={idx} className="tl-mini-back">
              <CardBackSvg />
            </div>
          ))}
        </div>
        <span className="tl-card-count-badge" data-testid={`seat-count-${player.id}`}>
          {player.hand.length} lá
        </span>
      </div>

      <div className="tl-opponent-status">
        {player.passedThisTrick && (
          <span className="tl-status-pill is-pass">Bỏ lượt / Pass</span>
        )}
        {isCurrentTurn && !player.passedThisTrick && (
          <span className="tl-status-pill is-turn">
            {player.isAi ? 'Đang đánh...' : 'Tới lượt / Turn'}
          </span>
        )}
        {!isCurrentTurn && !player.passedThisTrick && isTrickLeader && (
          <span className="tl-status-pill is-lead">Cầm cái / Lead</span>
        )}
      </div>
    </div>
  );
};
