/**
 * @import { E } from '../type.ts'
 */
import { frag as _frag } from '../core/render.js';

/**
 * @param {(items: E.Item[]) => E.Item} f
 */
const makeHelper = (f) => {
  /**
   * @param {TemplateStringsArray} text
   * @param {...E.Item} items
   * @returns {E.Item}
   */
  const helper = function (text, ...items) {
    if (typeof text === 'string') return f([text]);

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
    return f(body);
  };

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
 * @param {...E.Item} text
 * @returns {E.Item}
 */
export const p = (...text) => ['p', text];

/**
 * @param {...E.Item} text
 * @returns {E.Item}
 */
export const span = (...text) => ['span', text];

/**
 * @param {...E.Item} text
 * @returns {E.Item}
 */
export const li = (...text) => ['li', text];

/**
 * @param {E.Item} fig
 * @param {E.Item} cap
 * @returns {E.Item}
 */
export const figure = (fig, cap) => ['figure', {}, [
  fig,
  ['figcaption', {}, [cap]]
]];

export const small = makeHelper(items => {
  return ['p', { style: 'font-size: smaller' }, items]
});

/**
 * @param {...E.Item} text
 * @returns {E.Item}
 */
export const quote = (...text) => ['quote', text];

/**
 * @param {E.Item[] | string} text
 * @returns {E.Item}
 */
export const b = text => ['strong', text];

/**
 * @param {E.Item[] | string} text
 * @returns {E.Item}
 */
export const i = text => ['strong', text];

/**
 * @param {E.Attrs} attrs
 * @param {string} text
 * @returns {E.Item}
 */
export const font = (attrs, text) => ['font', attrs, [text]];

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

export const sub = makeHelper(item => ['sub', item]);

export const sup = makeHelper(item => ['sup', item]);

/**
 * @param {string | E.Attrs} attrs
 * @param {...E.Item} its
 * @returns {E.Item}
 */
export const link = (attrs, ...its) => (
  typeof attrs === 'string'
    ? ['a', { href: attrs }, its]
    : ['a', attrs, its]
);

export const h1 = makeHelper(items => ['h1', items]);
export const h2 = makeHelper(items => ['h2', items]);
export const h3 = makeHelper(items => ['h3', items]);
export const h4 = makeHelper(items => ['h4', items]);
export const h5 = makeHelper(items => ['h5', items]);
export const h6 = makeHelper(items => ['h6', items]);

export const helpers = {
  frag, i, p, b, dl, ul, li,
  quote, font, sub, small,
  image, span, figure, sup,
  h1, h2, h3, h4, h5, h6,
};
