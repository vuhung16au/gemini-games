// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GamePlayer } from '../GamePlayer';
import { findGameBySlug } from '../../registry/games';

afterEach(() => {
  cleanup();
});

describe('GamePlayer component', () => {
  const minesweeper = findGameBySlug('minesweeper')!;

  it('renders localized header info, back button, reload, and fullscreen actions', () => {
    const onBack = vi.fn();
    const { container } = render(
      <GamePlayer game={minesweeper} locale="vi" onBack={onBack} />,
    );

    expect(screen.getByText('Dò Mìn (Minesweeper)')).toBeTruthy();
    const iframe = screen.getByTitle('Dò Mìn (Minesweeper)') as HTMLIFrameElement;
    expect(iframe.getAttribute('src')).toBe('./games/minesweeper/index.html');

    // Trigger onLoad handler
    fireEvent.load(iframe);

    // Reload remounts iframe with new key
    fireEvent.click(screen.getByRole('button', { name: /Tải lại/i }));
    expect(screen.getByTitle('Dò Mìn (Minesweeper)')).toBeTruthy();

    // Fullscreen enter & exit
    const shell = container.querySelector('.player-shell') as HTMLElement;
    const reqFs = vi.fn().mockResolvedValue(undefined);
    const exitFs = vi.fn().mockResolvedValue(undefined);
    shell.requestFullscreen = reqFs;
    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: exitFs,
    });

    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: null,
    });
    fireEvent.click(screen.getByRole('button', { name: /Toàn màn hình/i }));
    expect(reqFs).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: shell,
    });
    fireEvent.click(screen.getByRole('button', { name: /Toàn màn hình/i }));
    expect(exitFs).toHaveBeenCalledTimes(1);

    // Fullscreen error is swallowed safely
    shell.requestFullscreen = vi.fn(() => {
      throw new Error('unsupported');
    });
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: null,
    });
    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: /Toàn màn hình/i })),
    ).not.toThrow();

    // Back button
    fireEvent.click(screen.getByRole('button', { name: /Tất cả trò chơi/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
