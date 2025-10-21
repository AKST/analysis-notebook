/**
 * @import { E } from '../../dom_app/type.ts';
 *
 * @typedef {'slim' | 'mobile' | 'desktop'} Layout
 */

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
export const container = (...items) => ['div', { className: 'container' }, items]

/**
 * @param {E.Item} a
 * @param {E.Item} b
 * @returns {E.Item}
 */
export const twoColumns = (a, b) =>
  ['div', { className: 'c2' }, [a, b]]

/**
 * @param {E.Item} a
 * @param {E.Item} b
 * @returns {E.Item}
 */
export const twoThree = (a, b) =>
  ['div', { className: 'c2 twoThree' }, [a, b]]

/**
 * @param {E.Item} body
 * @param {number} f
 * @returns {E.Item}
 */
export const fontsize = (body, f) =>
  ['div', {style: `font-size: ${f}px` }, [body]];

/**
 * @param {E.Item[]} items
 * @param {{ columns: Partial<Record<Layout, string>> }} config
 * @returns {E.Item}
 */
export const responsiveGridAutoRow = (items, {
  columns: {
    slim,
    mobile,
    desktop,
  },
}) => (
  ['div', {
    className: 'grid-responsive-row',
    style: `
      --grid-responsive-row-slim-columns: ${slim ?? mobile ?? '1fr'};
      --grid-responsive-row-mobile-columns: ${mobile ?? slim ?? '1fr'};
      --grid-responsive-row-desktop-columns: ${desktop ?? `repeat(auto, ${items.length})`};
    `,
  }, items]
);

