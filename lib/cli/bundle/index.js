/**
 * @import { BundleConfig, Config } from './types.ts'
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import fg from 'fast-glob';
import { parse } from './parse/index.js';
import { analyze, logSummary } from './analyze/index.js';
import { emit } from './emit/index.js';

const CONFIG_PATH = 'config/akst-bundle.json';

/**
 * Run the bundle process
 * @param {string} projectRoot
 */
export async function bundle(projectRoot) {
  console.log('Starting bundle...\n');
  console.log('Loading configuration...');

  const config = await loadConfig(projectRoot);
  const validation = validateConfig(config);

  if (!validation.valid) {
    console.error('Configuration errors:');
    for (const err of validation.errors) {
      console.error(`  - ${err}`);
    }
    throw new Error('Invalid configuration');
  }

  console.log(`  Found ${config.sourceFiles.length} source files\n`);
  console.log('Parsing source files...');
  const parseResult = await parse(config);
  console.log(`  Parsed ${parseResult.files.size} files`);

  console.log('\nAnalyzing dependencies...');
  const { manifest, errors, warnings } = analyze(parseResult, config);

  if (warnings.length > 0) {
    console.log('\nWarnings:');
    for (const w of warnings) console.log(`  ⚠ ${w}`);
  }

  if (errors.length > 0) {
    console.error('\nErrors:');
    for (const e of errors) console.error(`  ✗ ${e}`);
    throw new Error('Analysis failed');
  }

  logSummary(manifest);
  console.log('\nEmitting bundle...');
  await emit(parseResult, manifest, config);
  console.log('\n✓ Bundle complete!');
}

/**
 * Load and normalize config
 * @param {string} projectRoot
 * @returns {Promise<Config>}
 */
async function loadConfig(projectRoot) {
  const configPath = resolve(projectRoot, CONFIG_PATH);
  const content = await readFile(configPath, 'utf-8');

  /** @type {BundleConfig} */
  const raw = JSON.parse(content);
  const root = resolve(projectRoot, raw.root);

  const sourceFiles = await fg(raw.source, {
    cwd: root,
    ignore: raw.ignore,
    absolute: false,
    onlyFiles: true,
  });

  return {
    root,
    entry: raw.entry,
    outputDir: resolve(root, raw.output.dir),
    assetsDir: raw.output.assets,
    sourceFiles,
  };
}

/**
 * Validate config
 * @param {Config} config
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateConfig(config) {
  /** @type {string[]} */
  const errors = [];

  if (config.entry.length === 0) {
    errors.push('No entry points specified');
  }

  if (config.sourceFiles.length === 0) {
    errors.push('No source files matched');
  }

  for (const entry of config.entry) {
    if (!config.sourceFiles.includes(entry)) {
      errors.push(`Entry "${entry}" not in source files`);
    }
  }

  return { valid: errors.length === 0, errors };
}
