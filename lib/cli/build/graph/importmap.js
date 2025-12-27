/**
 * @import { ImportMap, ScanResult, HtmlScannedFile } from '../types.ts'
 */

/**
 * Collect all importmaps from HTML files
 * @param {ScanResult} scanResult
 * @returns {Map<string, ImportMap>} Map of HTML path to its importmap
 */
export function collectImportmaps(scanResult) {
  /** @type {Map<string, ImportMap>} */
  const importmaps = new Map();

  for (const [path, file] of scanResult.files) {
    if (file.type === 'html' && file.data.importmap) {
      importmaps.set(path, file.data.importmap);
    }
  }

  return importmaps;
}

/**
 * Resolve a specifier using an importmap
 * @param {string} specifier - The import specifier
 * @param {string} referrer - The path of the referencing file
 * @param {ImportMap | null} importmap
 * @returns {string} The resolved path
 */
export function resolveWithImportmap(specifier, referrer, importmap) {
  if (!importmap) return specifier;

  // Check scopes first (more specific)
  if (importmap.scopes) {
    for (const [scope, mappings] of Object.entries(importmap.scopes)) {
      if (referrer.startsWith(scope.replace('./', ''))) {
        const resolved = tryResolve(specifier, mappings);
        if (resolved) return resolved;
      }
    }
  }

  // Then check top-level imports
  if (importmap.imports) {
    const resolved = tryResolve(specifier, importmap.imports);
    if (resolved) return resolved;
  }

  return specifier;
}

/**
 * Try to resolve a specifier using a mappings object
 * @param {string} specifier
 * @param {Record<string, string>} mappings
 * @returns {string | null}
 */
function tryResolve(specifier, mappings) {
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
 * Validate importmap consistency across files
 * @param {Map<string, ImportMap>} importmaps
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateImportmaps(importmaps) {
  /** @type {string[]} */
  const errors = [];

  // Check for conflicting mappings across importmaps
  // This is a simplified check - in practice we'd need to track
  // which files use which importmaps and check for conflicts
  // in overlapping scopes

  // For now, just validate that each importmap is structurally valid
  for (const [path, importmap] of importmaps) {
    if (importmap.imports) {
      for (const [key, value] of Object.entries(importmap.imports)) {
        if (typeof value !== 'string') {
          errors.push(`Invalid importmap in ${path}: import "${key}" has non-string value`);
        }
      }
    }

    if (importmap.scopes) {
      for (const [scope, mappings] of Object.entries(importmap.scopes)) {
        if (typeof mappings !== 'object' || mappings === null) {
          errors.push(`Invalid importmap in ${path}: scope "${scope}" has invalid mappings`);
          continue;
        }
        for (const [key, value] of Object.entries(mappings)) {
          if (typeof value !== 'string') {
            errors.push(`Invalid importmap in ${path}: scope "${scope}" import "${key}" has non-string value`);
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Merge multiple importmaps (later ones take precedence)
 * @param {ImportMap[]} importmaps
 * @returns {ImportMap}
 */
export function mergeImportmaps(importmaps) {
  /** @type {ImportMap} */
  const result = {};

  for (const map of importmaps) {
    if (map.imports) {
      result.imports = { ...result.imports, ...map.imports };
    }
    if (map.scopes) {
      result.scopes = result.scopes || {};
      for (const [scope, mappings] of Object.entries(map.scopes)) {
        result.scopes[scope] = { ...result.scopes[scope], ...mappings };
      }
    }
  }

  return result;
}
