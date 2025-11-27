/**
 * @import { Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import * as doc from './doc.js';
import * as render from './render.js';

export { getConfig, onUpdate, createState } from './util.js';
export { createStyle } from './style.js';

export const meta = {
  kind: 'multi',
  layout: {
    gridTemplateColumns: ['1fr', '1fr'],
    breakpoints: { s: 620, m: 900 },
  },
}

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.createPlaceholder('Matrix for coase problems'),
  doc.header,
  doc.coaseTheorem,
  doc.largerMarkets,
  render.chart,
  doc.deadWeightLossTable,
  doc.internalisingLargerMarketsExternalities,
  doc.computeExternalityFromDesiredQuantity,
  /*
   * See time 53:30
   *
   * @ https://www.youtube.com/watch?v=C0naMEbEcjY
   */
  doc.createPlaceholder('Government Intervention Summary Table'),
];
