/**
 * @import { E } from '@base/dsl_dom/type.ts';
 * @import { TemplateHelper, Helper, DefaultHelperAttrs } from '@base/dsl_dom/helper-type.ts';
 */
import { makeHelper, makeTemplateHelper } from '@base/dsl_dom/helper.js';
import * as doc from '@base/dsl_dom/helper/html.js';
import * as Meta from '@base/dsl_dom/node_meta.js';
import { node } from '@base/dsl_dom/render.js';

/**
 * External Type
 *
 * @type {{
 *  (a: string, b: string): string;
 *  (a: string, b: undefined): undefined;
 *  (a: undefined, b: string): undefined;
 *  (a: undefined, b: undefined): undefined;
 *  (a: string, b: string | undefined): string | undefined;
 *  (a: string | undefined, b: string): string | undefined;
 *  (a: string | undefined, b: string | undefined): string | undefined;
 * }}
 */
const joinClass = /** @type {any} */ (
  /**
   * Internal Type
   *
   * @param {string | undefined} a
   * @param {string | undefined} b
   * @returns {string | undefined}
   */
  function (a, b) {
    if (a == null && b == null) {
      return undefined;
    }
    if (a == null) return b;
    if (b == null) return a;
    return `${a} ${b}`;
  }
);

/**
 * @typedef {{
 *   className?: string,
 *   itemSpace?: 'sparse' | 'dense',
 *   blockMargin?: 0 | 1,
 * }} ListHelperAttrs
 */

/**
 * @template {'ul' | 'ol'} T
 * @param {T} tagName
 * @param {string | undefined} cls
 * @returns {Helper<'html', T, ListHelperAttrs & DefaultHelperAttrs<'html', T>, E.Item[]>}
 */
const makeListTag = (tagName, cls) => makeHelper({
  of: ['html', tagName],
  create: (m, items) => {
    const { className: classIn, itemSpace = 'dense', blockMargin = 0, ...attr } = m.attributes;
    let className = joinClass(classIn, cls);
    if (itemSpace === 'dense') className = joinClass(className, 'no-item-padding');

    // the type is unreconcilable due to the ambigious nature of this.
    const newMeta = Meta.build(m)
      .setAttr(/** @type {any} */ (attr))
      .attr('className', /** @type {any} */ (className ?? ''))
      .style({ marginBlock: `${blockMargin * 8}px` })
      .meta;

    return /** @type {any} */ (node('html', tagName, newMeta, items));
  },
});

/**
 * @template {'p' | 'blockquote' | 'li'} T
 * @param {T} tagName
 * @param {string | undefined} cls
 * @returns {TemplateHelper<'html', T, { className?: string } & DefaultHelperAttrs<'html', T>>}
 */
const makeClsTagB = (tagName, cls) => makeTemplateHelper({
  of: ['html', tagName],
  create: (m, items) => {
    const { className: classIn, ...attr } = m.attributes;
    const newMeta = Meta.build(m)
      .setAttr(/** @type {any} */ (attr))
      .attr('className', /** @type {any} */ (joinClass(classIn, cls)))
      .meta;
    return /** @type {any} */ (node('html', tagName, newMeta, items));
  },
});

export const text = {
  a: makeTemplateHelper({
    of: ['html', 'a'],
    create: (m, ls) => node('html', 'a', Meta.attr(m, 'target', '_blank'), ls),
  }),
  b: doc.strong,
  figure: makeHelper({
    of: ['html', 'figure'],
    create (m, items) {
      const { className: classIn } = m.attributes;
      const cls = 'pre--horizontal-shadow';
      return node('html', 'figure', Meta.attr(m, 'className', joinClass(classIn, cls)), items);
    },
  }),
  i: doc.em,
  p: {
    m: makeClsTagB('p', 'text-medium'),
    l: makeClsTagB('p', 'text-large'),
  },
  quote: {
    l: makeClsTagB('blockquote', 'text-large'),
  },
  li: {
    m: makeClsTagB('li', 'text-medium'),
    l: makeClsTagB('li', 'text-large'),
  },
  ul: makeListTag('ul', undefined),
  ol: makeListTag('ol', undefined),
};

