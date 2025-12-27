/**
 * @import { ImportMap } from '../types.ts'
 */

import { dirname, join } from 'node:path';

/**
 * Resolve an import specifier to a file path
 * @param {string} specifier - The import specifier
 * @param {string} referrer - The path of the referencing file
 * @param {ImportMap} importMap
 * @returns {string} Resolved path (normalized, no ./ prefix)
 */
export function resolve(specifier, referrer, importMap) {
  // Relative paths
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    const dir = dirname(referrer);
    return join(dir, specifier).replace(/\\/g, '/');
  }

  // Try import map resolution
  const mapped = resolveWithImportMap(specifier, referrer, importMap);
  if (mapped !== specifier) {
    return mapped.replace(/^\.\//, '');
  }

  return specifier;
}

/**
 * Resolve specifier to absolute path
 * @param {string} specifier
 * @param {string} referrer
 * @param {ImportMap} importMap
 * @param {string} root
 * @returns {string | null} Absolute path or null if external
 */
export function resolveAbsolute(specifier, referrer, importMap, root) {
  const resolved = resolve(specifier, referrer, importMap);

  // If unchanged and not relative, it's external
  if (resolved === specifier && !specifier.startsWith('.') && !specifier.startsWith('/')) {
    return null;
  }

  // Join with root if relative
  if (!resolved.startsWith('/')) {
    return join(root, resolved);
  }

  return resolved;
}

/**
 * Resolve specifier using import map (scopes + imports)
 * @param {string} specifier
 * @param {string} referrer
 * @param {ImportMap} importMap
 * @returns {string}
 */
function resolveWithImportMap(specifier, referrer, importMap) {
  // Check scopes first (more specific)
  if (importMap.scopes) {
    for (const [scope, mappings] of Object.entries(importMap.scopes)) {
      const normalizedScope = scope.replace(/^\.\//, '');
      const normalizedReferrer = referrer.replace(/^\.\//, '');
      if (normalizedReferrer.startsWith(normalizedScope)) {
        const resolved = tryResolve(specifier, mappings);
        if (resolved) return resolved;
      }
    }
  }

  // Then top-level imports
  if (importMap.imports) {
    const resolved = tryResolve(specifier, importMap.imports);
    if (resolved) return resolved;
  }

  return specifier;
}

/**
 * Try to resolve specifier using mappings
 * @param {string} specifier
 * @param {Record<string, string>} mappings
 * @returns {string | null}
 */
export function tryResolve(specifier, mappings) {
  // Exact match
  if (specifier in mappings) {
    return mappings[specifier];
  }

  // Prefix match (for paths ending with /)
  for (const [prefix, target] of Object.entries(mappings)) {
    if (prefix.endsWith('/') && specifier.startsWith(prefix)) {
      return target + specifier.slice(prefix.length);
    }
  }

  return null;
}

/**
 * Build inverse mapping: file path prefix -> alias prefix
 * Used for lookup entrypoint generation
 * @param {ImportMap} importMap
 * @returns {Array<[string, string]>}
 */
export function buildInverseAliasMap(importMap) {
  /** @type {Array<[string, string]>} */
  const result = [];

  if (importMap.imports) {
    for (const [alias, path] of Object.entries(importMap.imports)) {
      if (alias.endsWith('/') && typeof path === 'string') {
        const normalizedPath = path.replace(/^\.\//, '');
        result.push([normalizedPath, alias]);
      }
    }
  }

  if (importMap.scopes) {
    for (const mappings of Object.values(importMap.scopes)) {
      for (const [alias, path] of Object.entries(mappings)) {
        if (alias.endsWith('/') && typeof path === 'string') {
          const normalizedPath = path.replace(/^\.\//, '');
          if (!result.some(([p]) => p === normalizedPath)) {
            result.push([normalizedPath, alias]);
          }
        }
      }
    }
  }

  return result;
}
