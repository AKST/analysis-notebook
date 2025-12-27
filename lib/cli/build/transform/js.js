/**
 * @import { EntryManifest, JsScannedFile, HtmlPathDeclareSite, ImportMap } from '../types.ts'
 */

import { dirname, join, relative } from 'node:path';

/**
 * Transform JavaScript content for bundling
 * - Update import.meta.resolve() paths to point to bundled assets
 * - Update strings marked with @akst::bundle::html-path:declare
 *
 * @param {string} content - Original JS content
 * @param {string} sourcePath - Path of the JS file
 * @param {JsScannedFile['data']} scanData - Scan data for this file
 * @param {EntryManifest} manifest - Entry manifest with path mappings
 * @param {string} assetsDir - Assets directory name
 * @param {ImportMap} importmap - Merged import map from HTML files
 * @returns {string} Transformed JS
 */
export function transformJs(content, sourcePath, scanData, manifest, assetsDir, importmap) {
  let result = content;

  // Transform import.meta.resolve() calls
  // We need to update the path argument to point to the bundled asset
  // Get the JS file's output location to calculate relative paths
  // All bundled JS ends up in the assets dir, so default to true
  const jsOutputPath = manifest.pathMappings.get(sourcePath);
  const jsInAssetsDir = !jsOutputPath || !jsOutputPath.includes('/');

  for (const resolve of scanData.metaResolves) {
    const resolvedPath = resolvePath(resolve.path, sourcePath);
    const outputPath = manifest.pathMappings.get(resolvedPath);

    if (outputPath) {
      // Build the new path relative to where this JS file will be
      // If JS is in __asset/ and target is also in __asset/, use just ./filename
      // If JS is at root and target is in __asset/, use ./__asset/filename
      const targetInAssetsDir = !outputPath.includes('/');
      let newPath;
      if (jsInAssetsDir && targetInAssetsDir) {
        // Both in assets dir - just use filename
        newPath = `./${outputPath}`;
      } else if (targetInAssetsDir) {
        // Target in assets, JS at root
        newPath = `./${assetsDir}/${outputPath}`;
      } else {
        // Target has full path
        newPath = `./${outputPath}`;
      }

      // Replace the path in import.meta.resolve()
      // Match import.meta.resolve('original-path') or import.meta.resolve("original-path")
      const escapedPath = escapeRegex(resolve.path);
      const regex = new RegExp(
        `(import\\.meta\\.resolve\\s*\\(\\s*)(['"])${escapedPath}\\2`,
        'g',
      );
      result = result.replace(regex, `$1$2${newPath}$2`);
    }
  }

  // Transform html-path-declare strings
  for (const htmlPath of scanData.htmlPathDeclares) {
    const transformedPath = transformHtmlPath(htmlPath.value, manifest);
    if (transformedPath !== htmlPath.value) {
      // Replace the string value
      // This is tricky because we need to find the exact string in context
      const escapedValue = escapeRegex(htmlPath.value);
      const regex = new RegExp(`(['"])${escapedValue}\\1`, 'g');
      result = result.replace(regex, `$1${transformedPath}$1`);
    }
  }

  // Transform lookup-entrypoint sites
  // Replace import.meta.resolve with a lookup function
  if (scanData.lookupEntrypoints.length > 0) {
    // Build path mapping for JS entries (including import map alias forms)
    const pathMap = buildEntrypointMap(manifest, assetsDir, importmap);

    if (Object.keys(pathMap).length > 0) {
      // Inject the lookup function at the start of the file
      // The function resolves to absolute URLs using document.baseURI as the base
      // This ensures paths resolve relative to the HTML page, not the chunk location
      const lookupFn = `const __lookupEntrypoint = (p) => { const m = ${JSON.stringify(pathMap)}; const r = m[p] ?? p; return new URL(r, document.baseURI).href; };`;

      // Replace import.meta.resolve with __lookupEntrypoint
      // This is a simple replacement that assumes import.meta.resolve is used
      // directly with the result of the expression
      result = result.replace(/import\.meta\.resolve\(/g, '__lookupEntrypoint(');

      // Add the lookup function at the start (after any imports)
      const firstNonImportLine = findFirstNonImportLine(result);
      const lines = result.split('\n');
      lines.splice(firstNonImportLine, 0, lookupFn);
      result = lines.join('\n');
    }
  }

  return result;
}

/**
 * Build a mapping of source paths to output paths for JS entries
 * Includes both file paths and import map alias forms
 * @param {EntryManifest} manifest
 * @param {string} assetsDir
 * @param {ImportMap} importmap
 * @returns {Record<string, string>}
 */
function buildEntrypointMap(manifest, assetsDir, importmap) {
  /** @type {Record<string, string>} */
  const pathMap = {};

  // Build inverse mapping: path prefix → alias prefix
  const pathToAlias = buildInverseAliasMap(importmap);

  for (const entry of manifest.jsEntries) {
    // Output path - JS entries are in assets dir
    const outputPath = `./${assetsDir}/${entry.outputName}`;

    // Add the file path form (with ./ prefix)
    const sourceKey = entry.sourcePath.startsWith('./')
      ? entry.sourcePath
      : './' + entry.sourcePath;
    pathMap[sourceKey] = outputPath;

    // Also add import map alias forms by checking which path prefixes match
    for (const [pathPrefix, aliasPrefix] of pathToAlias) {
      if (entry.sourcePath.startsWith(pathPrefix)) {
        const aliasKey = aliasPrefix + entry.sourcePath.slice(pathPrefix.length);
        pathMap[aliasKey] = outputPath;
      }
    }
  }

  return pathMap;
}

/**
 * Build inverse mapping from path prefixes to alias prefixes
 * e.g., "lib/app/" → "@app/"
 * @param {ImportMap} importmap
 * @returns {Array<[string, string]>}
 */
function buildInverseAliasMap(importmap) {
  /** @type {Array<[string, string]>} */
  const result = [];

  // Process top-level imports
  if (importmap.imports) {
    for (const [alias, path] of Object.entries(importmap.imports)) {
      if (alias.endsWith('/') && typeof path === 'string') {
        // Remove ./ prefix from path
        const normalizedPath = path.replace(/^\.\//, '');
        result.push([normalizedPath, alias]);
      }
    }
  }

  // Process scopes
  if (importmap.scopes) {
    for (const mappings of Object.values(importmap.scopes)) {
      for (const [alias, path] of Object.entries(mappings)) {
        if (alias.endsWith('/') && typeof path === 'string') {
          // Remove ./ prefix from path
          const normalizedPath = path.replace(/^\.\//, '');
          // Check if this mapping already exists
          if (!result.some(([p]) => p === normalizedPath)) {
            result.push([normalizedPath, alias]);
          }
        }
      }
    }
  }

  return result;
}

/**
 * Find the first line that isn't an import statement or comment
 * @param {string} content
 * @returns {number}
 */
function findFirstNonImportLine(content) {
  const lines = content.split('\n');
  let inBlockComment = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Track block comment state
    if (inBlockComment) {
      if (trimmed.includes('*/')) {
        inBlockComment = false;
      }
      continue;
    }

    // Check for block comment start
    if (trimmed.startsWith('/*')) {
      if (!trimmed.includes('*/')) {
        inBlockComment = true;
      }
      continue;
    }

    // Skip empty lines and single-line comments
    if (trimmed === '' || trimmed.startsWith('//')) {
      continue;
    }

    // Check for import statements
    if (!trimmed.startsWith('import ') && !trimmed.startsWith('import{')) {
      return i;
    }
  }
  return lines.length;
}

/**
 * Transform an HTML path reference
 * Handles paths like './lib/remote/app-embed/sec-2102-cobb-douglas?rho=0'
 *
 * @param {string} path - Original path (may include query params)
 * @param {EntryManifest} manifest - Entry manifest
 * @returns {string} Transformed path
 */
function transformHtmlPath(path, manifest) {
  // Parse URL to extract path and query
  let basePath = path;
  let query = '';

  const queryIndex = path.indexOf('?');
  if (queryIndex !== -1) {
    basePath = path.slice(0, queryIndex);
    query = path.slice(queryIndex);
  }

  // Normalize the path
  let normalizedPath = basePath.replace(/^\.\//, '');

  // Check if index.html was omitted
  const hasExplicitIndex = normalizedPath.endsWith('/index.html');
  if (!hasExplicitIndex && !normalizedPath.endsWith('.html')) {
    // Try with /index.html appended
    const withIndex = normalizedPath + '/index.html';
    if (manifest.pathMappings.has(withIndex)) {
      normalizedPath = withIndex;
    }
  }

  // Look up the output path
  const outputPath = manifest.pathMappings.get(normalizedPath);
  if (!outputPath) {
    return path; // No mapping found, return original
  }

  // Build the result path
  let resultPath = './' + outputPath;

  // If original omitted index.html and output ends with it, omit it too
  if (!hasExplicitIndex && resultPath.endsWith('/index.html')) {
    resultPath = resultPath.slice(0, -'/index.html'.length);
  }

  // Re-append query params
  return resultPath + query;
}

/**
 * Resolve a path relative to a referrer
 * @param {string} specifier
 * @param {string} referrer
 * @returns {string}
 */
function resolvePath(specifier, referrer) {
  // Handle relative paths
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    const dir = dirname(referrer);
    return join(dir, specifier).replace(/\\/g, '/');
  }

  // For import map aliases, we need to resolve them
  // This is a simplified version - full implementation would use the importmap
  const aliasMap = {
    '@base/': 'lib/base/',
    '@app/': 'lib/app/',
    '@ui/': 'lib/ui/',
    '@prelude-uni/': 'lib/prelude/university/',
    '@prelude-econ/': 'lib/prelude/econ/',
    '@assets/': 'assets/',
  };

  for (const [alias, target] of Object.entries(aliasMap)) {
    if (specifier.startsWith(alias)) {
      return target + specifier.slice(alias.length);
    }
  }

  return specifier;
}

/**
 * Escape special regex characters in a string
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
