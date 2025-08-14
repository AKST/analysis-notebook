/**
 * @import { E } from '../type.ts'
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

/**
 * @param {E.Item[]} contents
 * @returns {E.Item}
 */
export const mathml = (contents) => ['math', {
  ns: 'http://www.w3.org/1998/Math/MathML',
  display: 'block'
}, [
  ['mrow', contents],
]]

/**
 * @type {(size?: number) => E.Item}
 */
mathml.space = (size=32) => ['mspace', { width: size+"px" }];

/**
 * @type {(xs: E.Item[]) => E.Item}
 */
mathml.row = xs => ['mrow', xs];

/**
 * @type {(rows: E.Item[]) => E.Item}
 */
mathml.rows = rows => ['mtable', rows.map(row => ['mtr', [['mtd', [row]]]])];

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
mathml.sum = (max, inc) => (
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
mathml.table = (rows, attrs = null) => (
  ['mtable', attrs, rows.map(row => ['mtr', row.map(col => ['mtd', [col]])])]
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
 * @type {(a: E.Item, b: E.Item) => E.Item}
 */
mathml.under = (a, b) => ['munder', [a, b]];

/**
 * @type {(a: E.Item, b: E.Item) => E.Item}
 */
mathml.over = (a, b) => ['mover', [b, a]];

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
mathml.i = i => ['mi', i];

/**
 * @type {(o: string) => E.Item}
 */
mathml.o = o => ['mo', o];

/**
 * @type {(n: string | number) => E.Item}
 */
mathml.n = n => ['mn', n];

/**
 * @type {(i: string) => E.Item}
 */
mathml.iv = i => ['mi', `${i} ⃗`.replace(/\s+/g, '')];

/**
 * @type {(a: E.Item, b: E.Item) => E.Item}
 */
mathml.sub = (a, b) => ['msub', [a, b]];

/**
 * @type {(a: E.Item, b: E.Item) => E.Item}
 */
mathml.sup = (a, b) => ['msup', [a, b]];


/**
 * @type {(a: E.Item, b: E.Item, c: E.Item) => E.Item}
 */
mathml.subsup = (a, b, c) => ['msubsup', [a, b, c]];

/**
 * @type {(a: E.Item) => E.Item}
 */
mathml.inv = a => ['msup', [a, ['mrow', [['mo', '-'], ['mn', 1]]]]];

/**
 * @type {(t: string) => E.Item}
 */
mathml.text = t => ['mtext', t];

/**
 * @type {(a: E.Item[], b: E.Item[]) => E.Item}
 */
mathml.frac = (a, b) => ['mfrac', [
  ['mrow', a],
  ['mrow', b],
]];

mathml.SPECIAL = {
  alpha: mathml.i('α'),
  delta: mathml.i('Δ'),
  beta: mathml.i('β'),
  Simga: mathml.i('∑'),
  exists: mathml.o('∈'),
  neq: mathml.o('≠'),
  plusMinus: mathml.o('±'),
  arrow: mathml.o('⇒'),
  ellipse: {
    h: mathml.o('…'),
    h2: mathml.o('⋯'),
    v: mathml.o('⋮'),
    d1: mathml.o('⋱'),
  },
  operation: {
    dot: mathml.o('·'),
    integral: mathml.o('∫'),
  },
  sets: {
    real: mathml.i('ℝ'),
    nat: mathml.i('ℕ'),
  },
  constraint: {
    lteq: mathml.o('≤')
  },
  cursive: {
    F: mathml.i('ℱ'),
  },
  greek: {
    alpha: mathml.i('α'),
    delta: mathml.i('Δ'),
    beta: mathml.i('β'),
    eplison: mathml.i('ε'),
    Simga: mathml.i('∑'),
  },
}
