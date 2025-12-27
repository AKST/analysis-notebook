/**
 * Main build orchestrator
 *
 * @import { NormalizedConfig } from './types.ts'
 */

import { loadConfig, validateConfig } from './config.js';
import { scan } from './scan/index.js';
import { buildGraph, logGraphSummary } from './graph/index.js';
import { transformFiles } from './transform/index.js';
import { bundle } from './bundle/index.js';

/**
 * Run the build process
 * @param {string} projectRoot - Root directory of the project
 */
export async function build(projectRoot) {
  console.log('Starting build...\n');

  // Step 1: Load and validate config
  console.log('Loading configuration...');
  const config = await loadConfig(projectRoot);
  const configValidation = validateConfig(config);

  if (!configValidation.valid) {
    console.error('Configuration errors:');
    for (const error of configValidation.errors) {
      console.error(`  - ${error}`);
    }
    throw new Error('Invalid configuration');
  }

  console.log(`  Found ${config.sourceFiles.length} source files`);

  // Step 2: Scan all source files
  console.log('\nScanning source files...');
  const scanResult = await scan(config);
  console.log(`  Scanned ${scanResult.files.size} files`);

  // Step 3: Build dependency graph and discover entry points
  console.log('\nBuilding dependency graph...');
  const { manifest, errors, warnings } = buildGraph(scanResult, config);

  if (warnings.length > 0) {
    console.log('\nWarnings:');
    for (const warning of warnings) {
      console.log(`  ⚠ ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error('\nErrors:');
    for (const error of errors) {
      console.error(`  ✗ ${error}`);
    }
    throw new Error('Build validation failed');
  }

  logGraphSummary(manifest);

  // Step 4: Transform files
  console.log('\nTransforming files...');
  const transformed = transformFiles(scanResult, manifest, config);
  console.log(`  Transformed ${transformed.files.size} files`);

  // Step 5: Bundle with esbuild
  console.log('\nBundling...');
  await bundle(manifest, transformed, scanResult, config);

  console.log('\n✓ Build complete!');
}