/**
 * @param {E.Item} fig
 * @param {E.Item} cap
 * @returns {E.Item}
 */
export const figure = (fig, cap) => doc.figure.of(
  fig,
  doc.figcaption.of(cap)
);

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
 *   meaning: E.Item[],
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
    doc.strong` < `,
    doc.span.of(origin),
  ];
  return doc.blockquote({ className: 'word-def' }).of(
    doc.div({ className: 'word-def-word' }).of(
      doc.dfn.of(doc.strong.of(cfg.word)),
      doc.span({ className: 'word-de-ipa' }).of(
        doc.span({ className: 'word-def-ipa-syn' }).of(cfg.pronunciation.syntax),
        doc.sup({ className: 'word-def-ipa-act' }).of('(', cfg.pronunciation.accent, ')'),
      ),
    ),
    doc.ul({ className: 'word-def-meanings' }).of(
      ...cfg.meaning.map(meaning => doc.li.of(meaning))
    ),
    doc.hr(),
    doc.div({ className: 'word-def-etymology' }).of(
      doc.strong`FROM:`, ' ',
      doc.span.of(cfg.etymology.origin[0]),
      /** @returns {E.Item[]} */
      ...cfg.etymology.origin.slice(1).flatMap(prependSeperator),
    ),
    doc.span({ className: 'word-def-source' }).of(
      ...Object.entries(cfg.source).map(([name, link]) => (
        /** @type {E.Item} */
        doc.a({ className: 'word-def-source-link', href: link }).of(name)
      ))
    ),
  );
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
  return doc.details({ className: 'readmore' }).of(
    doc.summary.of(...cfg.summary),
    doc.br(),
    cfg.image,
    doc.div({ className: 'container' }).of(...cfg.details),
  );
}

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
export const dashbox = (...items) => doc.div({
  className: 'container dashbox',
  style: 'padding: 16px; border: var(--border-white-dash)',
}).of(...items);

export const infobox = makeHelper({
  of: ['html', 'aside'],

  /**
   * @param {E.Meta<{ title?: string } & DefaultHelperAttrs<'html', 'aside'>>} m
   */
  create: (m, body) => {
    const { className: interClassName, title, ...attrs } = m.attributes;
    const className = joinClass(interClassName, 'infobox');

    /** @type {E.Meta<DefaultHelperAttrs<'html', 'aside'>>} */
    const newMeta = Meta.build(m)
      .setAttr({ ...attrs, className })
      .meta;

    return doc.aside(newMeta).of(
      doc.h3({ className: "infobox-name" }).t`💡 ${title}`,
      doc.div({ className: "infobox-body" }).of(doc.div({ className: 'container' }).of(...body)),
    );
  },
});

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
  text.p.l({
    style: 'color: var(--fg-white-on-red); background: var(--bg-red); padding: 8px' +
      (height == null ? '' : `; height: ${height}px`)
  }).of(
    doc.strong.of(leadingText),
    ': ',
    ...content,
  )
);

/**
 * @param {...E.Item} content
 * @returns {E.Item}
 */
export const note = (...content) => (
  doc.p({
    style: `
      color: var(--fg-white-on-blue);
      background: var(--bg-blue);
      padding: 8px
    `,
  }).of(
    doc.p.of(doc.strong.of('NOTE')), (
      text.ul(...content)
    ),
  )
);

/**
 * @param {string} topic
 * @returns {(...content: E.Item[]) => E.Item}
 */
export const noteOn = (topic) => (...content) => (
  doc.p({
    style: `
      color: var(--fg-white-on-blue);
      background: var(--bg-blue);
      padding: 8px
    `,
  }).of(
    doc.p.of(doc.strong`NOTE (on ${topic} )`), (
      text.ul(...content)
    )
  )
);

/**
 * @param {{
 *   lec?: {
 *     id: [number, undefined | string] | [number]
 *     slide?: number,
 *     time?: string,
 *   },
 *   book?: {
 *     chapter: string | number,
 *     page: string | number,
 *   },
 * }} ref
 * @param {E.Item} title
 * @returns {E.Item}
 */
