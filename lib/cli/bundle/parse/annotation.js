/**
 * @import { DynamicImportAnnotations, AssetNameTemplate, AssetNameTransform } from '../types.ts'
 */

const PREFIX = '@akst::bundle::';

/**
 * Check if text contains bundle annotations
 * @param {string} text
 * @returns {boolean}
 */
export function hasAnnotations(text) {
  return text.includes(PREFIX);
}

/**
 * Parse annotations from a JSDoc comment for dynamic imports
 * @param {string} comment - Full comment text including delimiters
 * @returns {DynamicImportAnnotations}
 */
export function parseDynamicImportAnnotations(comment) {
  /** @type {DynamicImportAnnotations} */
  const result = {};

  for (const line of comment.split('\n')) {
    const trimmed = line.trim().replace(/^\*\s*/, '');
    if (!trimmed.startsWith(PREFIX)) continue;

    const rest = trimmed.slice(PREFIX.length);

    // dyn-import:path-constraint {pattern}
    if (rest.startsWith('dyn-import:path-constraint')) {
      const match = rest.match(/\{([^}]+)\}/);
      if (match) result.pathConstraint = match[1].trim();
    }

    // dyn-import:asset-name {template}
    if (rest.startsWith('dyn-import:asset-name')) {
      const match = rest.match(/\{([^}]+)\}/);
      if (match) {
        result.assetName = parseAssetNameTemplate(match[1].trim());
      }
    }

    // dyn-import:implicit-bundle-generation (or implict)
    if (rest.includes('implict-bundle-generation') || rest.includes('implicit-bundle-generation')) {
      result.implicitBundle = true;
    }
  }

  return result;
}

/**
 * Check if comment has html-path:declare annotation
 * @param {string} comment
 * @returns {boolean}
 */
export function hasHtmlPathDeclare(comment) {
  return comment.includes(PREFIX + 'html-path:declare');
}

/**
 * Check if comment has resolve:lookup-entrypoint annotation
 * @param {string} comment
 * @returns {boolean}
 */
export function hasLookupEntrypoint(comment) {
  return comment.includes(PREFIX + 'resolve:lookup-entrypoint');
}

/**
 * Parse asset name template
 * Example: "app-[strip:sec-:/][join:-]"
 * @param {string} template
 * @returns {AssetNameTemplate}
 */
function parseAssetNameTemplate(template) {
  /** @type {AssetNameTransform[]} */
  const transforms = [];
  let joinSeparator = '-';

  // Extract prefix (before first [)
  const firstBracket = template.indexOf('[');
  const prefix = firstBracket === -1 ? template : template.slice(0, firstBracket);

  // Parse bracketed transforms
  const bracketRegex = /\[([^\]]+)\]/g;
  let match;
  while ((match = bracketRegex.exec(template)) !== null) {
    const content = match[1];

    if (content.startsWith('strip:')) {
      const parts = content.slice(6).split(':');
      if (parts.length >= 2) {
        transforms.push({
          kind: 'strip',
          leading: parts[0],
          trailing: parts[1],
        });
      }
    } else if (content.startsWith('join:')) {
      joinSeparator = content.slice(5);
    }
  }

  return { prefix, transforms, joinSeparator };
}

/**
 * Apply asset name template to path captures
 * @param {AssetNameTemplate} template
 * @param {string[]} captures
 * @param {string} contentHash
 * @returns {string}
 */
export function applyAssetNameTemplate(template, captures, contentHash) {
  const parts = captures.map(capture => {
    let result = capture;
    for (const transform of template.transforms) {
      if (transform.kind === 'strip') {
        if (result.startsWith(transform.leading)) {
          result = result.slice(transform.leading.length);
        }
        if (result.endsWith(transform.trailing)) {
          result = result.slice(0, -transform.trailing.length);
        }
      }
    }
    return result;
  });

  return `${template.prefix}${parts.join(template.joinSeparator)}-${contentHash}.js`;
}

/**
 * Extract all captures from repeated group pattern
 * @param {string} pattern - Regex pattern with repeated group like (sec-[^/]+/)+
 * @param {string} path - Path to match
 * @returns {string[]}
 */
export function extractPathCaptures(pattern, path) {
  // Find the capture group pattern
  const groupMatch = pattern.match(/\(([^)]+)\)\+/);
  if (!groupMatch) {
    const match = path.match(new RegExp(pattern));
    return match ? match.slice(1) : [];
  }

  const groupPattern = groupMatch[1];

  // Find prefix and suffix
  const prefixMatch = pattern.match(/^([^(]+)\(/);
  const prefix = prefixMatch ? prefixMatch[1] : '';

  const suffixMatch = pattern.match(/\)\+(.+)$/);
  const suffix = suffixMatch ? suffixMatch[1] : '';

  // Determine search bounds
  let start = 0;
  if (prefix) {
    const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefixRegex = new RegExp('^' + escaped);
    const prefixPathMatch = path.match(prefixRegex);
    if (prefixPathMatch) start = prefixPathMatch[0].length;
  }

  let end = path.length;
  if (suffix) {
    const escaped = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const suffixRegex = new RegExp(escaped + '$');
    const suffixPathMatch = path.match(suffixRegex);
    if (suffixPathMatch?.index != null) end = suffixPathMatch.index;
  }

  // Extract matches from middle portion
  const middle = path.slice(start, end);
  const captures = [];
  const captureRegex = new RegExp(groupPattern, 'g');
  let captureMatch;
  while ((captureMatch = captureRegex.exec(middle)) !== null) {
    captures.push(captureMatch[0]);
  }

  return captures;
}
