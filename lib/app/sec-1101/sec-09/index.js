/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */
import * as doc from './doc.js';
export { createStyle } from './style.js';

export const meta = {
  kind: 'multi',
};

/**
 * @returns {any}
 */
export function getConfig() {
  return { placeholder: { kind: 'number', of: 5, range: [0, 10] } };
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
  return onUpdate({}, { kind: 'config', config });
}

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.createPlaceholder('Matrix for coase problems'),
  doc.header,
  doc.coaseTheorem,
  doc.largerMarkets,
  doc.createPlaceholder('Supply and demand graph socially optimial equilibrium'),
  doc.internalisingLargerMarketsExternalities,
  /*
   * See time 53:30
   *
   * @ https://www.youtube.com/watch?v=C0naMEbEcjY
   */
  doc.createPlaceholder('Government Intervention Summary Table'),
];
