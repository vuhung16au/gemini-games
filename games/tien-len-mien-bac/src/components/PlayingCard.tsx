import React from 'react';
import { formatRank } from '../game/deck';
import { isRedSuit } from '../game/rules';
import type { Card, Suit } from '../game/types';

interface SuitSvgProps {
  suit: Suit;
  className?: string;
}

export const SuitSvg: React.FC<SuitSvgProps> = ({ suit, className }) => {
  switch (suit) {
    case 'spades':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2C9 6.2 4 9.5 4 14a4.5 4.5 0 0 0 7.1 3.7L9.5 22h5l-1.6-4.3A4.5 4.5 0 0 0 20 14c0-4.5-5-7.8-8-12z"
          />
        </svg>
      );
    case 'clubs':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2.5a4.1 4.1 0 0 0-3.2 6.7A4.2 4.2 0 1 0 10.6 17L9.3 21.5h5.4L13.4 17a4.2 4.2 0 1 0 1.8-7.8A4.1 4.1 0 0 0 12 2.5z"
          />
        </svg>
      );
    case 'diamonds':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path fill="currentColor" d="M12 2 20 12 12 22 4 12z" />
        </svg>
      );
    case 'hearts':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 21.2 4.2 13.7A5.1 5.1 0 0 1 12 7a5.1 5.1 0 0 1 7.8 6.7L12 21.2z"
          />
        </svg>
      );
  }
};

interface PlayingCardProps {
  card: Card;
  selected?: boolean;
  hinted?: boolean;
  mustPlay?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export const PlayingCard: React.FC<PlayingCardProps> = ({
  card,
  selected = false,
  hinted = false,
  mustPlay = false,
  compact = false,
  onClick,
}) => {
  const red = isRedSuit(card.suit);
  const rankLabel = formatRank(card.rank);
  const isTwo = card.rank === 15;

  const classes = [
    'tl-card',
    red ? 'tl-card-red' : 'tl-card-black',
    selected ? 'tl-card-selected' : '',
    hinted ? 'tl-card-hinted' : '',
    mustPlay ? 'tl-card-must' : '',
    compact ? 'tl-card-compact' : '',
    isTwo ? 'tl-card-heo' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (!onClick) {
    return (
      <div className={classes} data-testid={`table-card-${card.id}`}>
        <div className="tl-card-corner tl-card-tl">
          <span className="tl-card-rank">{rankLabel}</span>
          <SuitSvg suit={card.suit} className="tl-card-suit-sm" />
        </div>
        <div className="tl-card-center">
          <SuitSvg suit={card.suit} className="tl-card-suit-lg" />
          {isTwo && <span className="tl-heo-tag">2</span>}
        </div>
        <div className="tl-card-corner tl-card-br">
          <span className="tl-card-rank">{rankLabel}</span>
          <SuitSvg suit={card.suit} className="tl-card-suit-sm" />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${rankLabel} ${card.suit}`}
      data-testid={`card-${card.id}`}
    >
      <div className="tl-card-corner tl-card-tl">
        <span className="tl-card-rank">{rankLabel}</span>
        <SuitSvg suit={card.suit} className="tl-card-suit-sm" />
      </div>
      <div className="tl-card-center">
        <SuitSvg suit={card.suit} className="tl-card-suit-lg" />
        {isTwo && <span className="tl-heo-tag">HEO</span>}
      </div>
      <div className="tl-card-corner tl-card-br">
        <span className="tl-card-rank">{rankLabel}</span>
        <SuitSvg suit={card.suit} className="tl-card-suit-sm" />
      </div>
    </button>
  );
};

export const CardBack: React.FC<{ mini?: boolean }> = ({ mini = false }) => (
  <div
    className={`tl-card-back ${mini ? 'tl-card-back-mini' : ''}`}
    aria-hidden="true"
  >
    <div className="tl-card-back-inner" />
  </div>
);
