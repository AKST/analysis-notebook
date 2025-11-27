/**
 * @import { Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import * as doc from './doc.js';
import * as render from './render.js';
import * as remote from './remote.js';
export { getConfig, createState, onUpdate } from './util.js';

export const meta = {
  kind: 'multi',
  sheets: [import.meta.resolve('@prelude-uni/styles.css')],
  layout: {
    gridTemplateColumns: ['1fr', '1fr'],
    breakpoints: { s: 620 },
  },
};

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.header,
  doc.intro,
  doc.unemploymentRate,
  // remote.unemployment,
  render.supplyAndDemand,
  doc.supplyAndDemand,
  doc.bathtubModel,
  doc.labourMarketsAroundTheWorld,
  doc.valueOfHumanCapital,
  doc.risingReturnToEducation,
  render.returnToEducationHS,
  render.returnToEducationUni,
  doc.economicGrowthAndIncomeInequality,
];
