import React, { useRef, useState } from 'react';
import type { GameEntry } from '../registry/games';

interface GamePlayerProps {
  game: GameEntry;
  onBack: () => void;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({ game, onBack }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const handleFullscreen = () => {
    const target = containerRef.current;
    if (!target) return;
    try {
      if (document.fullscreenElement) {
        void document.exitFullscreen();
      } else {
        void target.requestFullscreen();
      }
    } catch {
      // Ignore fullscreen errors if unsupported
    }
  };

  return (
    <div ref={containerRef} className="player-shell">
      <header className="player-bar">
        <div className="player-bar-left">
          <button
            type="button"
            className="game-btn game-btn-secondary player-btn"
            onClick={onBack}
          >
            ← All Games
          </button>

          <div className="player-game-info">
            <img
              src={game.iconPath}
              alt={`${game.title} icon`}
              className="player-icon"
              width={28}
              height={28}
            />
            <span className="player-title">{game.title}</span>
            <span className="player-controls-hint">{game.controls}</span>
          </div>
        </div>

        <div className="player-bar-actions">
          <button
            type="button"
            className="game-btn game-btn-secondary player-btn"
            onClick={() => setReloadKey((k) => k + 1)}
          >
            ↻ Reload
          </button>
          <button
            type="button"
            className="game-btn game-btn-primary player-btn"
            onClick={handleFullscreen}
          >
            ⛶ Fullscreen
          </button>
        </div>
      </header>

      <iframe
        key={`${game.slug}-${reloadKey}`}
        ref={iframeRef}
        src={game.entryPath}
        title={game.title}
        className="player-iframe"
        onLoad={() => {
          iframeRef.current?.contentWindow?.focus();
        }}
      />
    </div>
  );
};
