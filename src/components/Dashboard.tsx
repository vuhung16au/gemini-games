import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  HUB_TRANSLATIONS,
  LOCALE_OPTIONS,
  type HubTabFilter,
  type Locale,
} from '../i18n/translations';
import {
  GAME_CATEGORIES,
  GAMES,
  filterGames,
  findGameBySlug,
  getLocalizedGame,
  type GameEntry,
} from '../registry/games';
import type { ThemeMode } from '../registry/hubStorage';

const FILTER_TABS: readonly HubTabFilter[] = [
  'All',
  'Favorites',
  ...GAME_CATEGORIES.slice(1),
];

interface DashboardProps {
  favorites: string[];
  recentSlugs: string[];
  theme: ThemeMode;
  locale: Locale;
  onToggleFavorite: (slug: string) => void;
  onToggleTheme: () => void;
  onChangeLocale: (locale: Locale) => void;
  onSelectGame: (game: GameEntry) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  favorites,
  recentSlugs,
  theme,
  locale,
  onToggleFavorite,
  onToggleTheme,
  onChangeLocale,
  onSelectGame,
}) => {
  const t = HUB_TRANSLATIONS[locale];
  const [filter, setFilter] = useState<HubTabFilter>('All');
  const [query, setQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const gridRef = useRef<HTMLElement | null>(null);

  const visibleGames = useMemo(() => {
    const base =
      filter === 'Favorites'
        ? GAMES.filter((g) => favorites.includes(g.slug))
        : filterGames(GAMES, filter, '', locale);
    return filterGames(base, 'All', query, locale);
  }, [favorites, filter, locale, query]);

  const recentGames = useMemo(
    () =>
      recentSlugs
        .map((slug) => findGameBySlug(slug))
        .filter((g): g is GameEntry => Boolean(g)),
    [recentSlugs],
  );

  useEffect(() => {
    if (focusedIndex >= visibleGames.length) {
      setFocusedIndex(visibleGames.length > 0 ? 0 : -1);
    }
  }, [focusedIndex, visibleGames.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const activeTag = document.activeElement?.tagName;
      const inSearch = document.activeElement === searchRef.current;

      if (e.key === '/' && !inSearch) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (e.key === 'Escape' && inSearch) {
        setQuery('');
        searchRef.current?.blur();
        return;
      }

      if (
        inSearch ||
        activeTag === 'INPUT' ||
        activeTag === 'TEXTAREA' ||
        visibleGames.length === 0
      ) {
        return;
      }

      const getCols = () => {
        if (gridRef.current) {
          const cols = getComputedStyle(gridRef.current)
            .gridTemplateColumns.trim()
            .split(/\s+/).length;
          if (cols > 0) return cols;
        }
        return window.innerWidth > 1024 ? 4 : window.innerWidth > 600 ? 2 : 1;
      };

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % visibleGames.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev <= 0 ? visibleGames.length - 1 : prev - 1,
        );
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const cols = getCols();
        setFocusedIndex((prev) =>
          prev < 0 ? 0 : Math.min(visibleGames.length - 1, prev + cols),
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const cols = getCols();
        setFocusedIndex((prev) => (prev < 0 ? 0 : Math.max(0, prev - cols)));
      } else if (
        e.key === 'Enter' &&
        focusedIndex >= 0 &&
        focusedIndex < visibleGames.length &&
        activeTag !== 'BUTTON'
      ) {
        e.preventDefault();
        onSelectGame(visibleGames[focusedIndex]);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusedIndex, onSelectGame, visibleGames]);

  return (
    <div className="hub-page">
      <header className="hub-header">
        <div className="hub-top-row">
          <div className="hub-brand">
            <div className="hub-title-row">
              <h1 className="hub-title">{t.appTitle}</h1>
              <span className="hub-count-badge">{t.gamesCount(GAMES.length)}</span>
            </div>
            <p className="hub-subtitle">
              {t.subtitlePrefix}
              <strong>{t.subtitleSearchKey}</strong>
              {t.subtitleMiddle}
              <strong>{t.subtitleArrowKeys}</strong>
              {t.subtitlePlus}
              <strong>{t.subtitleEnterKey}</strong>
              {t.subtitleSuffix}
            </p>
          </div>

          <div className="hub-top-actions">
            <div
              className="lang-switcher"
              role="group"
              aria-label={t.languageAriaLabel}
            >
              {LOCALE_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  className={`lang-btn ${locale === opt.code ? 'is-active' : ''}`}
                  data-testid={`lang-${opt.code}`}
                  aria-label={opt.nativeName}
                  aria-pressed={locale === opt.code}
                  onClick={() => onChangeLocale(opt.code)}
                >
                  {opt.shortLabel}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="game-btn game-btn-secondary theme-toggle-btn"
              data-testid="theme-toggle"
              aria-pressed={theme === 'dark'}
              onClick={onToggleTheme}
            >
              {theme === 'dark' ? t.lightMode : t.darkMode}
            </button>
          </div>
        </div>

        <div className="hub-controls">
          <div
            className="category-pills"
            role="tablist"
            aria-label={t.categoriesAriaLabel}
          >
            {FILTER_TABS.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={filter === cat}
                className={`category-pill ${filter === cat ? 'is-active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'Favorites'
                  ? `★ ${t.categories.Favorites} (${favorites.length})`
                  : t.categories[cat]}
              </button>
            ))}
          </div>

          <input
            ref={searchRef}
            type="search"
            className="hub-search"
            placeholder={t.searchPlaceholder}
            aria-label={t.searchAriaLabel}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      {recentGames.length > 0 && (
        <section
          className="recent-strip"
          data-testid="recently-played"
          aria-label={t.recentlyPlayed}
        >
          <span className="recent-label">{t.recentlyPlayed}</span>
          <div className="recent-pills">
            {recentGames.map((game) => {
              const localized = getLocalizedGame(game, locale);
              return (
                <button
                  key={game.slug}
                  type="button"
                  className="recent-pill"
                  onClick={() => onSelectGame(game)}
                >
                  <img
                    src={game.iconPath}
                    alt=""
                    width={22}
                    height={22}
                    className="recent-icon"
                  />
                  <span>{localized.title}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {visibleGames.length === 0 ? (
        <div className="hub-empty game-card">
          <p>{filter === 'Favorites' ? t.emptyFavorites : t.emptyFilter}</p>
          <button
            type="button"
            className="game-btn game-btn-secondary"
            onClick={() => {
              setFilter('All');
              setQuery('');
            }}
          >
            {t.resetFilters}
          </button>
        </div>
      ) : (
        <section
          ref={gridRef}
          className="games-grid"
          aria-label={t.gamesGridAriaLabel}
        >
          {visibleGames.map((game, idx) => {
            const isFav = favorites.includes(game.slug);
            const isFocused = idx === focusedIndex;
            const localized = getLocalizedGame(game, locale);

            return (
              <article
                key={game.slug}
                className={`game-tile game-card ${isFocused ? 'is-focused' : ''}`}
                data-game-slug={game.slug}
              >
                <div className="tile-cover-wrap">
                  <button
                    type="button"
                    className="tile-cover-btn"
                    onClick={() => onSelectGame(game)}
                    aria-label={t.openGameAria(localized.title)}
                  >
                    <img
                      src={game.coverPath}
                      alt={`${localized.title} cover artwork`}
                      className="tile-cover"
                      loading="lazy"
                    />
                    <span className="tile-category">
                      {t.categories[game.category]}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`fav-btn ${isFav ? 'is-fav' : ''}`}
                    data-testid={`fav-${game.slug}`}
                    aria-label={
                      isFav
                        ? t.removeFavoriteAria(localized.title)
                        : t.addFavoriteAria(localized.title)
                    }
                    aria-pressed={isFav}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(game.slug);
                    }}
                  >
                    {isFav ? '★' : '☆'}
                  </button>
                </div>

                <div className="tile-body">
                  <div className="tile-heading">
                    <img
                      src={game.iconPath}
                      alt={`${localized.title} icon`}
                      className="tile-icon"
                      width={36}
                      height={36}
                    />
                    <h2 className="tile-title">{localized.title}</h2>
                  </div>

                  <p className="tile-desc">{localized.description}</p>

                  <div className="tile-footer">
                    <span className="tile-controls">{localized.controls}</span>
                    <button
                      type="button"
                      className="game-btn game-btn-primary tile-play-btn"
                      onClick={() => onSelectGame(game)}
                    >
                      {t.playButton}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};
