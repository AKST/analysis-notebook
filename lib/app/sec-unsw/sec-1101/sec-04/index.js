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
    gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr'],
    breakpoints: { s: 620, m: 900 },
  },
};

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.intro,
  doc.subjectPerfectCompetition,
  doc.introAggregateSupplyAndDemand,
  render.aggregateCurves,
  render.aggregateCurveSurplus,
  doc.continiousSurplus,
  doc.discrete,
  render.discreteCurve,
  render.discreteSurplus,
  doc.discreteSurplus,
  doc.findingEquilibrium,
  doc.longRunEquilibrium,
];
