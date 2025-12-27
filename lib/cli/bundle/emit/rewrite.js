/**
 * @import {
 *   ParsedFile,
 *   HtmlFile,
 *   JsFile,
 *   CssFile,
 *   Manifest,
 *   Config,
 *   ImportMap,
 * } from '../types.ts'
 */

import { dirname, join } from 'node:path';
import { resolve, buildInverseAliasMap } from '../util/resolve.js';

/**
 * Rewrite all files that need path transformations
 * @param {Map<string, ParsedFile>} files
 * @param {Manifest} manifest
 * @param {ImportMap} importMap
 * @param {Config} config
 * @returns {Map<string, string>} path -> transformed content
 */
export function rewriteFiles(files, manifest, importMap, config) {
  /** @type {Map<string, string>} */
  const result = new Map();

  for (const [path, file] of files) {
    let content = file.content;
    let changed = false;

    switch (file.type) {
      case 'html':
        content = rewriteHtml(file, manifest, config);
        changed = true;
        break;
      case 'js':
        content = rewriteJs(file, manifest, importMap, config);
        changed = content !== file.content;
        break;
      case 'css':
        content = rewriteCss(file, manifest);
        changed = content !== file.content;
        break;
    }

    if (changed || isNeededForBundle(path, manifest)) {
      result.set(path, content);
    }
  }

  return result;
}

/**
 * Check if file is needed for bundling
 * @param {string} path
 * @param {Manifest} manifest
 * @returns {boolean}
 */
function isNeededForBundle(path, manifest) {
  if (manifest.htmlEntries.some(e => e.sourcePath === path)) return true;
  if (manifest.jsEntries.some(e => e.sourcePath === path)) return true;
  if (manifest.cssAssets.some(e => e.sourcePath === path)) return true;
  if (manifest.staticAssets.some(e => e.sourcePath === path)) return true;
  return false;
}

// ============================================================================
// HTML Rewriting
// ============================================================================

const META_REGEX = /<!--\s*akst::bundle::meta[^>]*-->\s*/g;

/**
 * Rewrite HTML file
 * @param {HtmlFile} file
 * @param {Manifest} manifest
 * @param {Config} config
 * @returns {string}
 */
