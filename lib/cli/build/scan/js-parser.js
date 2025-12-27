/**
 * @import {
 *   JsScanData,
 *   MetaResolveSite,
 *   DynamicImportSite,
 *   WorkerCreationSite,
 *   HtmlPathDeclareSite,
 *   LookupEntrypointSite,
 *   SourceLocation,
 *   BundleAnnotation,
 * } from '../types.ts'
 */

import { parse } from '@swc/core';
import { parseAnnotations, hasBundleAnnotations } from './annotation.js';

/**
 * Parse a JavaScript file for bundle-relevant data
 * @param {string} content - JS file content
 * @param {string} filePath - Path to the file (for error messages)
 * @returns {Promise<JsScanData>}
 */
export async function parseJs(content, filePath) {
  /** @type {MetaResolveSite[]} */
  const metaResolves = [];
  /** @type {DynamicImportSite[]} */
  const dynamicImports = [];
  /** @type {WorkerCreationSite[]} */
  const workers = [];
  /** @type {HtmlPathDeclareSite[]} */
  const htmlPathDeclares = [];
  /** @type {LookupEntrypointSite[]} */
  const lookupEntrypoints = [];

  // Extract JSDoc comments with their positions using regex
  // SWC doesn't reliably return comments, so we extract them ourselves
  const commentsMap = extractComments(content);

  // Parse with SWC
  const ast = await parse(content, {
    syntax: 'ecmascript',
    comments: false,
    target: 'es2024',
  });

  // SWC uses global byte offsets when parsing multiple files in parallel,
  // so we need to calculate the base offset to normalize positions back to file-local
  const baseOffset = findBaseOffset(ast, content);

  // Walk the AST
  walkAst(ast.body, {
    commentsMap,
    content,
    metaResolves,
    dynamicImports,
    workers,
    htmlPathDeclares,
    lookupEntrypoints,
    baseOffset,
  });

  return {
    metaResolves,
    dynamicImports,
    workers,
    htmlPathDeclares,
    lookupEntrypoints,
  };
}

/**
 * Extract JSDoc block comments with bundle annotations
 * @param {string} content
 * @returns {Map<number, { text: string, annotations: BundleAnnotation[] }>}
 */
function extractComments(content) {
  /** @type {Map<number, { text: string, annotations: BundleAnnotation[] }>} */
  const commentsMap = new Map();

  // Match JSDoc-style block comments: /** ... */
  const commentRegex = /\/\*\*[\s\S]*?\*\//g;
  let match;

  while ((match = commentRegex.exec(content)) !== null) {
    const text = match[0];
    if (hasBundleAnnotations(text)) {
      const annotations = parseAnnotations(text);
      if (annotations.length > 0) {
        // Store by end position (index + length)
        const endPos = match.index + text.length;
        commentsMap.set(endPos, { text, annotations });
      }
    }
  }

  return commentsMap;
}

/**
 * @typedef {object} WalkContext
 * @property {Map<number, { text: string, annotations: BundleAnnotation[] }>} commentsMap
 * @property {string} content
 * @property {MetaResolveSite[]} metaResolves
 * @property {DynamicImportSite[]} dynamicImports
 * @property {WorkerCreationSite[]} workers
 * @property {HtmlPathDeclareSite[]} htmlPathDeclares
 * @property {LookupEntrypointSite[]} lookupEntrypoints
 * @property {number} baseOffset
 */

/**
 * Find the base offset used by SWC for this parse
 * SWC uses global byte offsets when parsing multiple files in parallel,
 * so we need to calculate the offset to normalize positions back to file-local.
 *
 * The module's span.start points to the first non-comment content.
 * We find where that content is in the source and calculate the difference.
 *
 * @param {unknown} ast
 * @param {string} content
 * @returns {number}
 */
