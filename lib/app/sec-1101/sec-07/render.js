/**
 * @import {
 *   E,
 *   Widget,
 *   Vec2,
 *   Econ,
 *   ProjectionConstraint,
 *   RenderContextInit,
 * } from '../../prelude-type.ts';
 * @import {
 *   Config,
 *   Good,
 *   State,
 *   RenderContext,
 *   QuantityPlot,
 *   ComparisionPlot,
 *   TablePlots,
 * } from './type.ts';
 */
import {
  v2,
  COLOR,
  econFirm,
  TextRenderer,
  Grid,
  math,
  numbers,
  PointRenderer,
  LineRenderer,
  PolygonRenderer,
  clearCanvas,
} from '../../prelude.js';

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

/**
 * @param {Set<number>} items
 * @param {number} range
 * @returns {Iterable<number>}
 */
function * sparse(items, range) {
  const array = Array.from(items).sort(numbers.compareInv);
  const dist = range * 0.1;
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

    clearCanvas(renderer, viewport);
    grid.draw({ step: [100 / xmax, 0.1 / ymax] });
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
    header: ['h4', title],
    render: render,
  }
}

export const renderExampleA = renderFirmCurve((cfg, state) => {
  const { exampleA } = state;
  if (exampleA == null) return;

  const bounds = econFirm.tableBounds(exampleA);
  const plots = econFirm.tablePlots(exampleA, bounds);
  return [bounds, plots];
}, 'Monopoly Example 1');

/**
 * @type {Widget<any, State, Config>}
 */
export const renderExampleB = {
  size: { height: 400 },
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
  header: ['h4', 'Monopolist Example 2'],
  render: (ctx, state, config) => {
    const { grid, poly, text, line, renderer, viewport } = ctx;
    const eg = state.exampleB;
    if (eg == null) return;

    const { deadWeightLoss: dwl, bounds, lines, deadWeightLoss } = eg;
    const { vec: [xmax, ymax] } = bounds;
    /** @param {readonly Vec2[]} ps */
    const scale = ps => ps.map(p => math.el.div(p, bounds));
    clearCanvas(renderer, viewport);
    renderer.setGlobalCompositeOperation('screen');
    grid.draw({ step: [100 / xmax, 100 / ymax] });
    line.drawVector(scale(lines.demand), { width: 4, stroke: 0x00ff00 });
    line.drawVector(scale(lines.supply), { width: 4, stroke: 0xff0000 });
    line.drawVector(scale(lines.revenue), { width: 4, stroke: 0x0000ff });
    poly.draw(dwl.geom.map(g => math.el.div(g, bounds)), { fill: 0xaaaaaa });

    const xSet = new Set();
    const ySet = new Set();

    xSet.add(eg.profitEq.vec[0]);
    xSet.add(eg.socialEq.vec[0]);
    xSet.add(eg.lines.demand[1].vec[0]);

    ySet.add(eg.profitEq.vec[1]);
    ySet.add(eg.socialEq.vec[1]);
    ySet.add(eg.lines.supply[0].vec[1]);
    ySet.add(eg.lines.demand[0].vec[1]);

    const fontSize = 10;

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

  },
};

