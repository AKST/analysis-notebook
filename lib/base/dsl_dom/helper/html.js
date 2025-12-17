import { makeHelper, makeTemplateHelper, makeVoidHelper } from '../helper.js';

export const a = makeTemplateHelper('html', 'a')();
export const abbr = makeTemplateHelper('html', 'attr')()
export const address = makeTemplateHelper('html', 'address')();
export const article = makeTemplateHelper('html', 'article')();
export const area = makeVoidHelper('html', 'area')();
export const aside = makeHelper('html', 'aside')();
export const audio = makeTemplateHelper('html', 'audio')();
export const b = makeTemplateHelper('html', 'strong')();
export const base = makeVoidHelper('html', 'base')();
export const bdi = makeTemplateHelper('html', 'bdi')();
export const bdo = makeTemplateHelper('html', 'bdo')();
export const blockquote = makeTemplateHelper('html', 'blockquote')();
export const br = makeVoidHelper('html', 'br')();
export const button = makeHelper('html', 'button')();
export const caption = makeTemplateHelper('html', 'caption')();
export const cite = makeTemplateHelper('html', 'cite')();
export const code = makeTemplateHelper('html', 'code')();
export const col = makeVoidHelper('html', 'col')();
export const colgroup = makeTemplateHelper('html', 'colgroup')();
export const data = makeTemplateHelper('html', 'data')();
export const datalist = makeTemplateHelper('html', 'datalist')();
export const del = makeTemplateHelper('html', 'del')();
export const details = makeHelper('html', 'details')();
export const dd = makeTemplateHelper('html', 'dd')();
export const dfn = makeTemplateHelper('html', 'dfn')();
export const dialog = makeTemplateHelper('html', 'dialog')();
export const div = makeHelper('html', 'div')();
export const dl = makeHelper('html', 'dl')();
export const dt = makeTemplateHelper('html', 'dt')();
export const embed = makeVoidHelper('html', 'embed')();
export const fencedframe = makeTemplateHelper('html', 'fencedframe')();
export const fieldset = makeTemplateHelper('html', 'fieldset')();
export const figure = makeHelper('html', 'figure')();
export const figcaption = makeTemplateHelper('html', 'figcaption')();
export const font = makeTemplateHelper('html', 'font')();
export const footer = makeTemplateHelper('html', 'footer')();
export const form = makeTemplateHelper('html', 'form')();
export const header = makeHelper('html', 'header')();
export const hgroup = makeTemplateHelper('html', 'hgroup')();
export const hr = makeVoidHelper('html', 'hr')();
export const kbd = makeTemplateHelper('html', 'kbd')();
export const i = makeTemplateHelper('html', 'em')();
export const iframe = makeTemplateHelper('html', 'iframe')();
export const img = makeVoidHelper('html', 'img')();
export const input = makeVoidHelper('html', 'input')();
export const ins = makeTemplateHelper('html', 'ins')();
export const label = makeTemplateHelper('html', 'label')();
export const legend = makeTemplateHelper('html', 'legend')();
export const li = makeTemplateHelper('html', 'li')();
export const link = makeVoidHelper('html', 'link')();
export const main = makeTemplateHelper('html', 'main')();
export const mark = makeTemplateHelper('html', 'mark')();
export const map = makeTemplateHelper('html', 'map')();
export const menu = makeTemplateHelper('html', 'menu')();
export const meta = makeVoidHelper('html', 'meta')();
export const meter = makeTemplateHelper('html', 'meter')();
export const nav = makeTemplateHelper('html', 'nav')();
export const object = makeTemplateHelper('html', 'object')();
export const ol = makeTemplateHelper('html', 'ol')();
export const optgroup = makeTemplateHelper('html', 'optgroup')();
export const option = makeTemplateHelper('html', 'option')();
export const output = makeTemplateHelper('html', 'output')();
export const p = makeTemplateHelper('html', 'p')();
export const picture = makeTemplateHelper('html', 'picture')();
export const progress = makeTemplateHelper('html', 'progress')();
export const q = makeTemplateHelper('html', 'q')();
export const pre = makeTemplateHelper('html', 'pre')();
export const quote = makeTemplateHelper('html', 'quote')();
export const rp = makeTemplateHelper('html', 'rp')();
export const rt = makeTemplateHelper('html', 'rt')();
export const ruby = makeTemplateHelper('html', 'ruby')();
export const s = makeTemplateHelper('html', 's')();
export const samp = makeTemplateHelper('html', 'samp')();
export const search = makeTemplateHelper('html', 'search')();
export const section = makeTemplateHelper('html', 'section')();
export const select = makeTemplateHelper('html', 'select')();
export const selectedcontent = makeTemplateHelper('html', 'selectedcontent')();
export const slot = makeTemplateHelper('html', 'slot')();
export const small = makeTemplateHelper('html', 'small')();
export const span = makeTemplateHelper('html', 'span')();
export const source = makeVoidHelper('html', 'source')();
export const style = makeTemplateHelper('html', 'style')();
export const sub = makeTemplateHelper('html', 'sub')();
export const summary = makeTemplateHelper('html', 'summary')();
export const sup = makeTemplateHelper('html', 'sup')();
export const table = makeHelper('html', 'table')();
export const tbody = makeHelper('html', 'tbody')();
export const td = makeTemplateHelper('html', 'td')();
export const template = makeTemplateHelper('html', 'template')();
export const textarea = makeTemplateHelper('html', 'textarea')();
export const tfoot = makeTemplateHelper('html', 'tfoot')();
export const time = makeTemplateHelper('html', 'time')();
export const th = makeTemplateHelper('html', 'th')();
export const thead = makeHelper('html', 'thead')();
export const tr = makeHelper('html', 'tr')();
export const track = makeVoidHelper('html', 'track')();
export const u = makeTemplateHelper('html', 'u')();
export const ul = makeTemplateHelper('html', 'ul')();
export const _var = makeTemplateHelper('html', 'var')();
export const video = makeTemplateHelper('html', 'video')();
export const wbr = makeVoidHelper('html', 'wbr')();
export const wbar = makeTemplateHelper('html', 'wbar')();

export const h1 = makeTemplateHelper('html', 'h1')();
export const h2 = makeTemplateHelper('html', 'h2')();
export const h3 = makeTemplateHelper('html', 'h3')();
export const h4 = makeTemplateHelper('html', 'h4')();
export const h5 = makeTemplateHelper('html', 'h5')();
export const h6 = makeTemplateHelper('html', 'h6')();

export const helpers = {
  a, abbr, address, area, aside, article, audio, b, button, bdi,
  bdo, blockquote, br, caption, cite, code, col, colgroup, data,
  datalist, details, dd, del, dfn, dialog, div, dl, dt, embed, fencedframe,
  fieldset, figcaption, figure, font, form, footer,
  kbd, i, iframe, img, ins, input, header, hgroup, hr,
  h1, h2, h3, h4, h5, h6, label, legend, li, main, mark, map, meter, menu,
  nav, object, ol, optgroup, option, output, p, picture, pre, progress, q,
  quote, rp, rt, ruby, s, samp, search, section, select, selectedcontent,
  small, slot, source, span, style, sub, summary, sup, table, template, textarea,
  tbody, td, tfoot, th, thead, tr, time, track, u, ul, var: _var, video,
  wbar, wbr,
};
