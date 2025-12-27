/**
 * @import { AssetNameTemplate, AssetNameTransform } from '../types.ts'
 */

/**
 * Parse an asset name template string
 * Example: "app-[strip:sec-:/][join:-]"
 *
 * @param {string} template
 * @returns {AssetNameTemplate | null}
 */
export function parseAssetNameTemplate(template) {
  /** @type {AssetNameTransform[]} */
  const transforms = [];
  let prefix = '';
  let joinSeparator = '-'; // default

  let i = 0;

  // Extract prefix (everything before first [)
  const firstBracket = template.indexOf('[');
  if (firstBracket === -1) {
    // No transforms, just a prefix
    return {
      prefix: template,
      transforms: [],
      joinSeparator: '-',
    };
  }

  prefix = template.slice(0, firstBracket);
  i = firstBracket;

  // Parse transforms
  while (i < template.length) {
    if (template[i] !== '[') {
      i++;
      continue;
    }

    const closeIdx = template.indexOf(']', i);
    if (closeIdx === -1) {
      return null; // malformed
    }

    const content = template.slice(i + 1, closeIdx);
    i = closeIdx + 1;

    // Parse transform
    if (content.startsWith('strip:')) {
      const args = content.slice('strip:'.length).split(':');
      if (args.length >= 2) {
        transforms.push({
          kind: 'strip',
          leading: args[0],
          trailing: args[1],
        });
      }
    } else if (content.startsWith('join:')) {
      joinSeparator = content.slice('join:'.length);
    }
  }

  return {
    prefix,
    transforms,
    joinSeparator,
  };
}

/**
 * Apply an asset name template to path captures
 * @param {AssetNameTemplate} template
 * @param {string[]} captures - Captured groups from path-constraint regex
 * @param {string} hash - Content hash
 * @returns {string}
 */
export function applyAssetNameTemplate(template, captures, hash) {
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

  return `${template.prefix}${parts.join(template.joinSeparator)}-${hash}.js`;
}
