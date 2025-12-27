/**
 * @import { Manifest, ParseResult, Config } from '../types.ts'
 */

import { mkdir, writeFile, copyFile, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { rewriteFiles } from './rewrite.js';
import { bundleJs } from './esbuild.js';

/**
 * Emit bundled output
 * @param {ParseResult} parseResult
 * @param {Manifest} manifest
 * @param {Config} config
 */
export async function emit(parseResult, manifest, config) {
  // Clean and create output directory
  if (existsSync(config.outputDir)) {
    await rm(config.outputDir, { recursive: true });
  }
  await mkdir(config.outputDir, { recursive: true });
  await mkdir(join(config.outputDir, config.assetsDir), { recursive: true });

  // Rewrite files
  const rewritten = rewriteFiles(
    parseResult.files,
    manifest,
    parseResult.importMap,
    config,
  );

  // Bundle JS with esbuild
  await bundleJs(manifest, rewritten, parseResult, config);

  // Write HTML files
  await writeHtml(manifest, rewritten, config);

  // Write CSS assets
  await writeCss(manifest, rewritten, parseResult, config);

  // Copy static assets
  await copyStatic(manifest, parseResult, config);

  console.log(`\nOutput written to: ${config.outputDir}`);
}

/**
 * Write HTML files
 * @param {Manifest} manifest
 * @param {Map<string, string>} rewritten
 * @param {Config} config
 */
async function writeHtml(manifest, rewritten, config) {
  for (const entry of manifest.htmlEntries) {
    const content = rewritten.get(entry.sourcePath);
    if (!content) {
      console.warn(`Warning: No content for ${entry.sourcePath}`);
      continue;
    }

    const outPath = join(config.outputDir, entry.outputPath);
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, content, 'utf-8');
  }
}

/**
 * Write CSS assets
 * @param {Manifest} manifest
 * @param {Map<string, string>} rewritten
 * @param {ParseResult} parseResult
 * @param {Config} config
 */
async function writeCss(manifest, rewritten, parseResult, config) {
  for (const asset of manifest.cssAssets) {
    const content = rewritten.get(asset.sourcePath)
      || parseResult.files.get(asset.sourcePath)?.content;

    if (!content) {
      console.warn(`Warning: No content for CSS ${asset.sourcePath}`);
      continue;
    }

    const outPath = join(config.outputDir, config.assetsDir, asset.outputName);
    await writeFile(outPath, content, 'utf-8');
  }
}

/**
 * Copy static assets
 * @param {Manifest} manifest
 * @param {ParseResult} parseResult
 * @param {Config} config
 */
async function copyStatic(manifest, parseResult, config) {
  for (const asset of manifest.staticAssets) {
    const srcPath = join(config.root, asset.sourcePath);
    const outPath = join(config.outputDir, config.assetsDir, asset.outputName);

    try {
      await copyFile(srcPath, outPath);
    } catch (err) {
      console.warn(`Warning: Could not copy ${asset.sourcePath}:`, err);
    }
  }
}