function rewriteHtml(file, manifest, config) {
  let content = file.content;

  // Strip bundle meta comments
  content = content.replace(META_REGEX, '');

  // Update script src
  content = content.replace(
    /(<script[^>]*\ssrc=["'])([^"']+)(["'][^>]*>)/g,
    (_, prefix, src, suffix) => {
      const newPath = resolveHtmlRef(src, file.path, manifest, config);
      return `${prefix}${newPath}${suffix}`;
    },
  );

  // Update link href
  content = content.replace(
    /(<link[^>]*\shref=["'])([^"']+)(["'][^>]*>)/g,
    (_, prefix, href, suffix) => {
      const newPath = resolveHtmlRef(href, file.path, manifest, config);
      return `${prefix}${newPath}${suffix}`;
    },
  );

  // Update inline module script imports
  content = content.replace(
    /(<script\s+type=["']module["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
    (match, open, script, close) => {
      if (/\ssrc\s*=/.test(open)) return match;

      const updated = script.replace(
        /(import\s+(?:[\w\s{},*]+\s+from\s+)?['"])([^'"]+)(['"])/g,
        /** @type {(m: string, p: string, imp: string, s: string) => string} */
        (_, p, imp, s) => {
          const newPath = resolveHtmlRef(imp, file.path, manifest, config);
          return `${p}${newPath}${s}`;
        },
      );
      return open + updated + close;
    },
  );

  return content;
}

/**
 * Resolve HTML reference to output path
 * @param {string} ref
 * @param {string} htmlPath
 * @param {Manifest} manifest
 * @param {Config} config
 * @returns {string}
 */
function resolveHtmlRef(ref, htmlPath, manifest, config) {
  if (ref.startsWith('http://') || ref.startsWith('https://')) return ref;

  const htmlOutput = manifest.pathMap.get(htmlPath) || htmlPath;
  let resolved = ref.replace(/^\.\//, '');

  if (ref.startsWith('./') || ref.startsWith('../')) {
    const htmlDir = dirname(htmlPath);
    resolved = join(htmlDir, ref).replace(/\\/g, '/');
  }

  const mapped = manifest.pathMap.get(resolved);
  if (mapped) {
    const assetOutput = mapped.includes('/') ? mapped : `${config.assetsDir}/${mapped}`;
    return relativePath(htmlOutput, assetOutput);
  }

  return ref;
}

// ============================================================================
// JS Rewriting
// ============================================================================

/**
 * Rewrite JS file
 * @param {JsFile} file
 * @param {Manifest} manifest
 * @param {ImportMap} importMap
 * @param {Config} config
 * @returns {string}
 */
function rewriteJs(file, manifest, importMap, config) {
  let content = file.content;

  // Check if this file is in the assets dir (all bundled JS ends up there)
  const jsOutput = manifest.pathMap.get(file.path);
  const jsInAssets = !jsOutput || !jsOutput.includes('/');

  // Rewrite import.meta.resolve() paths
  for (const site of file.data.metaResolves) {
    const resolved = resolve(site.specifier, file.path, importMap);
    const outputPath = manifest.pathMap.get(resolved);

    if (outputPath) {
      const targetInAssets = !outputPath.includes('/');
      let newPath;
      if (jsInAssets && targetInAssets) {
        newPath = `./${outputPath}`;
      } else if (targetInAssets) {
        newPath = `./${config.assetsDir}/${outputPath}`;
      } else {
        newPath = `./${outputPath}`;
      }

      const escaped = escapeRegex(site.specifier);
      const regex = new RegExp(
        `(import\\.meta\\.resolve\\s*\\(\\s*)(['"])${escaped}\\2`,
        'g',
      );
      content = content.replace(regex, `$1$2${newPath}$2`);
    }
  }

  // Rewrite html-path-declare strings
  for (const site of file.data.htmlPaths) {
    const transformed = transformHtmlPath(site.value, manifest);
    if (transformed !== site.value) {
      const escaped = escapeRegex(site.value);
      const regex = new RegExp(`(['"])${escaped}\\1`, 'g');
      content = content.replace(regex, `$1${transformed}$1`);
    }
  }

  // Inject lookup function if needed
  if (file.data.hasLookupEntrypoint) {
    const pathMap = buildEntrypointMap(manifest, config, importMap);
    if (Object.keys(pathMap).length > 0) {
      const fn = `const __lookupEntrypoint = (p) => { const m = ${JSON.stringify(pathMap)}; const r = m[p] ?? p; return new URL(r, document.baseURI).href; };`;

      // Replace import.meta.resolve with __lookupEntrypoint
      content = content.replace(/import\.meta\.resolve\(/g, '__lookupEntrypoint(');

      // Insert after imports
      const insertAt = findInsertPoint(content);
      const lines = content.split('\n');
      lines.splice(insertAt, 0, fn);
      content = lines.join('\n');
    }
  }

  return content;
}

/**
 * Transform HTML path (handles query params)
 * @param {string} path
 * @param {Manifest} manifest
 * @returns {string}
 */
function transformHtmlPath(path, manifest) {
  let base = path;
  let query = '';

  const qIdx = path.indexOf('?');
  if (qIdx !== -1) {
    base = path.slice(0, qIdx);
    query = path.slice(qIdx);
  }

  let normalized = base.replace(/^\.\//, '');

  // Try with /index.html if not explicit
  if (!normalized.endsWith('.html') && !normalized.endsWith('/index.html')) {
    const withIndex = normalized + '/index.html';
    if (manifest.pathMap.has(withIndex)) {
      normalized = withIndex;
    }
  }

  const output = manifest.pathMap.get(normalized);
  if (!output) return path;

  let result = './' + output;
  if (!base.endsWith('/index.html') && result.endsWith('/index.html')) {
    result = result.slice(0, -'/index.html'.length);
  }

  return result + query;
}

/**
 * Build entrypoint map for lookup function
 * @param {Manifest} manifest
 * @param {Config} config
 * @param {ImportMap} importMap
 * @returns {Record<string, string>}
 */
function buildEntrypointMap(manifest, config, importMap) {
  /** @type {Record<string, string>} */
  const map = {};
  const inverse = buildInverseAliasMap(importMap);

  for (const entry of manifest.jsEntries) {
    const output = `./${config.assetsDir}/${entry.outputName}`;
    const sourceKey = entry.sourcePath.startsWith('./')
      ? entry.sourcePath
      : './' + entry.sourcePath;
    map[sourceKey] = output;

    // Add alias forms
    for (const [pathPrefix, aliasPrefix] of inverse) {
      if (entry.sourcePath.startsWith(pathPrefix)) {
        const aliasKey = aliasPrefix + entry.sourcePath.slice(pathPrefix.length);
        map[aliasKey] = output;
      }
    }
  }

  return map;
}

/**
 * Find line to insert lookup function (after imports)
 * @param {string} content
 * @returns {number}
 */
function findInsertPoint(content) {
  const lines = content.split('\n');
  let inBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (inBlock) {
      if (line.includes('*/')) inBlock = false;
      continue;
    }

    if (line.startsWith('/*')) {
      if (!line.includes('*/')) inBlock = true;
      continue;
    }

    if (line === '' || line.startsWith('//')) continue;
    if (!line.startsWith('import ') && !line.startsWith('import{')) {
      return i;
    }
  }

  return lines.length;
}

// ============================================================================
// CSS Rewriting
// ============================================================================

/**
 * Rewrite CSS file
 * @param {CssFile} file
 * @param {Manifest} manifest
 * @returns {string}
 */
function rewriteCss(file, manifest) {
  let content = file.content;

  // Rewrite @import
  content = content.replace(
    /@import\s+(['"])([^'"]+)\1/g,
    (_, quote, path) => {
      const newPath = resolveCssRef(path, file.path, manifest);
      return `@import ${quote}${newPath}${quote}`;
    },
  );

  // Rewrite url()
  content = content.replace(
    /url\(\s*(['"]?)([^'")\s]+)\1\s*\)/g,
    (_, quote, path) => {
      const newPath = resolveCssRef(path, file.path, manifest);
      return `url(${quote}${newPath}${quote})`;
    },
  );

  return content;
}

/**
 * Resolve CSS reference
 * @param {string} ref
 * @param {string} cssPath
 * @param {Manifest} manifest
 * @returns {string}
 */
function resolveCssRef(ref, cssPath, manifest) {
  if (ref.startsWith('http://') || ref.startsWith('https://') || ref.startsWith('data:')) {
    return ref;
  }

  // Try root-relative
  let resolved = ref.replace(/^\.\//, '');
  let mapped = manifest.pathMap.get(resolved);

  // Try relative to CSS file
  if (!mapped && (ref.startsWith('./') || ref.startsWith('../'))) {
    const cssDir = dirname(cssPath);
    resolved = join(cssDir, ref).replace(/\\/g, '/');
    mapped = manifest.pathMap.get(resolved);
  }

  if (mapped) {
    // All CSS ends up in same dir, just use filename
    const filename = mapped.includes('/') ? mapped.split('/').pop() : mapped;
    return `./${filename}`;
  }

  return ref;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Get relative path from one file to another
 * @param {string} from
 * @param {string} to
 * @returns {string}
 */
function relativePath(from, to) {
  const fromParts = from.split('/').slice(0, -1);
  const toParts = to.split('/');

  let common = 0;
  while (
    common < fromParts.length &&
    common < toParts.length &&
    fromParts[common] === toParts[common]
  ) {
    common++;
  }

  const ups = fromParts.length - common;
  const downs = toParts.slice(common);

  if (ups === 0 && downs.length === 0) return '.';

  const parts = [];
  for (let i = 0; i < ups; i++) parts.push('..');
  parts.push(...downs);

  return parts.join('/') || '.';
}

/**
 * Escape regex special characters
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
