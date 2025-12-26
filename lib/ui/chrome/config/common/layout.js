/**
 * @import { E } from '@base/dsl-dom/type.ts';
 * @import { KnobElement } from '../type.ts';
 */
import * as doc from '@base/dsl-dom/helper/html.js';

/**
 * @param {KnobElement[]} children
 * @returns {E.Item[]}
 */
export function formatChildren(children) {
  return children.map(c =>
    doc.div.css({ gridColumn: `span ${c.gridColumn}` }).c(c)
  )
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
