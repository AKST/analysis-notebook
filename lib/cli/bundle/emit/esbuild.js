/**
 * @import { Manifest, ParseResult, Config, ImportMap } from '../types.ts'
 */

import * as esbuild from 'esbuild';
import { resolve, join } from 'node:path';
import { resolveAbsolute } from '../util/resolve.js';

/**
 * Bundle JS entry points with esbuild
 * @param {Manifest} manifest
 * @param {Map<string, string>} rewritten - Rewritten file contents
 * @param {ParseResult} parseResult
 * @param {Config} config
 */
export async function bundleJs(manifest, rewritten, parseResult, config) {
  if (manifest.jsEntries.length === 0) return;

  const plugin = createPlugin(rewritten, parseResult, config);

  const entryPoints = manifest.jsEntries.map(entry => ({
    in: resolve(config.root, entry.sourcePath),
    out: entry.outputName.replace(/\.js$/, ''),
  }));

  // Add main entry scripts from HTML
  for (const html of manifest.htmlEntries) {
    const file = parseResult.files.get(html.sourcePath);
    if (file?.type !== 'html') continue;

    for (const script of file.data.scripts) {
      if (script.type === 'module' && script.src) {
        const scriptPath = script.src.replace(/^\.\//, '');
        const scriptFile = parseResult.files.get(scriptPath);
        if (scriptFile) {
          entryPoints.push({
            in: resolve(config.root, scriptPath),
            out: `main-${scriptFile.hash}`,
          });
        }
      }
    }
  }

  if (entryPoints.length === 0) return;

  await esbuild.build({
    entryPoints,
    bundle: true,
    format: 'esm',
    splitting: true,
    outdir: join(config.outputDir, config.assetsDir),
    plugins: [plugin],
    minify: true,
    treeShaking: true,
    sourcemap: config.sourcemap,
  });
}

/**
 * Create esbuild plugin for virtual files
 * @param {Map<string, string>} rewritten
 * @param {ParseResult} parseResult
 * @param {Config} config
 * @returns {esbuild.Plugin}
 */
function createPlugin(rewritten, parseResult, config) {
  const { importMap } = parseResult;

  return {
    name: 'bundle-virtual',
    setup(build) {
      build.onResolve({ filter: /.*/ }, args => {
        // Get importer's relative path for resolution
        const referrer = args.importer
          ? args.importer.replace(config.root + '/', '').replace(/\\/g, '/')
          : '';

        const resolved = resolveAbsolute(args.path, referrer, importMap, config.root);

        // null means external (not in import map and not relative)
        if (resolved === null) {
          return { external: true };
        }

        return { path: resolved };
      });

      build.onLoad({ filter: /\.(js|ts)$/ }, args => {
        const relative = args.path.replace(config.root + '/', '').replace(/\\/g, '/');

        // Check rewritten content first
        const content = rewritten.get(relative);
        if (content) {
          return { contents: content, loader: 'js' };
        }

        // Fall back to original
        const file = parseResult.files.get(relative);
        if (file) {
          return { contents: file.content, loader: 'js' };
        }

        return null;
      });
    },
  };
}

