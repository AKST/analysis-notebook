/**
 * @import { E } from '../../prelude-type.ts';
 */

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
export const ul = (...items) => ['ul', {
  className: 'no-item-padding',
  style: 'padding-left: 16px',
}, items.map(p => ['li', [p]])];

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
export const ol = (...items) => ['ol', {
  className: 'no-item-padding',
  style: 'padding-left: 32px',
}, items.map(p => ['li', [p]])];

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
export const container = (...items) => ['div', {
  className: 'container',
}, items];

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
export const twoColumns = (...items) => ['div', {
  className: 'c2',
}, items];

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
    ? ['font', { color }, [text]]
    : text;

  /** @param {number | string} text @returns {E.Item} */
  const wRowColor = text => maybeWrapInFont(text, rowColor[text]);

  /** @param {number | string} text @returns {E.Item} */
  const wColColor = text => maybeWrapInFont(text, colColor[text]);

  /** @type {E.Item} */
  const colHeaderSpace = ['th', {
    colSpan: mainRowHeader == null ? 1 : 2,
    rowSpan: colHeader == null ? 1 : 2,
  }]

  return ['table', { className: 'diagram-table' }, [
    ['thead', {}, [
      colHeader == null ? null : (
        ['tr', {}, [
          colHeaderSpace,
          ['th', { colSpan: colHeaders.length }, [
            maybeWrapInFont(colHeader.name, colHeader.color),
          ]],
        ]]
      ),
      ['tr', {}, [
        colHeader == null ? colHeaderSpace : null,
        ...colHeaders.map(colHeader => (
          /** @type {E.Item} */
          (['th', { colSpan: '1' }, [wColColor(colHeader)]])
        )),
      ]],
    ]],
    ['tbody', {}, rowHeaders.map((rowHeader, index) => (
      /** @type {E.Item} */
      (['tr', {}, [
        mainRowHeader == null || (index !== 0) ? null : (
          ['th', { rowSpan: rowHeaders.length }, [
            maybeWrapInFont(mainRowHeader.name, mainRowHeader.color),
          ]]
        ),
        ['th', {}, [wRowColor(rowHeader)]],
        ...colHeaders.map(colHeader => {
          return ['td', {}, outcomes[rowHeader][colHeader]];
        }),
      ]])
    ))],
    footer && (
      ['caption', { align: 'bottom' }, footer]
    ),
  ]];
};

