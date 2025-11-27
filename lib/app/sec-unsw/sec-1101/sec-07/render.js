/**
 * @import {
 *   E,
 *   Widget,
 *   Vec2,
 *   ProjectionConstraint,
 *   RenderContextInit,
 * } from '@app/prelude-type.ts';
 * @import {
 *   Config,
 *   State,
 *   RenderContext,
 *   TablePlots,
 * } from './type.ts';
 * @import * as Econ from '@base/econ/micro/type';
 */
import {
  v2,
  COLOR,
  TextRenderer,
  Grid,
  math,
  numbers,
  PointRenderer,
  LineRenderer,
  PolygonRenderer,
  clearCanvas,
} from '@app/prelude.js';
import * as econFirm from '@base/econ/micro/firm.js';

/** @template T @param {T | undefined | null} p @returns {boolean} */
const isNullish = p => p == null;

/**
 * @param {RenderContextInit} init
 * @returns {RenderContext}
 */
export function createRenderContext({ renderer, viewport }) {
  const grid = new Grid(renderer, viewport);
  const text = new TextRenderer(renderer, viewport);
  const poly = new PolygonRenderer(renderer, viewport);
  const point = new PointRenderer(renderer, viewport);
  const line = new LineRenderer(renderer, viewport);
  return { text, grid, poly, point, line, renderer, viewport };
}

/** @param {string} t @returns {E.Item} */
const mkTitle = t => ['h4', { className: 'chartLabel' },  t];

/**
 * @param {Set<number>} items
 * @param {number} range
 * @param {number} [threshold]
 * @returns {Iterable<number>}
 */
function * sparse(items, range, threshold = 0.1) {
  const array = Array.from(items).sort(numbers.compareInv);
  const dist = range * threshold;
  let last = array[0];
  yield last;

  for (const next of array.slice(1)) {
    if (Math.abs(last - next) < dist) continue;
    last = next;
    yield next;
  }
}

/**
 * @param {(config: Config, state: State) => [Vec2, TablePlots] | undefined} getFirm
 * @param {string} title
 * @returns {Widget<any, State, Config>}
 */
export function renderFirmCurve(getFirm, title) {
  const LINE_WIDTH = 4;
  /**
   * @param {RenderContext} ctx
   * @param {State} state
   * @param {Config} config
   */
  const render = (ctx, state, config) => {
    const { grid, text, line, renderer, viewport } = ctx;
    const result = getFirm(config, state);

    if (result == null) return;
    const [bounds, plots] = result;
    const { vec: [xmax, ymax] } = bounds;
    const gy = 1/((1/(0.1 / ymax))%50);
    const gx = 1/((1/(100 / xmax))%100);

    clearCanvas(renderer, viewport);
    grid.draw({ step: [gx, gy] });
    renderer.setGlobalCompositeOperation('screen');
    line.drawVector(plots.avgCostVar, { stroke: 0xff00cc, width: LINE_WIDTH });
    line.drawVector(plots.avgCostTotal, { stroke: 0xffcc00, width: LINE_WIDTH });
    line.drawVector(plots.marginalCost, { stroke: 0xff0000, width: LINE_WIDTH });
    line.drawVector(plots.marginalRevenue, { stroke: 0x0000ff, width: LINE_WIDTH });
    line.drawVector(plots.price, { stroke: 0x00ff00, width: LINE_WIDTH });

    const xSet = new Set();
    const ySet = new Set();

    for (const curve of [
      plots.price,
      plots.avgCostVar,
      plots.avgCostTotal,
      plots.marginalCost,
      plots.marginalRevenue,
    ]) {
      for (const { vec: [xIn, yIn] } of curve) {
        xSet.add(xIn * bounds.vec[0]);
        ySet.add(yIn * bounds.vec[1]);
      }
    }

    const fontSize = 12;

    for (const xIn of sparse(xSet, bounds.vec[0])) {
      const x = xIn / bounds.vec[0];
      const xsa = [v2(x, 0), v2(x, 1)];
      const xsb = [v2(x, -0.1), v2(x, -1)];
      line.drawVector(xsa, { stroke: 0xffffff, width: 1, lineDash: [1, 10] });
      line.drawVector(xsb, { stroke: 0xffffff, width: 1, lineDash: [1, 10] });
      text.draw(v2(x, -0.075), xIn.toFixed(2), { fontSize });
    }

    for (const yIn of sparse(ySet, bounds.vec[1])) {
      const y = yIn / bounds.vec[1];
      const ys = [v2(0, y), v2(1, y)];
      line.drawVector(ys, { stroke: 0xffffff, width: 1, lineDash: [1, 10] });
      text.draw(v2(-0.05, y), yIn.toFixed(2), { fontSize });
    }
  };

  return {
    size: { height: 400 },
    meta: {
      kind: 'Canvas2d',
      pure: true,
      proj: {
        kind: 'viewbox-absolute',
        origin: [-0.1, -0.1],
        width: 1.05,
        height: 1.05,
      },
    },
    createContext: createRenderContext,
    header: mkTitle(title),
    render: render,
  }
}

