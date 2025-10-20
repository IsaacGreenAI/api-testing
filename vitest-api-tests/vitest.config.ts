import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.ts', '../commons/__tests__/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '**/*.config.ts',
        '**/*.d.ts'
      ]
    },
    testTimeout: 30000
  },
  resolve: {
    alias: {
      '@commons': path.resolve(__dirname, '../commons')
    }
  }
});
