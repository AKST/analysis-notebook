/**
 * @import { E, ElAttributes } from '../type.ts'
 */
import { frag as _frag } from '../core/render.js';

/**
 * @param {E.Item} item
 * @returns {E.Item[]}
 */
const setFlatApply = item => [
  ['mo', ','],
  ['mspace', { width: '4px' }],
  item,
]
/**
 * @param {number} [size]
 * @returns {E.Item}
 */
const space = (size=32) => ['mspace', { width: size+"px" }];

export const mathml = {}

/**
 * @type {(size?: number) => E.Item}
 */
mathml.space = (size=32) => ['mspace', { width: size+"px" }];

/**
 * @type {(xs: E.Item[], attrs?: ElAttributes) => E.Item}
 */
const row = (xs, attrs) => ['mrow', attrs ?? {}, xs];

/**
 * @type {(items: E.Item[]) => E.Item}
 */
mathml.paren = items => ['mrow', [['mo', '('], ...items, ['mo', ')']]];

/**
 * @type {(items: E.Item[]) => E.Item}
 */
mathml.set = items => _frag([
  ['mo', '{'],
  items[0],
  ...items.slice(1).flatMap(setFlatApply),
  ['mo', '}'],
]);

/**
 * @type {(body: E.Item) => E.Item}
 */
mathml.abs = body => _frag([['mo', '|'], body, ['mo', '|']]);

/**
 * @type {(expr: E.Item, index: E.Item) => E.Item}
 */
mathml.idx = (expr, index) => _frag([expr, ['mo', '['], index, ['mo', ']']]);

/**
 * @type {(max: E.Item, inc: E.Item) => E.Item}
 */
const sum = (max, inc) => (
  ['mrow', [
    ['munderover', [
      ['mi', '∑'],
      ['mrow', [inc]],
      ['mrow', [max]],
    ]],
  ]]
);

/**
 * @type {(rows: E.Item[][], attrs?: any) => E.Item}
 */
mathml.table = (rows, { columnalign, ...attrs } = {}) => (
  ['mtable', attrs, rows.map(row => {
    const split = columnalign != null
      ? columnalign.split(' ')
      : Array(row.length).fill(undefined);
    return ['mtr', { columnalign }, row.map((col, idx) => (
      ['mtd', { columnalign: split[idx] }, [col]]
    ))]
  })]
);

/**
 * @type {(m: E.Item[][]) => E.Item}
 */
mathml.matrix = m => (
  ['mrow', [
    ['mo', '['],
    ['mtable', m.map(row => ['mtr', row.map(col => ['mtd', [col]])])],
    ['mo', ']'],
  ]]
);

/**
 * @type {(conds: { cond?: E.Item[], then: E.Item[] }[]) => E.Item}
 */
mathml.piecewise = conds => (
  ['mrow', [
    ['mo', '{'],
    ['mtable', conds.map(({ cond, then }) => ['mtr', [
      ['mtd', then],
      ['mtd', cond == null ? [mathml.space(0)] : [text('if')]],
      ['mtd', cond == null ? [text('otherwise')] : cond],
    ]])],
  ]]
);

/**
 * @type {(a: E.Item, b: E.Item) => E.Item}
 */
const under = (a, b) => ['munder', [a, b]];

/**
 * @type {(fname: string | E.Item, ...xs: E.Item[]) => E.Item}
 */
mathml.call = (fname, ...xs) => _frag([
  ['mi', typeof fname === 'string' ? fname : [fname]],
  ['mrow', [
    ['mo', '('],
    xs.slice(1).reduce(
        (last, next) => _frag([
          last,
          space(1),
          ['mo', ','],
          space(4),
          next,
        ]),
        xs[0],
    ),
    ['mo', ')'],
  ]],
]);

/**
 * @type {(i: string) => E.Item}
 */
const i = value => ['mi', value];

/**
 * @type {(o: string) => E.Item}
 */
const o = v => ['mo', v];

/**
 * @type {(n: string | number) => E.Item}
 */
const n = n => ['mn', n];

/**
 * @type {(i: string) => E.Item}
 */
mathml.iv = i => ['mi', `${i} ⃗`.replace(/\s+/g, '')];

/**
 * @type {(a: E.Item, b: E.Item) => E.Item}
 */
const sub = (a, b) => ['msub', [a, b]];

/**
 * @type {(a: E.Item, b: E.Item) => E.Item}
 */
mathml.sup = (a, b) => ['msup', [a, b]];


/**
 * @type {(a: E.Item, b: E.Item, c: E.Item) => E.Item}
 */
mathml.subsup = (a, b, c) => ['msubsup', [a, b, c]];

/**
 * @type {(base: E.Item, options: {
 *   sup?: [E.Item | undefined, E.Item | undefined],
 *   sub?: [E.Item | undefined, E.Item | undefined],
 * }) => E.Item}
 */
mathml.multiscripts = (base, {
  sup: [tl, tr] = [undefined, undefined],
  sub: [bl, br] = [undefined, undefined],
}) => ['mmultiscripts', [
  base,
  br ?? row([]),
  tr ?? row([]),
  ['mprescripts'],
  bl ?? row([]),
  tl ?? row([]),
]];

/**
 * @type {(a: E.Item) => E.Item}
 */
mathml.inv = a => ['msup', [a, ['mrow', [['mo', '-'], ['mn', 1]]]]];

/**
 * @param {string} t
 * @param {ElAttributes} [options]
 * @returns {E.Item}
 */
const text = (t, options = {}) => ['mtext', options, [t]];

/**
 * @type {(a: E.Item[], b: E.Item[]) => E.Item}
 */
mathml.frac = (a, b) => ['mfrac', [
  ['mrow', a],
  ['mrow', b],
]];

/**
 * @type {(a: E.Item) => E.Item}
 */
mathml.sqrt = (value) => ['msqrt', [value]];

mathml.SPECIAL = {
  alpha: i('α'),
  delta: i('Δ'),
  beta: i('β'),
  neq: o('≠'),
  plusMinus: o('±'),
  arrow: o('⇒'),
  because: o('∵'),
  therefore: o('∴'),
  ellipse: {
    h: o('…'),
    h2: o('⋯'),
    v: o('⋮'),
    d1: o('⋱'),
  },
  operation: {
    dot: o('·'),
    exists: o('∈'),
    integral: o('∫'),
    plusMinus: o('±'),
  },
  sets: {
    real: i('ℝ'),
    nat: i('ℕ'),
  },
  constraint: {
    neq: o('≠'),
    lteq: o('≤')
  },
  cursive: {
    F: i('ℱ'),
  },
  greek: {
    alpha: i('α'),
    beta: i('𝛽'),
    betaCrfx: i('𝛽̂'),
    delta: i('Δ'),
    // TODO make uppercase
    Delta: i('Δ'),
    delta2: i('δ'),
    Theta: i('Θ'),
    theta: i('θ'),
    gamma: i('ɣ'),
    eplison: i('ε'),
    sigma: i('𝜎'),
    sigmaCrfx: i('𝜎̂'),
    Sigma: i('∑'),
    Pi: i('Π'),
    rho: i('𝜌'),
    rhoCrfx: i('𝜌̂'),
    circumflex: {
      beta: i('𝛽̂'),
      gamma: i('ɣ̂'),
      mu: i('μ̂'),
      sigma: i('σ̂'),
    },
  },
}
