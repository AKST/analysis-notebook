/**
 * Hash utilities for the build system.
 * Hashes are computed during scanning, this module provides
 * utilities for working with hashes in path generation.
 */

import { createHash } from 'node:crypto';

/**
 * Compute a content hash (SHA-256, truncated to 8 hex chars)
 * @param {string | Buffer} content
 * @returns {string}
 */
export function computeHash(content) {
  return createHash('sha256')
    .update(content)
    .digest('hex')
    .slice(0, 8);
}

/**
 * Generate a hashed filename
 * @param {string} basename - Base name without extension
 * @param {string} hash - Content hash
 * @param {string} ext - File extension (with dot)
 * @returns {string}
 */
export function hashedFilename(basename, hash, ext) {
  return `${basename}-${hash}${ext}`;
}

/**
 * Extract the original filename from a hashed filename
 * @param {string} filename
 * @returns {{ basename: string, hash: string, ext: string } | null}
 */
export function parseHashedFilename(filename) {
  // Match pattern: name-hash.ext where hash is 8 hex chars
  const match = filename.match(/^(.+)-([a-f0-9]{8})(\.[^.]+)$/);
  if (!match) return null;

  return {
    basename: match[1],
    hash: match[2],
    ext: match[3],
  };
}
