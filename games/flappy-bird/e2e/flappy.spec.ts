import { expect, test } from '@playwright/test';

test.describe('Flappy Bird E2E', () => {
  test('loads cleanly, flaps with Space, and reports zero console errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'FLAPPY BIRD' }),
    ).toBeVisible();
    await expect(page.locator('canvas.game-canvas')).toBeVisible();

    await page.keyboard.press('Space');
    await expect(page.getByLabel(/Score:/i)).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('supports How to Play modal, Tutorial mode, Hint toggle, and Mute persistence without flapping', async ({
    page,
  }) => {
    await page.goto('/');

    // How to Play does not trigger a flap
    await page.getByRole('button', { name: 'How to Play' }).click();
    await expect(
      page.getByRole('dialog', { name: 'How to Play Flappy Bird' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Got It' }).click();
    await expect(
      page.getByRole('heading', { name: 'FLAPPY BIRD' }),
    ).toBeVisible();

    // Tutorial mode banner & Hint toggle
    await page.getByRole('button', { name: 'Tutorial' }).click();
    await expect(page.getByTestId('guidance-banner')).toContainText(
      'Practice Mode:',
    );
    const hintBtn = page.getByRole('button', { name: /Hint/i });
    await expect(hintBtn).toHaveAttribute('aria-pressed', 'true');

    // Mute button does not trigger a flap and persists across reload
    await page.getByRole('button', { name: /Mute sound effects/i }).click();
    await expect(
      page.getByRole('heading', { name: 'FLAPPY BIRD' }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole('button', { name: /Unmute sound effects/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
