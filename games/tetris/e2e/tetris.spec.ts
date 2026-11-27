import { expect, test } from '@playwright/test';

test.describe('Tetris E2E', () => {
  test('loads cleanly, starts game, drops pieces, holds, and pauses without errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Tetris' })).toBeVisible();
    await expect(page.getByLabel('Tetris board')).toBeVisible();

    await page.getByRole('button', { name: 'Start Game' }).click();
    await expect(page.getByTestId('score-value')).toHaveText('0');

    // Hard drop with Space increases score
    await page.keyboard.press('Space');
    const scoreText = await page.getByTestId('score-value').textContent();
    expect(Number(scoreText)).toBeGreaterThan(0);

    // Hold with C populates hold-box
    await page.keyboard.press('KeyC');
    await expect(page.getByTestId('hold-box')).not.toHaveAttribute(
      'data-hold-type',
      'none',
    );

    // Pause and Resume
    await page.getByRole('button', { name: 'Pause game' }).click();
    await expect(page.getByRole('dialog', { name: 'Game Paused' })).toBeVisible();
    await page.getByRole('button', { name: 'Resume', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Game Paused' })).toHaveCount(0);

    expect(errors).toEqual([]);
  });

  test('supports How to Play modal, 3-step Tutorial, Hint, and Mute persistence', async ({
    page,
  }) => {
    await page.goto('/');

    // How to Play modal
    await page.getByRole('button', { name: 'How to Play' }).click();
    await expect(
      page.getByRole('dialog', { name: 'How to Play Tetris' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Got It' }).click();

    // Tutorial mode walkthrough
    await page.getByRole('button', { name: 'Tutorial' }).click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 1 of 3');

    await page.keyboard.press('ArrowUp');
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 2 of 3');

    // Move vertical I-piece right to col 9 (4 right presses from col 3 -> 7) and hard drop
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('ArrowRight');
    }
    await page.keyboard.press('Space');
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 3 of 3');

    await page.keyboard.press('KeyC');
    await expect(page.getByTestId('guidance-banner')).toContainText(
      'Tutorial complete!',
    );

    // Start Full Game and test Hint + Mute persistence
    await page.getByRole('button', { name: 'Start Full Game' }).click();
    await page.getByRole('button', { name: /Hint/i }).click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Hint:');

    await page.getByRole('button', { name: /Mute sound effects/i }).click();
    await page.reload();
    await expect(
      page.getByRole('button', { name: /Unmute sound effects/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
