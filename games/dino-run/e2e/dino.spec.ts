import { expect, test } from '@playwright/test';

test.describe('Dino Run E2E', () => {
  test('loads cleanly, starts on Space, increases score, and switches themes with zero errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Dino Run' })).toBeVisible();
    await expect(page.locator('canvas.dino-canvas')).toBeVisible();
    await expect(page.getByTestId('idle-overlay')).toBeVisible();

    await page.keyboard.press('Space');
    await expect(page.getByTestId('idle-overlay')).toBeHidden();

    await page.waitForTimeout(300);
    const scoreText = await page.getByTestId('score-readout').innerText();
    expect(scoreText).not.toContain('00000\n00000');

    // Switch to 404 Math theme
    await page.getByRole('button', { name: /404 Math/i }).click();
    await expect(page.getByRole('button', { name: /404 Math/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    expect(errors).toEqual([]);
  });

  test('supports How to Play modal, Tutorial, Hint, and Mute + Theme persistence across reload', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await page.getByRole('button', { name: '? Help' }).click();
    await expect(page.getByRole('dialog', { name: 'How to Play Dino Run' })).toBeVisible();
    await page.getByRole('button', { name: 'Back to Run' }).click();

    await page.getByRole('button', { name: 'Tutorial' }).click();
    await expect(page.getByTestId('tutorial-toast')).toBeVisible();

    await page.getByRole('button', { name: '💡 Hint' }).click();
    await expect(page.getByTestId('hint-toast')).toBeVisible();

    await page.getByRole('button', { name: /404 Math/i }).click();
    await page.getByRole('button', { name: 'Mute audio' }).click();
    await expect(page.getByRole('button', { name: 'Unmute audio' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.reload();
    await expect(page.getByRole('button', { name: 'Unmute audio' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByRole('button', { name: /404 Math/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    expect(errors).toEqual([]);
  });
});
