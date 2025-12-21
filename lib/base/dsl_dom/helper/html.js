/**
 * @import { TemplateHelper, Helper, DefaultHelperAttrs } from '../helper-type.ts';
 * @import { E } from '../type.ts';
 */
import { makeHelper, makeTemplateHelper, makeVoidHelper } from '../helper.js';

export const a = makeTemplateHelper({ of: ['html', 'a'] });
export const abbr = makeTemplateHelper({ of: ['html', 'attr'] })
export const address = makeTemplateHelper({ of: ['html', 'address'] });
export const article = makeTemplateHelper({ of: ['html', 'article'] });
export const area = makeVoidHelper({ of: ['html', 'area'] });
export const aside = makeHelper({ of: ['html', 'aside'] });
export const audio = makeTemplateHelper({ of: ['html', 'audio'] });
export const b = makeTemplateHelper({ of: ['html', 'b'] });
export const base = makeVoidHelper({ of: ['html', 'base'] });
export const bdi = makeTemplateHelper({ of: ['html', 'bdi'] });
export const bdo = makeTemplateHelper({ of: ['html', 'bdo'] });
export const blockquote = makeTemplateHelper({ of: ['html', 'blockquote'] });
export const br = makeVoidHelper({ of: ['html', 'br'] });
export const button = makeHelper({ of: ['html', 'button'] });
export const caption = makeTemplateHelper({ of: ['html', 'caption'] });
export const cite = makeTemplateHelper({ of: ['html', 'cite'] });
export const code = makeTemplateHelper({ of: ['html', 'code'] });
export const col = makeVoidHelper({ of: ['html', 'col'] });
export const colgroup = makeTemplateHelper({ of: ['html', 'colgroup'] });
export const data = makeTemplateHelper({ of: ['html', 'data'] });
export const datalist = makeTemplateHelper({ of: ['html', 'datalist'] });
export const del = makeTemplateHelper({ of: ['html', 'del'] });
export const details = makeHelper({ of: ['html', 'details'] });
export const dd = makeTemplateHelper({ of: ['html', 'dd'] });
export const dfn = makeTemplateHelper({ of: ['html', 'dfn'] });
export const dialog = makeTemplateHelper({ of: ['html', 'dialog'] });
export const div = makeHelper({ of: ['html', 'div'] });
export const dl = makeHelper({ of: ['html', 'dl'] });
export const dt = makeTemplateHelper({ of: ['html', 'dt'] });
export const em = makeTemplateHelper({ of: ['html', 'em'] });
export const embed = makeVoidHelper({ of: ['html', 'embed'] });
export const fencedframe = makeTemplateHelper({ of: ['html', 'fencedframe'] });
export const fieldset = makeTemplateHelper({ of: ['html', 'fieldset'] });
export const figure = makeHelper({ of: ['html', 'figure'] });
export const figcaption = makeTemplateHelper({ of: ['html', 'figcaption'] });
export const font = makeTemplateHelper({ of: ['html', 'font'] });
export const footer = makeTemplateHelper({ of: ['html', 'footer'] });
export const form = makeTemplateHelper({ of: ['html', 'form'] });
export const header = makeHelper({ of: ['html', 'header'] });
export const hgroup = makeTemplateHelper({ of: ['html', 'hgroup'] });
export const hr = makeVoidHelper({ of: ['html', 'hr'] });
export const kbd = makeTemplateHelper({ of: ['html', 'kbd'] });
export const i = makeTemplateHelper({ of: ['html', 'i'] });
export const iframe = makeTemplateHelper({ of: ['html', 'iframe'] });
export const img = makeVoidHelper({ of: ['html', 'img'] });
export const input = makeVoidHelper({ of: ['html', 'input'] });
export const ins = makeTemplateHelper({ of: ['html', 'ins'] });
export const label = makeTemplateHelper({ of: ['html', 'label'] });
export const legend = makeTemplateHelper({ of: ['html', 'legend'] });
export const li = makeTemplateHelper({ of: ['html', 'li'] });
export const link = makeVoidHelper({ of: ['html', 'link'] });
export const main = makeTemplateHelper({ of: ['html', 'main'] });
export const mark = makeTemplateHelper({ of: ['html', 'mark'] });
export const map = makeTemplateHelper({ of: ['html', 'map'] });
export const menu = makeTemplateHelper({ of: ['html', 'menu'] });
export const meta = makeVoidHelper({ of: ['html', 'meta'] });
export const meter = makeTemplateHelper({ of: ['html', 'meter'] });
export const nav = makeTemplateHelper({ of: ['html', 'nav'] });
export const object = makeTemplateHelper({ of: ['html', 'object'] });
export const ol = makeTemplateHelper({ of: ['html', 'ol'] });
export const optgroup = makeTemplateHelper({ of: ['html', 'optgroup'] });
export const option = makeTemplateHelper({ of: ['html', 'option'] });
export const output = makeTemplateHelper({ of: ['html', 'output'] });
export const p = makeTemplateHelper({ of: ['html', 'p'] });
export const picture = makeTemplateHelper({ of: ['html', 'picture'] });
export const progress = makeTemplateHelper({ of: ['html', 'progress'] });
export const q = makeTemplateHelper({ of: ['html', 'q'] });
export const pre = makeTemplateHelper({ of: ['html', 'pre'] });
export const rp = makeTemplateHelper({ of: ['html', 'rp'] });
export const rt = makeTemplateHelper({ of: ['html', 'rt'] });
export const ruby = makeTemplateHelper({ of: ['html', 'ruby'] });
export const s = makeTemplateHelper({ of: ['html', 's'] });
export const samp = makeTemplateHelper({ of: ['html', 'samp'] });
export const search = makeTemplateHelper({ of: ['html', 'search'] });
export const section = makeTemplateHelper({ of: ['html', 'section'] });
export const select = makeTemplateHelper({ of: ['html', 'select'] });
export const selectedcontent = makeTemplateHelper({ of: ['html', 'selectedcontent'] });
export const slot = makeTemplateHelper({ of: ['html', 'slot'] });
export const small = makeTemplateHelper({ of: ['html', 'small'] });
export const span = makeTemplateHelper({ of: ['html', 'span'] });
export const source = makeVoidHelper({ of: ['html', 'source'] });
export const strong = makeTemplateHelper({ of: ['html', 'strong'] });
export const style = makeTemplateHelper({ of: ['html', 'style'] });
export const sub = makeTemplateHelper({ of: ['html', 'sub'] });
export const summary = makeTemplateHelper({ of: ['html', 'summary'] });
export const sup = makeTemplateHelper({ of: ['html', 'sup'] });
export const table = makeHelper({ of: ['html', 'table'] });
export const tbody = makeHelper({ of: ['html', 'tbody'] });
export const td = makeTemplateHelper({ of: ['html', 'td'] });
export const template = makeTemplateHelper({ of: ['html', 'template'] });
export const textarea = makeTemplateHelper({ of: ['html', 'textarea'] });
export const tfoot = makeTemplateHelper({ of: ['html', 'tfoot'] });
export const time = makeTemplateHelper({ of: ['html', 'time'] });
export const th = makeTemplateHelper({ of: ['html', 'th'] });
export const thead = makeHelper({ of: ['html', 'thead'] });
export const tr = makeHelper({ of: ['html', 'tr'] });
export const track = makeVoidHelper({ of: ['html', 'track'] });
export const u = makeTemplateHelper({ of: ['html', 'u'] });
export const ul = makeTemplateHelper({ of: ['html', 'ul'] });
export const _var = makeTemplateHelper({ of: ['html', 'var'] });
export const video = makeTemplateHelper({ of: ['html', 'video'] });
export const wbr = makeVoidHelper({ of: ['html', 'wbr'] });
export const wbar = makeTemplateHelper({ of: ['html', 'wbar'] });

