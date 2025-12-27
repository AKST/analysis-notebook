/**
 * @import {
 *   JsData,
 *   MetaResolveSite,
 *   HtmlPathSite,
 *   DynamicImportSite,
 *   WorkerSite,
 *   Span,
 * } from '../types.ts'
 */

import { parse } from '@swc/core';
import {
  hasAnnotations,
  parseDynamicImportAnnotations,
  hasHtmlPathDeclare,
  hasLookupEntrypoint,
} from './annotation.js';

/**
 * Parse JavaScript file for bundle-relevant data
 * @param {string} content
 * @returns {Promise<JsData>}
 */
export async function parseJs(content) {
  /** @type {MetaResolveSite[]} */
  const metaResolves = [];
  /** @type {HtmlPathSite[]} */
  const htmlPaths = [];
  /** @type {DynamicImportSite[]} */
  const dynamicImports = [];
  /** @type {WorkerSite[]} */
  const workers = [];
  let hasLookup = false;

  // Extract JSDoc comments with their end positions
  const comments = extractComments(content);

  // Parse with SWC
  const ast = await parse(content, {
    syntax: 'ecmascript',
    comments: false,
    target: 'es2024',
  });

  // SWC accumulates byte offsets globally even across separate parse calls
  // Calculate the base offset to normalize positions back to file-local
  const baseOffset = findBaseOffset(ast, content);

  // Walk the AST
  walk(ast.body, {
    content,
    comments,
    baseOffset,
    metaResolves,
    htmlPaths,
    dynamicImports,
    workers,
    onLookupEntrypoint: () => { hasLookup = true; },
  });

  return {
    metaResolves,
    htmlPaths,
    dynamicImports,
    workers,
    hasLookupEntrypoint: hasLookup,
  };
}

/**
 * Find the base offset used by SWC for this parse
 * SWC uses global byte offsets, so we calculate the offset to normalize
 * positions back to file-local.
 * @param {unknown} ast
 * @param {string} content
 * @returns {number}
 */
function findBaseOffset(ast, content) {
  const astObj = /** @type {{ span?: { start: number } }} */ (ast);
  if (!astObj.span) return 0;

  // Find first non-comment, non-whitespace position in source
  let localPos = 0;
  while (localPos < content.length) {
    // Skip whitespace
    if (/\s/.test(content[localPos])) {
      localPos++;
      continue;
    }

    // Skip block comments
    if (content.slice(localPos, localPos + 2) === '/*') {
      const end = content.indexOf('*/', localPos + 2);
      if (end === -1) break;
      localPos = end + 2;
      continue;
    }

    // Skip line comments
    if (content.slice(localPos, localPos + 2) === '//') {
      const end = content.indexOf('\n', localPos);
      if (end === -1) break;
      localPos = end + 1;
      continue;
    }

    break;
  }

  // SWC uses 1-indexed positions
  return astObj.span.start - localPos - 1;
}

/**
 * @typedef {object} WalkContext
 * @property {string} content
 * @property {Map<number, string>} comments - Comment text by end position
 * @property {number} baseOffset - SWC base offset to normalize positions
 * @property {MetaResolveSite[]} metaResolves
 * @property {HtmlPathSite[]} htmlPaths
 * @property {DynamicImportSite[]} dynamicImports
 * @property {WorkerSite[]} workers
 * @property {() => void} onLookupEntrypoint
 */

/**
 * Extract JSDoc block comments with bundle annotations
 * @param {string} content
 * @returns {Map<number, string>} Comment text keyed by end position
 */
function extractComments(content) {
  const comments = new Map();
  const regex = /\/\*\*[\s\S]*?\*\//g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const text = match[0];
    if (hasAnnotations(text)) {
      // Key by end position (byte offset where comment ends)
      comments.set(match.index + text.length, text);
    }
  }

  return comments;
}

/**
 * Find annotation comment preceding a position
 * @param {number} pos - SWC byte position (includes base offset)
 * @param {WalkContext} ctx
 * @returns {string | null}
 */
function findPrecedingComment(pos, ctx) {
  // Normalize position by subtracting SWC's base offset
  const normalizedPos = pos - ctx.baseOffset;

  // Look for comments that end within ~200 chars before this position
  for (const [endPos, text] of ctx.comments) {
    if (endPos < normalizedPos && normalizedPos - endPos < 200) {
      return text;
    }
  }
  return null;
}

/**
 * Walk AST nodes
 * @param {unknown} node
 * @param {WalkContext} ctx
 */
