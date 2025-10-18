/**
 * @import { E, ElAttributes } from '../../render_app/type.ts';
 * @import { Helper } from '../../render_app/helper/type.ts';
 */

import { frag } from '../../render_app/helper/typography.js';
import { makeHelper } from '../../render_app/helper/util.js';
import { mathml } from '../../render_app/helper/mathml_2.js';

const { mspace, mrow, mn, mo, mi } = mathml;

export const parensA = makeHelper((attrs, body) => mrow(attrs).of(mo`(`, ...body, mo`)`));
export const parensB = makeHelper((attrs, body) => mrow(attrs).of(mo`[`, ...body, mo`]`));
export const parensC = makeHelper((attrs, body) => mrow(attrs).of(mo`{`, ...body, mo`}`));

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

export const set = makeHelper((attrs, body) => parensC(attrs).of.apply(null,
  seperateItems(body, [mo`,`, mspace({ space: 4 }).of()]),
));

/***
 * Stacks rows in a table
 */
export const rows = makeHelper((attr, body) => mathml.mtable(attr).of.apply(
  null,
  body.map(row => mathml.mtr.of(mathml.mtd.of(row))),
));

/**
 * Stacks rows in a table
 */
export const abs = makeHelper((attr, body) => mathml.mrow(attr).of(
  mathml.mo`|`,
  ...body,
  mathml.mo`|`,
));

/**
 * Stacks rows in a table
 * @type {Helper<{ index: E.Item }>}
 */
export const index = makeHelper(({ index, ...attr }, body) => mathml.mrow(attr).of(
  mathml.mrow.of.apply(null, body),
  mathml.mrow.of(
    mathml.mo`[`,
    index,
    mathml.mo`]`,
  ),
), { index: mathml.mtext`noop` });


/**
 * Stacks rows in a table
 *
 * @type {Helper<{ max: E.Item, inc: E.Item }>}
 */
export const sum =
  makeHelper(({
    max,
    inc,
    ...attr
  }, items) => mathml.mrow(attr).of(
    mathml.munderover.of(
        mathml.mi`∑`,
        mathml.mrow.of(inc),
        mathml.mrow.of(max),
    ),
    mathml.mrow.of(...items),
  ), ({ max: mrow.of(), inc: mrow.of() }));

/**
 * @type {Helper<undefined, E.Item[]>}
 */
export const table = makeHelper(({ columnalign = '', ...attrs }, rows) => (
  mathml.mtable(attrs).of.apply(null, rows.map(row => {
    const split = columnalign != null
      ? columnalign.split(' ')
      : Array(row.length).fill(undefined);

    const mtd = row.map((col, idx) => (
      mathml.mtd({ columnalign: split[idx] }).of(col)
    ));

    return mathml.mtr({ columnalign }).of.apply(null, mtd);
  }))
));

/**
 * @type {Helper<undefined, E.Item[]>}
 */
export const matrix = makeHelper((attrs, rows) => (
  mathml.mrow(attrs).of(
    mathml.mo`[`,
    mathml.mtable.of.apply(null, rows.map(row => (
      mathml.mtr.of.apply(null, row.map(col => mathml.mtd.of(col)))
    ))),
    mathml.mo`]`,
  )
));

/**
 * @type {Helper<undefined, { cond?: E.Item, then: E.Item }>}
 */
export const piecewise = makeHelper((attrs, conds) => (
  mathml.mrow(attrs).of(
    mathml.mo`{`,
    mathml.mtable.of.apply(null, conds.map(({ cond, then }) =>
      mathml.mtr.of(
        mathml.mtd.of(then),
        mathml.mtd.of(cond == null ? mathml.mrow.of() : mathml.mtext`if`),
        mathml.mtd.of(cond == null ? mathml.mtext`otherwise` : cond),
      ),
    )),
  )
));

/**
 * @type {(i: string) => E.Item}
 */
export const iv = i => mathml.mi.of(`${i} ⃗`.replace(/\s+/g, ''));

/**
 * @type {(fname: E.Item, xs: E.Item[]) => E.Item}
 */
export const call = (fname, xs) => mathml.mrow.of(
  fname,
  mathml.mrow.of(
    mathml.mo`(`,
    ...seperateItems(xs, [
      mathml.mo`,`,
      mathml.mspace({ space: 4 }).of(),
    ]),
    mathml.mo`)`,
  ),
);

export const inv = makeHelper((attr, body) => {
  if (body.length === 0) throw new Error();
  const { msup, mrow, mn, mo } = mathml;
  const item = body.length > 1 ? parensA.of.apply(null, body) : body[0];
  return msup(attr).of(item, mrow.of(mo`-`, mn.of(1)));
});

export const multiscripts =
  makeHelper(({
    sup: [tl, tr] = [undefined, undefined],
    sub: [bl, br] = [undefined, undefined],
    ...attr
  }, body) => {
    const base = body.length > 1 ? parensA.of.apply(null, body) : body[0];
    return mathml.mmultiscripts(attr).of(
      base,
      br ?? mathml.mrow.of(),
      tr ?? mathml.mrow.of(),
      mathml.mprescripts.of(),
      bl ?? mathml.mrow.of(),
      tl ?? mathml.mrow.of(),
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
 * @param {E.Item} o
 * @param {number} [space]
 * @returns {(...items: E.Item[]) => E.Item}
 */
const makeOperator = (o, space=4) => (...items) => mrow.of(
  ...seperateItems(items, [mspace({ space }).of(), o, mspace({ space }).of()])
);

/**
 * Wraps something in normal parens ().
 *
 * @param {E.Item} o
 * @param {number} [space]
 * @returns {(...items: E.Item[]) => E.Item}
 */
const makeOperatorPA = (o, space=4) => (...items) => mrow.of(
  parensA.of(...seperateItems(items, [mspace({ space }).of(), o, mspace({ space }).of()])),
);

/**
 * Wraps something in square parens [].
 *
 * @param {E.Item} o
 * @param {number} [space]
 * @returns {(...items: E.Item[]) => E.Item}
 */
const makeOperatorPB = (o, space=4) => (...items) => mrow.of(
  parensB.of(...seperateItems(items, [mspace({ space }).of(), o, mspace({ space }).of()])),
);

export const eq = makeOperator(mathml.mo`=`);
export const eqId = makeOperator(SPECIAL.rel.id);
export const imply = makeOperator(SPECIAL.rel.imply);
export const aprox = makeOperator(SPECIAL.rel.aprox);
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
export const divPA = makeOperatorPA(SPECIAL.operation.divide);;
export const divPB = makeOperatorPB(SPECIAL.operation.divide);;

/** @param {number} a @param {number} b */
export const nFrac = (a, b) => mathml.mfrac.of(mn.of(a), mn.of(b));
