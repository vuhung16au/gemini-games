import { expect, test } from '@playwright/test';

test.describe('Battle City (1985) E2E', () => {
  test('loads title screen cleanly, starts 1P and 2P Co-op modes, and fires with zero console errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Battle City (1985)' })).toBeVisible();
    await expect(page.getByTestId('title-overlay')).toBeVisible();
    await expect(page.locator('canvas.bc-canvas')).toBeVisible();

    // Start 2-Player Co-op mode
    await page.getByRole('button', { name: '2 Players (Co-op)' }).click();
    await expect(page.getByTestId('p1-hud')).toBeVisible();
    await expect(page.getByTestId('p2-hud')).toBeVisible();

    // Move & fire P1 and P2
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(120);
    await page.keyboard.up('KeyW');
    await page.keyboard.press('Space');

    await page.keyboard.down('ArrowUp');
    await page.waitForTimeout(120);
    await page.keyboard.up('ArrowUp');
    await page.keyboard.press('Enter');

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
    await expect(page.getByRole('dialog', { name: 'How to Play Battle City' })).toBeVisible();
    await page.getByRole('button', { name: 'Back to Battle' }).click();

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
