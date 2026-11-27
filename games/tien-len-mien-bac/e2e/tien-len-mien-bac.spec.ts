import { expect, test } from '@playwright/test';

test.describe('Tiến Lên Miền Bắc E2E', () => {
  test('loads cleanly inside 100dvh with zero scrollbars and zero console/page errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Tiến Lên Miền Bắc' }),
    ).toBeVisible();
    await expect(page.getByTestId('table-center')).toBeVisible();
    await expect(page.getByTestId('player-hand')).toBeVisible();

    // Verify 13 cards dealt to the human player in 4P mode
    await expect(
      page.getByTestId('player-hand').locator('[data-testid^="card-"]'),
    ).toHaveCount(13);

    // Verify zero scrollbars on 1280x720 desktop
    const hasScrollbars = await page.evaluate(() => {
      return (
        document.documentElement.scrollHeight > window.innerHeight ||
        document.documentElement.scrollWidth > window.innerWidth
      );
    });
    expect(hasScrollbars).toBe(false);
    expect(errors).toEqual([]);
  });

  test('supports How to Play modal, 3-step Tutorial, Hint, 2P/3P/4P & Pass-and-Play Curtain, and Mute persistence', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. How to Play modal
    await page.getByTestId('help-btn').click();
    await expect(
      page.getByRole('dialog', {
        name: /Luật Tiến Lên Miền Bắc \/ How to Play/i,
      }),
    ).toBeVisible();
    await page.getByTestId('close-help-btn').click();
    await expect(
      page.getByRole('dialog', {
        name: /Luật Tiến Lên Miền Bắc \/ How to Play/i,
      }),
    ).toHaveCount(0);

    // 2. 3-step Guided Tutorial walkthrough
    await page.getByTestId('tutorial-btn').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Bước 1/3');

    // Step 1: play 3♠
    await page.getByTestId('card-spades-3').click();
    await page.getByTestId('play-btn').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Bước 2/3');

    // Step 2: play 9♦ to beat 7♦
    await page.getByTestId('card-diamonds-9').click();
    await page.getByTestId('play-btn').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Bước 3/3');

    // Step 3: Chặt Heo with Tứ quý 6
    await page.getByTestId('card-spades-6').click();
    await page.getByTestId('card-clubs-6').click();
    await page.getByTestId('card-diamonds-6').click();
    await page.getByTestId('card-hearts-6').click();
    await page.getByTestId('play-btn').click();
    await expect(page.getByTestId('guidance-banner')).toContainText(
      'Tutorial complete!',
    );

    // Return to full game
    await page.getByTestId('start-full-game-btn').click();

    // 3. Switch to 2P + Pass & Play and test Privacy Handoff Curtain
    await page.getByTestId('players-2').click();
    await page.getByTestId('mode-hotseat').click();

    await expect(page.getByTestId('handoff-curtain')).toBeVisible();
    await expect(page.getByTestId('handoff-curtain')).toContainText(
      'Chuyển máy cho Người chơi',
    );
    await page.getByTestId('reveal-hand-btn').click();
    await expect(page.getByTestId('handoff-curtain')).toHaveCount(0);

    // Use Hint to highlight & select valid opening play, then play it -> triggers curtain for next player
    await page.getByTestId('hint-btn').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Hint:');
    await page.getByTestId('play-btn').click();
    await expect(page.getByTestId('handoff-curtain')).toBeVisible();

    // 4. Mute toggle & reload persistence
    await page.getByTestId('mute-btn').click();
    await expect(page.getByTestId('mute-btn')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.reload();
    await expect(page.getByTestId('mute-btn')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByTestId('players-2')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByTestId('mode-hotseat')).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
