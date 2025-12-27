/**
 * @import { HtmlScanData, HtmlScriptRef, ImportMap } from '../types.ts'
 */

import { Parser } from 'htmlparser2';

const BUNDLE_META_REGEX = /akst::bundle::meta\s+output-path="([^"]+)"/;

/**
 * Parse an HTML file for bundle-relevant data
 * @param {string} content - HTML file content
 * @returns {HtmlScanData}
 */
export function parseHtml(content) {
  /** @type {string | null} */
  let outputPath = null;
  /** @type {ImportMap | null} */
  let importmap = null;
  /** @type {HtmlScriptRef[]} */
  const scripts = [];
  /** @type {string[]} */
  const stylesheets = [];
  /** @type {string[]} */
  const links = [];
  /** @type {string[]} */
  const inlineImports = [];

  /** @type {string | null} */
  let currentScriptType = null;
  /** @type {string} */
  let currentScriptContent = '';

  const parser = new Parser({
    oncomment(data) {
      // Look for akst::bundle::meta output-path="..."
      const match = data.match(BUNDLE_META_REGEX);
      if (match) {
        outputPath = match[1];
      }
    },

    onopentag(name, attrs) {
      if (name === 'script') {
        const type = attrs.type || 'text/javascript';
        const src = attrs.src;

        if (src) {
          scripts.push({
            src,
            type: type === 'module' ? 'module' : type === 'importmap' ? 'importmap' : 'other',
          });
        } else if (type === 'importmap') {
          currentScriptType = 'importmap';
          currentScriptContent = '';
        } else if (type === 'module') {
          // Inline module script - track content to extract imports
          currentScriptType = 'module';
          currentScriptContent = '';
        }
      } else if (name === 'link') {
        const rel = attrs.rel;
        const href = attrs.href;

        if (href) {
          if (rel === 'stylesheet') {
            stylesheets.push(href);
          } else if (rel === 'modulepreload') {
            links.push(href);
          }
        }
      }
    },

    ontext(text) {
      if (currentScriptType === 'importmap' || currentScriptType === 'module') {
        currentScriptContent += text;
      }
    },

    onclosetag(name) {
      if (name === 'script') {
        if (currentScriptType === 'importmap') {
          try {
            importmap = JSON.parse(currentScriptContent);
          } catch {
            // Invalid JSON, ignore
          }
        } else if (currentScriptType === 'module') {
          // Extract import paths from inline module script
          const importRegex = /import\s+(?:[\w\s{},*]+\s+from\s+)?['"]([^'"]+)['"]/g;
          let match;
          while ((match = importRegex.exec(currentScriptContent)) !== null) {
            inlineImports.push(match[1]);
          }
        }
        currentScriptType = null;
        currentScriptContent = '';
      }
    },
  });

  parser.write(content);
  parser.end();

  return {
    outputPath,
    importmap,
    scripts,
    stylesheets,
    links,
    inlineImports,
  };
}

/**
 * Check if an HTML file has bundle metadata
 * @param {string} content
 * @returns {boolean}
 */
export function hasBundleMeta(content) {
  return BUNDLE_META_REGEX.test(content);
}
