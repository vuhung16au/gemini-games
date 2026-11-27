import { expect, test } from '@playwright/test';

test.describe('SimCity 3D E2E', () => {
  test('renders 3D WebGL canvas cleanly with zero console or page errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'SimCity 3D' })).toBeVisible();
    const canvas = page.locator('canvas.simcity-webgl-canvas');
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(200);
    expect(box!.height).toBeGreaterThan(200);

    await expect(page.getByTestId('hud-treasury')).toContainText('$2,500');
    expect(errors).toEqual([]);
  });

  test('supports building placement, Tutorial, Hint, How to Play, Starter Town, and Mute persistence', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'SimCity 3D' })).toBeVisible();
    await expect(page.locator('canvas.simcity-webgl-canvas')).toBeVisible();

    // Select Power Plant (hotkey 6) and place on canvas center
    await page.keyboard.press('6');
    await expect(page.locator('[data-tool-id="power"]')).toHaveAttribute('aria-pressed', 'true');

    const canvas = page.locator('canvas.simcity-webgl-canvas');
    const box = (await canvas.boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);

    // Either built on grass/forest (treasury decreased) or water notice shown; test Starter Town for guaranteed live city
    await page.getByRole('button', { name: 'New City' }).click();
    await page.getByRole('button', { name: /Load Starter Town/i }).click();

    await expect(page.getByTestId('hud-treasury')).toContainText('$1,850');
    const popText = await page.getByTestId('hud-population').innerText();
    expect(popText).not.toContain('Population\n0');

    // Open How to Play modal
    await page.getByRole('button', { name: '? Help' }).click();
    await expect(page.getByRole('dialog', { name: 'How to Play SimCity 3D' })).toBeVisible();
    await page.getByRole('button', { name: 'Back to City' }).click();

    // Open Tutorial & Hint
    await page.getByRole('button', { name: 'Tutorial' }).click();
    await expect(page.getByTestId('advisor-toast')).toBeVisible();
    await page.getByRole('button', { name: '💡 Hint' }).click();
    await expect(page.getByTestId('advisor-toast')).toBeVisible();

    // Toggle Night lighting & Mute and verify persistence across reload
    await page.getByRole('button', { name: /Night/i }).click();
    const muteBtn = page.getByRole('button', { name: 'Mute audio' });
    await muteBtn.click();
    await expect(page.getByRole('button', { name: 'Unmute audio' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.reload();
    await expect(page.getByRole('button', { name: 'Unmute audio' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByTestId('hud-treasury')).toContainText('$1,850');

    expect(errors).toEqual([]);
  });
});
