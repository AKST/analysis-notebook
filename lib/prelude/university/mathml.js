/**
 * @import { E } from '@base/dsl_dom/type.ts';
 * @import { TemplateHelper, Helper, DefaultHelperAttrs } from '@base/dsl_dom/helper-type.ts';
 */

import { makeHelper } from '@base/dsl_dom/helper.js';
import * as Meta from '@base/dsl_dom/node_meta.js';
import * as mathml from '@base/dsl_dom/helper/mathml.js';

const {
  msup,
  mspace, mrow, mn, mo, mi,
  munderover, munder, mover,
  mtext, mtd, mtr, mtable,
} = mathml;

export const parensA = makeHelper({
  of: ['mathml', 'mrow'],
  create: (meta, body) => mrow(meta).c(mo`(`, ...body, mo`)`),
});

export const parensB = makeHelper({
  of: ['mathml', 'mrow'],
  create: (meta, body) => mrow(meta).c(mo`[`, ...body, mo`]`),
});

export const parensC = makeHelper({
  of: ['mathml', 'mrow'],
  create: (meta, body) => mrow(meta).c(mo`{`, ...body, mo`}`),
});

export const parensD = makeHelper({
  of: ['mathml', 'mrow'],
  create: (meta, body) => mrow(meta).c(mo`⟨`, ...body, mo`⟩`),
});

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

export const set = makeHelper({
  of: ['mathml', 'mrow'],
  create(meta, body) {
    return parensC(meta).c(...seperateItems(body, [mo`,`, mspace(4)]));
  },
});

export const annotationUnder = makeHelper({
  of: ['mathml', 'munder'],
  /**
   * @param {E.Meta<DefaultHelperAttrs<'mathml', 'munder'> & {
   *   label: E.Item,
   *   labelSize?: number,
   *   marginTop?: number,
   * }>} meta
   */
  create(meta, body) {
    const { label, labelSize, marginTop, ...attr } = meta.attributes;
    let style = '';
    if (labelSize != null) style += `; font-size: ${labelSize}px`;
    if (marginTop != null) style += `; margin-top: ${marginTop}px`;
    const newMeta = Meta.build(meta).setAttr(attr).meta;
    return munder(newMeta).c(mrow(...body), munder(mo`⏟`, mrow.attr({ style }).c(label)))
  },
});

export const annotationOver = makeHelper({
  of: ['mathml', 'mover'],
  /**
   * @param {E.Meta<DefaultHelperAttrs<'mathml', 'mover'> & {
   *   label: E.Item,
   *   labelSize?: number,
   *   marginTop?: number,
   * }>} meta
   */
  create(meta, body) {
    const { label, labelSize, ...attr } = meta.attributes;
    const overAttr = labelSize == null ? ({}) : ({ style: `font-size: ${labelSize}px` });
    const newMeta = Meta.build(meta).setAttr(attr).meta;
    return mover(newMeta).c(mrow(...body), mover(mo`⏞`, mrow.attr(overAttr).c(label)))
  },
});

/**
 * Similar to mtable components except columnalign is propagated
 * and rows are automatically handled.
 */
export const table = makeHelper({
  of: ['mathml', 'mtable'],
  /**
   * @param {(E.Item[])[]} rows
   */
  create(meta, rows) {
    const { columnalign = '', ...attr } = meta.attributes;
    const newMeta = Meta.build(meta).setAttr(attr).meta;
    return mtable(newMeta).c(...rows.map(row => {
      const split = columnalign != null
        ? columnalign.split(' ')
        : Array(row.length).fill(undefined);

      const cell = row.map((col, idx) => mtd({ columnalign: split[idx] }).c(col));
      return mtr({ columnalign }).c(...cell);
    }));
  },
});

/***
 * Stacks rows in a table
 */
export const rows = makeHelper({
  of: ['mathml', 'mtable'],
  create(meta, body) {
    return table(meta).c(...body.map(row => [mtd(row)]));
  },
});

/**
 * Stacks rows in a table
 */
export const abs = makeHelper({
  of: ['mathml', 'mrow'],
  create: (meta, body) => mrow(meta).c(mo`|`, mrow(...body), mo`|`)
});

