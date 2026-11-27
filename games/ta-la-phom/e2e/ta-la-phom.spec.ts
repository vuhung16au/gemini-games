import { expect, test } from '@playwright/test';

test.describe('Tá Lả (Phỏm) E2E', () => {
  test('loads cleanly inside 100dvh without scrollbars and supports 2P/3P/4P & Pass & Play privacy curtain', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Tá Lả (Phỏm)' })).toBeVisible();
    await expect(page.getByTestId('noc-pile')).toBeVisible();
    await expect(page.getByTestId('player-hand').locator('button')).toHaveCount(10);

    // Zero scrollbars inside 100dvh
    const fitsViewport = await page.evaluate(() => {
      return (
        document.documentElement.scrollHeight <= window.innerHeight &&
        document.documentElement.scrollWidth <= window.innerWidth
      );
    });
    expect(fitsViewport).toBe(true);

    // Switch player count 2P -> 3P -> 4P
    await page.getByTestId('player-count-2').click();
    await expect(page.locator('[data-testid^="opponent-seat-"]')).toHaveCount(1);

    await page.getByTestId('player-count-3').click();
    await expect(page.locator('[data-testid^="opponent-seat-"]')).toHaveCount(2);

    await page.getByTestId('player-count-4').click();
    await expect(page.locator('[data-testid^="opponent-seat-"]')).toHaveCount(3);

    // Switch to Pass & Play and verify Privacy Handoff Curtain
    await page.getByTestId('mode-pass-play').click();
    await expect(page.getByTestId('privacy-curtain')).toContainText(
      'Chuyển máy cho Người chơi 1',
    );
    await expect(page.getByTestId('privacy-curtain')).toContainText(
      'Pass device to Player 1',
    );

    await page.getByTestId('reveal-hand-btn').click();
    await expect(page.getByTestId('privacy-curtain')).toHaveCount(0);

    // Player 1 selects first card and discards -> Player 2 curtain appears
    await page.getByTestId('player-hand').locator('button').first().click();
    await page.getByTestId('discard-btn').click();

    await expect(page.getByTestId('privacy-curtain')).toContainText(
      'Chuyển máy cho Người chơi 2',
    );
    await page.getByTestId('reveal-hand-btn').click();
    await expect(page.getByTestId('privacy-curtain')).toHaveCount(0);

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test('supports How to Play modal, 3-step Tutorial, Hint, and Mute/Mode persistence', async ({
    page,
  }) => {
    await page.goto('/');

    // ? Help modal
    await page.getByTestId('help-btn').click();
    await expect(
      page.getByRole('dialog', { name: /How to Play Tá Lả/i }),
    ).toBeVisible();
    await page.getByTestId('howto-close-btn').click();
    await expect(
      page.getByRole('dialog', { name: /How to Play Tá Lả/i }),
    ).toHaveCount(0);

    // 3-step Tutorial: Draw/Eat -> Discard -> Form Phỏm
    await page.getByTestId('tutorial-btn').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 1 of 3');

    // Step 1: Eat 7♠
    await page.getByTestId('eat-btn').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 2 of 3');

    // Step 2: Select K♦ and Discard
    await page.locator('[data-card-id="diamonds-13"]').click();
    await page.getByTestId('discard-btn').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 3 of 3');

    // Step 3: Meld Phỏms
    await page.getByTestId('meld-btn').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Tutorial complete!');

    // Start full game and test Hint & Sort
    await page.getByTestId('start-full-game-btn').click();
    await page.getByTestId('hint-btn').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Hint:');
    await page.getByTestId('sort-btn').click();

    // Persistence across reload (2P + Pass & Play + Muted)
    await page.getByTestId('player-count-2').click();
    await page.getByTestId('mode-pass-play').click();
    await page.getByTestId('mute-btn').click();
    await page.reload();

    await expect(page.getByTestId('player-count-2')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('mode-pass-play')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('mute-btn')).toHaveAttribute('aria-pressed', 'true');
  });
});
