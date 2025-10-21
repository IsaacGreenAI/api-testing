import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/commons-tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '**/*.config.ts',
        '**/*.d.ts',
        'index.ts'
      ]
    },
    testTimeout: 10000
  }
});
