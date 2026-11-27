import React from 'react';
import type { Suit } from '../game/types';

interface SuitSvgProps {
  suit: Suit;
  className?: string;
}

export const SuitSvg: React.FC<SuitSvgProps> = ({ suit, className = '' }) => {
  switch (suit) {
    case 'hearts':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      );
    case 'diamonds':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path fill="currentColor" d="M12 2L20.5 12L12 22L3.5 12Z" />
        </svg>
      );
    case 'spades':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2C9 6.2 4 9.5 4 14a4.5 4.5 0 0 0 7 3.74c-.25 1.4-.9 2.58-2.2 3.26h6.4c-1.3-.68-1.95-1.86-2.2-3.26A4.5 4.5 0 0 0 20 14c0-4.5-5-7.8-8-12z"
          />
        </svg>
      );
    case 'clubs':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2.5a4.2 4.2 0 0 0-4.2 4.2c0 1.02.37 1.95.98 2.68A4.3 4.3 0 0 0 3.5 13.5a4.3 4.3 0 0 0 7.2 3.16c-.28 1.54-.95 2.9-2.2 3.84h7c-1.25-.94-1.92-2.3-2.2-3.84a4.3 4.3 0 0 0 7.2-3.16 4.3 4.3 0 0 0-5.28-4.12c.61-.73.98-1.66.98-2.68A4.2 4.2 0 0 0 12 2.5z"
          />
        </svg>
      );
  }
};

export const CardBackSvg: React.FC = () => (
  <svg
    viewBox="0 0 80 112"
    className="card-back-svg"
    aria-hidden="true"
    preserveAspectRatio="none"
  >
    <rect x="4" y="4" width="72" height="104" rx="5" fill="#3c1053" />
    <rect
      x="8"
      y="8"
      width="64"
      height="96"
      rx="3"
      fill="none"
      stroke="#f2efeb"
      strokeOpacity="0.65"
      strokeWidth="1.5"
    />
    <path
      d="M40 22 L58 56 L40 90 L22 56 Z"
      fill="none"
      stroke="#f2efeb"
      strokeOpacity="0.45"
      strokeWidth="1.5"
    />
    <circle cx="40" cy="56" r="8" fill="#b51825" fillOpacity="0.85" stroke="#f2efeb" strokeWidth="1.2" />
  </svg>
);
