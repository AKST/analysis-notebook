/**
 * @import { EntryManifest, ScanResult, HtmlScannedFile } from '../types.ts'
 */

const BUNDLE_META_REGEX = /<!--\s*akst::bundle::meta[^>]*-->\s*/g;

/**
 * Transform HTML content for bundling
 * - Strip akst::bundle::meta comments
 * - Update script and stylesheet paths to bundled versions
 *
 * @param {string} content - Original HTML content
 * @param {string} sourcePath - Path of the HTML file
 * @param {EntryManifest} manifest - Entry manifest with path mappings
 * @param {string} assetsDir - Assets directory name
 * @returns {string} Transformed HTML
 */
export function transformHtml(content, sourcePath, manifest, assetsDir) {
  let result = content;

  // Strip bundle meta comments
  result = result.replace(BUNDLE_META_REGEX, '');

  // Update script src attributes
  result = result.replace(
    /(<script[^>]*\ssrc=["'])([^"']+)(["'][^>]*>)/g,
    (match, prefix, src, suffix) => {
      const newPath = resolveOutputPath(src, sourcePath, manifest, assetsDir);
      return `${prefix}${newPath}${suffix}`;
    },
  );

  // Update link href attributes (stylesheets and modulepreload)
  result = result.replace(
    /(<link[^>]*\shref=["'])([^"']+)(["'][^>]*>)/g,
    (match, prefix, href, suffix) => {
      const newPath = resolveOutputPath(href, sourcePath, manifest, assetsDir);
      return `${prefix}${newPath}${suffix}`;
    },
  );

  // Update import paths inside inline module scripts
  result = result.replace(
    /(<script\s+type=["']module["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
    (match, openTag, scriptContent, closeTag) => {
      // Skip if it has a src attribute (external script)
      if (/\ssrc\s*=/.test(openTag)) {
        return match;
      }

      // Update import statements in the script content
      const updatedContent = scriptContent.replace(
        /(import\s+(?:[\w\s{},*]+\s+from\s+)?['"])([^'"]+)(['"])/g,
        /**
         * @param {string} _match
         * @param {string} prefix
         * @param {string} importPath
         * @param {string} suffix
         */
        (_match, prefix, importPath, suffix) => {
          const newPath = resolveOutputPath(importPath, sourcePath, manifest, assetsDir);
          return `${prefix}${newPath}${suffix}`;
        },
      );

      return openTag + updatedContent + closeTag;
    },
  );

  return result;
}

/**
 * Resolve a path to its output location
 * @param {string} originalPath - Original path in HTML
 * @param {string} htmlSourcePath - Source path of the HTML file
 * @param {EntryManifest} manifest - Entry manifest
 * @param {string} assetsDir - Assets directory name
 * @returns {string} Resolved output path
 */
function resolveOutputPath(originalPath, htmlSourcePath, manifest, assetsDir) {
  // Skip external URLs
  if (originalPath.startsWith('http://') || originalPath.startsWith('https://')) {
    return originalPath;
  }

  // Get HTML output path
  const htmlOutputPath = manifest.pathMappings.get(htmlSourcePath) || htmlSourcePath;

  // Resolve the source path relative to the HTML source file
  let resolvedSourcePath = originalPath.replace(/^\.\//, '');
  if (originalPath.startsWith('./') || originalPath.startsWith('../')) {
    // Relative path - resolve from HTML source directory
    const htmlDir = htmlSourcePath.split('/').slice(0, -1).join('/');
    resolvedSourcePath = resolvePath(originalPath, htmlDir);
  }

  // Check if we have a mapping for this path
  const mappedPath = manifest.pathMappings.get(resolvedSourcePath);
  if (mappedPath) {
    // Calculate relative path from HTML output location to asset output location
    const assetOutputPath = mappedPath.includes('/') ? mappedPath : `${assetsDir}/${mappedPath}`;
    return getRelativePath(htmlOutputPath, assetOutputPath);
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

/**
 * Get the relative path from one file to another in the output
 * @param {string} from - Source file output path
 * @param {string} to - Target file output path
 * @returns {string} Relative path
 */
export function getRelativePath(from, to) {
  const fromParts = from.split('/').slice(0, -1); // directory of from
  const toParts = to.split('/');

  // Find common prefix
  let common = 0;
  while (
    common < fromParts.length &&
    common < toParts.length &&
    fromParts[common] === toParts[common]
  ) {
    common++;
  }

  // Build relative path
  const ups = fromParts.length - common;
  const downs = toParts.slice(common);

  if (ups === 0 && downs.length === 0) {
    return '.';
  }

  const parts = [];
  for (let i = 0; i < ups; i++) {
    parts.push('..');
  }
  parts.push(...downs);

  return parts.join('/') || '.';
}
