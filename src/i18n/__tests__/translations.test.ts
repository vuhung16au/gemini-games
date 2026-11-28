import { describe, expect, it } from 'vitest';
import {
  GAME_LOCALIZATIONS,
  HUB_TRANSLATIONS,
  LOCALE_OPTIONS,
  SUPPORTED_LOCALES,
} from '../translations';
import { GAMES } from '../../registry/games';

describe('hub translations', () => {
  it('provides complete UI strings and dynamic formatters for en, zh, and vi', () => {
    expect(LOCALE_OPTIONS.map((o) => o.code)).toEqual(['en', 'zh', 'vi']);

    for (const locale of SUPPORTED_LOCALES) {
      const t = HUB_TRANSLATIONS[locale];
      expect(t.gamesCount(16)).toContain('16');
      expect(t.openGameAria('Tetris')).toContain('Tetris');
      expect(t.addFavoriteAria('Tetris')).toContain('Tetris');
      expect(t.removeFavoriteAria('Tetris')).toContain('Tetris');
      expect(t.categories.All.length).toBeGreaterThan(0);
      expect(t.categories.Favorites.length).toBeGreaterThan(0);
      expect(t.categories.Puzzle.length).toBeGreaterThan(0);
      expect(t.categories.Board.length).toBeGreaterThan(0);
      expect(t.categories.Arcade.length).toBeGreaterThan(0);
      expect(t.categories.Simulation.length).toBeGreaterThan(0);
      expect(t.categories.Card.length).toBeGreaterThan(0);
      expect(t.footerAriaLabel.length).toBeGreaterThan(0);
      expect(t.footerLinks.projectRepo.length).toBeGreaterThan(0);
      expect(t.footerLinks.authorGithub.length).toBeGreaterThan(0);
      expect(t.footerLinks.linkedin.length).toBeGreaterThan(0);
      expect(t.footerLinks.substack.length).toBeGreaterThan(0);
    }
  });

  it('defines zh and vi localizations for every registered game', () => {
    for (const game of GAMES) {
      const entry = GAME_LOCALIZATIONS[game.slug];
      expect(entry, `Missing localization for ${game.slug}`).toBeDefined();
      expect(entry?.zh?.title).toBeTruthy();
      expect(entry?.zh?.description).toBeTruthy();
      expect(entry?.zh?.controls).toBeTruthy();
      expect(entry?.vi?.title).toBeTruthy();
      expect(entry?.vi?.description).toBeTruthy();
      expect(entry?.vi?.controls).toBeTruthy();
    }
  });
});
