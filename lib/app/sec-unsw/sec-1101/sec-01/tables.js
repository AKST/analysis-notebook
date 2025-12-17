/**
 * @import { Vec2 } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';

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

  return doc.table.of(
    doc.caption({ className: 'footerCap' }).of(text.p.l`Note Opportunity cost is expressed in terms of units`),
    doc.thead(doc.tr(doc.th`Agent`, doc.th`X`, doc.th`Y`, doc.th`X OC`, doc.th`Y OC`)),
    doc.tbody(
      ...points.map(oc => doc.tr(
        doc.th`${oc.name}`,
        doc.td`${r(oc.x, 0)}`,
        doc.td`${r(oc.y, 1)}`,
        doc.td`${r(oc.xOC, 2)}`,
        doc.td`${r(oc.yOC, 3)}`,
      )),
    ),
  );
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

  return doc.table.of(
    doc.caption({ className: 'footerCap' }).of(text.p.l`* Output within time frame`),
    doc.thead(doc.tr(doc.th`Product`, doc.th`Agent`, doc.th`OC`, doc.th`Output*`)),
    doc.tbody(
      doc.tr(doc.th`x`, doc.td`${xMin.name}`, doc.td`${r(xMin.xOC)}`, doc.td`${r(xMin.x)}`),
      doc.tr(doc.th`y`, doc.td`${yMin.name}`, doc.td`${r(yMin.yOC)}`, doc.td`${r(yMin.y)}`),
    ),
  );
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
    return doc.tr(
      doc.th`${i+1}`,
      doc.td`${r(x)}`,
      doc.td`${r(y)}`,
      doc.td`${r(xr)}`,
      doc.td`${r(yr)}`,
      doc.td`${r(xr + yr)}`,
    );
  };

  const { econPPF } = state;
  return doc.table.of(
    doc.caption({ className: 'footerCap' }).of(text.p.l`* Output within time frame`),
    doc.thead(doc.tr(doc.th`Scenario`, doc.th`X`, doc.th`Y`, doc.th`X Income`, doc.th`Y Income`, doc.th`Total`)),
    doc.tbody(...econPPF.filter(notOrigin).map(makeRow)),
  );
}


