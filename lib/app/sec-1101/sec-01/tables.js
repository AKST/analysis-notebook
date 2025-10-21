/**
 * @import { Vec2 } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import * as prelude from '../prelude.js';
import { table } from '../../prelude.js';

const { text } = prelude.components;

class OpportunityCostCalc {
  /**
   * @param {string} name
   * @param {Vec2} value
   */
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  get x() { return this.value.vec[0]; }
  get y() { return this.value.vec[1]; }
  get xOC () { return this.y/this.x; }
  get yOC () { return this.x/this.y; }

  /**
   * @param {State} cfg
   */
  static abc({ agents }) {
    return Object.entries(agents).map(([name, it]) => (
      new OpportunityCostCalc(name, it.point)
    ));
  }
}

/**
 * @param {State} state
 */
export function opportunityCostTable(state) {
  const points = OpportunityCostCalc.abc(state)
  const units = ['', '', 'y', 'x'];
  /** @param {number} n @param {number} i */
  const r = (n, i) => n.toFixed(2) + units[i];

  return table(['Agent', 'X', 'Y', 'X OC', 'Y OC'], [
    ...points.map(oc => (
      [oc.name, ...[oc.x, oc.y, oc.xOC, oc.yOC].map(r)]
    )),
  ], {
    firstColumnHeader: true,
    caption: text.p.l`
      Note Opportunity cost is expressed in terms of units
    `,
  })
}

/**
 * @param {State} state
 */
export function comparitiveAdvantageTable(state) {
  /** @ts-ignore - cannot be bothered */
  const reduce = f => (a, b) => a[f] < b[f] ? a : b;
  /** @param {number} n */
  const r = n => n.toFixed(2);
  const ps = OpportunityCostCalc.abc(state)
  const xMin = ps.reduce(reduce('xOC'));
  const yMin = ps.reduce(reduce('yOC'));

  return table(['Product', 'Agent', 'OC', 'Output*'], [
    ['x', xMin.name, ...[xMin.xOC, xMin.x].map(r)],
    ['y', yMin.name, ...[yMin.yOC, yMin.y].map(r)],
  ], {
    firstColumnHeader: true,
    caption: text.p.l`* Output within time frame`,
  })
}

/**
 * @param {State} state
 * @param {Config} config
 */
export function profitTable(state, config) {
  const { priceX, priceY } = config;
  /** @param {number} n */
  const r = n => n.toFixed(2);
  /** @param {Vec2} v */
  const notOrigin = v => v.vec[0] > 0 || v.vec[1] > 0;
  /** @param {Vec2} c @param {number} i */
  const makeRow = ({ vec: [x, y] }, i) => {
    const xr = x * priceX, yr = y * priceY;
    return [i+1, ...[x, y, xr, yr, xr + yr].map(r)];
  };

  const { econPPF } = state;
  const rows = econPPF.filter(notOrigin).map(makeRow);
  return table([
    'Scenario',
    'X',
    'Y',
    'X Income',
    'Y Income',
    'Total',
  ], rows, {
    firstColumnHeader: true,
    caption: text.p.l`* Output within time frame`,
  })
}