/**
 * Stacks rows in a table
 * @type {Helper<'mathml', 'mrow', DefaultHelperAttrs<'mathml', 'mrow'>, [E.Item, E.Item]>}
 */
export const index = makeHelper({
  of: ['mathml', 'mrow'],
  create: (meta, [body, index]) => mrow(meta).c(mrow(body), mrow(mo`[`, index, mo`]`))
});

export const sum = makeHelper({
  of: ['mathml', 'mrow'],
  /**
   * @typedef {{
   *   max: E.Item,
   *   inc: E.Item,
   * }} SumAttrs
   *
   * @param {E.Meta<DefaultHelperAttrs<'mathml', 'mrow'> & SumAttrs>} meta
   */
  create(meta, items) {
    const { inc, max, ...attr } = meta.attributes;
    const newMeta = Meta.build(meta).setAttr(attr).meta;
    return mrow(newMeta).c(
      munderover(mi`∑`, inc, max),
      mspace(4),
      mrow(...items),
    );
  },
});


export const matrix = makeHelper({
  of: ['mathml', 'mrow'],
  /**
   * @param {E.Item[][]} rows
   */
  create(attrs, rows) {
    return mrow(attrs).c(
      mo`[`,
      mtable(...rows.map(row => (
        mtr(...row.map(col => mathml.mtd(col)))
      ))),
      mo`]`,
    );
  }
});

export const piecewise = makeHelper({
  of: ['mathml', 'mrow'],
  /**
   * @param {{ cond?: E.Item, then: E.Item }[]} conds
   */
  create(meta, conds) {
    return mrow(meta).c(
      mo`{`,
      mtable(...conds.map(({ cond, then }) =>
        mtr(
          mtd.attr({ columnalign: 'left' }).c(then),
          mtd.attr({ columnalign: 'left' }).c(cond == null ? mrow() : mtext`if`),
          mtd.attr({ columnalign: 'left' }).c(cond == null ? mtext`otherwise` : cond),
        ),
      )),
    );
  }
});

export const iv = makeHelper({
  of: ['mathml', 'mi'],
  /**
   * @param {[string]} items
   */
  create: (meta, items) => (
    mi(meta).c(`${items[0]} ⃗`.replace(/\s+/g, ''))
  ),
});

export const call = makeHelper({
  of: ['mathml', 'mrow'],
  /**
   * @typedef {{ paren?: "[]" | "()", fn: E.Item, space?: boolean }} CallAttrs
   *
   * @param {E.Meta<CallAttrs & DefaultHelperAttrs<'mathml', 'mrow'>>} meta
   */
  create(meta, items) {
    const { paren = '()', fn = mrow(), space = true, ...attr } = meta.attributes;
    const [po, pc] = paren === '()' ? [mo`(`, mo`)`] : [mo`[`, mo`]`];
    const inner = seperateItems(items, [mo`,`, mspace(4)]);
    const leadingSpace = space ? [mspace(2)] : [];
    const newMeta = Meta.build(meta).setAttr(attr).meta;
    return mrow(newMeta).c(fn, ...leadingSpace, mrow(po, ...inner, pc));
  },
});

export const inv = makeHelper({
  of: ['mathml', 'msup'],
  create(meta, items) {
    if (items.length === 0) throw new Error();
    const item = items.length > 1 ? parensA(...items) : items[0];
    return msup(meta).c(item, mrow(mo`-`, mn(1)));
  },
});

export const neg = makeHelper({
  of: ['mathml', 'mrow'],
  create(meta, items) {
    if (items.length === 0) throw new Error();
    const item = items.length > 1 ? parensA(...items) : items[0];
    return mrow(meta).c(mo`-`, item);
  },
});

