/**
 * @import {
 *   BundleAnnotation,
 *   AnnotationType,
 *   PathConstraintAnnotation,
 *   AssetNameAnnotation,
 *   ImplicitBundleGenerationAnnotation,
 *   HtmlPathDeclareAnnotation,
 * } from '../types.ts'
 */

import { parseAssetNameTemplate } from './asset-name.js';

const ANNOTATION_PREFIX = '@akst::bundle::';

/**
 * Parse annotations from a JSDoc comment block
 * @param {string} comment - The comment text (without leading/trailing markers)
 * @returns {BundleAnnotation[]}
 */
export function parseAnnotations(comment) {
  /** @type {BundleAnnotation[]} */
  const annotations = [];

  const lines = comment.split('\n');

  for (const line of lines) {
    const trimmed = line.trim().replace(/^\*\s*/, '');

    if (!trimmed.startsWith(ANNOTATION_PREFIX)) {
      continue;
    }

    const annotation = parseAnnotationLine(trimmed);
    if (annotation) {
      annotations.push(annotation);
    }
  }

  return annotations;
}

/**
 * Parse a single annotation line
 * @param {string} line - Line starting with @akst::bundle::
 * @returns {BundleAnnotation | null}
 */
function parseAnnotationLine(line) {
  const afterPrefix = line.slice(ANNOTATION_PREFIX.length);

  // dyn-import annotations
  if (afterPrefix.startsWith('dyn-import:')) {
    return parseDynImportOrWorkerAnnotation(afterPrefix.slice('dyn-import:'.length), 'dyn-import');
  }

  // worker annotations
  if (afterPrefix.startsWith('worker:')) {
    return parseDynImportOrWorkerAnnotation(afterPrefix.slice('worker:'.length), 'worker');
  }

  // html-path:declare
  if (afterPrefix === 'html-path:declare') {
    return /** @type {HtmlPathDeclareAnnotation} */ ({
      kind: 'html-path-declare',
    });
  }

  // resolve:lookup-entrypoint
  if (afterPrefix === 'resolve:lookup-entrypoint') {
    return /** @type {import('../types.ts').LookupEntrypointAnnotation} */ ({
      kind: 'lookup-entrypoint',
    });
  }

  return null;
}

/**
 * Parse dyn-import or worker annotation
 * @param {string} content - Content after "dyn-import:" or "worker:"
 * @param {AnnotationType} type
 * @returns {BundleAnnotation | null}
 */
function parseDynImportOrWorkerAnnotation(content, type) {
  // path-constraint {pattern}
  if (content.startsWith('path-constraint')) {
    const match = content.match(/^path-constraint\s*\{([^}]+)\}/);
    if (match) {
      return /** @type {PathConstraintAnnotation} */ ({
        kind: 'path-constraint',
        type,
        pattern: match[1].trim(),
      });
    }
  }

  // asset-name {template}
  if (content.startsWith('asset-name')) {
    const match = content.match(/^asset-name\s*\{([^}]+)\}/);
    if (match) {
      const template = parseAssetNameTemplate(match[1].trim());
      if (template) {
        return /** @type {AssetNameAnnotation} */ ({
          kind: 'asset-name',
          type,
          template,
        });
      }
    }
  }

  // implict-bundle-generation (note: typo preserved from design doc)
  if (content === 'implict-bundle-generation' || content === 'implicit-bundle-generation') {
    return /** @type {ImplicitBundleGenerationAnnotation} */ ({
      kind: 'implicit-bundle-generation',
      type,
    });
  }

  return null;
}

/**
 * Check if a comment contains any bundle annotations
 * @param {string} comment
 * @returns {boolean}
 */
export function hasBundleAnnotations(comment) {
  return comment.includes(ANNOTATION_PREFIX);
}
