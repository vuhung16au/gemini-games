import { expect, test } from '@playwright/test';

test.describe('Checkers E2E', () => {
  test('loads cleanly with 64 squares, 12v12 pieces, and zero errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Checkers' })).toBeVisible();
    await expect(page.getByRole('gridcell')).toHaveCount(64);
    await expect(page.getByTestId('red-count')).toContainText('Red: 12');
    await expect(page.getByTestId('black-count')).toContainText('Black: 12');
    await expect(page.getByTestId('turn-indicator')).toHaveText("Red's Turn");
    expect(errors).toEqual([]);
  });

  test('supports 2-player moves, undo, vs-AI response, and mute persistence', async ({
    page,
  }) => {
    await page.goto('/');

    // How to Play modal & 3-step Tutorial
    await page.getByRole('button', { name: 'How to Play' }).click();
    await expect(
      page.getByRole('dialog', { name: 'How to Play Checkers' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Got It' }).click();

    await page.getByRole('button', { name: 'Tutorial' }).click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 1 of 3');
    await page.locator('[data-row="3"][data-col="2"]').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 2 of 3');
    await page.locator('[data-row="1"][data-col="4"]').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 3 of 3');
    await page.locator('[data-row="0"][data-col="3"]').click();
    await expect(page.getByTestId('guidance-banner')).toContainText(
      'Tutorial complete!',
    );
    await page.getByRole('button', { name: 'Start Full Match' }).click();

    // Switch to 2 Players mode for deterministic move + undo check
    await page.getByRole('tab', { name: '2 Players' }).click();
    await expect(page.getByTestId('turn-indicator')).toHaveText("Red's Turn");

    // Select Red piece at (5, 0) and move to (4, 1)
    await page.locator('[data-row="5"][data-col="0"]').click();
    await expect(page.getByTestId('move-target-4-1')).toBeVisible();
    await page.locator('[data-row="4"][data-col="1"]').click();

    await expect(page.getByTestId('turn-indicator')).toHaveText("Black's Turn");
    await expect(
      page.locator('[data-row="4"][data-col="1"] [data-piece="red"]'),
    ).toBeVisible();

    // Undo restores Red's turn
    await page.getByRole('button', { name: /Undo/i }).click();
    await expect(page.getByTestId('turn-indicator')).toHaveText("Red's Turn");
    await expect(
      page.locator('[data-row="5"][data-col="0"] [data-piece="red"]'),
    ).toBeVisible();

    // Switch back to vs AI, make a move, and verify AI responds
    await page.getByRole('tab', { name: 'vs AI' }).click();
    await page.locator('[data-row="5"][data-col="0"]').click();
    await page.locator('[data-row="4"][data-col="1"]').click();
    await expect(page.getByTestId('turn-indicator')).toHaveText("Red's Turn", {
      timeout: 5000,
    });

    // Toggle Mute and verify persistence across reload
    await page.getByRole('button', { name: /Mute sound effects/i }).click();
    await page.reload();
    await expect(
      page.getByRole('button', { name: /Unmute sound effects/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
