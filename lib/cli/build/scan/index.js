/**
 * @import {
 *   NormalizedConfig,
 *   ScanResult,
 *   ScannedFile,
 *   HtmlScannedFile,
 *   JsScannedFile,
 *   CssScannedFile,
 *   AssetScannedFile,
 * } from '../types.ts'
 */

import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { parseHtml } from './html-parser.js';
import { parseJs } from './js-parser.js';

/**
 * Scan all source files and extract bundle-relevant data
 * @param {NormalizedConfig} config
 * @returns {Promise<ScanResult>}
 */
export async function scan(config) {
  /** @type {Map<string, ScannedFile>} */
  const files = new Map();

  // Read and process all files concurrently
  const results = await Promise.all(
    config.sourceFiles.map(async (relativePath) => {
      const fullPath = join(config.root, relativePath);
      const content = await readFile(fullPath, 'utf-8');
      const hash = computeHash(content);
      const ext = extname(relativePath).toLowerCase();

      return {
        relativePath,
        content,
        hash,
        ext,
      };
    }),
  );

  // Process each file based on type
  for (const { relativePath, content, hash, ext } of results) {
    let scannedFile;

    switch (ext) {
      case '.html':
        scannedFile = await scanHtmlFile(relativePath, content, hash);
        break;
      case '.js':
        scannedFile = await scanJsFile(relativePath, content, hash);
        break;
      case '.css':
        scannedFile = scanCssFile(relativePath, content, hash);
        break;
      default:
        scannedFile = scanAssetFile(relativePath, content, hash);
        break;
    }

    files.set(relativePath, scannedFile);
  }

  return { files };
}

/**
 * Compute content hash (SHA-256, truncated to 8 hex chars)
 * @param {string} content
 * @returns {string}
 */
export function computeHash(content) {
  return createHash('sha256')
    .update(content)
    .digest('hex')
    .slice(0, 8);
}

/**
 * Scan an HTML file
 * @param {string} path
 * @param {string} content
 * @param {string} hash
 * @returns {Promise<HtmlScannedFile>}
 */
async function scanHtmlFile(path, content, hash) {
  const data = parseHtml(content);
  return {
    path,
    content,
    hash,
    type: 'html',
    data,
  };
}

/**
 * Scan a JS file
 * @param {string} path
 * @param {string} content
 * @param {string} hash
 * @returns {Promise<JsScannedFile>}
 */
async function scanJsFile(path, content, hash) {
  const data = await parseJs(content, path);
  return {
    path,
    content,
    hash,
    type: 'js',
    data,
  };
}

/**
 * Scan a CSS file
 * @param {string} path
 * @param {string} content
 * @param {string} hash
 * @returns {CssScannedFile}
 */
function scanCssFile(path, content, hash) {
  // Extract @import statements
  /** @type {string[]} */
  const imports = [];
  const importRegex = /@import\s+(?:url\s*\(\s*)?['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  return {
    path,
    content,
    hash,
    type: 'css',
    data: { imports },
  };
}

/**
 * Scan a static asset file
 * @param {string} path
 * @param {string} content
 * @param {string} hash
 * @returns {AssetScannedFile}
 */
function scanAssetFile(path, content, hash) {
  return {
    path,
    content,
    hash,
    type: 'asset',
    data: null,
  };
}
