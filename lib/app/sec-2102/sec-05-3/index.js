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
  // render.dummy,
  doc.header,
  doc.intro,
  doc.theMPCurve,
  doc.philipCurve,
  doc.usingShortRunModel,
  doc.microFoundations1,
  doc.microFoundations2,
  doc.insideTheFed,
];
