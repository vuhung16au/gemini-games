import { expect, test } from '@playwright/test';

test.describe('Super Mario Bros. (1985) E2E', () => {
  test('loads title screen, selects World 1-4, moves/jumps, and pauses with zero console errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Super Mario Bros. (1985)' })).toBeVisible();
    await expect(page.getByTestId('title-overlay')).toBeVisible();
    await expect(page.locator('canvas.smb-canvas')).toBeVisible();

    // Verify 2 Players (TODO) button is visible & disabled
    await expect(page.getByRole('button', { name: '2 Players (TODO)' })).toBeDisabled();

    // Select World 1-4 and start
    await page.locator('[data-level-btn="1-4"]').click();
    await page.getByRole('button', { name: '1 Player Start' }).click();
    await expect(page.getByTestId('hud-world')).toContainText('1-4');

    // Move right and jump
    await page.keyboard.down('KeyD');
    await page.keyboard.press('Space');
    await page.waitForTimeout(140);
    await page.keyboard.up('KeyD');

    // Pause and resume
    await page.keyboard.press('KeyP');
    await expect(page.getByTestId('pause-overlay')).toBeVisible();
    await page.getByTestId('pause-overlay').getByRole('button', { name: 'Resume' }).click();
    await expect(page.getByTestId('pause-overlay')).toBeHidden();

    expect(errors).toEqual([]);
  });

  test('supports How to Play modal, Tutorial, Hint, and Mute persistence across reload', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await page.getByRole('button', { name: '? Help' }).click();
    await expect(page.getByRole('dialog', { name: 'How to Play Super Mario Bros' })).toBeVisible();
    await page.getByRole('button', { name: 'Back to World 1' }).click();

    await page.getByTestId('title-overlay').getByRole('button', { name: 'Tutorial' }).click();
    await expect(page.getByTestId('tutorial-toast')).toBeVisible();

    await page.getByRole('button', { name: '💡 Hint' }).click();

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

    expect(errors).toEqual([]);
  });
});
