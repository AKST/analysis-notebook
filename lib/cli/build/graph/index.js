/**
 * @import { ScanResult, EntryManifest, NormalizedConfig } from '../types.ts'
 */

import { collectImportmaps, validateImportmaps, mergeImportmaps } from './importmap.js';
import { discoverEntryPoints, validateEntryPoints } from './entry-points.js';

/**
 * Build the dependency graph and identify entry points
 * @param {ScanResult} scanResult
 * @param {NormalizedConfig} config
 * @returns {{ manifest: EntryManifest, errors: string[], warnings: string[] }}
 */
export function buildGraph(scanResult, config) {
  /** @type {string[]} */
  const errors = [];
  /** @type {string[]} */
  const warnings = [];

  // Collect and validate importmaps
  const importmaps = collectImportmaps(scanResult);
  const importmapValidation = validateImportmaps(importmaps);
  errors.push(...importmapValidation.errors);
  const mergedImportmap = mergeImportmaps([...importmaps.values()]);

  // Discover entry points
  const manifest = discoverEntryPoints(scanResult, config);

  // Validate entry points
  const entryValidation = validateEntryPoints(manifest, scanResult, mergedImportmap);
  errors.push(...entryValidation.errors);
  warnings.push(...entryValidation.warnings);

  return {
    manifest,
    errors,
    warnings,
  };
}

/**
 * Log graph summary
 * @param {EntryManifest} manifest
 */
export function logGraphSummary(manifest) {
  console.log('\nEntry points discovered:');
  console.log(`  HTML entries: ${manifest.htmlEntries.length}`);
  console.log(`  JS entries: ${manifest.jsEntries.length}`);
  console.log(`  CSS assets: ${manifest.cssAssets.length}`);
  console.log(`  Static assets: ${manifest.staticAssets.length}`);
  console.log(`  Path mappings: ${manifest.pathMappings.size}`);
}
