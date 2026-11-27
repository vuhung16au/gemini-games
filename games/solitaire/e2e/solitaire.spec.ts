import { expect, test } from '@playwright/test';

test.describe('Solitaire E2E', () => {
  test('loads cleanly with 7 tableau columns, 4 foundations, and zero errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Solitaire' })).toBeVisible();
    await expect(page.getByTestId('stock-pile')).toBeVisible();
    for (let i = 0; i < 4; i++) {
      await expect(page.getByTestId(`foundation-${i}`)).toBeVisible();
    }
    for (let i = 0; i < 7; i++) {
      await expect(page.getByTestId(`tableau-${i}`)).toBeVisible();
    }

    // Draw from stock and verify Moves increments and Undo reverts
    await page.getByTestId('stock-pile').click();
    await expect(page.getByTestId('moves-display')).toHaveText('Moves: 1');
    await page.getByRole('button', { name: /Undo/i }).click();
    await expect(page.getByTestId('moves-display')).toHaveText('Moves: 0');

    expect(errors).toEqual([]);
  });

  test('supports How to Play modal, 3-step Tutorial, Hint, and Draw/Mute persistence', async ({
    page,
  }) => {
    await page.goto('/');

    // How to Play modal
    await page.getByRole('button', { name: 'How to Play' }).click();
    await expect(
      page.getByRole('dialog', { name: 'How to Play Solitaire' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Got It' }).click();
    await expect(
      page.getByRole('dialog', { name: 'How to Play Solitaire' }),
    ).toHaveCount(0);

    // Tutorial mode walkthrough (3 steps)
    await page.getByRole('button', { name: 'Tutorial' }).click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 1 of 3');

    // Step 1: A♥ -> Foundation 0
    await page.locator('[data-card-id="hearts-1"]').click();
    await page.getByTestId('foundation-0').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 2 of 3');

    // Step 2: 6♥ -> 7♠
    await page.locator('[data-card-id="hearts-6"]').click();
    await page.locator('[data-card-id="spades-7"]').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 3 of 3');

    // Step 3: K♠ -> empty col 4
    await page.locator('[data-card-id="spades-13"]').click();
    await page.getByTestId('tableau-4').click();
    await expect(page.getByTestId('guidance-banner')).toContainText(
      'Tutorial complete!',
    );

    // Hint works in normal game
    await page.getByRole('button', { name: 'Start Full Game' }).click();
    await page.getByRole('button', { name: /Hint/i }).click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Hint:');

    // Switch to Turn 3 & Mute, verify persistence across reload
    await page.getByRole('tab', { name: 'Turn 3' }).click();
    await page.getByRole('button', { name: /Mute sound effects/i }).click();
    await page.reload();

    await expect(page.getByRole('tab', { name: 'Turn 3' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(
      page.getByRole('button', { name: /Unmute sound effects/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
