/**
 * @import { HtmlData, ImportMap, ScriptRef } from '../types.ts'
 */

import { Parser } from 'htmlparser2';

const META_REGEX = /akst::bundle::meta\s+output-path="([^"]+)"/;

/**
 * Parse HTML file for bundle-relevant data
 * @param {string} content
 * @returns {HtmlData}
 */
export function parseHtml(content) {
  /** @type {string | null} */
  let outputPath = null;
  /** @type {ImportMap | null} */
  let importMap = null;
  /** @type {ScriptRef[]} */
  const scripts = [];
  /** @type {string[]} */
  const stylesheets = [];
  /** @type {string[]} */
  const preloads = [];
  /** @type {string[]} */
  const inlineImports = [];

  /** @type {'importmap' | 'module' | null} */
  let captureMode = null;
  let captureContent = '';

  const parser = new Parser({
    oncomment(text) {
      const match = text.match(META_REGEX);
      if (match) outputPath = match[1];
    },

    onopentag(name, attrs) {
      if (name === 'script') {
        const type = attrs.type || 'text/javascript';
        const src = attrs.src;

        if (src) {
          scripts.push({
            src,
            type: type === 'module' ? 'module' : type === 'importmap' ? 'importmap' : 'classic',
          });
        } else if (type === 'importmap') {
          captureMode = 'importmap';
          captureContent = '';
        } else if (type === 'module') {
          captureMode = 'module';
          captureContent = '';
        }
      } else if (name === 'link') {
        const rel = attrs.rel;
        const href = attrs.href;
        if (!href) return;

        if (rel === 'stylesheet') {
          stylesheets.push(href);
        } else if (rel === 'modulepreload') {
          preloads.push(href);
        }
      }
    },

    ontext(text) {
      if (captureMode) captureContent += text;
    },

    onclosetag(name) {
      if (name !== 'script') return;

      if (captureMode === 'importmap') {
        try {
          importMap = JSON.parse(captureContent);
        } catch {
          // Invalid JSON, ignore
        }
      } else if (captureMode === 'module') {
        // Extract import paths from inline script
        const importRegex = /import\s+(?:[\w\s{},*]+\s+from\s+)?['"]([^'"]+)['"]/g;
        let match;
        while ((match = importRegex.exec(captureContent)) !== null) {
          inlineImports.push(match[1]);
        }
      }

      captureMode = null;
      captureContent = '';
    },
  });

  parser.write(content);
  parser.end();

  return {
    outputPath,
    importMap,
    scripts,
    stylesheets,
    preloads,
    inlineImports,
  };
}
