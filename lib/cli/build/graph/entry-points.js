/**
 * @import {
 *   ScanResult,
 *   EntryManifest,
 *   HtmlEntry,
 *   JsEntry,
 *   AssetEntry,
 *   ScannedFile,
 *   JsScannedFile,
 *   HtmlScannedFile,
 *   PathConstraintAnnotation,
 *   AssetNameAnnotation,
 *   NormalizedConfig,
 * } from '../types.ts'
 */

import { basename, extname, dirname, join, relative } from 'node:path';
import { applyAssetNameTemplate } from '../scan/asset-name.js';
import { hashedFilename } from './hash.js';
import { collectImportmaps, mergeImportmaps, resolveWithImportmap } from './importmap.js';

/**
 * Discover all entry points from scan results
 * @param {ScanResult} scanResult
 * @param {NormalizedConfig} config
 * @returns {EntryManifest}
 */
export function discoverEntryPoints(scanResult, config) {
  /** @type {HtmlEntry[]} */
  const htmlEntries = [];
  /** @type {JsEntry[]} */
  const jsEntries = [];
  /** @type {AssetEntry[]} */
  const cssAssets = [];
  /** @type {AssetEntry[]} */
  const staticAssets = [];
  /** @type {Map<string, string>} */
  const pathMappings = new Map();

  // Collect and merge all import maps from HTML files
  const importmaps = collectImportmaps(scanResult);
  const mergedImportmap = mergeImportmaps([...importmaps.values()]);

  // Track which JS files are referenced by dynamic imports with implicit generation
  /** @type {Map<string, { constraint: PathConstraintAnnotation, assetName: AssetNameAnnotation | null }>} */
  const dynamicImportConstraints = new Map();

  // Track assets referenced directly in HTML
  /** @type {Set<string>} */
  const htmlReferencedAssets = new Set();

  // First pass: collect HTML entries, their referenced assets, and dynamic import constraints
  for (const [path, file] of scanResult.files) {
    if (file.type === 'html' && file.data.outputPath) {
      htmlEntries.push({
        sourcePath: path,
        outputPath: file.data.outputPath,
        hash: file.hash,
      });
      pathMappings.set(path, file.data.outputPath);

      // Track CSS and JS files referenced in this HTML
      for (const stylesheet of file.data.stylesheets) {
        const normalizedPath = stylesheet.replace(/^\.\//, '');
        htmlReferencedAssets.add(normalizedPath);
      }
      for (const script of file.data.scripts) {
        if (script.src) {
          const normalizedPath = script.src.replace(/^\.\//, '');
          htmlReferencedAssets.add(normalizedPath);
        }
      }
      for (const link of file.data.links) {
        const normalizedPath = link.replace(/^\.\//, '');
        htmlReferencedAssets.add(normalizedPath);
      }
      // Track imports from inline module scripts
      for (const inlineImport of file.data.inlineImports) {
        // Resolve relative to HTML file's directory
        const resolvedPath = resolvePath(inlineImport, path, mergedImportmap);
        htmlReferencedAssets.add(resolvedPath);
      }
    }

    if (file.type === 'js') {
      // Look for dynamic imports with path constraints
      for (const dynImport of file.data.dynamicImports) {
        const constraint = dynImport.annotations.find(
          (a) => a.kind === 'path-constraint',
        );
        const assetName = dynImport.annotations.find(
          (a) => a.kind === 'asset-name',
        );
        const hasImplicit = dynImport.annotations.some(
          (a) => a.kind === 'implicit-bundle-generation',
        );

        if (constraint && constraint.kind === 'path-constraint' && hasImplicit) {
          dynamicImportConstraints.set(path, {
            constraint,
            assetName: assetName?.kind === 'asset-name' ? assetName : null,
          });
        }
      }
    }
  }

  // Second pass: find JS files matching constraints (implicit bundle generation)
  for (const [constraintPath, { constraint, assetName }] of dynamicImportConstraints) {
    const regex = new RegExp(constraint.pattern);

    for (const [path, file] of scanResult.files) {
      if (file.type !== 'js') continue;

      // Normalize path for matching (add ./ prefix if pattern expects it)
      const pathForMatch = constraint.pattern.startsWith('./') && !path.startsWith('./')
        ? './' + path
        : path;

      // Check if path matches the constraint
      const match = pathForMatch.match(regex);
      if (!match) continue;

      // Generate output name
      let outputName;
      if (assetName) {
        // Extract all repeated captures from the path
        // The regex pattern has a repeated group like (sec-[^/]+/)+
        // We need to extract ALL iterations, not just the last one
        const captures = extractAllCaptures(constraint.pattern, pathForMatch);
        outputName = applyAssetNameTemplate(assetName.template, captures, file.hash);
      } else {
        // Default: use basename with hash
        const base = basename(path, extname(path));
        outputName = hashedFilename(base, file.hash, '.js');
      }

      jsEntries.push({
        sourcePath: path,
        outputName,
        hash: file.hash,
      });

      pathMappings.set(path, outputName);
    }
  }

  // Third pass: collect CSS and static assets from import.meta.resolve
  const processedAssets = new Set();

  for (const [path, file] of scanResult.files) {
    if (file.type !== 'js') continue;

    for (const resolve of file.data.metaResolves) {
      // Resolve the path relative to the file
      const resolvedPath = resolvePath(resolve.path, path, mergedImportmap);

      if (processedAssets.has(resolvedPath)) continue;
      processedAssets.add(resolvedPath);

      const targetFile = scanResult.files.get(resolvedPath);
      if (!targetFile) continue;

      const ext = extname(resolvedPath);
      const base = basename(resolvedPath, ext);
      const outputPath = hashedFilename(base, targetFile.hash, ext);

      if (ext === '.css') {
        cssAssets.push({
          sourcePath: resolvedPath,
          outputPath,
          hash: targetFile.hash,
        });
      } else if (ext !== '.js' && ext !== '.html') {
        staticAssets.push({
          sourcePath: resolvedPath,
          outputPath,
          hash: targetFile.hash,
        });
      }

      pathMappings.set(resolvedPath, outputPath);
    }
  }

  // Fourth pass: process assets directly referenced in HTML
  for (const assetPath of htmlReferencedAssets) {
    // Skip if already processed
    if (pathMappings.has(assetPath)) continue;

    const targetFile = scanResult.files.get(assetPath);
    if (!targetFile) continue;

    const ext = extname(assetPath);
    const base = basename(assetPath, ext);
    const outputPath = hashedFilename(base, targetFile.hash, ext);

    if (ext === '.css') {
      cssAssets.push({
        sourcePath: assetPath,
        outputPath,
        hash: targetFile.hash,
      });
    } else if (ext === '.js') {
      // Main entry JS files referenced directly in HTML
      jsEntries.push({
        sourcePath: assetPath,
        outputName: outputPath,
        hash: targetFile.hash,
      });
    } else if (ext !== '.html') {
      staticAssets.push({
        sourcePath: assetPath,
        outputPath,
        hash: targetFile.hash,
      });
    }

    pathMappings.set(assetPath, outputPath);
  }

  return {
    htmlEntries,
    jsEntries,
    cssAssets,
    staticAssets,
    pathMappings,
  };
}

/**
 * Extract all captures from a repeated group pattern
 * For a pattern like "./lib/app/(sec-[^/]+/)+" matching a path,
 * this extracts all the sec-xxx/ segments, not just the last one.
 *
 * @param {string} pattern - The constraint pattern
 * @param {string} path - The path to match
 * @returns {string[]}
 */
function extractAllCaptures(pattern, path) {
  // Find the capture group in the pattern
  // Look for (something)+ patterns
  const groupMatch = pattern.match(/\(([^)]+)\)\+/);
  if (!groupMatch) {
    // No repeated group, fall back to normal match
    const match = path.match(new RegExp(pattern));
    return match ? match.slice(1) : [];
  }

  // Extract the group pattern
  const groupPattern = groupMatch[1];

  // Find where in the path to look (after the prefix)
  const prefixMatch = pattern.match(/^([^(]+)\(/);
  const prefix = prefixMatch ? prefixMatch[1] : '';

  // Find the part of the path that matches the prefix
  let searchStart = 0;
  if (prefix) {
    const prefixRegex = new RegExp('^' + prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\.\\/g, './'));
    const prefixPathMatch = path.match(prefixRegex);
    if (prefixPathMatch) {
      searchStart = prefixPathMatch[0].length;
    }
  }

  // Find the suffix (after the repeated group)
  const suffixMatch = pattern.match(/\)\+(.+)$/);
  const suffix = suffixMatch ? suffixMatch[1] : '';

  // Determine where to stop
  let searchEnd = path.length;
  if (suffix) {
    const suffixRegex = new RegExp(suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$');
    const suffixPathMatch = path.match(suffixRegex);
    if (suffixPathMatch) {
      searchEnd = suffixPathMatch.index || path.length;
    }
  }

  // Extract the middle portion and find all matches
  const middle = path.slice(searchStart, searchEnd);
  const captures = [];
  const captureRegex = new RegExp(groupPattern, 'g');
  let captureMatch;
  while ((captureMatch = captureRegex.exec(middle)) !== null) {
    captures.push(captureMatch[0]);
  }

  return captures;
}

/**
 * Resolve a path relative to a referrer using import maps
 * @param {string} specifier
 * @param {string} referrer
 * @param {import('../types.ts').ImportMap | null} importmap
 * @returns {string}
 */
function resolvePath(specifier, referrer, importmap = null) {
  // Handle relative paths
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    const dir = dirname(referrer);
    return join(dir, specifier).replace(/\\/g, '/');
  }

  // Try to resolve using import map
  if (importmap) {
    const resolved = resolveWithImportmap(specifier, referrer, importmap);
    if (resolved !== specifier) {
      // Result may have ./ prefix, normalize it
      return resolved.replace(/^\.\//, '');
    }
  }

  return specifier;
}

/**
 * Validate entry points
 * @param {EntryManifest} manifest
 * @param {ScanResult} scanResult
 * @param {import('../types.ts').ImportMap | null} importmap
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
export function validateEntryPoints(manifest, scanResult, importmap = null) {
  /** @type {string[]} */
  const errors = [];
  /** @type {string[]} */
  const warnings = [];

  // Check that all HTML entries have valid output paths
  for (const entry of manifest.htmlEntries) {
    if (!entry.outputPath) {
      errors.push(`HTML file "${entry.sourcePath}" has no output-path specified`);
    }
  }

  // Check for duplicate output paths
  const outputPaths = new Set();
  for (const entry of [...manifest.htmlEntries, ...manifest.jsEntries]) {
    const outputPath = 'outputPath' in entry ? entry.outputPath : entry.outputName;
    if (outputPaths.has(outputPath)) {
      errors.push(`Duplicate output path: "${outputPath}"`);
    }
    outputPaths.add(outputPath);
  }

  // Check that JS files referenced by import.meta.resolve are covered by constraints
  for (const [path, file] of scanResult.files) {
    if (file.type !== 'js') continue;

    for (const resolve of file.data.metaResolves) {
      if (resolve.path.endsWith('.js')) {
        const resolvedPath = resolvePath(resolve.path, path, importmap);
        if (!manifest.pathMappings.has(resolvedPath)) {
          warnings.push(
            `JS file "${resolvedPath}" referenced by import.meta.resolve in "${path}" ` +
            `is not covered by any path-constraint annotation`,
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
