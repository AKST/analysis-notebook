/**
 * @import {
 *   EntryManifest,
 *   TransformedFiles,
 *   NormalizedConfig,
 *   ScanResult,
 * } from '../types.ts'
 */

import * as esbuild from 'esbuild';
import { mkdir, writeFile, copyFile, rm } from 'node:fs/promises';
import { join, dirname, extname, resolve } from 'node:path';
import { existsSync } from 'node:fs';

/**
 * Bundle all entry points and write output
 * @param {EntryManifest} manifest
 * @param {TransformedFiles} transformed
 * @param {ScanResult} scanResult
 * @param {NormalizedConfig} config
 */
export async function bundle(manifest, transformed, scanResult, config) {
  // Clean output directory
  if (existsSync(config.outputDir)) {
    await rm(config.outputDir, { recursive: true });
  }
  await mkdir(config.outputDir, { recursive: true });

  // Create assets directory
  const assetsPath = join(config.outputDir, config.assetsDir);
  await mkdir(assetsPath, { recursive: true });

  // Bundle JS entry points with esbuild
  if (manifest.jsEntries.length > 0) {
    await bundleJsEntries(manifest, transformed, scanResult, config);
  }

  // Write HTML files
  await writeHtmlFiles(manifest, transformed, config);

  // Copy CSS assets
  await copyCssAssets(manifest, transformed, scanResult, config);

  // Copy static assets
  await copyStaticAssets(manifest, scanResult, config);

  console.log(`\nBundle written to: ${config.outputDir}`);
}

/**
 * Bundle JavaScript entry points using esbuild
 * @param {EntryManifest} manifest
 * @param {TransformedFiles} transformed
 * @param {ScanResult} scanResult
 * @param {NormalizedConfig} config
 */
async function bundleJsEntries(manifest, transformed, scanResult, config) {
  // Create a virtual file plugin for transformed content
  const virtualPlugin = createVirtualPlugin(transformed, scanResult, config);

  // Get entry points
  const entryPoints = manifest.jsEntries.map(entry => ({
    in: resolve(config.root, entry.sourcePath),
    out: entry.outputName.replace(/\.js$/, ''),
  }));

  // Also add the main entry from HTML
  for (const htmlEntry of manifest.htmlEntries) {
    const htmlFile = scanResult.files.get(htmlEntry.sourcePath);
    if (htmlFile?.type === 'html') {
      for (const script of htmlFile.data.scripts) {
        if (script.type === 'module' && script.src) {
          const scriptPath = script.src.replace(/^\.\//, '');
          const file = scanResult.files.get(scriptPath);
          if (file) {
            entryPoints.push({
              in: resolve(config.root, scriptPath),
              out: `main-${file.hash}`,
            });
          }
        }
      }
    }
  }

  if (entryPoints.length === 0) {
    return;
  }

  try {
    await esbuild.build({
      entryPoints,
      bundle: true,
      format: 'esm',
      splitting: true,
      outdir: join(config.outputDir, config.assetsDir),
      plugins: [virtualPlugin],
      minify: true,
      treeShaking: true,
      metafile: true,
    });
  } catch (error) {
    console.error('esbuild error:', error);
    throw error;
  }
}

/**
 * Create esbuild plugin for virtual/transformed files
 * @param {TransformedFiles} transformed
 * @param {ScanResult} scanResult
 * @param {NormalizedConfig} config
 * @returns {esbuild.Plugin}
 */
function createVirtualPlugin(transformed, scanResult, config) {
  return {
    name: 'virtual-files',
    setup(build) {
      // Resolve paths
      build.onResolve({ filter: /.*/ }, args => {
        // Skip external modules
        if (!args.path.startsWith('.') && !args.path.startsWith('/') && !args.path.startsWith('@')) {
          return { external: true };
        }

        // Handle import map aliases
        const aliasMap = {
          '@base/': 'lib/base/',
          '@app/': 'lib/app/',
          '@ui/': 'lib/ui/',
          '@prelude-uni/': 'lib/prelude/university/',
          '@prelude-econ/': 'lib/prelude/econ/',
          '@assets/': 'assets/',
        };

        let resolvedPath = args.path;
        for (const [alias, target] of Object.entries(aliasMap)) {
          if (args.path.startsWith(alias)) {
            resolvedPath = join(config.root, target, args.path.slice(alias.length));
            break;
          }
        }

        // Handle relative paths
        if (resolvedPath.startsWith('.')) {
          const importer = args.importer || config.root;
          resolvedPath = resolve(dirname(importer), resolvedPath);
        }

        return { path: resolvedPath };
      });

      // Load transformed content
      build.onLoad({ filter: /\.(js|ts)$/ }, async args => {
        const relativePath = args.path.replace(config.root + '/', '').replace(/\\/g, '/');

        // Check for transformed content
        const content = transformed.files.get(relativePath);
        if (content) {
          return { contents: content, loader: 'js' };
        }

        // Fall back to original content from scan
        const file = scanResult.files.get(relativePath);
        if (file) {
          return { contents: file.content, loader: 'js' };
        }

        return null;
      });
    },
  };
}

/**
 * Write HTML files to output
 * @param {EntryManifest} manifest
 * @param {TransformedFiles} transformed
 * @param {NormalizedConfig} config
 */
async function writeHtmlFiles(manifest, transformed, config) {
  for (const entry of manifest.htmlEntries) {
    const content = transformed.files.get(entry.sourcePath);
    if (!content) {
      console.warn(`Warning: No transformed content for ${entry.sourcePath}`);
      continue;
    }

    const outputPath = join(config.outputDir, entry.outputPath);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, content, 'utf-8');
  }
}

/**
 * Copy CSS assets to output
 * @param {EntryManifest} manifest
 * @param {TransformedFiles} transformed
 * @param {ScanResult} scanResult
 * @param {NormalizedConfig} config
 */
async function copyCssAssets(manifest, transformed, scanResult, config) {
  for (const asset of manifest.cssAssets) {
    const content = transformed.files.get(asset.sourcePath) ||
      scanResult.files.get(asset.sourcePath)?.content;

    if (!content) {
      console.warn(`Warning: No content for CSS asset ${asset.sourcePath}`);
      continue;
    }

    const outputPath = join(config.outputDir, config.assetsDir, asset.outputPath);
    await writeFile(outputPath, content, 'utf-8');
  }
}

/**
 * Copy static assets to output
 * @param {EntryManifest} manifest
 * @param {ScanResult} scanResult
 * @param {NormalizedConfig} config
 */
async function copyStaticAssets(manifest, scanResult, config) {
  for (const asset of manifest.staticAssets) {
    const sourcePath = join(config.root, asset.sourcePath);
    const outputPath = join(config.outputDir, config.assetsDir, asset.outputPath);

    try {
      await copyFile(sourcePath, outputPath);
    } catch (error) {
      console.warn(`Warning: Could not copy static asset ${asset.sourcePath}:`, error);
    }
  }
}
