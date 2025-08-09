/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */
import * as doc from './doc.js';
import * as render from './render.js';
export { createStyle } from './style.js';
import { initExamples } from './util.js';


export const meta = {
  kind: 'multi',
  layout: {
    gridTemplateColumns: ['1fr', '1fr'],
    breakpoints: { s: 620, m: 900 },
  },
};

/**
 * @returns {any}
 */
export function getConfig() {
  return {};
}

/**
 * @param {State} state
 * @param {Event} _event
 * @returns {State}
 */
export function onUpdate(state, _event) {
  return state;
}

/**
 * @param {Config} config
 * @returns {State}
 */
export function createState(config) {
  return onUpdate({
    ...initExamples(),
  }, { kind: 'config', config });
}

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.header,
  doc.priceControls,
  render.priceFloor,
  render.priceCeil,
  doc.taxesAndSubsidies,
  render.demandTax,
  render.demandSubsidy,
  doc.taxBurdenTable,
];
