/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import * as doc from './doc.js';
import * as render from './render.js';
export { getConfig, createState, onUpdate } from './util.js';
export { createStyle } from './style.js';

export const meta = {
  kind: 'multi',
  layout: {
    gridTemplateColumns: ['1fr', '1fr'],
    breakpoints: { s: 620 },
  },
};

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.intro,
  doc.definitions,
  doc.calibrationTable,
  doc.table2,
  doc.table3,
  doc.table4,
  doc.table5,
  doc.table6,
  doc.table7,
  doc.table8,
  doc.table9,
  doc.table10,
  doc.table11,
  doc.table12,
];