export const clsRef = (ref, title) => {
  const items = [];
  if (ref.lec) {
    const cls = [];
    const week = `W${ref.lec.id[0]}${ref.lec.id[1] ? (' ' + ref.lec.id[1]) : ''}`
    items.push(week);
    if (ref.lec.slide) cls.push(`Slide ${ref.lec.slide}`);
    if (ref.lec.time) cls.push(`Time ${ref.lec.time}`);
    items.push('/ Class (' + cls.join(', ') + ')');
  }
  if (ref.book) {
    items.push(`Book (C${ref.book.chapter} P${ref.book.page})`);
  }
  const item = items.join(', ');

  return doc.div({
    style: `
      display: grid;
      grid-template-columns: 1fr auto;
      grid-gap: 8px;
    `,
  }).of(
    title,
    doc.span({
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
    }).of(doc.strong.of(item)),
  );
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
  const p1 = text => doc.font({ color: playerOne.color }).of(text);

  /** @param {number | string} text @returns {E.Item} */
  const p2 = text => doc.font({ color: playerTwo.color }).of(text);


  /** @type {E.Item[]} */
  const moveHeaderCols = p2Moves.map(move => (
    doc.th({ colSpan: 1 }).of(p2(move))
  ));


  /** @type {E.Item[]} */
  const rows = p1Moves.map((move, index) => (
    /** @type {E.Item} */
    (doc.tr.of(
      (index === 0) && doc.th({ rowSpan: p1Moves.length }).of(p1(playerOne.name)),
      doc.th.of(p1(move)),
      ...p2Moves.map(p2Move => {
        const [x, y] = outcomes[move][p2Move];

        return doc.td.of(p1(x), ' / ', p2(y));
      }),
    ))
  ));

  return doc.table({ className: 'diagram-table' }).of(
    doc.thead.of(
      doc.tr.of(
        doc.th({ colSpan: 2, rowSpan: 2 }).t``,
        doc.th({ colSpan: p2Moves.length }).of(
          doc.font({ color: playerTwo.color }).of(playerTwo.name),
        ),
      ),
      doc.tr.of(...moveHeaderCols),
    ),
    doc.tbody.of(...rows),
  );
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
    ? doc.font({ color }).of(text)
    : text;

  /** @param {number | string} text @returns {E.Item} */
  const wRowColor = text => maybeWrapInFont(text, rowColor[text]);

  /** @param {number | string} text @returns {E.Item} */
  const wColColor = text => maybeWrapInFont(text, colColor[text]);

  /** @type {E.Item} */
  const colHeaderSpace = doc.th({
    colSpan: mainRowHeader == null ? 1 : 2,
    rowSpan: colHeader == null ? 1 : 2,
  }).of();

  return doc.table({ className: 'diagram-table' }).of(
    doc.thead.of(
      colHeader == null ? null : (
        doc.tr.of(
          colHeaderSpace,
          doc.th({ colSpan: colHeaders.length }).of(
            maybeWrapInFont(colHeader.name, colHeader.color),
          ),
        )
      ),
      doc.tr.of(
        colHeader == null ? colHeaderSpace : null,
        ...colHeaders.map(colHeader => (
          doc.th({ colSpan: 1 }).of(wColColor(colHeader))
        )),
      ),
    ),
    doc.tbody.of(...rowHeaders.map((rowHeader, index) => (
      /** @type {E.Item} */
      (doc.tr.of(
        mainRowHeader == null || (index !== 0) ? null : (
          doc.th({ rowSpan: rowHeaders.length }).of(
            maybeWrapInFont(mainRowHeader.name, mainRowHeader.color),
          )
        ),
        doc.th.of(wRowColor(rowHeader)),
        ...colHeaders.map(colHeader => {
          return doc.td.of(...outcomes[rowHeader][colHeader]);
        }),
      ))
    ))),
    footer && (
      doc.caption({ align: 'bottom' }).of(...footer)
    ),
  );
};


/**
 * @param {E.Item[]} items
 * @returns {E.Item[]}
 */
export const alternating = items => (
  /** @type {E.Item[]} */
  (items.flatMap((item, index) => {
    const fmtItem = index%2===0 ? item : doc.strong.of(item);
    const last = item === items.at(-1);
    return last ? [fmtItem] : [fmtItem, ', '];
  }))
);
