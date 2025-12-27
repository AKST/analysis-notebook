/**
 * @import { ImportMap } from '../types.ts'
 */

import { resolve } from '../util/resolve.js';

/**
 * Create a resolver using the merged import map
 * @param {ImportMap} importMap
 * @returns {(specifier: string, referrer: string) => string}
 */
export function createResolver(importMap) {
  return (specifier, referrer) => resolve(specifier, referrer, importMap);
}
