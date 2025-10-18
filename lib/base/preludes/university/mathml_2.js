/**
 * @import { E, ElAttributes } from '../../render_app/type.ts';
 * @import { Helper, TemplateHelper } from '../../render_app/helper/type.ts';
 */

import { frag } from '../../render_app/helper/typography.js';
import { makeHelper, makeTemplateHelper } from '../../render_app/helper/util.js';
import { mathml } from '../../render_app/helper/mathml_2.js';

const {
  mspace, mrow, mn, mo, mi,
  munderover, munder, mover,
  mtext, mtd, mtr, mtable,
} = mathml;

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

export const set = makeTemplateHelper((attrs, body) => parensC(attrs)(
  ...seperateItems(body, [mo`,`, mspace({ space: 4 }).of()]),
));

export const annotationUnder = makeTemplateHelper(({ label, ...attr }, body) => (
  munder(attr).of(
    mrow.of(...body),
    munder.of(mo`⏟`, mrow.of(label))
  )
), { label: mrow.of() });

export const annotationOver = makeTemplateHelper(({ label, ...attr }, body) => (
  mover(attr).of(
    mrow.of(...body),
    mover.of(mo`⏟`, mrow.of(label))
  )
), { label: mrow.of() });

/***
 * Stacks rows in a table
 */
export const rows = makeTemplateHelper((attr, body) => mtable(attr).of(
  ...body.map(row => mtr.of(mtd.of(row))),
));

/**
 * Stacks rows in a table
 */
export const abs = makeTemplateHelper((attr, body) => (
  mrow(attr).of(mo`|`, ...body, mo`|`)
));

/**
 * Stacks rows in a table
 * @type {TemplateHelper<{ index: E.Item }>}
 */
export const index = makeTemplateHelper(({ index, ...attr }, body) => mrow(attr).of(
  mrow.of(...body),
  mrow.of(mo`[`, index, mo`]`),
), { index: mtext`noop` });


/**
 * Stacks rows in a table
 *
 * @type {TemplateHelper<{ max: E.Item, inc: E.Item }>}
 */
export const sum =
  makeTemplateHelper(({
    max,
    inc,
    ...attr
  }, items) => mathml.mrow(attr).of(
    munderover.of(mi`∑`, mrow.of(inc), mrow.of(max)),
    mrow.of(...items),
  ), ({ max: mrow.of(), inc: mrow.of() }));

/**
 * @type {TemplateHelper<undefined, E.Item[]>}
 */
export const table = makeTemplateHelper(({ columnalign = '', ...attrs }, rows) => (
  mtable(attrs).of(...rows.map(row => {
    const split = columnalign != null
      ? columnalign.split(' ')
      : Array(row.length).fill(undefined);

    const cell = row.map((col, idx) => (
      mtd({ columnalign: split[idx] }).of(col)
    ));

    return mtr({ columnalign }).of(...cell);
  }))
));

/**
 * @type {TemplateHelper<undefined, E.Item[]>}
 */
export const matrix = makeTemplateHelper((attrs, rows) => (
  mrow(attrs).of(
    mo`[`,
    mtable.of(...rows.map(row => (
      mtr.of(...row.map(col => mathml.mtd.of(col)))
    ))),
    mo`]`,
  )
));

/**
 * @type {TemplateHelper<undefined, { cond?: E.Item, then: E.Item }>}
 */
export const piecewise = makeTemplateHelper((attrs, conds) => (
  mrow(attrs).of(
    mo`{`,
    mtable.of(...conds.map(({ cond, then }) =>
      mtr.of(
        mtd.of(then),
        mtd.of(cond == null ? mrow.of() : mtext`if`),
        mtd.of(cond == null ? mtext`otherwise` : cond),
      ),
    )),
  )
));

/**
 * @type {(i: string) => E.Item}
 */
export const iv = i => mi.of(`${i} ⃗`.replace(/\s+/g, ''));

/**
 * @type {Helper<{ fn: E.Item }>}
 */
export const call = makeHelper(({ fn, ...attr }, items) => (
  mrow(attr).of(
    fn,
    mspace({ space: 2 }).of(),
    mrow.of(
      mo`(`,
      ...seperateItems(items, [
        mo`,`,
        mspace({ space: 4 }).of(),
      ]),
      mo`)`,
    ),
  )
), { fn: mrow.of() });

/** @param {...E.Item} body */
export const inv = (...body) => {
  if (body.length === 0) throw new Error();
  const { msup, mrow, mn, mo } = mathml;
  const item = body.length > 1 ? parensA(...body) : body[0];
  return msup.of(item, mrow.of(mo`-`, mn.of(1)));
};

export const multiscripts =
  makeTemplateHelper(({
    sup: [tl, tr] = [undefined, undefined],
    sub: [bl, br] = [undefined, undefined],
    ...attr
  }, body) => {
    const base = body.length > 1 ? parensA(...body) : body[0];
    return mathml.mmultiscripts(attr).of(
      base,
      br ?? mrow.of(),
      tr ?? mrow.of(),
      mathml.mprescripts.of(),
      bl ?? mrow.of(),
      tl ?? mrow.of(),
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
  parensA(...seperateItems(items, [mspace({ space }).of(), o, mspace({ space }).of()])),
);

/**
 * Wraps something in square parens [].
 *
 * @param {E.Item} o
 * @param {number} [space]
 * @returns {(...items: E.Item[]) => E.Item}
 */
const makeOperatorPB = (o, space=4) => (...items) => mrow.of(
  parensB(...seperateItems(items, [mspace({ space }).of(), o, mspace({ space }).of()])),
);

export const gt = makeOperator(mo`>`);
export const lt = makeOperator(mo`<`);
export const eq = makeOperator(mo`=`);
export const eqId = makeOperator(SPECIAL.rel.id);
export const cond = makeOperator(mo`|`, 2);
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
