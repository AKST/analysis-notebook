import { expect, describe, it } from 'vitest';
import { parseHtml } from '../html.js';

describe('parseHtml', () => {
  describe('scripts', () => {
    it('extracts module script src', () => {
      const html = `<script type="module" src="./main.js"></script>`;
      const result = parseHtml(html);

      expect(result.scripts).toHaveLength(1);
      expect(result.scripts[0].src).toBe('./main.js');
      expect(result.scripts[0].type).toBe('module');
    });

    it('extracts classic script src', () => {
      const html = `<script src="./legacy.js"></script>`;
      const result = parseHtml(html);

      expect(result.scripts).toHaveLength(1);
      expect(result.scripts[0].src).toBe('./legacy.js');
      expect(result.scripts[0].type).toBe('classic');
    });

    it('handles external importmap script', () => {
      const html = `<script type="importmap" src="./importmap.json"></script>`;
      const result = parseHtml(html);

      expect(result.scripts).toHaveLength(1);
      expect(result.scripts[0].type).toBe('importmap');
      expect(result.scripts[0].src).toBe('./importmap.json');
    });
  });

  describe('stylesheets', () => {
    it('extracts stylesheet links', () => {
      const html = `<link rel="stylesheet" href="./style.css">`;
      const result = parseHtml(html);

      expect(result.stylesheets).toHaveLength(1);
      expect(result.stylesheets[0]).toBe('./style.css');
    });

    it('ignores non-stylesheet links', () => {
      const html = `<link rel="icon" href="./favicon.ico">`;
      const result = parseHtml(html);

      expect(result.stylesheets).toHaveLength(0);
    });
  });

  describe('preloads', () => {
    it('extracts modulepreload links', () => {
      const html = `<link rel="modulepreload" href="./chunk.js">`;
      const result = parseHtml(html);

      expect(result.preloads).toHaveLength(1);
      expect(result.preloads[0]).toBe('./chunk.js');
    });
  });

  describe('import maps', () => {
    it('parses import map content', () => {
      const html = `
        <script type="importmap">
          { "imports": { "@base/": "./lib/base/" } }
        </script>
      `;
      const result = parseHtml(html);

      expect(result.importMap).toBeDefined();
      expect(result.importMap?.imports?.['@base/']).toBe('./lib/base/');
    });

    it('parses scoped import maps', () => {
      const html = `
        <script type="importmap">
          {
            "imports": { "@base/": "./lib/base/" },
            "scopes": {
              "./lib/app/": { "@base/": "../base/" }
            }
          }
        </script>
      `;
      const result = parseHtml(html);

      expect(result.importMap?.scopes?.['./lib/app/']?.['@base/']).toBe('../base/');
    });
  });

  describe('output path meta', () => {
    it('extracts output-path from meta comment', () => {
      const html = `
        <!-- akst::bundle::meta output-path="app/index.html" -->
        <html></html>
      `;
      const result = parseHtml(html);

      expect(result.outputPath).toBe('app/index.html');
    });

    it('returns null when no output-path', () => {
      const html = `<html></html>`;
      const result = parseHtml(html);

      expect(result.outputPath).toBeNull();
    });
  });

  describe('inline imports', () => {
    it('extracts imports from inline module scripts', () => {
      const html = `
        <script type="module">
          import { foo } from './foo.js';
          import bar from './bar.js';
        </script>
      `;
      const result = parseHtml(html);

      expect(result.inlineImports).toContain('./foo.js');
      expect(result.inlineImports).toContain('./bar.js');
    });
  });

  describe('edge cases', () => {
    it('handles empty HTML', () => {
      const result = parseHtml('');

      expect(result.scripts).toHaveLength(0);
      expect(result.stylesheets).toHaveLength(0);
      expect(result.importMap).toBeNull();
    });

    it('handles malformed HTML gracefully', () => {
      const html = `<script src="test.js"`;
      const result = parseHtml(html);

      // Should not throw, may extract partial data
      expect(result).toBeDefined();
    });
  });
});