export const multiscripts = makeHelper({
  of: ['mathml', 'mmultiscripts'],
  /**
   * @typedef {{
   *   sup?: [E.Item | undefined, E.Item | undefined] | undefined,
   *   sub?: [E.Item | undefined, E.Item | undefined] | undefined,
   * }} MultiscriptsAttrs
   *
   * @param {E.Meta<MultiscriptsAttrs & DefaultHelperAttrs<'mathml', 'mrow'>>} meta
   */
  create(meta, body) {
    const {
      sup: [tl, tr] = [undefined, undefined],
      sub: [bl, br] = [undefined, undefined],
      ...attr
    } = meta.attributes;

    const base = body.length > 1 ? parensA(...body) : body[0];
    const newMeta = Meta.build(meta).setAttr(attr).meta;

    return mathml.mmultiscripts(newMeta).c(
      base,
      br ?? mrow(),
      tr ?? mrow(),
      mathml.mprescripts(),
      bl ?? mrow(),
      tl ?? mrow(),
    );
  },
});

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
    alpha: mathml.mi`α`,
    Alpha: mathml.mi`𝛢`,
    beta: mathml.mi`β`,
    Beta: mathml.mi`𝛣`,
    delta: mathml.mi`δ`,
    Delta: mathml.mi`𝛥`,
    gamma: mathml.mi`γ`,
    Gamma: mathml.mi`𝛤`,
    eplison: mathml.mi`ε`,
    Eplison: mathml.mi`𝛦`,
    zeta: mathml.mi`ζ`,
    Zeta: mathml.mi`𝛧`,
    eta: mathml.mi`η`,
    Eta: mathml.mi`𝛨`,
    theta: mathml.mi`θ`,
    Theta: mathml.mi`𝛩`,
    iota: mathml.mi`ι`,
    Iota: mathml.mi`𝛪`,
    kappa: mathml.mi`κ`,
    Kappa: mathml.mi`𝛫`,
    lambda: mathml.mi`𝛬`,
    Lambda: mathml.mi`λ`,
    mu: mathml.mi`μ`,
    Mu: mathml.mi`𝛭`,
    nu: mathml.mi`ν`,
    Nu: mathml.mi`𝛮`,
    xi: mathml.mi`ξ`,
    Xi: mathml.mi`𝛯`,
    omicron: mathml.mi`ο`,
    Omicron: mathml.mi`𝛰`,
    pi: mathml.mi`π`,
    Pi: mathml.mi`𝛱`,
    rho: mathml.mi`ρ`,
    Rho: mathml.mi`ρ`,
    sigma: mathml.mi`σ`,
    Sigma: mathml.mi`𝛴`,
    tau: mathml.mi`τ`,
    Tau: mathml.mi`𝛵`,
    upsilon: mathml.mi`υ`,
    Upsilon: mathml.mi`𝛶`,
    phi: mathml.mi`φ`,
    Phi: mathml.mi`𝛷`,
    chi: mathml.mi`𝝌`,
    Chi: mathml.mi`𝛸`,
    psi: mathml.mi`ψ`,
    Psi: mathml.mi`𝛹`,
    omega: mathml.mi`ω`,
    Omega: mathml.mi`𝛺`,
    circumflex: {
      beta: mathml.mi`β̂`,
      gamma: mathml.mi`γ̂`,
      theta: mathml.mi`θ̂`,
      mu: mathml.mi`μ̂`,
      rho: mathml.mi`ρ̂`,
      sigma: mathml.mi`σ̂`,
    },
  },
}


/**
 * @typedef {{
 *   paren?: '()' | '[]' | '{}' | '⟨⟩' | undefined,
 *   subsup?: boolean
 * }} OperatorAttr
 *
 * @typedef {{ pos?: string[] }} OpMtrAttrs
 */

/**
 * @template {string} T
 * @param {E.Node<'mathml', T, DefaultHelperAttrs<'mathml', T>>} o
 * @param {number} [space]
 * @returns {Helper<'mathml', 'mrow', OperatorAttr & DefaultHelperAttrs<'mathml', 'mrow'>> & {
 *   sub: Helper<unknown, unknown, DefaultHelperAttrs<'mathml', 'mrow'>>,
 *   sup: Helper<unknown, unknown, DefaultHelperAttrs<'mathml', 'mrow'>>,
 *   paren: Helper<unknown, unknown, DefaultHelperAttrs<'mathml', 'mrow'>>,
 *   square: Helper<unknown, unknown, DefaultHelperAttrs<'mathml', 'mrow'>>,
 *   brace: Helper<unknown, unknown, DefaultHelperAttrs<'mathml', 'mrow'>>,
 *   angle: Helper<unknown, unknown, DefaultHelperAttrs<'mathml', 'mrow'>>,
 *   mtr: Helper<unknown, unknown, OpMtrAttrs & DefaultHelperAttrs<'mathml', 'mtr'>>,
 *   array: (...items: E.Item[]) => E.Item[],
 * }}
 */
