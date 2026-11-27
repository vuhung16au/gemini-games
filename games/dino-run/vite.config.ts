import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['src/game/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/game/types.ts', 'src/game/audio.ts', 'src/game/sound.ts', 'src/game/renderer.ts', 'src/game/canvasScene.ts', 'src/game/sprites.ts'],
      thresholds: {
        lines: 70,
        statements: 70,
        functions: 70,
        branches: 70,
      },
    },
  },
});
