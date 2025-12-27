import { expect, describe, it } from 'vitest';
import {
  hasAnnotations,
  parseDynamicImportAnnotations,
  hasHtmlPathDeclare,
  hasLookupEntrypoint,
  applyAssetNameTemplate,
  extractPathCaptures,
} from '../annotation.js';

describe('annotation parser', () => {
  describe('hasAnnotations', () => {
    it('returns true for bundle annotations', () => {
      expect(hasAnnotations('@akst::bundle::foo')).toBe(true);
    });

    it('returns false for non-bundle text', () => {
      expect(hasAnnotations('regular comment')).toBe(false);
    });
  });

  describe('parseDynamicImportAnnotations', () => {
    it('parses path-constraint', () => {
      const comment = `/**
       * @akst::bundle::dyn-import:path-constraint {lib/app/*}
       */`;
      const result = parseDynamicImportAnnotations(comment);

      expect(result.pathConstraint).toBe('lib/app/*');
    });

    it('parses implicit-bundle-generation', () => {
      const comment = `/**
       * @akst::bundle::dyn-import:implicit-bundle-generation
       */`;
      const result = parseDynamicImportAnnotations(comment);

      expect(result.implicitBundle).toBe(true);
    });

    it('parses asset-name with strip transform', () => {
      const comment = `/**
       * @akst::bundle::dyn-import:asset-name {app-[strip:lib/app/:-]}
       */`;
      const result = parseDynamicImportAnnotations(comment);

      expect(result.assetName?.prefix).toBe('app-');
      expect(result.assetName?.transforms).toHaveLength(1);
      expect(result.assetName?.transforms[0].kind).toBe('strip');
      expect(result.assetName?.transforms[0].leading).toBe('lib/app/');
      expect(result.assetName?.transforms[0].trailing).toBe('-');
    });

    it('parses multiple annotations', () => {
      const comment = `/**
       * @akst::bundle::dyn-import:path-constraint {lib/app/*}
       * @akst::bundle::dyn-import:implicit-bundle-generation
       */`;
      const result = parseDynamicImportAnnotations(comment);

      expect(result.pathConstraint).toBe('lib/app/*');
      expect(result.implicitBundle).toBe(true);
    });

    it('returns empty object for non-bundle comment', () => {
      const comment = `/** Regular JSDoc comment */`;
      const result = parseDynamicImportAnnotations(comment);

      expect(result).toEqual({});
    });
  });

  describe('hasHtmlPathDeclare', () => {
    it('detects html-path:declare annotation', () => {
      expect(hasHtmlPathDeclare('/** @akst::bundle::html-path:declare */')).toBe(true);
    });

    it('returns false without annotation', () => {
      expect(hasHtmlPathDeclare('/** regular comment */')).toBe(false);
    });
  });

  describe('hasLookupEntrypoint', () => {
    it('detects lookup-entrypoint annotation', () => {
      expect(hasLookupEntrypoint('/** @akst::bundle::resolve:lookup-entrypoint */')).toBe(true);
    });

    it('returns false without annotation', () => {
      expect(hasLookupEntrypoint('/** regular comment */')).toBe(false);
    });
  });

  describe('applyAssetNameTemplate', () => {
    it('applies prefix and strip transform', () => {
      const template = {
        prefix: 'app-',
        transforms: [{ kind: 'strip' as const, leading: 'sec-', trailing: '/' }],
        joinSeparator: '-',
      };
      const result = applyAssetNameTemplate(template, ['sec-foo/'], 'abc123');

      expect(result).toBe('app-foo-abc123.js');
    });

    it('joins multiple captures', () => {
      const template = {
        prefix: 'app-',
        transforms: [{ kind: 'strip' as const, leading: 'sec-', trailing: '/' }],
        joinSeparator: '-',
      };
      const result = applyAssetNameTemplate(template, ['sec-foo/', 'sec-bar/'], 'abc123');

      expect(result).toBe('app-foo-bar-abc123.js');
    });
  });

  describe('extractPathCaptures', () => {
    it('extracts captures from repeated group pattern', () => {
      const pattern = 'lib/app/(sec-[^/]+/)+index.js';
      const path = 'lib/app/sec-foo/sec-bar/index.js';
      const result = extractPathCaptures(pattern, path);

      expect(result).toContain('sec-foo/');
      expect(result).toContain('sec-bar/');
    });

    it('returns empty for non-matching path', () => {
      const pattern = 'lib/app/(sec-[^/]+/)+index.js';
      const path = 'lib/other/file.js';
      const result = extractPathCaptures(pattern, path);

      expect(result).toHaveLength(0);
    });
  });
});
