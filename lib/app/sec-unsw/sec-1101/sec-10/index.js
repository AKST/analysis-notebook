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
};

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.header,
  render.aggregateDemand,
  doc.curveInformation,
  doc.aggregatingDemandForPublicGoods,
  doc.freeRiding,
  doc.createPlaceholder('Each Consumers Surplus at their Lindhal Price or free riding'),
  doc.marketFailure,
];
