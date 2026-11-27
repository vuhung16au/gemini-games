import { expect, test } from '@playwright/test';

test.describe('1024 E2E', () => {
  test('loads cleanly, handles moves & undo, and reports zero console errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(page.getByRole('heading', { name: '1024' })).toBeVisible();
    await expect(page.locator('.tile-inner')).toHaveCount(2);

    await page.keyboard.press('ArrowLeft');
    if (await page.getByRole('button', { name: 'Undo' }).isDisabled()) {
      await page.keyboard.press('ArrowDown');
    }
    await expect(page.getByRole('button', { name: 'Undo' })).toBeEnabled();
    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(page.getByRole('button', { name: 'Undo' })).toBeDisabled();

    expect(errors).toEqual([]);
  });

  test('supports How to Play modal, 3-step Tutorial, Hint, and Mute persistence', async ({
    page,
  }) => {
    await page.goto('/');

    // How to Play
    await page.getByRole('button', { name: 'How to Play' }).click();
    await expect(
      page.getByRole('dialog', { name: 'How to Play 1024' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Got It' }).click();
    await expect(
      page.getByRole('dialog', { name: 'How to Play 1024' }),
    ).toHaveCount(0);

    // 3-step Tutorial
    await page.getByRole('button', { name: 'Tutorial' }).click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 1 of 3');

    await page.keyboard.press('ArrowLeft');
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 2 of 3');

    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 3 of 3');

    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('guidance-banner')).toContainText(
      'Tutorial complete!',
    );

    // Hint & Mute persistence
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
