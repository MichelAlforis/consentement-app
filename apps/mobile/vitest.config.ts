import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.expo'],
    passWithNoTests: true,
  },
  define: {
    // __DEV__ est un global React Native / Metro ; polyfillé ici pour Vitest
    __DEV__: false,
  },
});
