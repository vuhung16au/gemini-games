import { expect, test } from '@playwright/test';

test.describe('Minesweeper E2E', () => {
  test('renders default 9x9 Easy board, reveals safe pocket, flags mine, and switches presets with zero errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Minesweeper' })).toBeVisible();
    await expect(page.getByRole('gridcell')).toHaveCount(81);
    await expect(page.getByTestId('mine-counter')).toHaveText('010');

    // First click is guaranteed safe
    await page.locator('[data-cell="4-4"]').click();
    await expect(page.locator('[data-cell="4-4"]')).toHaveClass(/revealed/);

    // Right-click a hidden cell to flag
    const hiddenCell = page.locator('.ms-cell.hidden').first();
    await hiddenCell.click({ button: 'right' });
    await expect(page.getByTestId('mine-counter')).toHaveText('009');

    // Switch to Medium 16x16 and Custom 7x8
    await page.getByRole('button', { name: 'Medium 16×16' }).click();
    await expect(page.getByRole('gridcell')).toHaveCount(256);

    await page.getByRole('button', { name: 'Custom…' }).click();
    await page.getByLabel('Custom rows').fill('7');
    await page.getByLabel('Custom columns').fill('8');
    await page.getByLabel('Custom mines').fill('6');
    await page.getByRole('button', { name: 'Start Custom Board' }).click();
    await expect(page.getByRole('gridcell')).toHaveCount(56);

    expect(errors).toEqual([]);
  });

  test('supports How to Play modal, Tutorial, Hint, and Mute + Difficulty persistence across reload', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await page.getByRole('button', { name: '? Help' }).click();
    await expect(page.getByRole('dialog', { name: 'How to Play Minesweeper' })).toBeVisible();
    await page.getByRole('button', { name: 'Back to Board' }).click();

    await page.getByRole('button', { name: 'Tutorial' }).click();
    await expect(page.getByTestId('tutorial-toast')).toBeVisible();

    await page.getByRole('button', { name: '💡 Hint' }).click();

    await page.getByRole('button', { name: 'Hard 30×16' }).click();
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
    await expect(page.getByRole('gridcell')).toHaveCount(480);

    expect(errors).toEqual([]);
  });
});
