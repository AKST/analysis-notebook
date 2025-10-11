/**
 * @import { E } from '../type.ts'
 */
import { frag as _frag } from '../core/render.js';

/**
 * @param {E.Item[]} headers
 * @param {E.Item[][]} rows
 * @param {{
 *   className?: string,
 *   heading?: string,
 *   caption?: E.Item,
 *   headerRows?: [number, E.Item[]][],
 *   firstColumnHeader?: boolean
 *   style?: string,
 * }} [options={}]
 * @returns {E.Item}
 */
export const table = (headers, rows, {
  heading,
  headerRows = [],
  caption,
  firstColumnHeader: firstColumnHeader = false,
  ...cfg
} = {}) => {
  const colSpan = headers.length.toString();

  /** @param {number} index @returns {E.Item} */
  const renderHeaderRow = (index) => {
    const header = headerRows.find(item => item[0] === index);
    if (header == null) return undefined;
    return ['tr', [['th', { colSpan }, header[1]]]];
  };

  /** @param {E.Item[]} tableRow @param {number} index @returns {E.Item[]} */
  const mapRows = (tableRow, index) => ([
    renderHeaderRow(index),
    ['tr', tableRow.map((td, i) => [
      i === 0 && firstColumnHeader ? 'th' : 'td',
      null,
      [td],
    ])],
  ]);

  return ['table', cfg, [
    heading && ['caption', { className: 'headingCap' }, [heading]],
    caption && ['caption', { className: 'footerCap' }, [caption]],
    ['thead', [['tr', headers.map(td => ['th', {}, [td]])]]],
    ['tbody', rows.flatMap(mapRows)],
  ]];
}


