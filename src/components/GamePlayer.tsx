import React, { useRef, useState } from 'react';
import { HUB_TRANSLATIONS, type Locale } from '../i18n/translations';
import { getLocalizedGame, type GameEntry } from '../registry/games';

interface GamePlayerProps {
  game: GameEntry;
  locale: Locale;
  onBack: () => void;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  locale,
  onBack,
}) => {
  const t = HUB_TRANSLATIONS[locale];
  const localized = getLocalizedGame(game, locale);
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
            {t.allGamesBack}
          </button>

          <div className="player-game-info">
            <img
              src={game.iconPath}
              alt={`${localized.title} icon`}
              className="player-icon"
              width={28}
              height={28}
            />
            <span className="player-title">{localized.title}</span>
            <span className="player-controls-hint">{localized.controls}</span>
          </div>
        </div>

        <div className="player-bar-actions">
          <button
            type="button"
            className="game-btn game-btn-secondary player-btn"
            onClick={() => setReloadKey((k) => k + 1)}
          >
            {t.reloadGame}
          </button>
          <button
            type="button"
            className="game-btn game-btn-primary player-btn"
            onClick={handleFullscreen}
          >
            {t.fullscreen}
          </button>
        </div>
      </header>

      <iframe
        key={`${game.slug}-${reloadKey}`}
        ref={iframeRef}
        src={game.entryPath}
        title={localized.title}
        className="player-iframe"
        onLoad={() => {
          iframeRef.current?.contentWindow?.focus();
        }}
      />
    </div>
  );
};
