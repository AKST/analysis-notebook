/**
 * @import {
 *   ParseResult,
 *   Manifest,
 *   HtmlEntry,
 *   JsEntry,
 *   AssetEntry,
 *   Config,
 *   JsFile,
 *   HtmlFile,
 *   ImportMap,
 * } from '../types.ts'
 */

import { basename, extname } from 'node:path';
import { resolve } from '../util/resolve.js';
import { hashedName } from '../util/hash.js';
import { applyAssetNameTemplate, extractPathCaptures } from '../parse/annotation.js';

/**
 * Build manifest from parse results
 * @param {ParseResult} parseResult
 * @param {Config} config
 * @returns {Manifest}
 */
export function buildManifest(parseResult, config) {
  const { files, importMap } = parseResult;

  /** @type {HtmlEntry[]} */
  const htmlEntries = [];
  /** @type {JsEntry[]} */
  const jsEntries = [];
  /** @type {AssetEntry[]} */
  const cssAssets = [];
  /** @type {AssetEntry[]} */
  const staticAssets = [];
  /** @type {Map<string, string>} */
  const pathMap = new Map();

  // Collect dynamic import constraints from JS files
  const constraints = collectConstraints(files);

  // Collect assets referenced in HTML
  const htmlRefs = new Set();

  // 1. Discover HTML entries
  for (const [path, file] of files) {
    if (file.type !== 'html') continue;
    if (!file.data.outputPath) continue;

    htmlEntries.push({
      sourcePath: path,
      outputPath: file.data.outputPath,
      hash: file.hash,
    });
    pathMap.set(path, file.data.outputPath);

    // Track assets referenced in this HTML
    collectHtmlRefs(file, htmlRefs, importMap);
  }

  // 2. Discover JS entries via path constraints
  for (const [path, file] of files) {
    if (file.type !== 'js') continue;

    for (const { pattern, assetName, hash: constraintHash } of constraints) {
      const pathForMatch = pattern.startsWith('./') && !path.startsWith('./')
        ? './' + path
        : path;

      const regex = new RegExp(pattern);
      if (!regex.test(pathForMatch)) continue;

      let outputName;
      if (assetName) {
        const captures = extractPathCaptures(pattern, pathForMatch);
        outputName = applyAssetNameTemplate(assetName, captures, file.hash);
      } else {
        const base = basename(path, extname(path));
        outputName = hashedName(base, file.hash, '.js');
      }

      jsEntries.push({
        sourcePath: path,
        outputName,
        hash: file.hash,
      });
      pathMap.set(path, outputName);
      break; // Only match first constraint
    }
  }

  // 3. Collect CSS/assets from import.meta.resolve
  const processed = new Set();
  for (const [path, file] of files) {
    if (file.type !== 'js') continue;

    for (const site of file.data.metaResolves) {
      const resolved = resolve(site.specifier, path, importMap);
      if (processed.has(resolved)) continue;
      processed.add(resolved);

      const target = files.get(resolved);
      if (!target) continue;

      const ext = extname(resolved);
      const base = basename(resolved, ext);
      const outputName = hashedName(base, target.hash, ext);

      if (ext === '.css') {
        cssAssets.push({ sourcePath: resolved, outputName, hash: target.hash });
      } else if (ext !== '.js' && ext !== '.html') {
        staticAssets.push({ sourcePath: resolved, outputName, hash: target.hash });
      }
      pathMap.set(resolved, outputName);
    }
  }

  // 4. Process assets referenced directly in HTML
  for (const ref of htmlRefs) {
    if (pathMap.has(ref)) continue;

    const target = files.get(ref);
    if (!target) continue;

    const ext = extname(ref);
    const base = basename(ref, ext);
    const outputName = hashedName(base, target.hash, ext);

    if (ext === '.css') {
      cssAssets.push({ sourcePath: ref, outputName, hash: target.hash });
    } else if (ext === '.js') {
      jsEntries.push({ sourcePath: ref, outputName, hash: target.hash });
    } else if (ext !== '.html') {
      staticAssets.push({ sourcePath: ref, outputName, hash: target.hash });
    }
    pathMap.set(ref, outputName);
  }

  return {
    htmlEntries,
    jsEntries,
    cssAssets,
    staticAssets,
    pathMap,
  };
}

/**
 * Collect dynamic import constraints from all JS files
 * @param {Map<string, import('../types.ts').ParsedFile>} files
 * @returns {Array<{ pattern: string, assetName: import('../types.ts').AssetNameTemplate | undefined, hash: string }>}
 */
function collectConstraints(files) {
  const constraints = [];

  for (const [path, file] of files) {
    if (file.type !== 'js') continue;

    for (const dyn of file.data.dynamicImports) {
      const { pathConstraint, assetName, implicitBundle } = dyn.annotations;
      if (pathConstraint && implicitBundle) {
        constraints.push({
          pattern: pathConstraint,
          assetName,
          hash: file.hash,
        });
      }
    }
  }

  return constraints;
}

/**
 * Collect asset references from HTML file
 * @param {HtmlFile} file
 * @param {Set<string>} refs
 * @param {ImportMap} importMap
 */
function collectHtmlRefs(file, refs, importMap) {
  for (const style of file.data.stylesheets) {
    refs.add(style.replace(/^\.\//, ''));
  }
  for (const script of file.data.scripts) {
    if (script.src) refs.add(script.src.replace(/^\.\//, ''));
  }
  for (const preload of file.data.preloads) {
    refs.add(preload.replace(/^\.\//, ''));
  }
  for (const imp of file.data.inlineImports) {
    const resolved = resolve(imp, file.path, importMap);
    refs.add(resolved);
  }
}
