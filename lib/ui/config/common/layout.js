/**
 * @import { El } from '../../../base/render_ui/index.js';
 * @import { KnobElement } from '../type.ts';
 */

/**
 * @param {KnobElement[]} children
 * @returns {El[]}
 */
export function formatChildren(children) {
  return children.map(c => (
    ['div', { styles: { gridColumn: `span ${c.gridColumn}` } }, [c]]
  ))
}

export const subGridGap = [8, 8];

/**
 * @param {number | string} gridSize
 * @returns {Record<string, string | number[]>}
 */
export const configGridLayout = (gridSize) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
  gridGap: [12, 16],
  gridAutoRows: 'auto',
});
