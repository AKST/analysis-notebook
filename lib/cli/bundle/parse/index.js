/**
 * @import {
 *   Config,
 *   ParseResult,
 *   ParsedFile,
 *   HtmlFile,
 *   JsFile,
 *   CssFile,
 *   AssetFile,
 *   ImportMap,
 * } from '../types.ts'
 */

import { readFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { hash } from '../util/hash.js';
import { parseHtml } from './html.js';
import { parseJs } from './js.js';
import { parseCss } from './css.js';

/**
 * Parse all source files
 * @param {Config} config
 * @returns {Promise<ParseResult>}
 */
export async function parse(config) {
  /** @type {Map<string, ParsedFile>} */
  const files = new Map();

  // Group files by type
  const htmlPaths = [];
  const jsPaths = [];
  const cssPaths = [];
  const assetPaths = [];

  for (const path of config.sourceFiles) {
    const ext = extname(path).toLowerCase();
    switch (ext) {
      case '.html': htmlPaths.push(path); break;
      case '.js': jsPaths.push(path); break;
      case '.css': cssPaths.push(path); break;
      default: assetPaths.push(path); break;
    }
  }

  // Parse HTML files (can be parallel - no SWC)
  const htmlResults = await Promise.all(
    htmlPaths.map(path => parseHtmlFile(path, config.root)),
  );
  for (const file of htmlResults) {
    files.set(file.path, file);
  }

  // Parse JS files SEQUENTIALLY to avoid SWC offset accumulation
  for (const path of jsPaths) {
    const file = await parseJsFile(path, config.root);
    files.set(file.path, file);
  }

  // Parse CSS files (can be parallel)
  const cssResults = await Promise.all(
    cssPaths.map(path => parseCssFile(path, config.root)),
  );
  for (const file of cssResults) {
    files.set(file.path, file);
  }

  // Read asset files (can be parallel)
  const assetResults = await Promise.all(
    assetPaths.map(path => parseAssetFile(path, config.root)),
  );
  for (const file of assetResults) {
    files.set(file.path, file);
  }

  // Merge import maps from all HTML files
  const importMap = mergeImportMaps(htmlResults);

  return { files, importMap };
}

/**
 * @param {string} path
 * @param {string} root
 * @returns {Promise<HtmlFile>}
 */
async function parseHtmlFile(path, root) {
  const content = await readFile(join(root, path), 'utf-8');
  const data = parseHtml(content);
  return {
    path,
    content,
    hash: hash(content),
    type: 'html',
    data,
  };
}

/**
 * @param {string} path
 * @param {string} root
 * @returns {Promise<JsFile>}
 */
async function parseJsFile(path, root) {
  const content = await readFile(join(root, path), 'utf-8');
  const data = await parseJs(content);
  return {
    path,
    content,
    hash: hash(content),
    type: 'js',
    data,
  };
}

/**
 * @param {string} path
 * @param {string} root
 * @returns {Promise<CssFile>}
 */
async function parseCssFile(path, root) {
  const content = await readFile(join(root, path), 'utf-8');
  const data = parseCss(content);
  return {
    path,
    content,
    hash: hash(content),
    type: 'css',
    data,
  };
}

/**
 * @param {string} path
 * @param {string} root
 * @returns {Promise<AssetFile>}
 */
async function parseAssetFile(path, root) {
  const content = await readFile(join(root, path), 'utf-8');
  return {
    path,
    content,
    hash: hash(content),
    type: 'asset',
    data: null,
  };
}

/**
 * Merge import maps from all HTML files
 * @param {HtmlFile[]} htmlFiles
 * @returns {ImportMap}
 */
function mergeImportMaps(htmlFiles) {
  /** @type {ImportMap} */
  const result = {};

  for (const file of htmlFiles) {
    const map = file.data.importMap;
    if (!map) continue;

    // Get the directory of the HTML file for resolving relative paths
    const htmlDir = dirname(file.path);

    if (map.imports) {
      result.imports = result.imports || {};
      for (const [alias, target] of Object.entries(map.imports)) {
        // Resolve relative paths from HTML file's location
        const resolved = resolveImportMapPath(target, htmlDir);
        result.imports[alias] = resolved;
      }
    }
    if (map.scopes) {
      result.scopes = result.scopes || {};
      for (const [scope, mappings] of Object.entries(map.scopes)) {
        result.scopes[scope] = result.scopes[scope] || {};
        for (const [alias, target] of Object.entries(mappings)) {
          const resolved = resolveImportMapPath(target, htmlDir);
          result.scopes[scope][alias] = resolved;
        }
      }
    }
  }

  return result;
}

/**
 * Resolve a relative import map path from an HTML file's directory
 * @param {string} target
 * @param {string} htmlDir
 * @returns {string}
 */
function resolveImportMapPath(target, htmlDir) {
  if (!target.startsWith('./') && !target.startsWith('../')) {
    return target;
  }

  // Resolve relative path from HTML directory
  const resolved = join(htmlDir, target).replace(/\\/g, '/');

  // Normalize to ./ prefix
  return './' + resolved;
}
