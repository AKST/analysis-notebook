/**
 * @import { E } from '../../render_app/type.ts';
 */
import { helpers as doc } from '../../render_app/index.js';

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
  style: 'padding: 16px; border: var(--border-white-dash)',
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
    style: 'color: var(--fg-white-on-red); background: var(--bg-red); padding: 8px' +
      (height == null ? '' : `; height: ${height}px`)
  }, [
    ['strong', [leadingText]], ': ', ...content,
  ]]
);

/**
 * @param {...E.Item} content
 * @returns {E.Item}
 */
export const note = (...content) => (
  ['p', {
    style: `
      color: var(--fg-white-on-blue);
      background: var(--bg-blue);
      padding: 8px
    `,
  }, [
    doc.small(['strong', ['NOTE']], ': '), doc.small(ulLight(content)),
  ]]
);

/**
 * @param {string} topic
 * @returns {(...content: E.Item[]) => E.Item}
 */
export const noteOn = (topic) => (...content) => (
  ['p', {
    style: `
      color: var(--fg-white-on-blue);
      background: var(--bg-blue);
      padding: 8px
    `,
  }, [
    doc.small(['strong', ['NOTE (on ', topic, ')']], ': '), doc.small(ulLight(content)),
  ]]
);

/**
 * @param {[number, undefined | string] | [number]} classWeek
 * @param {(
 *   | { k: 'slide', s: number }
 *   | { k: 'time', t: string }
 * )} ref
 * @param {E.Item} title
 * @returns {E.Item}
 */
export const clsRef = (classWeek, ref, title) => {
  const week = `W${classWeek[0]}${classWeek[1] ? (' ' + classWeek[1]) : ''}`
  const item = ref.k === 'slide' ? `Slide ${ref.s}` : `Time ${ref.t}`;

  return ['div', {
    style: `
      display: grid;
      grid-template-columns: 1fr auto;
      grid-gap: 8px;
    `,
  }, [
    title,
    ['span', {
      style: `
        display: grid;
        grid-auto-flow: column;
        grid-gap: 0.5em;
        align-items: center;
        max-height: 2em;
        line-height: 1;
        font-size: 10px;
        color: var(--fg-black-on-pink);
        background: var(--bg-pink);
        padding: 4px;
      `,
    }, [doc.b(week), '/', doc.b(item)]],
  ]];
};

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
