// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';

describe('App root integration', () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          store.set(k, v);
        },
        removeItem: (k: string) => {
          store.delete(k);
        },
        clear: () => {
          store.clear();
        },
      },
    });
    window.location.hash = '';
  });

  afterEach(() => {
    cleanup();
  });

  it('renders Dashboard, persists theme/locale/favorites, and navigates via hash routing', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Gemini Games' })).toBeTruthy();
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.lang).toBe('en');

    // Toggle theme
    fireEvent.click(screen.getByTestId('theme-toggle'));
    expect(document.documentElement.dataset.theme).toBe('dark');

    // Switch locale
    fireEvent.click(screen.getByTestId('lang-zh'));
    expect(document.documentElement.lang).toBe('zh');
    expect(screen.getByRole('heading', { name: 'Gemini 游戏中心' })).toBeTruthy();

    // Toggle favorite
    fireEvent.click(screen.getByTestId('fav-1024'));
    expect(screen.getByTestId('fav-1024').getAttribute('aria-pressed')).toBe('true');

    // Launch a game via Play button
    const card1024 = document.querySelector('[data-game-slug="1024"]')!;
    fireEvent.click(card1024.querySelector('.tile-play-btn')!);
    expect(window.location.hash).toBe('#/play/1024');
    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.getByTitle('1024 数字合成')).toBeTruthy();

    // Navigate back
    fireEvent.click(screen.getByRole('button', { name: /全部游戏/i }));
    expect(window.location.hash).toBe('#/');
    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.getByRole('heading', { name: 'Gemini 游戏中心' })).toBeTruthy();

    // Hashchange to another game & unknown slug fallback
    act(() => {
      window.location.hash = '#/play/minesweeper';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.getByTitle('扫雷')).toBeTruthy();

    act(() => {
      window.location.hash = '#/play/unknown-game';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.getByRole('heading', { name: 'Gemini 游戏中心' })).toBeTruthy();
  });
});
