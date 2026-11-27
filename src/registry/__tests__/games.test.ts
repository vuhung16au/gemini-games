import { describe, expect, it } from 'vitest';
import {
  GAMES,
  filterGames,
  findGameBySlug,
  getLocalizedGame,
} from '../games';
import {
  HUB_TRANSLATIONS,
  SUPPORTED_LOCALES,
} from '../../i18n/translations';
import {
  HUB_STORAGE_KEY,
  loadHubData,
  recordRecentGame,
  saveHubData,
  toggleFavorite,
} from '../hubStorage';

describe('game hub registry & storage', () => {
  it('registers all 16 games with unique slugs and valid relative paths', () => {
    expect(GAMES.length).toBe(16);
    const slugs = new Set(GAMES.map((g) => g.slug));
    expect(slugs.size).toBe(GAMES.length);

    for (const slug of [
      '1024',
      'battle-city',
      'checkers',
      'cozy-town-tycoon',
      'dino-run',
      'flappy-bird',
      'minesweeper',
      'simcity',
      'solitaire',
      'sudoku',
      'super-mario-bros',
      'ta-la-phom',
      'tan-do',
      'tetris',
      'tien-len-mien-bac',
      'tien-len-mien-nam',
    ]) {
      const game = findGameBySlug(slug);
      expect(game).toBeDefined();
      expect(game?.entryPath).toBe(`./games/${slug}/index.html`);
      expect(game?.iconPath).toBe(`./games/${slug}/icons/icon-192.png`);
      expect(game?.coverPath).toBe(`./games/${slug}/graphics/cover-hd.png`);
    }

    expect(findGameBySlug('non-existent-slug')).toBeUndefined();
  });

  it('filters games by category, English query, description, and localized queries', () => {
    const puzzles = filterGames(GAMES, 'Puzzle', '');
    expect(puzzles.map((g) => g.slug)).toEqual(['1024', 'minesweeper', 'sudoku']);

    const search = filterGames(GAMES, 'All', '  FLAPPY  ');
    expect(search.map((g) => g.slug)).toEqual(['flappy-bird']);

    const descMatch = filterGames(GAMES, 'Simulation', 'low-poly');
    expect(descMatch.map((g) => g.slug)).toEqual(['simcity']);

    const catMatch = filterGames(GAMES, 'All', 'board');
    expect(catMatch.map((g) => g.slug)).toEqual(['checkers', 'minesweeper']);

    expect(filterGames(GAMES, 'Arcade', 'sudoku')).toEqual([]);

    expect(filterGames(GAMES, 'All', '扫雷', 'zh').map((g) => g.slug)).toEqual([
      'minesweeper',
    ]);
    expect(filterGames(GAMES, 'All', 'Dò Mìn', 'vi').map((g) => g.slug)).toEqual([
      'minesweeper',
    ]);
  });

  it('manages favorites, recently played order, limit clamping, and storage edge cases', () => {
    let favs = toggleFavorite([], 'tetris');
    expect(favs).toEqual(['tetris']);
    favs = toggleFavorite(favs, 'sudoku');
    expect(favs).toEqual(['tetris', 'sudoku']);
    favs = toggleFavorite(favs, 'tetris');
    expect(favs).toEqual(['sudoku']);

    let recents = recordRecentGame([], '1024');
    recents = recordRecentGame(recents, 'tetris');
    recents = recordRecentGame(recents, 'sudoku');
    recents = recordRecentGame(recents, 'checkers');
    recents = recordRecentGame(recents, 'solitaire');
    expect(recents).toEqual(['solitaire', 'checkers', 'sudoku', 'tetris']);

    // Re-selecting moves existing game to front
    recents = recordRecentGame(recents, 'tetris');
    expect(recents).toEqual(['tetris', 'solitaire', 'checkers', 'sudoku']);

    // Limit < 1 clamps to 1
    expect(recordRecentGame(['a', 'b'], 'c', 0)).toEqual(['c']);

    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
    } as Storage;

    // Empty storage returns defaults
    expect(loadHubData(mockStorage)).toEqual({
      favorites: [],
      recentSlugs: [],
      theme: 'light',
      locale: 'en',
    });

    // Null storage returns defaults & saveHubData is a no-op
    expect(loadHubData(null)).toEqual({
      favorites: [],
      recentSlugs: [],
      theme: 'light',
      locale: 'en',
    });
    saveHubData(
      { favorites: ['a'], recentSlugs: ['a'], theme: 'dark', locale: 'zh' },
      null,
    );

    // Valid persistence
    saveHubData(
      { favorites: favs, recentSlugs: recents, theme: 'dark', locale: 'vi' },
      mockStorage,
    );
    expect(loadHubData(mockStorage)).toEqual({
      favorites: ['sudoku'],
      recentSlugs: ['tetris', 'solitaire', 'checkers', 'sudoku'],
      theme: 'dark',
      locale: 'vi',
    });

    // Malformed / partial JSON payloads sanitize safely
    store.set(HUB_STORAGE_KEY, '{not-valid-json');
    expect(loadHubData(mockStorage)).toEqual({
      favorites: [],
      recentSlugs: [],
      theme: 'light',
      locale: 'en',
    });

    store.set(
      HUB_STORAGE_KEY,
      JSON.stringify({
        favorites: ['tetris', 123, null],
        recentSlugs: 'not-an-array',
        theme: 'neon',
        locale: 'fr',
      }),
    );
    expect(loadHubData(mockStorage)).toEqual({
      favorites: ['tetris'],
      recentSlugs: [],
      theme: 'light',
      locale: 'en',
    });

    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('quota');
      },
    } as unknown as Storage;
    expect(loadHubData(broken)).toEqual({
      favorites: [],
      recentSlugs: [],
      theme: 'light',
      locale: 'en',
    });
    expect(() =>
      saveHubData(
        { favorites: [], recentSlugs: [], theme: 'light', locale: 'en' },
        broken,
      ),
    ).not.toThrow();
  });

  it('supports English, Chinese, and Vietnamese localizations for all games and hub UI', () => {
    expect(SUPPORTED_LOCALES).toEqual(['en', 'zh', 'vi']);
    for (const locale of SUPPORTED_LOCALES) {
      expect(HUB_TRANSLATIONS[locale].appTitle).toBeTruthy();
      for (const game of GAMES) {
        const localized = getLocalizedGame(game, locale);
        expect(localized.title.length).toBeGreaterThan(0);
        expect(localized.description.length).toBeGreaterThan(0);
        expect(localized.controls.length).toBeGreaterThan(0);
      }
    }
  });
});
