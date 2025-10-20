/**
 * @import { E, ElAttributes } from '../../render_app/type.ts';
 * @import { Helper, TemplateHelper } from '../../render_app/helper/type.ts';
 */

import { makeHelper, makeTemplateHelper } from '../../render_app/helper/util.js';
import { mathml } from '../../render_app/helper/mathml.js';

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
  mrow(attr)(mo`|`, ...body, mo`|`)
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
        mtd(then),
        mtd(cond == null ? mrow() : mtext`if`),
        mtd(cond == null ? mtext`otherwise` : cond),
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
 * @type {Helper<{ fn: E.Item }>}
 */
export const call = makeHelper(({ fn, ...attr }, items) => (
  mrow(attr)(
    fn,
    mspace(2),
    mrow(
      mo`(`,
      ...seperateItems(items, [
        mo`,`,
        mspace(4),
      ]),
      mo`)`,
    ),
  )
), { fn: mrow() });

/** @param {...E.Item} body */
export const inv = (...body) => {
  if (body.length === 0) throw new Error();
  const item = body.length > 1 ? parensA(...body) : body[0];
  return msup(item, mrow(mo`-`, mn(1)));
};

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
 *
 * @param {E.Item} o
 * @param {number} [space]
 * @returns {Helper<OperatorAttr, E.Item[]> & {
 *   sub: Helper<undefined, E.Item[]>,
 * }}
 */
const makeOperator = (o, space = 4) => {
  const helper = makeHelper(({
    paren,
    subsup = false,
    ...attrs
  }, items) => {
    const d = subsup ? 2 : 1;
    let wrapper, sep;

    if (subsup) {
      sep = [o];
    } else {
      sep = [mspace(space / d), o, mspace(space / d)]
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
  }, /** @type {OperatorAttr} */ ({}));

  // @ts-ignore - I'm making a DSL
  helper.sub = makeHelper((attrs, items) => {
    return helper.attr({ ...attrs, subsup: true })(...items);
  }, /** @type {OperatorAttr} */ ({}));

  // @ts-ignore - I'm making a DSL
  return helper;
};

/**
 * Wraps something in normal parens ().
 *
 * @param {E.Item} o
 * @param {number | string} [space]
 * @returns {(...items: E.Item[]) => E.Item}
 */
const makeOperatorPA = (o, space='0.5em') => (...items) => (
  parensA(...seperateItems(items, [mspace(space), o, mspace(space)]))
);

/**
 * Wraps something in square parens [].
 *
 * @param {E.Item} o
 * @param {number | string} [space]
 * @returns {(...items: E.Item[]) => E.Item}
 */
const makeOperatorPB = (o, space='0.5em') => (...items) => (
  parensB(...seperateItems(items, [mspace(space), o, mspace(space)]))
);

export const gt = makeOperator(mo`>`);
export const lt = makeOperator(mo`<`);
export const eq = makeOperator(mo`=`);
export const eqId = makeOperator(SPECIAL.rel.id);
export const cond = makeOperator(mo`|`, 2);
export const imply = makeOperator(SPECIAL.rel.imply);
export const aprox = makeOperator(SPECIAL.rel.aprox);
export const addMinus = makeOperator(mo`±`);
export const add = makeOperator(mo`+`);
export const addPA = makeOperatorPA(mo`+`);
export const addPB = makeOperatorPB(mo`+`);
export const mul = makeOperator(SPECIAL.operation.dot, 1);
export const mulPA = makeOperatorPA(SPECIAL.operation.dot, 1);
export const mulPB = makeOperatorPB(SPECIAL.operation.dot, 1);
export const mul0 = makeOperator(mo.of('\u{2062}'), 1);
export const mul0PA = makeOperatorPA(mo.of('\u{2062}'), 1);
export const mul0PB = makeOperatorPB(mo.of('\u{2062}'), 1);
export const minus = makeOperator(mo`-`);
export const minusPA = makeOperatorPA(mo`-`);
export const minusPB = makeOperatorPB(mo`-`);
export const div = makeOperator(SPECIAL.operation.divide);
export const divPA = makeOperatorPA(SPECIAL.operation.divide);
export const divPB = makeOperatorPB(SPECIAL.operation.divide);
