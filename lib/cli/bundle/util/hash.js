import { createHash } from 'node:crypto';

/**
 * Compute SHA-256 hash of content, truncated to 8 hex characters
 *
 * @param {string | Buffer} content
 * @returns {string}
 */
export function hash(content) {
  return createHash('sha256')
    .update(content)
    .digest('hex')
    .slice(0, 8);
}

/**
 * @param {string} base - Filename without extension
 * @param {string} contentHash - Content hash
 * @param {string} ext - Extension including dot
 * @returns {string}
 */
export function hashedName(base, contentHash, ext) {
  return `${base}-${contentHash}${ext}`;
}
