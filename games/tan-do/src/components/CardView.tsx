import React from 'react';
import { SUIT_INFO } from '../game/constants';
import { getRankLabel, isRedSuit } from '../game/engine';
import type { Card } from '../game/types';
import { CardBackSvg, SuitSvg } from './SuitSvg';

interface CardViewProps {
  card: Card;
  faceUp?: boolean;
  isSelected?: boolean;
  isHinted?: boolean;
  isPlayable?: boolean;
  isTrump?: boolean;
  size?: 'hand' | 'table' | 'mini';
  disabled?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  faceUp = true,
  isSelected = false,
  isHinted = false,
  isPlayable = true,
  isTrump = false,
  size = 'hand',
  disabled = false,
  className = '',
  onClick,
}) => {
  if (!faceUp) {
    return (
      <div
        className={`tan-card is-face-down size-${size} ${className}`}
        data-card-id={card.id}
        data-face-up="false"
      >
        <CardBackSvg />
      </div>
    );
  }

  const red = isRedSuit(card.suit);
  const rankLabel = getRankLabel(card.rank);
  const suitInfo = SUIT_INFO[card.suit];

  const classes = [
    'tan-card',
    'is-face-up',
    `size-${size}`,
    red ? 'is-red' : 'is-black',
    isSelected ? 'is-selected' : '',
    isHinted ? 'is-hinted' : '',
    isPlayable ? 'is-playable' : 'is-dimmed',
    isTrump ? 'is-trump' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!onClick) {
    return (
      <div
        className={classes}
        data-card-id={card.id}
        data-face-up="true"
        aria-label={`${rankLabel} ${suitInfo.symbol}`}
      >
        <div className="card-corner top-left">
          <span className="card-rank">{rankLabel}</span>
          <SuitSvg suit={card.suit} className="corner-suit" />
        </div>
        <SuitSvg suit={card.suit} className="center-suit" />
        {isTrump && <span className="trump-pip" title="Chất Trưởng / Trump">★</span>}
        <div className="card-corner bottom-right" aria-hidden="true">
          <span className="card-rank">{rankLabel}</span>
          <SuitSvg suit={card.suit} className="corner-suit" />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      data-card-id={card.id}
      data-face-up="true"
      disabled={disabled}
      aria-pressed={isSelected}
      aria-label={`${rankLabel} ${suitInfo.nameEn} (${suitInfo.symbol})`}
      onClick={onClick}
    >
      <div className="card-corner top-left">
        <span className="card-rank">{rankLabel}</span>
        <SuitSvg suit={card.suit} className="corner-suit" />
      </div>
      <SuitSvg suit={card.suit} className="center-suit" />
      {isTrump && <span className="trump-pip" title="Chất Trưởng / Trump">★</span>}
      <div className="card-corner bottom-right" aria-hidden="true">
        <span className="card-rank">{rankLabel}</span>
        <SuitSvg suit={card.suit} className="corner-suit" />
      </div>
    </button>
  );
};
