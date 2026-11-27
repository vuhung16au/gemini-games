import React from 'react';
import { isRedSuit } from '../game/combos';
import { RANK_LABELS, SUIT_SYMBOL } from '../game/constants';
import type { Card } from '../game/types';
import { SuitSvg } from './SuitSvg';

interface CardViewProps {
  card: Card;
  isSelected?: boolean;
  isHinted?: boolean;
  isRequired?: boolean;
  interactive?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  isSelected = false,
  isHinted = false,
  isRequired = false,
  interactive = false,
  compact = false,
  onClick,
}) => {
  const red = isRedSuit(card.suit);
  const rankLabel = RANK_LABELS[card.rank];
  const classes = [
    'tl-card',
    red ? 'is-red' : 'is-black',
    card.rank === 15 ? 'is-heo' : '',
    isSelected ? 'is-selected' : '',
    isHinted ? 'is-hinted' : '',
    isRequired ? 'is-required' : '',
    compact ? 'is-compact' : '',
    interactive ? 'is-interactive' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (!interactive) {
    return (
      <div
        className={classes}
        data-card-id={card.id}
        aria-label={`${rankLabel}${SUIT_SYMBOL[card.suit]}`}
      >
        <div className="tl-card-corner top-left">
          <span className="tl-card-rank">{rankLabel}</span>
          <SuitSvg suit={card.suit} className="tl-corner-suit" />
        </div>
        <SuitSvg suit={card.suit} className="tl-center-suit" />
        <div className="tl-card-corner bottom-right" aria-hidden="true">
          <span className="tl-card-rank">{rankLabel}</span>
          <SuitSvg suit={card.suit} className="tl-corner-suit" />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      data-card-id={card.id}
      data-selected={isSelected ? 'true' : 'false'}
      aria-pressed={isSelected}
      aria-label={`${rankLabel}${SUIT_SYMBOL[card.suit]}`}
      onClick={onClick}
    >
      <div className="tl-card-corner top-left">
        <span className="tl-card-rank">{rankLabel}</span>
        <SuitSvg suit={card.suit} className="tl-corner-suit" />
      </div>
      <SuitSvg suit={card.suit} className="tl-center-suit" />
      <div className="tl-card-corner bottom-right" aria-hidden="true">
        <span className="tl-card-rank">{rankLabel}</span>
        <SuitSvg suit={card.suit} className="tl-corner-suit" />
      </div>
    </button>
  );
};