function findBaseOffset(ast, content) {
  const astObj = /** @type {{ span?: { start: number } }} */ (ast);
  if (!astObj.span) return 0;

  // The ast.span.start is SWC's position for the first statement
  // We need to find where that first statement starts in the actual source
  // by skipping leading comments and whitespace

  // Find the first non-comment, non-whitespace position in the source
  let localPos = 0;
  while (localPos < content.length) {
    // Skip whitespace
    if (/\s/.test(content[localPos])) {
      localPos++;
      continue;
    }

    // Skip block comments
    if (content.slice(localPos, localPos + 2) === '/*') {
      const endComment = content.indexOf('*/', localPos + 2);
      if (endComment === -1) break;
      localPos = endComment + 2;
      continue;
    }

    // Skip line comments
    if (content.slice(localPos, localPos + 2) === '//') {
      const endLine = content.indexOf('\n', localPos);
      if (endLine === -1) break;
      localPos = endLine + 1;
      continue;
    }

    // Found first non-comment content
    break;
  }

  // Base offset is the difference between SWC's position and the local position
  // SWC uses 1-indexed positions, so adjust by 1
  return astObj.span.start - localPos - 1;
}

/**
 * Walk AST nodes recursively
 * @param {unknown} node
 * @param {WalkContext} ctx
 */
function walkAst(node, ctx) {
  if (node == null || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      walkAst(item, ctx);
    }
    return;
  }

  const n = /** @type {Record<string, unknown>} */ (node);

  // Check for CallExpression
  if (n.type === 'CallExpression') {
    handleCallExpression(n, ctx);
  }

  // Check for NewExpression (for new Worker())
  if (n.type === 'NewExpression') {
    handleNewExpression(n, ctx);
  }

  // Check for StringLiteral with html-path-declare annotation
  if (n.type === 'StringLiteral') {
    handleStringLiteral(n, ctx);
  }

  // Recurse into all properties
  for (const key of Object.keys(n)) {
    if (key === 'span' || key === 'type') continue;
    walkAst(n[key], ctx);
  }
}

/**
 * Handle call expressions (import(), import.meta.resolve())
 * @param {Record<string, unknown>} node
 * @param {WalkContext} ctx
 */
function handleCallExpression(node, ctx) {
  const callee = /** @type {Record<string, unknown> | undefined} */ (node.callee);
  const args = /** @type {Array<Record<string, unknown>> | undefined} */ (node.arguments);
  const span = /** @type {{ start: number, end: number } | undefined} */ (node.span);

  if (!callee || !span) return;

  // Dynamic import: import(...)
  if (callee.type === 'Import') {
    const annotations = findPrecedingAnnotations(span.start, ctx);
    ctx.dynamicImports.push({
      location: getLocation(span.start, ctx),
      annotations,
    });

    // Check for html-path-declare on the argument
    if (args && args.length > 0) {
      checkForHtmlPathDeclare(args[0], span.start, ctx);
    }
    return;
  }

  // import.meta.resolve(...)
  if (callee.type === 'MemberExpression') {
    const obj = /** @type {Record<string, unknown> | undefined} */ (callee.object);
    const prop = /** @type {Record<string, unknown> | undefined} */ (callee.property);

    if (
      obj?.type === 'MetaProperty' &&
      prop?.type === 'Identifier' &&
      /** @type {{ value?: string }} */ (prop).value === 'resolve'
    ) {
      // Check for lookup-entrypoint annotation
      const annotations = findPrecedingAnnotations(span.start, ctx);
      const hasLookupEntrypoint = annotations.some(a => a.kind === 'lookup-entrypoint');

      if (hasLookupEntrypoint) {
        ctx.lookupEntrypoints.push({
          location: getLocation(span.start, ctx),
        });
      }

      // Extract the string argument if present (for regular meta resolves)
      if (args && args.length > 0) {
        const arg = args[0];
        const expr = /** @type {Record<string, unknown> | undefined} */ (arg.expression);
        const actualArg = expr || arg;

        if (actualArg.type === 'StringLiteral') {
          const value = /** @type {{ value?: string }} */ (actualArg).value;
          if (value) {
            ctx.metaResolves.push({
              path: value,
              location: getLocation(span.start, ctx),
            });
          }
        }
      }
    }
  }
}

