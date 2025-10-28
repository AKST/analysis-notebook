/**
 * @import { E, ElAttributes } from '../type.ts'
 */
import { frag as _frag } from '../core/render.js';
import {
  makeHelper,
  makeTemplateHelper,
  makeVoidHelper,
} from './util.js';

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

export const a = makeTemplateHelper((attr, body) => ['a', attr, body]);
export const abbr = makeTemplateHelper((attrs, item) => ['attr', attrs, item])
export const address = makeTemplateHelper((attrs, items) => ['address', attrs, items]);
export const article = makeTemplateHelper((attrs, items) => ['article', attrs, items]);
export const area = makeVoidHelper((attrs) => ['area', attrs]);
export const aside = makeHelper((attrs, items) => ['aside', attrs, items]);
export const audio = makeTemplateHelper((attrs, items) => ['audio', attrs, items]);
export const b = makeTemplateHelper((attrs, body) => ['strong', attrs, body]);
export const base = makeVoidHelper((attr) => ['base', attr]);
export const bdi = makeTemplateHelper((attrs, items) => ['bdi', attrs, items]);
export const bdo = makeTemplateHelper((attrs, items) => ['bdo', attrs, items]);
export const blockquote = makeTemplateHelper((attrs, items) => ['blockquote', attrs, items]);
export const br = makeVoidHelper((attr) => ['br', attr]);
export const button = makeTemplateHelper((attrs, items) => ['button', attrs, items]);
export const cite = makeTemplateHelper((attrs, items) => ['cite', attrs, items]);
export const code = makeTemplateHelper((attrs, items) => ['code', attrs, items]);
export const col = makeVoidHelper((attrs) => ['col', attrs]);
export const colgroup = makeTemplateHelper((attrs, items) => ['colgroup', attrs, items]);
export const data = makeTemplateHelper((attrs, items) => ['data', attrs, items]);
export const datalist = makeTemplateHelper((attrs, items) => ['datalist', attrs, items]);
export const del = makeTemplateHelper((attrs, items) => ['del', attrs, items]);
export const details = makeTemplateHelper((attrs, body) => ['details', attrs, body]);
export const dd = makeTemplateHelper((attrs, items) => ['dd', attrs, items]);
export const dialog = makeTemplateHelper((attrs, items) => ['dialog', attrs, items]);
export const div = makeTemplateHelper((attrs, body) => ['div', attrs, body]);
export const dl = makeHelper((attrs, items) => ['dl', attrs, items]);
export const dt = makeTemplateHelper((attrs, items) => ['dt', attrs, items]);
export const embed = makeVoidHelper((attrs) => ['embed', attrs]);
export const fencedframe = makeTemplateHelper((attrs, items) => ['fencedframe', attrs, items]);
export const fieldset = makeTemplateHelper((attrs, items) => ['fieldset', attrs, items]);
export const figure = makeHelper((attrs, items) => ['figure', attrs, items]);
export const figcaption = makeTemplateHelper((attrs, items) => ['figcaption', attrs, items]);
export const font = makeTemplateHelper((attrs, body) => ['font', attrs, body]);
export const footer = makeTemplateHelper((attrs, items) => ['footer', attrs, items]);
export const form = makeTemplateHelper((attrs, items) => ['form', attrs, items]);
export const header = makeHelper((attrs, items) => ['header', attrs, items]);
export const hgroup = makeTemplateHelper((attrs, items) => ['hgroup', attrs, items]);
export const hr = makeVoidHelper((attr) => ['hr', attr]);
export const kbd = makeTemplateHelper((attrs, items) => ['kbd', attrs, items]);
export const i = makeTemplateHelper((attrs, body) => ['em', attrs, body]);
export const iframe = makeTemplateHelper((attrs, items) => ['iframe', attrs, items]);
export const img = makeVoidHelper((attrs) => ['img', attrs]);
export const input = makeVoidHelper((attrs) => ['input', attrs]);
export const ins = makeTemplateHelper((attrs, items) => ['ins', attrs, items]);
export const label = makeTemplateHelper((attrs, items) => ['label', attrs, items]);
export const legend = makeTemplateHelper((attrs, items) => ['legend', attrs, items]);
export const li = makeTemplateHelper((attrs, body) => ['li', attrs, body]);
export const link = makeVoidHelper((attrs) => ['link', attrs]);
export const main = makeTemplateHelper((attrs, items) => ['main', attrs, items]);
export const mark = makeTemplateHelper((attrs, items) => ['mark', attrs, items]);
export const map = makeTemplateHelper((attrs, items) => ['map', attrs, items]);
export const menu = makeTemplateHelper((attrs, items) => ['menu', attrs, items]);
export const meta = makeVoidHelper((attrs) => ['meta', attrs]);
export const meter = makeTemplateHelper((attrs, items) => ['meter', attrs, items]);
export const nav = makeTemplateHelper((attrs, items) => ['nav', attrs, items]);
export const object = makeTemplateHelper((attrs, items) => ['object', attrs, items]);
export const ol = makeTemplateHelper((attrs, body) => ['ol', attrs, body]);
export const optgroup = makeTemplateHelper((attrs, items) => ['optgroup', attrs, items]);
export const option = makeTemplateHelper((attrs, items) => ['option', attrs, items]);
export const output = makeTemplateHelper((attrs, items) => ['output', attrs, items]);
export const p = makeTemplateHelper((attr, body) => ['p', attr, body]);
export const picture = makeTemplateHelper((attrs, items) => ['picture', attrs, items]);
export const progress = makeTemplateHelper((attrs, items) => ['progress', attrs, items]);
export const q = makeTemplateHelper((attrs, items) => ['q', attrs, items]);
export const pre = makeTemplateHelper((attrs, items) => ['pre', attrs, items]);
export const quote = makeTemplateHelper((attrs, items) => ['quote', attrs, items]);
export const rp = makeTemplateHelper((attrs, items) => ['rp', attrs, items]);
export const rt = makeTemplateHelper((attrs, items) => ['rt', attrs, items]);
export const ruby = makeTemplateHelper((attrs, items) => ['ruby', attrs, items]);
export const s = makeTemplateHelper((attrs, items) => ['s', attrs, items]);
export const samp = makeTemplateHelper((attrs, items) => ['samp', attrs, items]);
export const search = makeTemplateHelper((attrs, items) => ['search', attrs, items]);
export const section = makeTemplateHelper((attrs, items) => ['section', attrs, items]);
export const select = makeTemplateHelper((attrs, items) => ['select', attrs, items]);
export const selectedcontent = makeTemplateHelper((attrs, items) => ['selectedcontent', attrs, items]);
export const slot = makeTemplateHelper((attrs, items) => ['slot', attrs, items]);
export const small = makeTemplateHelper((attrs, items) => ['small', attrs, items]);
export const span = makeTemplateHelper((attr, body) => ['span', attr, body]);
export const source = makeVoidHelper((attrs) => ['source', attrs]);
export const sub = makeTemplateHelper((attrs, item) => ['sub', attrs, item]);
export const summary = makeTemplateHelper((attrs, item) => ['summary', attrs, item]);
export const sup = makeTemplateHelper((attrs, item) => ['sup', attrs, item]);
export const svg = makeTemplateHelper((attrs, items) => ['svg', { ns: 'http://www.w3.org/2000/svg', ...attrs  }, items]);
export const table = makeHelper((attrs, items) => ['table', attrs, items]);
export const tbody = makeTemplateHelper((attrs, items) => ['tbody', attrs, items]);
export const td = makeTemplateHelper((attrs, items) => ['td', attrs, items]);
export const template = makeTemplateHelper((attrs, items) => ['template', attrs, items]);
export const textarea = makeTemplateHelper((attrs, items) => ['textarea', attrs, items]);
export const tfoot = makeTemplateHelper((attrs, items) => ['tfoot', attrs, items]);
export const time = makeTemplateHelper((attrs, items) => ['time', attrs, items]);
export const th = makeTemplateHelper((attrs, items) => ['th', attrs, items]);
export const thead = makeTemplateHelper((attrs, items) => ['thead', attrs, items]);
export const tr = makeHelper((attrs, items) => ['tr', attrs, items]);
export const track = makeVoidHelper((attrs) => ['track', attrs]);
export const u = makeTemplateHelper((attrs, body) => ['u', attrs, body]);
export const ul = makeTemplateHelper((attrs, body) => ['ul', attrs, body]);
export const _var = makeTemplateHelper((attrs, body) => ['var', attrs, body]);
export const video = makeTemplateHelper((attrs, items) => ['video', attrs, items]);
export const wbr = makeVoidHelper((attr) => ['wbr', attr]);
export const wbar = makeTemplateHelper((attrs, items) => ['wbar', attrs, items]);

