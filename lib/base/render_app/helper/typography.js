/**
 * @import { E, ElAttributes } from '../type.ts'
 */
import { frag as _frag } from '../core/render.js';
import { makeHelper } from './util.js';

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
export const address = makeHelper((attrs, items) => ['address', attrs, items]);
export const article = makeHelper((attrs, items) => ['article', attrs, items]);
export const area = makeHelper((attrs, items) => ['area', attrs, items]);
export const aside = makeHelper((attrs, items) => ['aside', attrs, items]);
export const audio = makeHelper((attrs, items) => ['audio', attrs, items]);
export const b = makeHelper((attrs, body) => ['strong', attrs, body]);
export const bdi = makeHelper((attrs, items) => ['bdi', attrs, items]);
export const bdo = makeHelper((attrs, items) => ['bdo', attrs, items]);
export const blockquote = makeHelper((attrs, items) => ['blockquote', attrs, items]);
export const button = makeHelper((attrs, items) => ['button', attrs, items]);
export const cite = makeHelper((attrs, items) => ['cite', attrs, items]);
export const code = makeHelper((attrs, items) => ['code', attrs, items]);
export const col = makeHelper((attrs, items) => ['col', attrs, items]);
export const colgroup = makeHelper((attrs, items) => ['colgroup', attrs, items]);
export const data = makeHelper((attrs, items) => ['data', attrs, items]);
export const datalist = makeHelper((attrs, items) => ['datalist', attrs, items]);
export const del = makeHelper((attrs, items) => ['del', attrs, items]);
export const details = makeHelper((attrs, body) => ['details', attrs, body]);
export const dd = makeHelper((attrs, items) => ['dd', attrs, items]);
export const dialog = makeHelper((attrs, items) => ['dialog', attrs, items]);
export const div = makeHelper((attrs, body) => ['div', attrs, body]);
export const _dl = makeHelper((attrs, items) => ['dl', attrs, items]);
export const dt = makeHelper((attrs, items) => ['dt', attrs, items]);
export const embed = makeHelper((attrs, items) => ['embed', attrs, items]);
export const fencedframe = makeHelper((attrs, items) => ['fencedframe', attrs, items]);
export const fieldset = makeHelper((attrs, items) => ['fieldset', attrs, items]);
export const _figure = makeHelper((attrs, items) => ['figure', attrs, items]);
export const figcaption = makeHelper((attrs, items) => ['figcaption', attrs, items]);
export const font = makeHelper((attrs, body) => ['font', attrs, body]);
export const footer = makeHelper((attrs, items) => ['footer', attrs, items]);
export const form = makeHelper((attrs, items) => ['form', attrs, items]);
export const header = makeHelper((attrs, items) => ['header', attrs, items]);
export const hgroup = makeHelper((attrs, items) => ['hgroup', attrs, items]);
export const kbd = makeHelper((attrs, items) => ['kbd', attrs, items]);
export const i = makeHelper((attrs, body) => ['em', attrs, body]);
export const iframe = makeHelper((attrs, items) => ['iframe', attrs, items]);
export const input = makeHelper((attrs, items) => ['input', attrs, items]);
export const ins = makeHelper((attrs, items) => ['ins', attrs, items]);
export const label = makeHelper((attrs, items) => ['label', attrs, items]);
export const legend = makeHelper((attrs, items) => ['legend', attrs, items]);
export const li = makeHelper((attrs, body) => ['li', attrs, body]);
export const main = makeHelper((attrs, items) => ['main', attrs, items]);
export const mark = makeHelper((attrs, items) => ['mark', attrs, items]);
export const map = makeHelper((attrs, items) => ['map', attrs, items]);
export const menu = makeHelper((attrs, items) => ['menu', attrs, items]);
export const meter = makeHelper((attrs, items) => ['meter', attrs, items]);
export const nav = makeHelper((attrs, items) => ['nav', attrs, items]);
export const object = makeHelper((attrs, items) => ['object', attrs, items]);
export const ol = makeHelper((attrs, body) => ['ol', attrs, body]);
export const optgroup = makeHelper((attrs, items) => ['optgroup', attrs, items]);
export const option = makeHelper((attrs, items) => ['option', attrs, items]);
export const output = makeHelper((attrs, items) => ['output', attrs, items]);
export const p = makeHelper((attr, body) => ['p', attr, body]);
export const picture = makeHelper((attrs, items) => ['picture', attrs, items]);
export const progress = makeHelper((attrs, items) => ['progress', attrs, items]);
export const q = makeHelper((attrs, items) => ['q', attrs, items]);
export const pre = makeHelper((attrs, items) => ['pre', attrs, items]);
export const quote = makeHelper((attrs, items) => ['quote', attrs, items]);
export const rp = makeHelper((attrs, items) => ['rp', attrs, items]);
export const rt = makeHelper((attrs, items) => ['rt', attrs, items]);
export const ruby = makeHelper((attrs, items) => ['ruby', attrs, items]);
export const s = makeHelper((attrs, items) => ['s', attrs, items]);
export const samp = makeHelper((attrs, items) => ['samp', attrs, items]);
export const search = makeHelper((attrs, items) => ['search', attrs, items]);
export const section = makeHelper((attrs, items) => ['section', attrs, items]);
export const select = makeHelper((attrs, items) => ['select', attrs, items]);
export const selectedcontent = makeHelper((attrs, items) => ['selectedcontent', attrs, items]);
export const slot = makeHelper((attrs, items) => ['slot', attrs, items]);
export const span = makeHelper((attr, body) => ['span', attr, body]);
export const source = makeHelper((attrs, items) => ['source', attrs, items]);
export const sub = makeHelper((attrs, item) => ['sub', attrs, item]);
export const summary = makeHelper((attrs, item) => ['summary', attrs, item]);
export const sup = makeHelper((attrs, item) => ['sup', attrs, item]);
export const svg = makeHelper((attrs, items) => ['svg', { ns: 'http://www.w3.org/2000/svg', ...attrs  }, items]);
export const table = makeHelper((attrs, items) => ['table', attrs, items]);
export const tbody = makeHelper((attrs, items) => ['tbody', attrs, items]);
export const td = makeHelper((attrs, items) => ['td', attrs, items]);
export const template = makeHelper((attrs, items) => ['template', attrs, items]);
export const textarea = makeHelper((attrs, items) => ['textarea', attrs, items]);
export const tfoot = makeHelper((attrs, items) => ['tfoot', attrs, items]);
export const time = makeHelper((attrs, items) => ['time', attrs, items]);
export const th = makeHelper((attrs, items) => ['th', attrs, items]);
export const thead = makeHelper((attrs, items) => ['thead', attrs, items]);
export const tr = makeHelper((attrs, items) => ['tr', attrs, items]);
export const track = makeHelper((attrs, items) => ['track', attrs, items]);
export const u = makeHelper((attrs, body) => ['u', attrs, body]);
export const ul_ = makeHelper((attrs, body) => ['ul', attrs, body]);
export const _var = makeHelper((attrs, body) => ['var', attrs, body]);
export const video = makeHelper((attrs, items) => ['video', attrs, items]);
export const wbar = makeHelper((attrs, items) => ['wbar', attrs, items]);


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
  a, abbr, address, area, aside, article, audio, b, button, bdi,
  bdo, blockquote, br, cite, code, col, colgroup, data, datalist,
  details, dd, del, dialog, div, _dl, dl, dt, embed, fencedframe,
  fieldset, figcaption, figure, _figure, font, form, footer, frag,
  kbd, i, iframe, img: image, image, ins, input, header, hgroup, hr,
  h1, h2, h3, h4, h5, h6, label, legend, li, main, mark, map, meter, menu,
  nav, object, ol, optgroup, option, output, p, picture, pre, progress, q,
  quote, rp, rt, ruby, s, samp, search, section, select, selectedcontent,
  small, slot, source, span, sub, summary, sup, table, template, textarea,
  tbody, td, tfoot, th, thead, tr, time, track, u, ul: ul_, var: _var, video,
  wbar,
};
