/**
 * @import { E } from '@base/dsl-dom/type.ts';
 *
 * @typedef {'slim' | 'mobile' | 'desktop'} Layout
 */
import * as doc from '@base/dsl-dom/helper/html.js';

/**
 * @param {...E.Item} items
 */
export const container = (...items) =>
  doc.div({ className: 'container pre--container' }).c(...items);

/**
 * @param {E.Item} a
 * @param {E.Item} b
 */
export const twoColumns = (a, b) =>
  doc.div({ className: 'c2 pre--c2' }).c(a, b);

/**
 * @param {E.Item} a
 * @param {E.Item} b
 */
export const twoThree = (a, b) =>
  doc.div({ className: 'c2 twoThree pre--c2 pre--two-three' }).c(a, b);


/**
 * @param {E.Item} body
 * @param {number} f
 */
export const fontsize = (body, f) =>
  doc.div.css({ fontSize: `${f}px` }).c(body);

/**
 * @param {E.Item[]} items
 * @param {{
 *   columns: Partial<Record<Layout, string>>,
 *   align?: string,
 * }} config
 */
export const responsiveGridAutoRow = (items, {
  columns: {
    slim,
    mobile,
    desktop,
  },
  align,
}) => (
  doc.div({
    className: 'grid-responsive-row pre--grid-responsive-row',
  }).cssVar({
    '--grid-responsive-row-slim-columns': slim ?? mobile ?? '1fr',
    '--grid-responsive-row-mobile-columns': mobile ?? slim ?? '1fr',
    '--grid-responsive-row-desktop-columns': desktop ?? `repeat(auto, ${items.length})`,
  }).css(align ? { alignItems: align } : {}).c(...items)
);

