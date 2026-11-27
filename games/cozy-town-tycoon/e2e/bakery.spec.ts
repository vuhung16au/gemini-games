import { expect, test } from '@playwright/test';

test.describe('Cozy Town Tycoon E2E', () => {
  test('loads cleanly, bakes bread, and reports zero console errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(page.getByText('COZY TOWN TYCOON')).toBeVisible();
    await expect(page.locator('canvas.bakery-canvas')).toBeVisible();

    await page.locator('button.btn-bake').click();
    await expect(page.getByText('Baked: 1')).toBeVisible();

    expect(errors).toEqual([]);
  });

  test('supports How to Play modal, 3-step Tutorial, Hint, and Mute persistence', async ({
    page,
  }) => {
    await page.goto('/');

    // How to Play modal
    await page.getByRole('button', { name: 'How to Play' }).click();
    await expect(
      page.getByRole('dialog', { name: 'How to Play Cozy Town Tycoon' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'GOT IT!' }).click();

    // 3-step Tutorial
    await page.getByRole('button', { name: 'Tutorial' }).click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 1 of 3');

    await page.locator('button.btn-bake').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 2 of 3');

    await page.locator('button.btn-bake').click();
    await page.locator('button.btn-bake').click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 3 of 3');

    await page.getByRole('button', { name: /Hint/i }).click();
    await expect(page.getByTestId('guidance-banner')).toContainText(
      'Tutorial complete!',
    );

    // Mute persistence
    await page.getByRole('button', { name: 'Mute SFX' }).click();
    await expect(
      page.getByRole('button', { name: 'Unmute SFX' }),
    ).toHaveAttribute('aria-pressed', 'true');

    await page.reload();
    await expect(
      page.getByRole('button', { name: 'Unmute SFX' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
