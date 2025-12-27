import { expect, describe, it } from 'vitest';
import { parseJs } from '../js.js';

describe('parseJs', () => {
  describe('import.meta.resolve()', () => {
    it('extracts static string arguments', async () => {
      const content = `const url = import.meta.resolve('./foo.js');`;
      const result = await parseJs(content);

      expect(result.metaResolves).toHaveLength(1);
      expect(result.metaResolves[0].specifier).toBe('./foo.js');
    });

    it('extracts multiple resolves', async () => {
      const content = `
        const a = import.meta.resolve('./a.js');
        const b = import.meta.resolve('./b/util.js');
      `;
      const result = await parseJs(content);

      expect(result.metaResolves).toHaveLength(2);
      expect(result.metaResolves[0].specifier).toBe('./a.js');
      expect(result.metaResolves[1].specifier).toBe('./b/util.js');
    });

    it('detects lookup-entrypoint annotation', async () => {
      const content = `
        /** @akst::bundle::resolve:lookup-entrypoint */
        const url = import.meta.resolve(specifier);
      `;
      const result = await parseJs(content);

      expect(result.hasLookupEntrypoint).toBe(true);
    });

    it('does not flag lookup-entrypoint without annotation', async () => {
      const content = `const url = import.meta.resolve('./foo.js');`;
      const result = await parseJs(content);

      expect(result.hasLookupEntrypoint).toBe(false);
    });
  });

  describe('dynamic import()', () => {
    it('extracts dynamic imports', async () => {
      const content = `const mod = await import('./module.js');`;
      const result = await parseJs(content);

      expect(result.dynamicImports).toHaveLength(1);
    });

    it('extracts path-constraint annotation', async () => {
      const content = `
        /**
         * @akst::bundle::dyn-import:path-constraint {lib/app/*}
         */
        const mod = await import(path);
      `;
      const result = await parseJs(content);

      expect(result.dynamicImports).toHaveLength(1);
      expect(result.dynamicImports[0].annotations.pathConstraint).toBe('lib/app/*');
    });

    it('extracts implicit-bundle annotation', async () => {
      const content = `
        /**
         * @akst::bundle::dyn-import:implicit-bundle-generation
         */
        const mod = await import('./foo.js');
      `;
      const result = await parseJs(content);

      expect(result.dynamicImports).toHaveLength(1);
      expect(result.dynamicImports[0].annotations.implicitBundle).toBe(true);
    });

    it('extracts asset-name annotation', async () => {
      const content = `
        /**
         * @akst::bundle::dyn-import:path-constraint {lib/app/*}
         * @akst::bundle::dyn-import:asset-name {app-[strip:lib/app/:-]}
         */
        const mod = await import(path);
      `;
      const result = await parseJs(content);

      expect(result.dynamicImports[0].annotations.assetName).toBeDefined();
      expect(result.dynamicImports[0].annotations.assetName?.prefix).toBe('app-');
    });
  });

  describe('html-path:declare', () => {
    it('extracts annotated string literals', async () => {
      const content = `
        /** @akst::bundle::html-path:declare */
        const path = './lib/remote/app-embed/widget';
      `;
      const result = await parseJs(content);

      expect(result.htmlPaths).toHaveLength(1);
      expect(result.htmlPaths[0].value).toBe('./lib/remote/app-embed/widget');
    });

    it('does not extract unannotated strings', async () => {
      const content = `const path = './lib/remote/app-embed/widget';`;
      const result = await parseJs(content);

      expect(result.htmlPaths).toHaveLength(0);
    });
  });

  describe('new Worker()', () => {
    it('extracts worker with static string', async () => {
      const content = `const worker = new Worker('./worker.js');`;
      const result = await parseJs(content);

      expect(result.workers).toHaveLength(1);
      expect(result.workers[0].src).toBe('./worker.js');
    });

    it('extracts worker with dynamic argument', async () => {
      const content = `const worker = new Worker(workerPath);`;
      const result = await parseJs(content);

      expect(result.workers).toHaveLength(1);
      expect(result.workers[0].src).toBeNull();
    });
  });

  describe('span positions', () => {
    it('returns spans that can locate specifiers', async () => {
      const content = `const url = import.meta.resolve('./foo.js');`;
      const result = await parseJs(content);

      // Spans are SWC offsets - verify they're present
      const span = result.metaResolves[0].span;
      expect(span.start).toBeDefined();
      expect(span.end).toBeDefined();
      expect(span.end).toBeGreaterThan(span.start);
    });
  });

  describe('empty/minimal files', () => {
    it('handles empty file', async () => {
      const result = await parseJs('');

      expect(result.metaResolves).toHaveLength(0);
      expect(result.htmlPaths).toHaveLength(0);
      expect(result.dynamicImports).toHaveLength(0);
      expect(result.workers).toHaveLength(0);
      expect(result.hasLookupEntrypoint).toBe(false);
    });

    it('handles file with only comments', async () => {
      const content = `
        // Line comment
        /* Block comment */
        /** JSDoc comment */
      `;
      const result = await parseJs(content);

      expect(result.metaResolves).toHaveLength(0);
    });
  });
});
