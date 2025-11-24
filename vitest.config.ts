import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@base/': fileURLToPath(new URL('./lib/base/', import.meta.url)),
      '@ui/': fileURLToPath(new URL('./lib/ui/', import.meta.url)),
      '@app/': fileURLToPath(new URL('./lib/app/', import.meta.url)),
      '@prelude-uni/': fileURLToPath(new URL('./lib/prelude/university/', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});