/**
 * Handle new expressions (new Worker(...))
 * @param {Record<string, unknown>} node
 * @param {WalkContext} ctx
 */
function handleNewExpression(node, ctx) {
  const callee = /** @type {Record<string, unknown> | undefined} */ (node.callee);
  const args = /** @type {Array<Record<string, unknown>> | undefined} */ (node.arguments);
  const span = /** @type {{ start: number, end: number } | undefined} */ (node.span);

  if (!callee || !span) return;

  // Check if it's new Worker(...)
  if (callee.type === 'Identifier') {
    const name = /** @type {{ value?: string }} */ (callee).value;
    if (name === 'Worker') {
      const annotations = findPrecedingAnnotations(span.start, ctx);

      let src = null;
      if (args && args.length > 0) {
        const arg = args[0];
        const expr = /** @type {Record<string, unknown> | undefined} */ (arg.expression);
        const actualArg = expr || arg;

        if (actualArg.type === 'StringLiteral') {
          src = /** @type {{ value?: string }} */ (actualArg).value || null;
        }
      }

      ctx.workers.push({
        src,
        location: getLocation(span.start, ctx),
        annotations,
      });
    }
  }
}

/**
 * Handle string literals that might have html-path-declare annotation
 * @param {Record<string, unknown>} node
 * @param {WalkContext} ctx
 */
function handleStringLiteral(node, ctx) {
  const span = /** @type {{ start: number } | undefined} */ (node.span);
  if (!span) return;

  const annotations = findPrecedingAnnotations(span.start, ctx);
  const hasHtmlPath = annotations.some(a => a.kind === 'html-path-declare');

  if (hasHtmlPath) {
    const value = /** @type {{ value?: string }} */ (node).value;
    if (value) {
      ctx.htmlPathDeclares.push({
        value,
        location: getLocation(span.start, ctx),
      });
    }
  }
}

/**
 * Check if a node has an html-path-declare annotation
 * @param {Record<string, unknown>} node
 * @param {number} nodeStart
 * @param {WalkContext} ctx
 */
function checkForHtmlPathDeclare(node, nodeStart, ctx) {
  const annotations = findPrecedingAnnotations(nodeStart, ctx);
  const hasHtmlPath = annotations.some(a => a.kind === 'html-path-declare');

  if (hasHtmlPath) {
    const expr = /** @type {Record<string, unknown> | undefined} */ (node.expression);
    const actualNode = expr || node;

    if (actualNode.type === 'StringLiteral') {
      const value = /** @type {{ value?: string }} */ (actualNode).value;
      const span = /** @type {{ start: number } | undefined } */ (actualNode.span);
      if (value && span) {
        ctx.htmlPathDeclares.push({
          value,
          location: getLocation(span.start, ctx),
        });
      }
    }
  }
}

/**
 * Find annotations from comments preceding a position
 * @param {number} pos - SWC span position (may include base offset)
 * @param {WalkContext} ctx
 * @returns {BundleAnnotation[]}
 */
function findPrecedingAnnotations(pos, ctx) {
  // Normalize position by subtracting SWC's base offset
  const normalizedPos = pos - ctx.baseOffset;

  // Look for comments that end before this position (within a reasonable range)
  // Comments should be within ~200 chars before the node
  for (const [endPos, data] of ctx.commentsMap) {
    if (endPos < normalizedPos && normalizedPos - endPos < 200) {
      return data.annotations;
    }
  }
  return [];
}

/**
 * Convert byte offset to line/column
 * @param {number} offset - SWC span position (includes base offset)
 * @param {WalkContext} ctx
 * @returns {SourceLocation}
 */
function getLocation(offset, ctx) {
  // Normalize position by subtracting SWC's base offset
  const normalizedOffset = offset - ctx.baseOffset;

  let line = 1;
  let column = 0;

  for (let i = 0; i < normalizedOffset && i < ctx.content.length; i++) {
    if (ctx.content[i] === '\n') {
      line++;
      column = 0;
    } else {
      column++;
    }
  }

  return { line, column };
}
