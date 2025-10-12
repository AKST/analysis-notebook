/**
 * @import { E, ElAttributes } from '../type.ts'
 */
import { frag as _frag } from '../core/render.js';

/**
 * @param {(attrs: ElAttributes,items: E.Item[]) => E.Item} f
 * @returns {{
 *   (text: TemplateStringsArray, ...items: E.Item[]): E.Item;
 *   (attr: any): {
 *     (text: TemplateStringsArray, ...items: E.Item[]): E.Item;
 *     of: (...items: E.Item[]) => E.Item;
 *   };
 *   attr: (attr: ElAttributes) => {
 *     (text: TemplateStringsArray, ...items: E.Item[]): E.Item;
 *     of: (...items: E.Item[]) => E.Item;
 *   };
 *   of: (...items: E.Item[]) => E.Item;
 * }}
 */
const makeHelper = (f) => {
  /**
   * @param {any} attrs
   * @param {TemplateStringsArray} text
   * @param {...E.Item} items
   * @returns {E.Item}
   */
  const stringTemplateFunction = function (attrs, text, ...items) {
    if (typeof text === 'string') return f(attrs, [text]);

    if (text.length !== items.length + 1) {
      console.error(text, items);
      throw new Error();
    }

    /** @type {E.Item[]} */
    const body = []
    for (let i = 0; i < items.length; i++) {
      body.push(text[i]);
      body.push(items[i]);
    }
    body.push(text.at(-1));
    return f(attrs, body);
  };

  // @ts-ignore - i can't be stuffed
  const withAttr = function (attr) {
    // @ts-ignore - i can't be stuffed
    const localHelper = (...args) => stringTemplateFunction(attr, ...args);
    /** @param {...E.Item} items */
    localHelper.of = (...items) => f(attr, items);
    return localHelper;
  }

  // @ts-ignore - i can't be stuffed
  const helper = function () {
    if (typeof arguments[0] === 'object' && !Array.isArray(arguments[0])) {
      // @ts-ignore - i can't be stuffed
      return withAttr(arguments[0]);
    } else {
      // @ts-ignore - i can't be stuffed
      return stringTemplateFunction({}, ...arguments);
    }
  };

  /** @param {...E.Item} items */
  helper.of = (...items) => f({}, items);
  helper.attr = withAttr;

  // @ts-ignore - i can't be stuffed
  return helper;
};

/**
 * @param {E.Item[][]} ul
 * @returns {E.Item}
 */
export const ul = ul => {
  return ['ul', ul.map((li) => (
    ['li', {}, li]
  ))]
};

/**
 * @param {[
 *  (E.Atom | E.Item[]),
 *  (E.Atom | E.Item[])
 * ][]} dl
 * @returns {E.Item}
 */
export const dl = dl => {
  return ['dl', dl.flatMap(([dt, dd]) => [
    ['dt', dt],
    ['dd', dd],
  ])]
};



/**
 * @param {E.Item} fig
 * @param {E.Item} cap
 * @returns {E.Item}
 */
export const figure = (fig, cap) => ['figure', {}, [
  fig,
  ['figcaption', {}, [cap]]
]];

/**
 * @param {...E.Item} its
 * @returns {E.Frag}
 */
export const frag = (...its) => _frag(its);

/**
 * @param {{
 *   src: string,
 *   className?: string,
 *   height?: string,
 *   style?: string,
 *   title?: string,
 *   alt?: string,
 * }} cfg
 * @returns {E.Item}
 */
export const image = (cfg) => ['img', cfg];

export const a = makeHelper((attr, body) => ['a', attr, body]);
export const abbr = makeHelper((attrs, item) => ['attr', attrs, item])
export const b = makeHelper((attrs, body) => ['strong', attrs, body]);
export const details = makeHelper((attrs, body) => ['details', attrs, body]);
export const div = makeHelper((attrs, body) => ['div', attrs, body]);
export const font = makeHelper((attrs, body) => ['font', attrs, body]);
export const i = makeHelper((attrs, body) => ['em', attrs, body]);
export const label = makeHelper((attrs, items) => ['label', attrs, items]);
export const li = makeHelper((attrs, body) => ['li', attrs, body]);
export const ol = makeHelper((attrs, body) => ['ol', attrs, body]);
export const p = makeHelper((attr, body) => ['p', attr, body]);
export const quote = makeHelper((attrs, items) => ['quote', attrs, items]);
export const span = makeHelper((attr, body) => ['span', attr, body]);
export const sub = makeHelper((attrs, item) => ['sub', attrs, item]);
export const summary = makeHelper((attrs, item) => ['summary', attrs, item]);
export const sup = makeHelper((attrs, item) => ['sup', attrs, item]);
export const u = makeHelper((attrs, body) => ['u', attrs, body]);
export const ul_ = makeHelper((attrs, body) => ['ul', attrs, body]);


export const small = makeHelper((attrs, items) => {
  return ['p', {
    ...attrs,
    style: (attrs.style ?? '')+';font-size: smaller',
  }, items]
});

export const h1 = makeHelper((attrs, items) => ['h1', attrs, items]);
export const h2 = makeHelper((attrs, items) => ['h2', attrs, items]);
export const h3 = makeHelper((attrs, items) => ['h3', attrs, items]);
export const h4 = makeHelper((attrs, items) => ['h4', attrs, items]);
export const h5 = makeHelper((attrs, items) => ['h5', attrs, items]);
export const h6 = makeHelper((attrs, items) => ['h6', attrs, items]);

/** @param {ElAttributes} [attr] @return {E.Item} */
export const br = (attr = {}) => ['br', attr];

/** @param {ElAttributes} [attr] @return {E.Item} */
export const hr = (attr = {}) => ['hr', attr];

export const helpers = {
  a, abbr, b, br, details, div, dl, figure, font, frag,
  i, image, hr, h1, h2, h3, h4, h5, h6, label,
  li, ol, p, quote, small, span, sub, summary, sup,
  u, ul: ul_
};