function walk(node, ctx) {
  if (node == null || typeof node !== 'object') return;

  if (Array.isArray(node)) {
    for (const item of node) walk(item, ctx);
    return;
  }

  const n = /** @type {Record<string, unknown>} */ (node);

  if (n.type === 'CallExpression') {
    handleCall(n, ctx);
  } else if (n.type === 'NewExpression') {
    handleNew(n, ctx);
  } else if (n.type === 'StringLiteral') {
    handleString(n, ctx);
  }

  // Recurse into all properties
  for (const key of Object.keys(n)) {
    if (key === 'span' || key === 'type') continue;
    walk(n[key], ctx);
  }
}

/**
 * Handle call expressions
 * @param {Record<string, unknown>} node
 * @param {WalkContext} ctx
 */
function handleCall(node, ctx) {
  const callee = /** @type {Record<string, unknown> | undefined} */ (node.callee);
  const args = /** @type {Array<Record<string, unknown>> | undefined} */ (node.arguments);
  const span = /** @type {{ start: number, end: number } | undefined} */ (node.span);

  if (!callee || !span) return;

  // Dynamic import()
  if (callee.type === 'Import') {
    const comment = findPrecedingComment(span.start, ctx);
    const annotations = comment ? parseDynamicImportAnnotations(comment) : {};

    ctx.dynamicImports.push({
      span: { start: span.start, end: span.end },
      annotations,
    });
    return;
  }

  // import.meta.resolve()
  if (callee.type === 'MemberExpression') {
    const obj = /** @type {Record<string, unknown> | undefined} */ (callee.object);
    const prop = /** @type {Record<string, unknown> | undefined} */ (callee.property);

    if (
      obj?.type === 'MetaProperty' &&
      prop?.type === 'Identifier' &&
      /** @type {{ value?: string }} */ (prop).value === 'resolve'
    ) {
      // Check for lookup-entrypoint annotation
      const comment = findPrecedingComment(span.start, ctx);
      if (comment && hasLookupEntrypoint(comment)) {
        ctx.onLookupEntrypoint();
      }

      // Extract string argument
      if (args && args.length > 0) {
        const arg = unwrapExpression(args[0]);
        if (arg.type === 'StringLiteral') {
          const value = /** @type {{ value?: string }} */ (arg).value;
          const argSpan = /** @type {{ start: number, end: number } | undefined} */ (arg.span);
          if (value && argSpan) {
            ctx.metaResolves.push({
              specifier: value,
              span: { start: argSpan.start, end: argSpan.end },
            });
          }
        }
      }
    }
  }
}

/**
 * Handle new expressions (new Worker())
 * @param {Record<string, unknown>} node
 * @param {WalkContext} ctx
 */
function handleNew(node, ctx) {
  const callee = /** @type {Record<string, unknown> | undefined} */ (node.callee);
  const args = /** @type {Array<Record<string, unknown>> | undefined} */ (node.arguments);
  const span = /** @type {{ start: number, end: number } | undefined} */ (node.span);

  if (!callee || !span) return;

  if (callee.type === 'Identifier' && /** @type {{ value?: string }} */ (callee).value === 'Worker') {
    let src = null;
    /** @type {Span | null} */
    let srcSpan = null;

    if (args && args.length > 0) {
      const arg = unwrapExpression(args[0]);
      if (arg.type === 'StringLiteral') {
        src = /** @type {{ value?: string }} */ (arg).value || null;
        const argSpan = /** @type {{ start: number, end: number } | undefined} */ (arg.span);
        if (argSpan) srcSpan = { start: argSpan.start, end: argSpan.end };
      }
    }

    ctx.workers.push({ src, span: srcSpan });
  }
}

/**
 * Handle string literals (for html-path:declare)
 * @param {Record<string, unknown>} node
 * @param {WalkContext} ctx
 */
function handleString(node, ctx) {
  const span = /** @type {{ start: number, end: number } | undefined} */ (node.span);
  if (!span) return;

  const comment = findPrecedingComment(span.start, ctx);
  if (comment && hasHtmlPathDeclare(comment)) {
    const value = /** @type {{ value?: string }} */ (node).value;
    if (value) {
      ctx.htmlPaths.push({
        value,
        span: { start: span.start, end: span.end },
      });
    }
  }
}

/**
 * Unwrap expression wrapper if present
 * @param {Record<string, unknown>} node
 * @returns {Record<string, unknown>}
 */
function unwrapExpression(node) {
  const expr = /** @type {Record<string, unknown> | undefined} */ (node.expression);
  return expr || node;
}
