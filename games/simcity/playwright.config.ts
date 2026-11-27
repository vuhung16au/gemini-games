import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4181',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--use-gl=angle',
            '--use-angle=swiftshader',
            '--enable-webgl',
            '--ignore-gpu-blocklist',
          ],
        },
      },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 4181 --host 127.0.0.1',
    url: 'http://127.0.0.1:4181',
    reuseExistingServer: !process.env.CI,
  },
});
