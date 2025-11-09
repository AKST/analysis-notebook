/**
 * @import { E, ElAttributes } from '@base/dom_app/type.ts';
 * @import { Helper, TemplateHelper } from '@base/dom_app/helper/type.ts';
 */

import { makeHelper, makeTemplateHelper } from '@base/dom_app/helper/util.js';
import { mathml } from '@base/dom_app/helper/mathml.js';

const {
  msup,
  mspace, mrow, mn, mo, mi,
  munderover, munder, mover,
  mtext, mtd, mtr, mtable,
} = mathml;

export const parensA = makeHelper((attrs, body) => mrow(attrs)(mo`(`, ...body, mo`)`));
export const parensB = makeHelper((attrs, body) => mrow(attrs)(mo`[`, ...body, mo`]`));
export const parensC = makeHelper((attrs, body) => mrow(attrs)(mo`{`, ...body, mo`}`));

/**
 * @param {E.Item[]} items
 * @param {E.Item[]} sep
 * @returns {E.Item[]}
 */
const seperateItems = (items, sep) => [
  items[0],
  ...items.slice(1).flatMap(item => [
    ...sep,
    item,
  ]),
];

export const set = makeHelper((attrs, body) => parensC(attrs)(
  ...seperateItems(body, [mo`,`, mspace(4)]),
));


export const annotationUnder = makeHelper(({
  label,
  labelSize,
  marginTop,
  ...attr
}, body) => {
  let style = '';
  if (labelSize != null) style += `; font-size: ${labelSize}px`;
  if (marginTop != null) style += `; margin-top: ${marginTop}px`;
  return munder(attr)(mrow(...body), munder(mo`⏟`, mrow.attr({ style })(label)))
}, /** @type {{
  label: E.Item,
  labelSize?: number,
  marginTop?: number,
}} */ ({ label: mrow() }));

export const annotationOver = makeHelper(({ label, labelSize, ...attr }, body) => {
  const overAttr = labelSize == null ? ({}) : ({ style: `font-size: ${labelSize}px` });
  return mover(attr)(mrow(...body), mover(mo`⏞`, mrow.attr(overAttr)(label)))
}, /** @type {{
  label: E.Item,
  labelSize?: number
}} */ ({ label: mrow() }));

/**
 * Similar to mtable components except columnalign is propagated
 * and rows are automatically handled.
 *
 * @type {Helper<undefined, E.Item[][]>}
 */
export const table = makeHelper(({ columnalign = '', ...attrs }, rows) => (
  mtable(attrs)(...rows.map(row => {
    const split = columnalign != null
      ? columnalign.split(' ')
      : Array(row.length).fill(undefined);

    const cell = row.map((col, idx) => mtd({ columnalign: split[idx] })(col));
    return mtr({ columnalign })(...cell);
  }))
));

/***
 * Stacks rows in a table
 */
export const rows = makeHelper((attr, body) => (
  table(attr)(...body.map(row => [mtd(row)]))
));

/**
 * Stacks rows in a table
 */
export const abs = makeHelper((attr, body) => (
  mrow(attr)(mo`|`, mrow(...body), mo`|`)
));

/**
 * Stacks rows in a table
 * @type {Helper<undefined, [E.Item, E.Item]>}
 */
export const index = makeHelper((attr, [body, index]) => mrow(attr)(
  mrow(body),
  mrow(mo`[`, index, mo`]`),
));


/**
 * Stacks rows in a table
 *
 * @type {Helper<{ max: E.Item, inc: E.Item }>}
 */
export const sum = makeHelper(({ max, inc, ...attr }, items) => (
  mrow(attr)(
    munderover(mi`∑`, inc, max),
    mspace(4),
    mrow(...items),
  )
), ({ max: mrow(), inc: mrow() }));


/**
 * @type {Helper<undefined, E.Item[][]>}
 */
export const matrix = makeHelper((attrs, rows) => (
  mrow(attrs)(
    mo`[`,
    mtable(...rows.map(row => (
      mtr(...row.map(col => mathml.mtd(col)))
    ))),
    mo`]`,
  )
));

/**
 * @type {Helper<undefined, { cond?: E.Item, then: E.Item }[]>}
 */
export const piecewise = makeHelper((attrs, conds) => (
  mrow(attrs)(
    mo`{`,
    mtable(...conds.map(({ cond, then }) =>
      mtr(
        mtd.attr({ columnalign: 'left' })(then),
        mtd.attr({ columnalign: 'left' })(cond == null ? mrow() : mtext`if`),
        mtd.attr({ columnalign: 'left' })(cond == null ? mtext`otherwise` : cond),
      ),
    )),
  )
));

/**
 * @type {Helper<undefined, [string]>}
 */
export const iv = makeHelper((attr, [i]) => (
  mi(attr).of(`${i} ⃗`.replace(/\s+/g, ''))
));

