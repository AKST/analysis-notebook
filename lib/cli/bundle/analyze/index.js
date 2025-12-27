/**
 * @import { ParseResult, Manifest, Config } from '../types.ts'
 */

import { buildManifest } from './manifest.js';

/**
 * Analyze parse results and build manifest
 * @param {ParseResult} parseResult
 * @param {Config} config
 * @returns {{ manifest: Manifest, errors: string[], warnings: string[] }}
 */
export function analyze(parseResult, config) {
  /** @type {string[]} */
  const errors = [];
  /** @type {string[]} */
  const warnings = [];

  // Build manifest
  const manifest = buildManifest(parseResult, config);

  // Validate
  const validation = validate(manifest, parseResult);
  errors.push(...validation.errors);
  warnings.push(...validation.warnings);

  return { manifest, errors, warnings };
}

/**
 * Validate manifest
 * @param {Manifest} manifest
 * @param {ParseResult} parseResult
 * @returns {{ errors: string[], warnings: string[] }}
 */
function validate(manifest, parseResult) {
  /** @type {string[]} */
  const errors = [];
  /** @type {string[]} */
  const warnings = [];

  // Check HTML entries have output paths
  for (const entry of manifest.htmlEntries) {
    if (!entry.outputPath) {
      errors.push(`HTML "${entry.sourcePath}" has no output-path`);
    }
  }

  // Check for duplicate output paths
  const outputs = new Set();
  for (const entry of manifest.htmlEntries) {
    if (outputs.has(entry.outputPath)) {
      errors.push(`Duplicate output path: ${entry.outputPath}`);
    }
    outputs.add(entry.outputPath);
  }

  for (const entry of manifest.jsEntries) {
    if (outputs.has(entry.outputName)) {
      errors.push(`Duplicate output path: ${entry.outputName}`);
    }
    outputs.add(entry.outputName);
  }

  // Warn about unmapped JS references
  for (const [path, file] of parseResult.files) {
    if (file.type !== 'js') continue;

    for (const site of file.data.metaResolves) {
      if (site.specifier.endsWith('.js')) {
        // Try to find in pathMap
        const found = manifest.pathMap.has(site.specifier.replace(/^\.\//, ''));
        if (!found) {
          warnings.push(
            `JS "${site.specifier}" in "${path}" not covered by path-constraint`,
          );
        }
      }
    }
  }

  return { errors, warnings };
}

/**
 * Log manifest summary
 * @param {Manifest} manifest
 */
export function logSummary(manifest) {
  console.log('\nEntry points discovered:');
  console.log(`  HTML entries: ${manifest.htmlEntries.length}`);
  console.log(`  JS entries: ${manifest.jsEntries.length}`);
  console.log(`  CSS assets: ${manifest.cssAssets.length}`);
  console.log(`  Static assets: ${manifest.staticAssets.length}`);
  console.log(`  Path mappings: ${manifest.pathMap.size}`);
}
