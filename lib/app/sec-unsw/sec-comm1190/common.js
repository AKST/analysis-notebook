/**
 * @import { E } from '../../prelude-type.ts';
 */
import { doc } from '../../prelude.js';

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
export const ul = (...items) => doc.ul({
  className: 'no-item-padding',
  style: 'padding-left: 16px',
}).c(...items.map(p => doc.li.c(p)));

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
export const ol = (...items) => doc.ol({
  className: 'no-item-padding',
  style: 'padding-left: 32px',
}).c(...items.map(p => doc.li.c(p)));

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
export const container = (...items) => doc.div({
  className: 'container',
}).c(...items);

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
export const twoColumns = (...items) => doc.div({
  className: 'c2',
}).c(...items);

/**
 * @param {{
 *   outcomes: Record<string, Record<string, E.Item[]>>,
 *   rowColor: Record<string, string>,
 *   rowHeader?: { name: string, color?: string },
 *   colColor: Record<string, string>,
 *   colHeader?: { name: string, color?: string },
 *   footer?: E.Item[],
 * }} cfg
 * @returns {E.Item}
 */
export const crossSectionTable = ({
  outcomes,
  rowColor,
  rowHeader: mainRowHeader,
  colColor,
  colHeader,
  footer,
}) => {
  const rowHeaders = Object.keys(outcomes);
  const colHeaders = Object.keys(outcomes[rowHeaders[0]]);

  /** @param {number | string} text @param {string | undefined} color @returns {E.Item} */
  const maybeWrapInFont = (text, color) => color != null
    ? doc.font({ color }).c(text)
    : text;

  /** @param {number | string} text @returns {E.Item} */
  const wRowColor = text => maybeWrapInFont(text, rowColor[text]);

  /** @param {number | string} text @returns {E.Item} */
  const wColColor = text => maybeWrapInFont(text, colColor[text]);

  /** @type {E.Item} */
  const colHeaderSpace = doc.th.void({
    colSpan: mainRowHeader == null ? 1 : 2,
    rowSpan: colHeader == null ? 1 : 2,
  })

  return doc.table({ className: 'diagram-table' }).c(
    doc.thead(
      colHeader == null ? null : (
        doc.tr(
          colHeaderSpace,
          doc.th({ colSpan: colHeaders.length }).c(
            maybeWrapInFont(colHeader.name, colHeader.color),
          ),
        )
      ),
      doc.tr(
        colHeader == null ? colHeaderSpace : null,
        ...colHeaders.map(colHeader => (
          /** @type {E.Item} */
          (doc.th({ colSpan: 1 }).c(wColColor(colHeader)))
        )),
      ),
    ),
    doc.tbody(
      ...rowHeaders.map((rowHeader, index) => (
        /** @type {E.Item} */
        (doc.tr(
          mainRowHeader == null || (index !== 0) ? null : (
            doc.th({ rowSpan: rowHeaders.length }).c(
              maybeWrapInFont(mainRowHeader.name, mainRowHeader.color),
            )
          ),
          doc.th.c(wRowColor(rowHeader)),
          ...colHeaders.map(colHeader => {
            return doc.td.c(...outcomes[rowHeader][colHeader]);
          }),
        ))
      ))
    ),
    footer && (
      doc.caption({ align: 'bottom' }).c(...footer)
    ),
  );
};