const makeOperator = (o, space = 4) => {
  const helper = makeHelper({
    of: ['mathml', 'mrow'],
    /**
     * @param {E.Meta<OperatorAttr & DefaultHelperAttrs<'mathml', 'mrow'>>} meta
     */
    create(meta, items) {
      const { paren, subsup = false, ...attrs } = meta.attributes;
      const newMeta = Meta.build(meta).setAttr(attrs).meta;

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
        case '⟨⟩':
          wrapper = parensD;
          break;
        default:
          wrapper = mrow;
      }

      return wrapper(newMeta).c(
        ...seperateItems(items, sep)
      );
    },
  });

  const operatorHelper = Object.assign(helper, {
    sup: makeHelper({
      of: ['mathml', 'mrow'],
      create: (meta, items) => helper(meta).attr({ subsup: true }).c(...items),
    }),
    sub: makeHelper({
      of: ['mathml', 'mrow'],
      create: (meta, items) => helper(meta).attr({ subsup: true }).c(...items),
    }),
    paren: makeHelper({
      of: ['mathml', 'mrow'],
      create: (meta, items) => helper(meta).attr({ paren: '()' }).c(...items),
    }),
    brace: makeHelper({
      of: ['mathml', 'mrow'],
      create: (meta, items) => helper(meta).attr({ paren: '{}' }).c(...items),
    }),
    square: makeHelper({
      of: ['mathml', 'mrow'],
      create: (meta, items) => helper(meta).attr({ paren: '[]' }).c(...items),
    }),
    angle: makeHelper({
      of: ['mathml', 'mrow'],
      create: (meta, items) => helper(meta).attr({ paren: '⟨⟩' }).c(...items),
    }),
    /**
     * @type {Helper<'mathml', 'mtr', OpMtrAttrs & DefaultHelperAttrs<'mathml', 'mtr'>>}
     */
    mtr: makeHelper({
      of: ['mathml', 'mtr'],
      create: (meta, items) => {
        const { pos: ca = [], ...attrs } = meta.attributes;
        const newMeta = Meta.build(meta).setAttr(attrs).meta;
        return mtr(newMeta).c(...seperateItems(items.map((it, i) => mtd({ columnalign: ca[i] ?? 'center' }).c(it)), [mtd(o)]));
      },
    }),

    /**
     * @param {...E.Item} items
     * @returns {E.Item[]}
     */
    array: (...items) => [
      items[0],
      ...items.slice(1).flatMap(item => [o, item])
    ],
  });

  return /** @type {any} */ (operatorHelper);
};

export const op = {
  gt: makeOperator(mo`>`),
  gteq: makeOperator(mo`≥`),
  lt: makeOperator(mo`<`),
  lteq: makeOperator(mo`≤`),
  or: makeOperator(mo`∨`),
  and: makeOperator(mo`∧`),
  eq: makeOperator(mo`=`),
  eqId: makeOperator(SPECIAL.rel.id),
  neq: makeOperator(mo`≠`),
  cond: makeOperator(mo`|`, 2),
  imply: makeOperator(SPECIAL.rel.imply),
  aprox: makeOperator(SPECIAL.rel.aprox),
  approxEq: makeOperator(mo`≅`),
  addMinus: makeOperator(mo`±`),
  add: makeOperator(mo`+`),
  mul: makeOperator(SPECIAL.operation.dot, 1),
  mul0: makeOperator(mo.c('\u{2062}'), 1),
  minus: makeOperator(mo`-`),
  div: makeOperator(SPECIAL.operation.divide),
  comma: makeOperator(mrow(mo`,`, mspace(2)), 0),
  // direct sum
  sumDir: makeOperator(mo`⊕`),
  member: makeOperator(mo`∈`),
};
