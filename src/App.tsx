import React, { useCallback, useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { GamePlayer } from './components/GamePlayer';
import type { Locale } from './i18n/translations';
import { findGameBySlug, type GameEntry } from './registry/games';
import {
  loadHubData,
  recordRecentGame,
  saveHubData,
  toggleFavorite,
  type HubData,
} from './registry/hubStorage';

function parseSlugFromHash(hash: string): string | null {
  const match = hash.match(/^#\/play\/([^/?#]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export const App: React.FC = () => {
  const [hubData, setHubData] = useState<HubData>(() => loadHubData());
  const [activeSlug, setActiveSlug] = useState<string | null>(() =>
    parseSlugFromHash(window.location.hash),
  );

  useEffect(() => {
    document.documentElement.dataset.theme = hubData.theme;
  }, [hubData.theme]);

  useEffect(() => {
    document.documentElement.lang = hubData.locale;
  }, [hubData.locale]);

  useEffect(() => {
    const onHashChange = () => {
      setActiveSlug(parseSlugFromHash(window.location.hash));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const updateHubData = useCallback((updater: (prev: HubData) => HubData) => {
    setHubData((prev) => {
      const next = updater(prev);
      saveHubData(next);
      return next;
    });
  }, []);

  const handleSelectGame = useCallback(
    (game: GameEntry) => {
      updateHubData((prev) => ({
        ...prev,
        recentSlugs: recordRecentGame(prev.recentSlugs, game.slug),
      }));
      window.location.hash = `#/play/${encodeURIComponent(game.slug)}`;
    },
    [updateHubData],
  );

  const handleToggleFavorite = useCallback(
    (slug: string) => {
      updateHubData((prev) => ({
        ...prev,
        favorites: toggleFavorite(prev.favorites, slug),
      }));
    },
    [updateHubData],
  );

  const handleToggleTheme = useCallback(() => {
    updateHubData((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, [updateHubData]);

  const handleChangeLocale = useCallback(
    (locale: Locale) => {
      updateHubData((prev) => ({
        ...prev,
        locale,
      }));
    },
    [updateHubData],
  );

  const handleBack = useCallback(() => {
    window.location.hash = '#/';
  }, []);

  const activeGame = activeSlug ? findGameBySlug(activeSlug) : undefined;

  if (activeGame) {
    return (
      <GamePlayer
        game={activeGame}
        locale={hubData.locale}
        onBack={handleBack}
      />
    );
  }

  return (
    <Dashboard
      favorites={hubData.favorites}
      recentSlugs={hubData.recentSlugs}
      theme={hubData.theme}
      locale={hubData.locale}
      onToggleFavorite={handleToggleFavorite}
      onToggleTheme={handleToggleTheme}
      onChangeLocale={handleChangeLocale}
      onSelectGame={handleSelectGame}
    />
  );
};

export default App;
