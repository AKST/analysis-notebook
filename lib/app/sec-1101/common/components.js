/**
 * @import { E } from '../../prelude-type.ts';
 */

/**
 * @typedef {(
 *   | 'latin'
 *   | 'greek'
 *   | 'english'
 *   | 'middle english'
 *   | 'middle french'
 * )} Origin
 * @param {{
 *   word: string,
 *   source: Record<string, string>,
 *   meaning: (E.Atom | E.Item[])[],
 *   etymology: { origin: Origin[] },
 *   pronunciation: {
 *     accent: 'rp',
 *     syntax: string,
 *   },
 * }} cfg
 * @returns {E.Item}
 */
export function defineTerm(cfg) {
  /** @param {string} origin @returns {E.Item[]} */
  const prependSeperator = (origin) => [
    ['strong', ' < '],
    ['span', {}, origin],
  ];
  return ['quote', { className: 'word-def' }, [
    ['div', { className: 'word-def-word' }, [
      ['dfn', [['strong', cfg.word]]],
      ['span', { className: 'word-de-ipa' }, [
        ['span', { className: 'word-def-ipa-syn' }, [cfg.pronunciation.syntax]],
        ['sup', { className: 'word-def-ipa-act' }, ['(', cfg.pronunciation.accent, ')']],
      ]],
    ]],
    ['ul', { className: 'word-def-meanings' }, (
      cfg.meaning.map(meaning => ['li', {}, meaning])
    )],
    ['hr'],
    ['div', { className: 'word-def-etymology' }, [
      ['strong', 'FROM:'], ' ',
      ['span', {}, cfg.etymology.origin[0]],
      /** @returns {E.Item[]} */
      ...cfg.etymology.origin.slice(1).flatMap(prependSeperator),
    ]],
    ['span', { className: 'word-def-source' }, (
      Object.entries(cfg.source).map(([name, link]) => (
        /** @type {E.Item} */
        ['a', { className: 'word-def-source-link', href: link }, name]
      ))
    )],
  ]];
}

/**
 * @param {{
 *   summary: E.Item[],
 *   image?: E.Item,
 *   details: E.Item[],
 * }} cfg
 * @returns {E.Item}
 */
export function readmore(cfg) {
  return ['details', { className: 'readmore' }, [
    ['summary', {}, cfg.summary],
    ['br'],
    cfg.image,
    ['div', { className: 'container' }, cfg.details],
  ]];
}

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
export const dashbox = (...items) => ['div', {
  className: 'container dashbox',
  style: 'padding: 16px; border: white 1px dashed',
}, items];

/**
 * @param {E.Item} title
 * @param {E.Item[]} body
 * @return {E.Item}
 */
export function infobox(title, body) {
  return ['aside', { className: 'infobox' }, [
    ['h3', { className: 'infobox-name' }, ['💡 ', title]],
    ['div', { className: 'infobox-body', }, body],
  ]];
}

/**
 * @param {{
 *   height?: number,
 *   leadingText?: string,
 * }} options
 * @param {...E.Item} content
 * @returns {E.Item}
 */
export const todo = ({
  height,
  leadingText = 'PLACEHOLDER',
}, ...content) => (
  ['p', {
    style: 'color: white; background: red; padding: 8px' +
      (height == null ? '' : `; height: ${height}px`)
  }, [
    ['strong', [leadingText]], ': ', ...content,
  ]]
);

/**
 * @param {{
 *   outcomes: Record<string, Record<string, [string | number, string | number]>>,
 *   playerOne: { color: string, name: string },
 *   playerTwo: { color: string, name: string },
 * }} cfg
 * @returns {E.Item}
 */
export const simultaneousGame = ({ outcomes, playerOne, playerTwo }) => {
  const p1Moves = Object.keys(outcomes);
  const p2Moves = Object.keys(outcomes[p1Moves[0]]);

  /** @param {number | string} text @returns {E.Item} */
  const p1 = text => ['font', { color: playerOne.color }, [text]];

  /** @param {number | string} text @returns {E.Item} */
  const p2 = text => ['font', { color: playerTwo.color }, [text]];


  /** @type {E.Item[]} */
  const moveHeaderCols = p2Moves.map(move => (
    ['th', { colSpan: '1' }, [p2(move)]]
  ));


  /** @type {E.Item[]} */
  const rows = p1Moves.map((move, index) => (
    /** @type {E.Item} */
    (['tr', {}, [
      (index === 0) && ['th', { rowSpan: p1Moves.length }, [p1(playerOne.name)]],
      ['th', {}, [p1(move)]],
      ...p2Moves.map(p2Move => {
        const [x, y] = outcomes[move][p2Move];

        return ['td', {}, [p1(x), ' / ', p2(y)]];
      }),
    ]])
  ));

  return ['table', { className: 'diagram-table' }, [
    ['thead', {}, [
      ['tr', [
        ['th', { colSpan: 2, rowSpan: 2 }],
        ['th', { colSpan: p2Moves.length }, [
          ['font', { color: playerTwo.color }, [playerTwo.name]],
        ]],
      ]],
      ['tr', {}, moveHeaderCols],
    ]],
    ['tbody', {}, rows],
  ]];
};

/**
 * @param {{
 *   outcomes: Record<string, Record<string, E.Item[]>>,
 *   rowColor: Record<string, string>,
 *   colColor: Record<string, string>,
 *   footer?: E.Item[],
 * }} cfg
 * @returns {E.Item}
 */
export const crossSectionTable = ({
  outcomes,
  rowColor,
  colColor,
  footer,
}) => {
  const rowHeaders = Object.keys(outcomes);
  const colHeaders = Object.keys(outcomes[rowHeaders[0]]);

  /** @param {number | string} text @returns {E.Item} */
  const wRowColor = text => rowColor[text]
    ? ['font', { color: rowColor[text] }, [text]]
    : text;

  /** @param {number | string} text @returns {E.Item} */
  const wColColor = text => ['font', { color: colColor[text] }, [text]];

  return ['table', { className: 'diagram-table' }, [
    ['thead', {}, [
      ['tr', {}, [
        ['th'],
        ...colHeaders.map(colHeader => (
          /** @type {E.Item} */
          (['th', { colSpan: '1' }, [wColColor(colHeader)]])
        )),
      ]],
    ]],
    ['tbody', {}, rowHeaders.map(rowHeader => (
      /** @type {E.Item} */
      (['tr', {}, [
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

/**
 * @param {E.Item[]} items
 * @returns {E.Item}
 */
export const ulLight = items => ['ul', { className: 'no-item-padding' }, (
  items.map(item => ['li', {}, [item]])
)];


/**
 * @param {E.Item[]} items
 * @returns {E.Item[]}
 */
export const alternating = items => (
  /** @type {E.Item[]} */
  (items.flatMap((item, index) => {
    const fmtItem = index%2===0 ? item : ['strong', [item]];
    const last = item === items.at(-1);
    return last ? [fmtItem] : [fmtItem, ', '];
  }))
);