/**
 * @type {Helper<{ paren?: "[]" | "()", fn: E.Item, space?: boolean }>}
 */
export const call = makeHelper(({ paren = '()', fn, space = true, ...attr }, items) => (
  mrow(attr)(
    fn,
    ...(space ? [mspace(2)] : []),
    mrow(
      paren === '()' ? mo`(` : mo`[`,
      ...seperateItems(items, [
        mo`,`,
        mspace(4),
      ]),
      paren === '()' ? mo`)` : mo`]`,
    ),
  )
), /** @type {{ paren?: '[]' | '()', fn: E.Item, space?: boolean }} */ ({
  space: true,
  fn: mrow(),
}));

/** @type {Helper<undefined, E.Item[]>} body */
export const inv = makeHelper((attr, items) => {
  if (items.length === 0) throw new Error();
  const item = items.length > 1 ? parensA(...items) : items[0];
  return msup.attr(attr)(item, mrow(mo`-`, mn(1)));
});

/** @type {Helper<undefined, E.Item[]>} body */
export const neg = makeHelper((attr, items) => {
  if (items.length === 0) throw new Error();
  const item = items.length > 1 ? parensA(...items) : items[0];
  return mrow.attr(attr)(mo`-`, item);
});

export const multiscripts =
  makeHelper(({
    sup: [tl, tr] = [undefined, undefined],
    sub: [bl, br] = [undefined, undefined],
    ...attr
  }, body) => {
    const base = body.length > 1 ? parensA(...body) : body[0];
    return mathml.mmultiscripts(attr)(
      base,
      br ?? mrow(),
      tr ?? mrow(),
      mathml.mprescripts(),
      bl ?? mrow(),
      tl ?? mrow(),
    );
  }, /**
      * @type {{
      *   sup?: [E.Item | undefined, E.Item | undefined] | undefined,
      *   sub?: [E.Item | undefined, E.Item | undefined] | undefined,
      * }}
      */ ({ sup: undefined, sub: undefined }));

export const SPECIAL = {
  because: mathml.mo`∵`,
  therefore: mathml.mo`∴`,
  ellipse: {
    h: mathml.mo`…`,
    h2: mathml.mo`⋯`,
    v: mathml.mo`⋮`,
    d1: mathml.mo`⋱`,
  },
  operation: {
    and: mathml.mo`∧`,
    or: mathml.mo`∨`,
    not: mathml.mo`¬`,
    dot: mathml.mo`·`,
    mul: mathml.mo`⨉`,
    divide: mathml.mo`÷`,
    integral: mathml.mo`∫`,
    plusMinus: mathml.mo`±`,
  },
  sets: {
    complex: mathml.mi`ℂ`,
    int: mathml.mi`ℤ`,
    nat: mathml.mi`ℕ`,
    rational: mathml.mi`ℚ`,
    real: mathml.mi`ℝ`,
  },
  rel: {
    id: mathml.mo`≡`,
    neq: mathml.mo`≠`,
    lteq: mathml.mo`≤`,
    gteq: mathml.mo`≥`,
    imply: mathml.mo`⇒`,
    aprox: mathml.mo`≈`,
    equiv: mathml.mo`~`,
    exists: mathml.mo`∈`,
    subset: mathml.mo`⊂`,
    supset: mathml.mo`⊃`,
  },
  cursive: {
    F: mathml.mi`ℱ`,
  },
  greek: {
    alpha: mathml.mi`𝛼`,
    Alpha: mathml.mi`𝛢`,
    beta: mathml.mi`𝛽`,
    Beta: mathml.mi`𝛣`,
    delta: mathml.mi`𝛿`,
    Delta: mathml.mi`𝛥`,
    gamma: mathml.mi`𝛾`,
    Gamma: mathml.mi`𝛤`,
    eplison: mathml.mi`𝜀`,
    Eplison: mathml.mi`𝛦`,
    zeta: mathml.mi`𝜁`,
    Zeta: mathml.mi`𝛧`,
    eta: mathml.mi`𝜂`,
    Eta: mathml.mi`𝛨`,
    theta: mathml.mi`𝜃`,
    Theta: mathml.mi`𝛩`,
    iota: mathml.mi`𝜄`,
    Iota: mathml.mi`𝛪`,
    kappa: mathml.mi`𝜅`,
    Kappa: mathml.mi`𝛫`,
    lambda: mathml.mi`𝛬`,
    Lambda: mathml.mi`𝜆`,
    mu: mathml.mi`𝜇`,
    Mu: mathml.mi`𝛭`,
    nu: mathml.mi`𝜈`,
    Nu: mathml.mi`𝛮`,
    xi: mathml.mi`𝜉`,
    Xi: mathml.mi`𝛯`,
    omicron: mathml.mi`𝜊`,
    Omicron: mathml.mi`𝛰`,
    pi: mathml.mi`𝜋`,
    Pi: mathml.mi`𝛱`,
    rho: mathml.mi`𝜌`,
    Rho: mathml.mi`𝜌`,
    sigma: mathml.mi`𝜎`,
    Sigma: mathml.mi`𝛴`,
    tau: mathml.mi`𝜏`,
    Tau: mathml.mi`𝛵`,
    upsilon: mathml.mi`𝜐`,
    Upsilon: mathml.mi`𝛶`,
    phi: mathml.mi`𝜙`,
    Phi: mathml.mi`𝛷`,
    chi: mathml.mi`𝝌`,
    Chi: mathml.mi`𝛸`,
    psi: mathml.mi`𝜓`,
    Psi: mathml.mi`𝛹`,
    omega: mathml.mi`𝜔`,
    Omega: mathml.mi`𝛺`,
    circumflex: {
      beta: mathml.mi`𝛽̂`,
      gamma: mathml.mi`𝛾̂`,
      theta: mathml.mi`𝜃̂`,
      mu: mathml.mi`𝜇̂`,
      rho: mathml.mi`𝜌̂`,
      sigma: mathml.mi`𝜎̂`,
    },
  },
}


