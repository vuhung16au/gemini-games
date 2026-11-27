import { expect, test } from '@playwright/test';

test.describe('Tấn Đỡ (Bài Tấn) E2E', () => {
  test('loads cleanly inside 100dvh, supports Help, 3-step Tutorial, and Hint', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /Tấn Đỡ/i }),
    ).toBeVisible();
    await expect(page.getByTestId('trump-display')).toBeVisible();
    await expect(page.getByTestId('noc-pile')).toBeVisible();
    await expect(
      page.getByTestId('player-hand').locator('[data-card-id]'),
    ).toHaveCount(8);

    // Viewport fits cleanly without vertical or horizontal scrollbars
    const overflow = await page.evaluate(() => ({
      scrollH: document.documentElement.scrollHeight - window.innerHeight,
      scrollW: document.documentElement.scrollWidth - window.innerWidth,
    }));
    expect(overflow.scrollH).toBeLessThanOrEqual(1);
    expect(overflow.scrollW).toBeLessThanOrEqual(1);

    // Help modal
    await page.getByTestId('btn-help').click();
    await expect(
      page.getByRole('dialog', { name: /Luật chơi Tấn Đỡ/i }),
    ).toBeVisible();
    await page.getByRole('button', { name: /Got It/i }).click();
    await expect(
      page.getByRole('dialog', { name: /Luật chơi Tấn Đỡ/i }),
    ).toHaveCount(0);

    // 3-step Tutorial walkthrough
    await page.getByTestId('btn-tutorial').click();
    await expect(page.getByTestId('guidance-banner')).toContainText(
      'Step 1 of 3',
    );

    // Step 1: Attack with 5♠
    await page.locator('[data-card-id="spades-5"]').click();
    await page.getByTestId('btn-attack').click();
    await expect(page.getByTestId('guidance-banner')).toContainText(
      'Step 2 of 3',
    );

    // Step 2: Throw in 8♦
    await page.locator('[data-card-id="diamonds-8"]').click();
    await page.getByTestId('btn-throw-in').click();
    await expect(page.getByTestId('guidance-banner')).toContainText(
      'Step 3 of 3',
    );

    // Step 3: Defend K♣ with Trump 2♥
    await page.locator('[data-card-id="hearts-2"]').click();
    await page.getByTestId('btn-defend').click();
    await expect(page.getByTestId('guidance-banner')).toContainText(
      'Tutorial complete!',
    );

    // Return to full game and test Hint
    await page.getByRole('button', { name: /Start Full Game/i }).click();
    await expect(
      page.getByTestId('player-hand').locator('[data-card-id]'),
    ).toHaveCount(8);

    // Wait briefly if AI happens to hold lowest trump & attacks first
    await expect(page.getByTestId('btn-hint')).toBeEnabled({ timeout: 5000 });
    await page.getByTestId('btn-hint').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Gợi ý:');

    expect(errors).toEqual([]);
  });

  test('supports 2P/3P/4P, Pass & Play privacy curtain, and Mute persistence', async ({
    page,
  }) => {
    await page.goto('/');

    // Switch to 3P -> 2 opponents
    await page.getByTestId('player-count-3').click();
    await expect(page.locator('[data-testid^="opponent-seat-"]')).toHaveCount(
      2,
    );

    // Switch to 4P -> 3 opponents
    await page.getByTestId('player-count-4').click();
    await expect(page.locator('[data-testid^="opponent-seat-"]')).toHaveCount(
      3,
    );

    // Switch to Pass & Play -> Privacy Curtain appears
    await page.getByTestId('mode-pass-and-play').click();
    await expect(page.getByTestId('privacy-curtain')).toBeVisible();
    await expect(page.getByTestId('privacy-curtain')).toContainText(
      'Chuyển máy cho Người chơi',
    );

    // Reveal hand and play an opening attack -> triggers Privacy Curtain for next player
    await page.getByTestId('btn-reveal-hand').click();
    await expect(page.getByTestId('privacy-curtain')).toHaveCount(0);

    await page
      .getByTestId('player-hand')
      .locator('[data-card-id]')
      .first()
      .click();
    await page.getByTestId('btn-attack').click();

    await expect(page.getByTestId('privacy-curtain')).toBeVisible();

    // Mute toggle & reload persistence
    await page.getByTestId('btn-mute').click();
    await expect(page.getByTestId('btn-mute')).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.reload();

    await expect(page.getByTestId('player-count-4')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByTestId('mode-pass-and-play')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByTestId('btn-mute')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByTestId('privacy-curtain')).toBeVisible();
  });
});
