/**
 * @import { ScanResult, EntryManifest, TransformedFiles, NormalizedConfig, ImportMap } from '../types.ts'
 */

import { collectImportmaps, mergeImportmaps } from '../graph/importmap.js';
import { transformCss } from './css.js';
import { transformHtml } from './html.js';
import { transformJs } from './js.js';

/**
 * Transform all files that need modification
 * @param {ScanResult} scanResult
 * @param {EntryManifest} manifest
 * @param {NormalizedConfig} config
 * @returns {TransformedFiles}
 */
export function transformFiles(scanResult, manifest, config) {
  /** @type {Map<string, string>} */
  const files = new Map();

  // Collect and merge import maps for use in JS transformation
  const importmaps = collectImportmaps(scanResult);
  const mergedImportmap = mergeImportmaps([...importmaps.values()]);

  for (const [path, file] of scanResult.files) {
    let content = file.content;

    if (file.type === 'html') {
      content = transformHtml(content, path, manifest, config.assetsDir);
    } else if (file.type === 'js') {
      content = transformJs(content, path, file.data, manifest, config.assetsDir, mergedImportmap);
    } else if (file.type === 'css') {
      content = transformCss(content, path, manifest);
    }

    // Only store if different from original (or if needed for bundling)
    if (content !== file.content || needsForBundling(path, manifest)) {
      files.set(path, content);
    }
  }

  // Also include original content for files that weren't transformed but are needed
  for (const [path, file] of scanResult.files) {
    if (!files.has(path) && needsForBundling(path, manifest)) {
      files.set(path, file.content);
    }
  }

  return { files };
}

/**
 * Check if a file is needed for bundling
 * @param {string} path
 * @param {EntryManifest} manifest
 * @returns {boolean}
 */
function needsForBundling(path, manifest) {
  // HTML entries
  if (manifest.htmlEntries.some(e => e.sourcePath === path)) {
    return true;
  }

  // JS entries
  if (manifest.jsEntries.some(e => e.sourcePath === path)) {
    return true;
  }

  // CSS assets
  if (manifest.cssAssets.some(e => e.sourcePath === path)) {
    return true;
  }

  // Static assets
  if (manifest.staticAssets.some(e => e.sourcePath === path)) {
    return true;
  }

  return false;
}
