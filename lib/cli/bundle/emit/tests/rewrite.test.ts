import { expect, describe, it } from 'vitest';
import { rewriteFiles } from '../rewrite.js';
import type { HtmlFile, JsFile, CssFile, Manifest, Config, ImportMap } from '../../types.ts';

const baseConfig: Config = {
  root: '/project',
  entry: ['index.html'],
  outputDir: '/project/out',
  assetsDir: '__asset',
  sourceFiles: [],
};

const baseManifest: Manifest = {
  htmlEntries: [],
  jsEntries: [],
  cssAssets: [],
  staticAssets: [],
  pathMap: new Map(),
};

const emptyImportMap: ImportMap = {};

describe('rewriteFiles', () => {
  describe('HTML rewriting', () => {
    it('strips bundle meta comments', () => {
      const files = new Map<string, HtmlFile>([
        ['index.html', {
          path: 'index.html',
          content: '<!-- akst::bundle::meta output-path="index.html" -->\n<html></html>',
          hash: 'abc',
          type: 'html',
          data: {
            outputPath: 'index.html',
            importMap: null,
            scripts: [],
            stylesheets: [],
            preloads: [],
            inlineImports: [],
          },
        }],
      ]);

      const manifest = {
        ...baseManifest,
        htmlEntries: [{ sourcePath: 'index.html', outputPath: 'index.html', hash: 'abc' }],
      };

      const result = rewriteFiles(files, manifest, emptyImportMap, baseConfig);
      const content = result.get('index.html');

      expect(content).not.toContain('akst::bundle::meta');
      expect(content).toContain('<html></html>');
    });

    it('rewrites script src paths', () => {
      const files = new Map<string, HtmlFile>([
        ['index.html', {
          path: 'index.html',
          content: '<script type="module" src="./main.js"></script>',
          hash: 'abc',
          type: 'html',
          data: {
            outputPath: 'index.html',
            importMap: null,
            scripts: [{ src: './main.js', type: 'module' }],
            stylesheets: [],
            preloads: [],
            inlineImports: [],
          },
        }],
      ]);

      const manifest: Manifest = {
        ...baseManifest,
        htmlEntries: [{ sourcePath: 'index.html', outputPath: 'index.html', hash: 'abc' }],
        pathMap: new Map([['main.js', 'main-def456.js']]),
      };

      const result = rewriteFiles(files, manifest, emptyImportMap, baseConfig);
      const content = result.get('index.html');

      expect(content).toContain('src="__asset/main-def456.js"');
    });
  });

  describe('JS rewriting', () => {
    it('rewrites import.meta.resolve paths', () => {
      const files = new Map<string, JsFile>([
        ['lib/app.js', {
          path: 'lib/app.js',
          content: `const url = import.meta.resolve('./util.js');`,
          hash: 'abc',
          type: 'js',
          data: {
            metaResolves: [{ specifier: './util.js', span: { start: 28, end: 40 } }],
            htmlPaths: [],
            dynamicImports: [],
            workers: [],
            hasLookupEntrypoint: false,
          },
        }],
      ]);

      const manifest: Manifest = {
        ...baseManifest,
        jsEntries: [{ sourcePath: 'lib/app.js', outputName: 'app-abc.js', hash: 'abc' }],
        pathMap: new Map([['lib/util.js', 'util-def.js']]),
      };

      const result = rewriteFiles(files, manifest, emptyImportMap, baseConfig);
      const content = result.get('lib/app.js');

      expect(content).toContain('./util-def.js');
    });

    it('rewrites html-path:declare strings', () => {
      const files = new Map<string, JsFile>([
        ['lib/app.js', {
          path: 'lib/app.js',
          content: `const path = './lib/remote/widget';`,
          hash: 'abc',
          type: 'js',
          data: {
            metaResolves: [],
            htmlPaths: [{ value: './lib/remote/widget', span: { start: 14, end: 33 } }],
            dynamicImports: [],
            workers: [],
            hasLookupEntrypoint: false,
          },
        }],
      ]);

      const manifest: Manifest = {
        ...baseManifest,
        jsEntries: [{ sourcePath: 'lib/app.js', outputName: 'app-abc.js', hash: 'abc' }],
        pathMap: new Map([['lib/remote/widget/index.html', 'widget/index.html']]),
      };

      const result = rewriteFiles(files, manifest, emptyImportMap, baseConfig);
      const content = result.get('lib/app.js');

      expect(content).toContain('./widget');
    });
  });

  describe('CSS rewriting', () => {
    it('rewrites url() paths', () => {
      const files = new Map<string, CssFile>([
        ['style.css', {
          path: 'style.css',
          content: `background: url(./image.png);`,
          hash: 'abc',
          type: 'css',
          data: {
            imports: [],
            urls: [{ path: './image.png', span: { start: 12, end: 27 } }],
          },
        }],
      ]);

      const manifest: Manifest = {
        ...baseManifest,
        cssAssets: [{ sourcePath: 'style.css', outputName: 'style-abc.css', hash: 'abc' }],
        pathMap: new Map([['image.png', 'image-def.png']]),
      };

      const result = rewriteFiles(files, manifest, emptyImportMap, baseConfig);
      const content = result.get('style.css');

      expect(content).toContain('url(./image-def.png)');
    });
  });
});
