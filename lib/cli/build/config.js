/**
 * @import { BundleConfig, NormalizedConfig } from './types.ts'
 */

import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import fg from 'fast-glob';

const CONFIG_PATH = 'config/akst-bundle.json';

/**
 * Load and normalize the bundle configuration
 * @param {string} projectRoot - The root directory of the project
 * @returns {Promise<NormalizedConfig>}
 */
export async function loadConfig(projectRoot) {
  const configPath = resolve(projectRoot, CONFIG_PATH);
  const content = await readFile(configPath, 'utf-8');

  /** @type {BundleConfig} */
  const raw = JSON.parse(content);

  const root = resolve(projectRoot, raw.root);

  // Expand source globs
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
    intermediaryDir: resolve(root, raw.output['intermediary-dir']),
    assetsDir: raw.output.assets,
    sourceFiles,
  };
}

/**
 * Validate the configuration
 * @param {NormalizedConfig} config
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateConfig(config) {
  /** @type {string[]} */
  const errors = [];

  if (config.entry.length === 0) {
    errors.push('No entry points specified');
  }

  if (config.sourceFiles.length === 0) {
    errors.push('No source files matched by source globs');
  }

  // Check that all entry files exist in source files
  for (const entry of config.entry) {
    if (!config.sourceFiles.includes(entry)) {
      errors.push(`Entry file "${entry}" not found in source files`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
