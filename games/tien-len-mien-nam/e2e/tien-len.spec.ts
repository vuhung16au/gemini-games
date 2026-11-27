import { expect, test } from '@playwright/test';

test.describe('Tiến Lên Miền Nam E2E', () => {
  test('loads cleanly inside 100dvh with zero scrollbars and supports 2P/3P/4P switching', async ({
    page,
  }) => {
    const appErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Coordinator generates public/icons/* and public/graphics/* after build
        if (!text.includes('404 (Not Found)')) {
          appErrors.push(text);
        }
      }
    });
    page.on('pageerror', (err) => appErrors.push(err.message));

    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Tiến Lên Miền Nam' }),
    ).toBeVisible();

    // Verify 100dvh zero scrollbars
    const overflow = await page.evaluate(() => ({
      scrollH: document.documentElement.scrollHeight,
      clientH: document.documentElement.clientHeight,
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollH).toBeLessThanOrEqual(overflow.clientH);
    expect(overflow.scrollW).toBeLessThanOrEqual(overflow.clientW);

    // 4P default -> 3 opponents + 13 cards in hand
    await expect(page.locator('[data-testid^="opponent-seat-"]')).toHaveCount(3);
    await expect(
      page.getByTestId('player-hand').locator('[data-card-id]'),
    ).toHaveCount(13);

    // Switch to 2P and 3P
    await page.getByTestId('player-count-2').click();
    await expect(page.locator('[data-testid^="opponent-seat-"]')).toHaveCount(1);

    await page.getByTestId('player-count-3').click();
    await expect(page.locator('[data-testid^="opponent-seat-"]')).toHaveCount(2);

    // Check mobile portrait viewport fits inside 100dvh with zero scrollbars
    await page.setViewportSize({ width: 390, height: 844 });
    const mobileOverflow = await page.evaluate(() => ({
      scrollH: document.documentElement.scrollHeight,
      clientH: document.documentElement.clientHeight,
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    expect(mobileOverflow.scrollH).toBeLessThanOrEqual(mobileOverflow.clientH);
    expect(mobileOverflow.scrollW).toBeLessThanOrEqual(mobileOverflow.clientW);

    expect(appErrors).toEqual([]);
  });

  test('supports vs AI play/response, Pass & Play privacy curtain, Help modal, Tutorial, and Mute persistence', async ({
    page,
  }) => {
    await page.goto('/');

    // In 2P vs AI, wait for human turn (at most 1 AI opening move) and play via Hint
    await page.getByTestId('player-count-2').click();
    await expect(page.getByTestId('hint-btn')).toBeEnabled({ timeout: 5000 });
    await page.getByTestId('hint-btn').click();
    await page.getByTestId('play-btn').click();
    await expect(page.getByTestId('player-hand').locator('[data-card-id]')).not.toHaveCount(13);

    // How to Play modal
    await page.getByTestId('help-btn').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByTestId('close-help-btn').click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    // 3-step Tutorial walkthrough
    await page.getByTestId('tutorial-btn').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 1 of 3');

    // Step 1: A♦
    await page.locator('[data-card-id="diamonds-14"]').click();
    await page.getByTestId('play-btn').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 2 of 3');

    // Step 2: Use Hint to select 3 Consecutive Pairs and Chặt Heo 2♠
    await page.getByTestId('hint-btn').click();
    await page.getByTestId('play-btn').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 3 of 3');

    // Step 3: Play Straight J♠-Q♦-K♣ to win Tutorial
    await page.locator('[data-card-id="spades-11"]').click();
    await page.locator('[data-card-id="diamonds-12"]').click();
    await page.locator('[data-card-id="clubs-13"]').click();
    await page.getByTestId('play-btn').click();
    await expect(page.getByTestId('round-over-overlay')).toBeVisible();
    await page.getByTestId('start-full-game-btn').click();

    // Switch to Pass & Play 2P and test Privacy Handoff Curtain
    await page.getByTestId('player-count-2').click();
    await page.getByTestId('mode-pass-play').click();
    await expect(page.getByTestId('privacy-curtain')).toContainText(
      'Chuyển máy cho Người chơi',
    );
    await expect(page.getByTestId('privacy-curtain')).toContainText(
      'Pass device to Player',
    );

    // Reveal hand, Hint + Play, confirm handoff curtain appears for next player
    await page.getByTestId('reveal-hand-btn').click();
    await expect(page.getByTestId('privacy-curtain')).toHaveCount(0);

    await page.getByTestId('hint-btn').click();
    await page.getByTestId('play-btn').click();
    await expect(page.getByTestId('privacy-curtain')).toBeVisible();

    // Mute toggle persists across reload
    await page.getByTestId('mute-btn').click();
    await page.reload();
    await expect(page.getByTestId('mute-btn')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByTestId('mode-pass-play')).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