export const renderExampleA = renderFirmCurve((cfg, state) => {
  const { exampleA } = state;
  if (exampleA == null) return;
  if (exampleA.price.some(isNullish)) return undefined;

  const bounds = econFirm.tableBounds(exampleA);
  const plots = econFirm.tablePlots(exampleA, bounds);
  return [bounds, plots];
}, 'Monopoly Example 1');

/**
 * @param {boolean} useAvgCostPrice
 * @returns {Widget<any, State, Config>}
 */
export const renderExampleB = (useAvgCostPrice) => ({
  size: { height: 400, gridColumn: { default: 2, m: 2 } },
  meta: {
    kind: 'Canvas2d',
    pure: true,
    proj: {
      kind: 'viewbox-absolute',
      origin: [-0.1, -0.1],
      width: 1.15,
      height: 1.15,
    },
  },
  createContext: createRenderContext,
  header: mkTitle(useAvgCostPrice ? (
    'Average Cost Pricing'
  ) : (
    'Marginal Revenue Pricing'
  )),
  render: (ctx, state) => {
    const { grid, poly, text, line, renderer, viewport } = ctx;
    const eg = state.exampleB;
    if (eg == null) return;

    const { surpluses, bounds, lines } = eg;
    const geom = useAvgCostPrice
      ? surpluses.averageCostPrice
      : surpluses.marginalRevenuePrice;
    const { vec: [xmax, ymax] } = bounds;
    /** @param {readonly Vec2[]} ps */
    const scale = ps => ps.map(p => math.el.div(p, bounds));
    clearCanvas(renderer, viewport);
    renderer.setGlobalCompositeOperation('screen');
    grid.draw({ step: [100 / xmax, 100 / ymax] });
    line.drawVector(scale(lines.demand), { width: 4, stroke: 0x00ff00 });
    line.drawVector(scale(lines.supply), { width: 4, stroke: 0xff0000 });
    line.drawVector(scale(lines.revenue), { width: 4, stroke: 0x0000ff });
    line.drawVector(scale(lines.atc), { width: 4, stroke: 0xffffff });
    poly.draw(scale(geom.dwl.geom), { fill: 0xaaaaaa });
    poly.draw(scale(geom.supply.geom), { fill: 0x660000 });
    poly.draw(scale(geom.demand.geom), { fill: 0x006600 });

    const xSet = new Set();
    const ySet = new Set();

    xSet.add(eg.eq.profit.vec[0]);
    xSet.add(eg.eq.social.vec[0]);
    xSet.add(eg.eq.atc.vec[0]);
    xSet.add(eg.lines.demand[1].vec[0]);

    ySet.add(eg.eq.profit.vec[1]);
    ySet.add(eg.eq.social.vec[1]);
    ySet.add(eg.eq.atc.vec[1]);
    ySet.add(eg.lines.supply[0].vec[1]);
    ySet.add(eg.lines.demand[0].vec[1]);

    const width = 2;
    const fontSize = 10;
    const lineDash = /** @type {[number, number]} */ ([1, 5]);

    for (const xIn of sparse(xSet, bounds.vec[0], 0.05)) {
      const x = xIn / bounds.vec[0];
      const xsa = [v2(x, 0), v2(x, 1)];
      const xsb = [v2(x, -0.1), v2(x, -1)];
      line.drawVector(xsa, { stroke: 0xffffff, width, lineDash });
      line.drawVector(xsb, { stroke: 0xffffff, width, lineDash });
      text.draw(v2(x, -0.075), xIn.toFixed(2), { fontSize });
    }

    for (const yIn of sparse(ySet, bounds.vec[1], 0.05)) {
      const y = yIn / bounds.vec[1];
      const ys = [v2(0, y), v2(1, y)];
      line.drawVector(ys, { stroke: 0xffffff, width, lineDash });
      text.draw(v2(-0.05, y), yIn.toFixed(2), { fontSize });
    }
  },
});

