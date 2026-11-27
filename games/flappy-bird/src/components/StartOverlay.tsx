import React from 'react';

export const StartOverlay: React.FC = () => {
  return (
    <div className="overlay start-overlay" aria-live="polite">
      <div className="title-stack">
        <img
          src="./icons/icon-192.png"
          alt="Flappy Bird icon"
          className="title-emblem"
          width={56}
          height={56}
        />
        <h1 className="game-title">FLAPPY BIRD</h1>
      </div>
      <div className="start-prompt">Tap or Press Space to Flap</div>
    </div>
  );
};
