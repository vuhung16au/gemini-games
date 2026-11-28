// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Dashboard } from '../Dashboard';
import { GAMES } from '../../registry/games';

afterEach(() => {
  cleanup();
});

describe('Dashboard component', () => {
  function setup(overrides: Partial<React.ComponentProps<typeof Dashboard>> = {}) {
    const props: React.ComponentProps<typeof Dashboard> = {
      favorites: [],
      recentSlugs: [],
      theme: 'light',
      locale: 'en',
      onToggleFavorite: vi.fn(),
      onToggleTheme: vi.fn(),
      onChangeLocale: vi.fn(),
      onSelectGame: vi.fn(),
      ...overrides,
    };
    return { ...render(<Dashboard {...props} />), props };
  }

  it('renders all games, switches theme and language, and handles favorites & recently played', () => {
    const { props } = setup({
      favorites: ['sudoku'],
      recentSlugs: ['minesweeper', 'unknown-slug'],
      theme: 'dark',
    });

    expect(screen.getByRole('heading', { name: 'Gemini Games' })).toBeTruthy();
    expect(screen.getByText(`${GAMES.length} Games`)).toBeTruthy();

    // Recently played renders valid slug only
    const recentSection = screen.getByTestId('recently-played');
    expect(recentSection.textContent).toContain('Minesweeper');
    fireEvent.click(recentSection.querySelector('button')!);
    expect(props.onSelectGame).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'minesweeper' }),
    );

    // Theme toggle
    const themeBtn = screen.getByTestId('theme-toggle');
    expect(themeBtn.textContent).toContain('Light');
    fireEvent.click(themeBtn);
    expect(props.onToggleTheme).toHaveBeenCalledTimes(1);

    // Language switcher
    fireEvent.click(screen.getByTestId('lang-zh'));
    expect(props.onChangeLocale).toHaveBeenCalledWith('zh');
    fireEvent.click(screen.getByTestId('lang-vi'));
    expect(props.onChangeLocale).toHaveBeenCalledWith('vi');

    // Favorite toggle stops propagation & calls onToggleFavorite
    fireEvent.click(screen.getByTestId('fav-sudoku'));
    expect(props.onToggleFavorite).toHaveBeenCalledWith('sudoku');

    // Filter to Favorites shows 1 game
    fireEvent.click(screen.getByRole('tab', { name: /Favorites \(1\)/i }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });

  it('shows empty states for empty favorites and unmatched search, and resets filters', () => {
    setup({ favorites: [] });

    fireEvent.click(screen.getByRole('tab', { name: /Favorites \(0\)/i }));
    expect(screen.getByText(/No favorite games yet/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Reset Filters' }));
    expect(screen.getAllByRole('article')).toHaveLength(GAMES.length);

    const search = screen.getByLabelText('Search games') as HTMLInputElement;
    fireEvent.change(search, { target: { value: 'zzzz-no-match' } });
    expect(screen.getByText(/No games match your current filter/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Reset Filters' }));
    expect(search.value).toBe('');
    expect(screen.getAllByRole('article')).toHaveLength(GAMES.length);
  });

  it('supports keyboard shortcuts (/ search, Escape clear, Arrow keys + Enter launch)', () => {
    const { props } = setup();
    const search = screen.getByLabelText('Search games') as HTMLInputElement;

    // Modifier keys are ignored
    fireEvent.keyDown(window, { key: '/', ctrlKey: true });
    expect(document.activeElement).not.toBe(search);

    // '/' focuses search, Escape clears & blurs
    fireEvent.keyDown(window, { key: '/' });
    expect(document.activeElement).toBe(search);
    fireEvent.change(search, { target: { value: '1024' } });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(search.value).toBe('');
    expect(document.activeElement).not.toBe(search);

    // Arrow navigation + Enter launches selected game
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(props.onSelectGame).toHaveBeenCalledWith(
      expect.objectContaining({ slug: '1024' }),
    );
  });

  it('renders external project and author links with localized labels', () => {
    setup({ locale: 'en' });

    const expectedLinks = [
      {
        testId: 'link-project-github',
        href: 'https://github.com/vuhung16au/gemini-games/',
        label: 'Project GitHub',
      },
      {
        testId: 'link-author-github',
        href: 'https://github.com/vuhung16au/',
        label: 'GitHub (@vuhung16au)',
      },
      {
        testId: 'link-linkedin',
        href: 'https://www.linkedin.com/in/nguyenvuhung/',
        label: 'LinkedIn',
      },
      {
        testId: 'link-substack',
        href: 'https://vuhung16.substack.com/',
        label: 'Substack',
      },
      {
        testId: 'link-vumaths',
        href: 'https://vumaths.com/',
        label: 'VuMaths',
      },
    ];

    for (const item of expectedLinks) {
      const link = screen.getByTestId(item.testId) as HTMLAnchorElement;
      expect(link.getAttribute('href')).toBe(item.href);
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link.textContent).toContain(item.label);
    }

    cleanup();
    setup({ locale: 'zh' });
    expect(screen.getByTestId('link-project-github').textContent).toContain('项目 GitHub');

    cleanup();
    setup({ locale: 'vi' });
    expect(screen.getByTestId('link-project-github').textContent).toContain('GitHub dự án');
  });
});
