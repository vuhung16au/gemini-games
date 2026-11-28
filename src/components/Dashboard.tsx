import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  HUB_TRANSLATIONS,
  LOCALE_OPTIONS,
  type HubTabFilter,
  type HubTranslations,
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

type FooterIconKind = 'repo' | 'github' | 'linkedin' | 'substack' | 'vumaths';

interface ExternalLinkItem {
  key: keyof HubTranslations['footerLinks'];
  href: string;
  testId: string;
  icon: FooterIconKind;
}

const HUB_EXTERNAL_LINKS: readonly ExternalLinkItem[] = [
  {
    key: 'projectRepo',
    href: 'https://github.com/vuhung16au/gemini-games/',
    testId: 'link-project-github',
    icon: 'repo',
  },
  {
    key: 'authorGithub',
    href: 'https://github.com/vuhung16au/',
    testId: 'link-author-github',
    icon: 'github',
  },
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/in/nguyenvuhung/',
    testId: 'link-linkedin',
    icon: 'linkedin',
  },
  {
    key: 'substack',
    href: 'https://vuhung16.substack.com/',
    testId: 'link-substack',
    icon: 'substack',
  },
  {
    key: 'vumaths',
    href: 'https://vumaths.com/',
    testId: 'link-vumaths',
    icon: 'vumaths',
  },
];

const FooterLinkIcon: React.FC<{ kind: FooterIconKind }> = ({ kind }) => {
  switch (kind) {
    case 'repo':
      return (
        <svg
          className="hub-footer-icon"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
        </svg>
      );
    case 'github':
      return (
        <svg
          className="hub-footer-icon"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg
          className="hub-footer-icon"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M1.146 0A1.146 1.146 0 0 0 0 1.146v13.708A1.146 1.146 0 0 0 1.146 16h13.708A1.146 1.146 0 0 0 16 14.854V1.146A1.146 1.146 0 0 0 14.854 0ZM4.943 13.394H2.542V6.169h2.401Zm-1.2-8.212c-.837 0-1.358-.554-1.358-1.248-.015-.709.52-1.248 1.342-1.248.822 0 1.359.54 1.359 1.248 0 .694-.521 1.248-1.327 1.248Zm9.651 8.212H11.02V9.39c0-1.005-.36-1.69-1.258-1.69-.686 0-1.094.461-1.274.907-.066.16-.082.382-.082.605v4.182H6.031s.031-6.787 0-7.49h2.375v1.06c.316-.488.88-1.182 2.14-1.182 1.563 0 2.748 1.021 2.748 3.215Z" />
        </svg>
      );
    case 'substack':
      return (
        <svg
          className="hub-footer-icon"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M15 3.604H1v1.891h14v-1.89ZM1 7.208V16l7-3.926L15 16V7.208ZM15 0H1v1.89h14Z" />
        </svg>
      );
    case 'vumaths':
      return (
        <svg
          className="hub-footer-icon"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M2 1.75C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v12.5A1.75 1.75 0 0 1 12.25 16h-8.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Zm1.5 2.25A.75.75 0 0 1 6 3h4a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM5 7.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 5 7.25Zm3 0A.75.75 0 0 1 8.75 6.5h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 8 7.25Zm-3 3a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 5 10.25Zm3 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 8 10.25Z" />
        </svg>
      );
  }
};

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
        activeTag !== 'BUTTON' &&
        activeTag !== 'A'
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

      <footer className="hub-footer" data-testid="hub-footer">
        <nav className="hub-footer-links" aria-label={t.footerAriaLabel}>
          {HUB_EXTERNAL_LINKS.map((item) => (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hub-footer-link"
              data-testid={item.testId}
            >
              <FooterLinkIcon kind={item.icon} />
              <span>{t.footerLinks[item.key]}</span>
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
};
