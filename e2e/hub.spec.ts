import { expect, test } from '@playwright/test';

test.describe('Unified Gemini Games Hub E2E', () => {
  test('renders 4-column dashboard grid with all 5 games and loaded graphics', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Gemini Games' }),
    ).toBeVisible();

    const cards = page.locator('.game-tile');
    await expect(cards).toHaveCount(15);

    // Verify 4 games per row on desktop (>= 1025px)
    const columnCount = await page.locator('.games-grid').evaluate((el) => {
      const cols = getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/);
      return cols.length;
    });
    expect(columnCount).toBe(4);

    // Verify every cover and icon image loaded cleanly
    await expect(async () => {
      const imageStatuses = await page.locator('.game-tile img').evaluateAll((imgs) =>
        imgs.map((img) => {
          const el = img as HTMLImageElement;
          return { src: el.getAttribute('src'), complete: el.complete, width: el.naturalWidth };
        }),
      );
      for (const img of imageStatuses) {
        expect(img.complete, `Image not complete: ${img.src}`).toBe(true);
        expect(img.width, `Image width 0: ${img.src}`).toBeGreaterThan(0);
      }
    }).toPass({ timeout: 5000 });

    // Filter by category and search
    await page.getByRole('tab', { name: 'Puzzle' }).click();
    await expect(cards).toHaveCount(2);
    await page.getByRole('tab', { name: 'All' }).click();
    await page.getByLabel('Search games').fill('flappy');
    await expect(cards).toHaveCount(1);
    await page.getByLabel('Search games').fill('');

    expect(errors).toEqual([]);
  });

  test('launches Checkers and Sudoku inside unified player and navigates back', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    // Launch Checkers
    await page
      .locator('[data-game-slug="checkers"]')
      .getByRole('button', { name: 'Play' })
      .click();
    await expect(page).toHaveURL(/#\/play\/checkers$/);

    const checkersFrame = page.frameLocator('iframe[title="Checkers"]');
    await expect(
      checkersFrame.getByRole('heading', { name: 'Checkers' }),
    ).toBeVisible();
    await expect(checkersFrame.getByRole('gridcell')).toHaveCount(64);

    // Return to Dashboard
    await page.getByRole('button', { name: /All Games/i }).click();
    await expect(page.locator('.game-tile')).toHaveCount(15);

    // Launch Tá Lả (Phỏm) inside unified player
    await page
      .locator('[data-game-slug="ta-la-phom"]')
      .getByRole('button', { name: 'Play' })
      .click();
    await expect(page).toHaveURL(/#\/play\/ta-la-phom$/);
    const phomFrame = page.frameLocator('iframe[title="Tá Lả (Phỏm)"]');
    await expect(phomFrame.getByRole('heading', { name: /Tá Lả/i })).toBeVisible();

    // Return to Dashboard
    await page.getByRole('button', { name: /All Games/i }).click();

    // Launch Dino Run
    await page
      .locator('[data-game-slug="dino-run"]')
      .getByRole('button', { name: 'Play' })
      .click();
    await expect(page).toHaveURL(/#\/play\/dino-run$/);

    const dinoFrame = page.frameLocator('iframe[title="Dino Run"]');
    await expect(dinoFrame.getByRole('heading', { name: 'Dino Run' })).toBeVisible();
    await expect(dinoFrame.locator('canvas.dino-canvas')).toBeVisible();

    // Return to Dashboard
    await page.getByRole('button', { name: /All Games/i }).click();

    // Launch Super Mario Bros. 1985
    await page
      .locator('[data-game-slug="super-mario-bros"]')
      .getByRole('button', { name: 'Play' })
      .click();
    await expect(page).toHaveURL(/#\/play\/super-mario-bros$/);

    const marioFrame = page.frameLocator('iframe[title="Super Mario Bros. 1985"]');
    await expect(
      marioFrame.getByRole('heading', { name: 'Super Mario Bros. (1985)' }),
    ).toBeVisible();
    await expect(marioFrame.locator('canvas.smb-canvas')).toBeVisible();

    // Return to Dashboard
    await page.getByRole('button', { name: /All Games/i }).click();

    // Launch Battle City 1985
    await page
      .locator('[data-game-slug="battle-city"]')
      .getByRole('button', { name: 'Play' })
      .click();
    await expect(page).toHaveURL(/#\/play\/battle-city$/);

    const bcFrame = page.frameLocator('iframe[title="Battle City 1985"]');
    await expect(
      bcFrame.getByRole('heading', { name: 'Battle City (1985)' }),
    ).toBeVisible();
    await expect(bcFrame.locator('canvas.bc-canvas')).toBeVisible();

    // Return to Dashboard
    await page.getByRole('button', { name: /All Games/i }).click();

    // Launch SimCity 3D
    await page
      .locator('[data-game-slug="simcity"]')
      .getByRole('button', { name: 'Play' })
      .click();
    await expect(page).toHaveURL(/#\/play\/simcity$/);

    const simcityFrame = page.frameLocator('iframe[title="SimCity 3D"]');
    await expect(
      simcityFrame.getByRole('heading', { name: 'SimCity 3D' }),
    ).toBeVisible();
    await expect(simcityFrame.locator('canvas.simcity-webgl-canvas')).toBeVisible();

    // Return to Dashboard
    await page.getByRole('button', { name: /All Games/i }).click();

    // Launch Tetris
    await page
      .locator('[data-game-slug="tetris"]')
      .getByRole('button', { name: 'Play' })
      .click();
    await expect(page).toHaveURL(/#\/play\/tetris$/);

    const tetrisFrame = page.frameLocator('iframe[title="Tetris"]');
    await expect(
      tetrisFrame.getByRole('heading', { name: 'Tetris' }),
    ).toBeVisible();
    await expect(tetrisFrame.getByLabel('Tetris board')).toBeVisible();

    // Return to Dashboard and launch Solitaire
    await page.getByRole('button', { name: /All Games/i }).click();

    // Launch Solitaire
    await page
      .locator('[data-game-slug="solitaire"]')
      .getByRole('button', { name: 'Play' })
      .click();
    await expect(page).toHaveURL(/#\/play\/solitaire$/);

    const solitaireFrame = page.frameLocator('iframe[title="Solitaire"]');
    await expect(
      solitaireFrame.getByRole('heading', { name: 'Solitaire' }),
    ).toBeVisible();
    await expect(solitaireFrame.getByTestId('stock-pile')).toBeVisible();

    // Return to Dashboard and launch Sudoku
    await page.getByRole('button', { name: /All Games/i }).click();
    await page
      .locator('[data-game-slug="sudoku"]')
      .getByRole('button', { name: 'Play' })
      .click();
    await expect(page).toHaveURL(/#\/play\/sudoku$/);

    const sudokuFrame = page.frameLocator('iframe[title="Sudoku"]');
    await expect(
      sudokuFrame.getByRole('heading', { name: 'Sudoku' }),
    ).toBeVisible();
    await expect(sudokuFrame.getByRole('gridcell')).toHaveCount(81);

    // Return to Dashboard and test Favorites, Recently Played, Keyboard Nav & Dark Theme
    await page.getByRole('button', { name: /All Games/i }).click();
    await expect(page.getByTestId('recently-played')).toContainText('Tetris');
    await expect(page.getByTestId('recently-played')).toContainText('Sudoku');

    // Star Sudoku and filter by Favorites
    await page.getByTestId('fav-sudoku').click();
    await page.getByRole('tab', { name: /Favorites/i }).click();
    await expect(page.locator('.game-tile')).toHaveCount(1);
    await page.getByRole('tab', { name: 'All' }).click();

    // Toggle Dark theme and verify persistence across reload
    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByTestId('fav-sudoku')).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    // Keyboard navigation: ArrowRight selects first tile, Enter launches 1024
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#\/play\/1024$/);

    expect(errors).toEqual([]);
  });
});
