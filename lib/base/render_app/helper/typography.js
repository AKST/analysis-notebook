/**
 * @import { E } from '../type.ts'
 */
import { frag as _frag } from '../core/render.js';

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
export const li = (...text) => ['li', text];

/**
 * @param {...E.Item} text
 * @returns {E.Item}
 */
export const small = (...text) => ['p', { style: 'font-size: smaller' }, text];

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

export const helpers = {
  frag, i, p, b, dl, ul, li,
  quote, font, small,
  image,
};