/**
 * @typedef {{
 *   paren?: '()' | '[]' | '{}' | undefined,
 *   subsup?: boolean
 * }} OperatorAttr
 *
 * @param {E.Item} o
 * @param {number} [space]
 * @returns {Helper<OperatorAttr, E.Item[]> & {
 *   sub: Helper<undefined, E.Item[]>,
 *   sup: Helper<undefined, E.Item[]>,
 *   paren: Helper<undefined, E.Item[]>,
 *   square: Helper<undefined, E.Item[]>,
 *   brace: Helper<undefined, E.Item[]>,
 *   mtr: Helper<{ pos?: string[] }, E.Item[]>,
 *   array: (...items: E.Item[]) => E.Item[],
 * }}
 */
const makeOperator = (o, space = 4) => {
  const helper =  (makeHelper(({
    paren,
    subsup = false,
    ...attrs
  }, items) => {
    let wrapper, sep;

    if (subsup) {
      sep = [o];
    } else {
      sep = [mspace(space), o, mspace(space)]
    }

    switch (paren) {
      case '()':
        wrapper = parensA;
        break;
      case '[]':
        wrapper = parensB;
        break;
      case '{}':
        wrapper = parensC;
        break;
      default:
        wrapper = mrow;
    }

    return wrapper.attr(attrs)(
      ...seperateItems(items, sep)
    );
  }, /** @type {OperatorAttr} */ ({})));

  return Object.assign(helper, {
    sup: makeHelper((attr, items) => {
      return helper.attr({ ...attr, subsup: true })(...items);
    }),
    sub: makeHelper((attr, items) => {
      return helper.attr({ ...attr, subsup: true })(...items);
    }),
    paren: makeHelper((attr, items) => {
      return helper.attr({ ...attr, paren: '()' })(...items);
    }),
    brace: makeHelper((attr, items) => {
      return helper.attr({ ...attr, paren: '{}' })(...items);
    }),
    square: makeHelper((attr, items) => {
      return helper.attr({ ...attr, paren: '[]' })(...items);
    }),
    mtr: makeHelper((attr, items) => {
      const { pos: ca = [] } = attr;
      return mtr(...seperateItems(items.map((it, i) => mtd({ columnalign: ca[i] ?? 'center' })(it)), [mtd(o)]));
    }, /** @type {{ pos?: string[] }} */ ({ pos: [] })),
    /**
     * @param {...E.Item} items
     * @returns {E.Item[]}
     */
    array: (...items) => [
      items[0],
      ...items.slice(1).flatMap(item => [o, item])
    ],
  });
};

export const op = {
  gt: makeOperator(mo`>`),
  gteq: makeOperator(mo`≥`),
  lt: makeOperator(mo`<`),
  lteq: makeOperator(mo`≤`),
  eq: makeOperator(mo`=`),
  eqId: makeOperator(SPECIAL.rel.id),
  neq: makeOperator(mo`≠`),
  cond: makeOperator(mo`|`, 2),
  imply: makeOperator(SPECIAL.rel.imply),
  aprox: makeOperator(SPECIAL.rel.aprox),
  addMinus: makeOperator(mo`±`),
  add: makeOperator(mo`+`),
  mul: makeOperator(SPECIAL.operation.dot, 1),
  mul0: makeOperator(mo.of('\u{2062}'), 1),
  minus: makeOperator(mo`-`),
  div: makeOperator(SPECIAL.operation.divide),
  comma: makeOperator(mrow(mo`,`, mspace(4)), 0),
};
