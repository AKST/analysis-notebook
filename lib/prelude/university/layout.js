/**
 * @import { E } from '@base/dsl_dom/type.ts';
 *
 * @typedef {'slim' | 'mobile' | 'desktop'} Layout
 */
import * as doc from '@base/dsl_dom/helper/html.js';

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
export const container = (...items) =>
  doc.div({ className: 'container pre--container' }).c(...items);

/**
 * @param {E.Item} a
 * @param {E.Item} b
 * @returns {E.Item}
 */
export const twoColumns = (a, b) =>
  doc.div({ className: 'c2 pre--c2' }).c(a, b);

/**
 * @param {E.Item} a
 * @param {E.Item} b
 * @returns {E.Item}
 */
export const twoThree = (a, b) =>
  doc.div({ className: 'c2 twoThree pre--c2 pre--two-three' }).c(a, b);


/**
 * @param {E.Item} body
 * @param {number} f
 * @returns {E.Item}
 */
export const fontsize = (body, f) =>
  doc.div({ style: `font-size: ${f}px` }).c(body);

/**
 * @param {E.Item[]} items
 * @param {{
 *   columns: Partial<Record<Layout, string>>,
 *   align?: string,
 * }} config
 * @returns {E.Item}
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
    style: `
      --grid-responsive-row-slim-columns: ${slim ?? mobile ?? '1fr'};
      --grid-responsive-row-mobile-columns: ${mobile ?? slim ?? '1fr'};
      --grid-responsive-row-desktop-columns: ${desktop ?? `repeat(auto, ${items.length})`};
      ${align ? `align-items: ${align};` : ''}
    `,
  }).c(...items)
);

