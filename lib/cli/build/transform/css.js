/**
 * @import { EntryManifest } from '../types.ts'
 */

/**
 * Transform CSS content for bundling
 * - Update CSS import paths to hashed versions
 * - Update url() paths to hashed versions
 *
 * @param {string} content - Original CSS content
 * @param {string} sourcePath - Path of the CSS file
 * @param {EntryManifest} manifest - Entry manifest with path mappings
 * @returns {string} Transformed CSS
 */
export function transformCss(content, sourcePath, manifest) {
  let result = content;

  // Update @import statements
  result = result.replace(
    /@import\s+(['"])([^'"]+)\1/g,
    /**
     * @param {string} _match
     * @param {string} quote
     * @param {string} importPath
     */
    (_match, quote, importPath) => {
      const newPath = resolveOutputPath(importPath, sourcePath, manifest);
      return `@import ${quote}${newPath}${quote}`;
    },
  );

  // Update url() references
  result = result.replace(
    /url\(\s*(['"]?)([^'")\s]+)\1\s*\)/g,
    /**
     * @param {string} _match
     * @param {string} quote
     * @param {string} urlPath
     */
    (_match, quote, urlPath) => {
      const newPath = resolveOutputPath(urlPath, sourcePath, manifest);
      return `url(${quote}${newPath}${quote})`;
    },
  );

  return result;
}

/**
 * Resolve a path to its output location
 * Since all CSS assets end up in __asset/, the relative path between them is simple
 *
 * @param {string} originalPath - Original path in CSS
 * @param {string} cssSourcePath - Source path of the CSS file
 * @param {EntryManifest} manifest - Entry manifest
 * @returns {string} Resolved output path
 */
function resolveOutputPath(originalPath, cssSourcePath, manifest) {
  // Skip external URLs and data URIs
  if (
    originalPath.startsWith('http://') ||
    originalPath.startsWith('https://') ||
    originalPath.startsWith('data:')
  ) {
    return originalPath;
  }

  // Try root-relative first (./lib/... means lib/... from project root)
  const rootRelativePath = originalPath.replace(/^\.\//, '');
  let mappedPath = manifest.pathMappings.get(rootRelativePath);

  // If not found as root-relative, try resolving relative to CSS file
  if (!mappedPath && (originalPath.startsWith('./') || originalPath.startsWith('../'))) {
    const cssDir = cssSourcePath.split('/').slice(0, -1).join('/');
    const resolvedPath = resolvePath(originalPath, cssDir);
    mappedPath = manifest.pathMappings.get(resolvedPath);
  }

  if (mappedPath) {
    // All CSS files are in the same __asset/ directory
    // So we just need the filename
    const filename = mappedPath.includes('/') ? mappedPath.split('/').pop() : mappedPath;
    return `./${filename}`;
  }

  // Return original if no mapping
  return originalPath;
}

/**
 * Resolve a relative path from a directory
 * @param {string} path
 * @param {string} fromDir
 * @returns {string}
 */
function resolvePath(path, fromDir) {
  const parts = fromDir ? fromDir.split('/') : [];

  for (const segment of path.split('/')) {
    if (segment === '..') {
      parts.pop();
    } else if (segment !== '.' && segment !== '') {
      parts.push(segment);
    }
  }

  return parts.join('/');
}
