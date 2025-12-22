import { defineConfig, Plugin } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const aliases: Record<string, string> = {
  '@base/': './lib/base/',
  '@ui/': './lib/ui/',
  '@app/': './lib/app/',
  '@prelude-uni/': './lib/prelude/university/',
  '@prelude-econ/': './lib/prelude/econ/',
};

function resolveImportMetaPlugin(): Plugin {
  return {
    name: 'resolve-import-meta',
    transform(code, id) {
      if (!code.includes('import.meta.resolve')) return;
      let transformed = code;
      for (const [alias, path] of Object.entries(aliases)) {
        const regex = new RegExp(`import\\.meta\\.resolve\\(['"]${alias.replace('/', '\\/')}`, 'g');
        transformed = transformed.replace(regex, `import.meta.resolve('${path}`);
      }
      return transformed !== code ? transformed : undefined;
    },
  };
}

export default defineConfig({
  plugins: [resolveImportMetaPlugin()],
  resolve: {
    alias: Object.fromEntries(
      Object.entries(aliases).map(([k, v]) => [k, fileURLToPath(new URL(v, import.meta.url))])
    ),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});