export const h1 = makeTemplateHelper((attrs, items) => ['h1', attrs, items]);
export const h2 = makeTemplateHelper((attrs, items) => ['h2', attrs, items]);
export const h3 = makeTemplateHelper((attrs, items) => ['h3', attrs, items]);
export const h4 = makeTemplateHelper((attrs, items) => ['h4', attrs, items]);
export const h5 = makeTemplateHelper((attrs, items) => ['h5', attrs, items]);
export const h6 = makeTemplateHelper((attrs, items) => ['h6', attrs, items]);

export const helpers = {
  a, abbr, address, area, aside, article, audio, b, button, bdi,
  bdo, blockquote, br, cite, code, col, colgroup, data, datalist,
  details, dd, del, dialog, div, dl, dt, embed, fencedframe,
  fieldset, figcaption, figure, font, form, footer, frag,
  kbd, i, iframe, img, ins, input, header, hgroup, hr,
  h1, h2, h3, h4, h5, h6, label, legend, li, main, mark, map, meter, menu,
  nav, object, ol, optgroup, option, output, p, picture, pre, progress, q,
  quote, rp, rt, ruby, s, samp, search, section, select, selectedcontent,
  small, slot, source, span, sub, summary, sup, table, template, textarea,
  tbody, td, tfoot, th, thead, tr, time, track, u, ul, var: _var, video,
  wbar, wbr,
};