export const h1 = makeTemplateHelper({ of: ['html', 'h1'] });
export const h2 = makeTemplateHelper({ of: ['html', 'h2'] });
export const h3 = makeTemplateHelper({ of: ['html', 'h3'] });
export const h4 = makeTemplateHelper({ of: ['html', 'h4'] });
export const h5 = makeTemplateHelper({ of: ['html', 'h5'] });
export const h6 = makeTemplateHelper({ of: ['html', 'h6'] });

export const helpers = {
  a, abbr, address, area, aside, article, audio, b, button, bdi,
  bdo, blockquote, br, caption, cite, code, col, colgroup, data,
  datalist, details, dd, del, dfn, dialog, div, dl, dt, em, embed, fencedframe,
  fieldset, figcaption, figure, font, form, footer,
  kbd, i, iframe, img, ins, input, header, hgroup, hr,
  h1, h2, h3, h4, h5, h6, label, legend, li, main, mark, map, meter, menu,
  nav, object, ol, optgroup, option, output, p, picture, pre, progress, q,
  rp, rt, ruby, s, samp, search, section, select, selectedcontent,
  small, slot, source, span, strong, style, sub, summary, sup, table, template,
  textarea, tbody, td, tfoot, th, thead, tr, time, track, u, ul, var: _var,
  video, wbar, wbr,
};
