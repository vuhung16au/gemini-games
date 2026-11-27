import { describe, expect, it } from 'vitest';
import { GAMES, filterGames, findGameBySlug } from '../games';
import {
  loadHubData,
  recordRecentGame,
  saveHubData,
  toggleFavorite,
} from '../hubStorage';

describe('game hub registry', () => {
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
  });

  it('filters games by category and search query', () => {
    const puzzles = filterGames(GAMES, 'Puzzle', '');
    expect(puzzles.map((g) => g.slug)).toEqual(['1024', 'minesweeper', 'sudoku']);

    const search = filterGames(GAMES, 'All', 'flappy');
    expect(search.map((g) => g.slug)).toEqual(['flappy-bird']);

    const combined = filterGames(GAMES, 'Board', 'check');
    expect(combined.map((g) => g.slug)).toEqual(['checkers']);

    expect(filterGames(GAMES, 'Arcade', 'sudoku')).toEqual([]);
  });

  it('manages favorites, recently played order, and theme persistence safely', () => {
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

    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
    } as Storage;

    saveHubData({ favorites: favs, recentSlugs: recents, theme: 'dark' }, mockStorage);
    expect(loadHubData(mockStorage)).toEqual({
      favorites: ['sudoku'],
      recentSlugs: ['tetris', 'solitaire', 'checkers', 'sudoku'],
      theme: 'dark',
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
    });
  });
});
