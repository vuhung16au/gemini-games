import { expect, test } from '@playwright/test';

test.describe('Sudoku E2E', () => {
  test('loads cleanly with 81 cells and zero console/page errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Sudoku' })).toBeVisible();
    await expect(page.getByRole('gridcell')).toHaveCount(81);
    await expect(page.getByTestId('mistakes-counter')).toHaveText('Mistakes: 0/3');
    expect(errors).toEqual([]);
  });

  test('supports notes, hint, undo, pause/resume, and mute persistence', async ({
    page,
  }) => {
    await page.goto('/');

    // How to Play modal & Tutorial mode
    await page.getByRole('button', { name: 'How to Play' }).click();
    await expect(
      page.getByRole('dialog', { name: 'How to Play Sudoku' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Got It' }).click();

    await page.getByRole('button', { name: 'Tutorial' }).click();
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 1 of 3');
    await page.keyboard.press('5');
    await expect(page.getByTestId('guidance-banner')).toContainText('Step 2 of 3');
    await page.getByRole('button', { name: 'New Game' }).click();

    // Select first empty cell
    const emptyCell = page.locator('[data-given="false"]').first();
    await emptyCell.click();

    // Toggle Notes mode ON and enter a note
    const notesBtn = page.getByRole('button', { name: /Notes/i });
    await notesBtn.click();
    await expect(notesBtn).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('7');
    await expect(emptyCell.locator('.note-slot').nth(6)).toHaveText('7');

    // Toggle Notes OFF and use Hint to solve the cell
    await notesBtn.click();
    await page.getByRole('button', { name: /Hint/i }).click();
    await expect(emptyCell.locator('.cell-value')).toBeVisible();

    // Undo clears the hinted cell
    await page.getByRole('button', { name: /Undo/i }).click();
    await expect(emptyCell.locator('.cell-value')).toHaveCount(0);

    // Pause and Resume
    await page.getByTestId('timer-display').click();
    await expect(page.getByRole('dialog', { name: 'Game Paused' })).toBeVisible();
    await page.getByRole('button', { name: 'Resume', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Game Paused' })).toHaveCount(0);

    // Switch difficulty and toggle Mute, then verify persistence across reload
    await page.getByRole('tab', { name: 'Hard' }).click();
    const muteBtn = page.getByRole('button', { name: /Mute sound effects/i });
    await muteBtn.click();
    await expect(
      page.getByRole('button', { name: /Unmute sound effects/i }),
    ).toHaveAttribute('aria-pressed', 'true');

    await page.reload();
    await expect(page.getByRole('tab', { name: 'Hard' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(
      page.getByRole('button', { name: /Unmute sound effects/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
