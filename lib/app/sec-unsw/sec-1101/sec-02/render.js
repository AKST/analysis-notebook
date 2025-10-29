/**
 * @import {
 *   E,
 *   Widget,
 *   Vec2,
 *   Econ,
 *   ProjectionConstraint,
 *   RenderContextInit,
 * } from '../../../prelude-type.ts';
 * @import {
 *   Config,
 *   Good,
 *   State,
 *   RenderContext,
 *   QuantityPlot,
 *   ComparisionPlot,
 * } from './type.ts';
 */
import {
  vector,
  COLOR,
  econFirm,
  TextRenderer,
  Grid,
  math,
  numbers,
  PointRenderer,
  LineRenderer,
  clearCanvas,
} from '../../../prelude.js';

/** @param {number} x @param {number} y */
const v2 = (x, y) => vector(2)(x, y);

/**
 * @param {RenderContextInit} init
 * @returns {RenderContext}
 */
export function createRenderContext({ renderer, viewport }) {
  const grid = new Grid(renderer, viewport);
  const text = new TextRenderer(renderer, viewport);
  const point = new PointRenderer(renderer, viewport);
  const line = new LineRenderer(renderer, viewport);
  return { text, grid, point, line, renderer, viewport };
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
 * @returns {Widget<any, State, Config>[]}
 */
export function renderMarginalCosts() {
  /**
   * @param {(state: State) => (ComparisionPlot | undefined)} getPlot
   * @returns {(ctx: RenderContext, s: State) => void}
   */
  const factory = (getPlot) => (context, state) => {
    const { text, grid, line, renderer, viewport } = context;
    const plot = getPlot(state);

    if (plot == null) return;
    clearCanvas(renderer, viewport);
    grid.draw({ step: math.el.inv(plot.bounds) });

    line.drawVector(
      plot.curves[0].map(p => math.el.div(p, plot.bounds)),
      { stroke: plot.colors[0], width: 2 },
    );

    line.drawVector(
      plot.curves[1].map(p => math.el.div(p, plot.bounds)),
      { stroke: plot.colors[1], width: 2 },
    );

    const xSet = new Set();
    const ySet = new Set();

    for (const curve of plot.curves) {
      for (const { vec: [xIn, yIn] } of curve) {
        xSet.add(xIn);
        ySet.add(yIn);
      }
    }

    const fontSize = 8;

    for (const xIn of sparse(xSet, plot.bounds.vec[0])) {
      const x = xIn / plot.bounds.vec[0];
      const xsa = [v2(x, 0), v2(x, 1)];
      const xsb = [v2(x, -0.1), v2(x, -1)];
      line.drawVector(xsa, { stroke: 0xffffff, width: 1, lineDash: [1, 10] });
      line.drawVector(xsb, { stroke: 0xffffff, width: 1, lineDash: [1, 10] });
      text.draw(v2(x, -0.075), xIn.toFixed(2), { fontSize });
    }

    for (const yIn of sparse(ySet, plot.bounds.vec[1])) {
      const y = yIn / plot.bounds.vec[1];
      const ys = [v2(0, y), v2(1, y)];
      line.drawVector(ys, { stroke: 0xffffff, width: 1, lineDash: [1, 10] });
      text.draw(v2(-0.1, y), yIn.toFixed(2), { fontSize });
    }
  };

  /**
   * @type {{
   *   render: (c: RenderContext, s: State) => void,
   *   title: string,
   *   yAxis: 'above-zero' | 'middle-zero'
   * }[]}
   */
  const items = [
    {
      render: factory(state => state.quantityProducedPlots?.marginalTime),
      title: 'Marginal Time',
      yAxis: 'above-zero',
    },
    {
      render: factory(state => state.quantityProducedPlots?.marginalProfit),
      title: 'Marginal Profit',
      yAxis: 'above-zero',
    },
    {
      render: factory(state => state.quantityProducedPlots?.marginalBenefit),
      title: 'Marginal Benefit',
      yAxis: 'middle-zero',
    },
    {
      render: factory(state => state.quantityProducedPlots?.marginalOC),
      title: 'Total Cost vs Total Profit',
      yAxis: 'above-zero',
    },
  ]

  /** @type {ProjectionConstraint} */
  const pMiddleZero = {
    kind: 'viewbox-absolute',
    origin: [-0.2, -1.05],
    width: 1.25,
    height: 2.1,
  };

  /** @type {ProjectionConstraint} */
  const pAboveZero = {
    kind: 'viewbox-absolute',
    origin: [-0.2, -0.15],
    width: 1.25,
    height: 1.2,
  };

  return items.map(o => ({
    size: {
      height: 250,
      gridColumn: { default: 1, m: 2 },
    },
    meta: {
      kind: 'Canvas2d',
      proj: o.yAxis === 'middle-zero' ? pMiddleZero : pAboveZero,
      pure: true,
    },
    createContext: createRenderContext,
    header: ['h4', o.title],
    render: o.render,
  }));
}

/**
 * @returns {Widget<any, State, Config>[]}
 */
export function renderQuantityProduced() {
  /**
   * @param {(state: State) => (QuantityPlot | undefined)} getPlot
   * @returns {(ctx: RenderContext, s: State) => void}
   */
  const factory = (getPlot) => (context, state) => {
    const { text, grid, line, renderer, viewport } = context;
    const plot = getPlot(state);

    if (plot == null) return;
    clearCanvas(renderer, viewport);
    grid.draw({ step: math.el.inv(plot.bounds) });
    line.drawVector(
      plot.curve.map(p => math.el.div(p, plot.bounds)),
      { stroke: plot.color, width: 4 },
    );

    const prices = [plot.price];
    const colors = [0x00ff00];
    const widths = [4];
    const lineStyle = [1, 0];

    for (const point of plot.curve) {
      const price = point.vec[1];
      if (price === 0) continue;
      colors.push(0xffffff);
      prices.push(price);
      widths.push(1);
      lineStyle.push(1, 10);
    }

    const ymax = plot.bounds.vec[1];
    for (let i = 0; i < prices.length; i++) {
      const stroke = colors[i];
      const width = widths[i];
      const lineDash = /** @type {[number, number]} */ (lineStyle.slice(i*2, i*2 + 2));
      const y = prices[i] / ymax;
      const ps = [v2(0, y), v2(1, y)];
      line.drawVector(ps, { stroke, width, lineDash });
      text.draw(v2(-0.1, y), prices[i].toFixed(2), {
        fontSize: 10,
      });
    }
  };


  /**
   * @type {{
   *   render: (c: RenderContext, s: State, cfg: Config) => void;
   *   title: string;
   * }[]}
   */
  const items = [
    {
      render: factory(state => state.quantityProducedPlots?.fishOverApple),
      title: 'Fish Price & Net Economic profit @ quantity'
    },
    {
      render: factory(state => state.quantityProducedPlots?.appleOverFish),
      title: 'Apple Price & Net Economic profit @ quantity'
    },
  ];

  return items.map(o => /** @type {Widget<any, State, Config>} */ ({
    size: { height: 300, gridColumn: { default: 2, m: 2 } },
    meta: {
      kind: 'Canvas2d',
      pure: true,
      proj: {
        kind: 'viewbox-absolute',
        origin: [-0.2, -1.05],
        width: 1.25,
        height: 2.1,
      },
    },
    header: ['h4', o.title],
    createContext: createRenderContext,
    render: o.render,
  }))
}

/**
 * @returns {Widget<any, State, Config>}
 */
export function renderFirmSupplyCurve() {
  const VIEW_Y_MAX = 16;

  const LINE_WIDTH = 4;

  /**
   * @param {RenderContext} context
   * @param {number} offset
   * @param {number} color
   * @param {string} name
   */
  const renderLegendItem = (context, offset, color, name) => {
    const { point, text } = context;
    const offsetY = 0.9 - offset * 0.05;
    point.draw(v2(0.04, offsetY), color, 5);
    text.draw(v2(0.065, offsetY), name, {
      fontSize: 10,
      textAlign: 'left',
    });
  }

  /**
   * @param {RenderContext} context
   * @param {State} state
   */
  const renderQuantityMarks = (context, state) => {
    const { line, text } = context;
    if (state.firm == null) return;
    const [xMax, yMax] = state.firmScale.vec;
    const plots = econFirm.tablePlots(state.firm);

    for (const q of plots.units) {
      if (q === 0) continue;
      const scaled = q / xMax;

      const base = v2(scaled, 0);
      const axis = v2(scaled, -0.05);
      line.draw(base, v2(scaled, yMax), {
        stroke: 0xffffff,
        width: 1,
        lineDash: [1, 5],
      });
      text.draw(axis, q+'', { fontSize: 10 });
    }
  };

  /**
   * @param {RenderContext} context
   * @param {State} state
   */
  const renderPriceMarks = (context, { firm, firmScale }) => {
    const { line, text } = context;
    if (firm == null) return null;

    const plots = econFirm.tablePlots(firm);
    const [qMax, pMax] = firmScale.vec;
    const points = Array.from(new Set([
      ...plots.marginalCost.map(v => v.vec[1]),
      ...plots.avgCostTotal.map(v => v.vec[1]),
      ...plots.avgCostVar.map(v => v.vec[1]),
    ])).sort(numbers.compareInv);

    let lastP = 0;
    for (const p of points) {
      const dp = p / pMax
      if (Math.abs(lastP - dp) < 0.07) continue;
      lastP = p / pMax;

      const base = v2(0, dp);
      const axis = v2(-0.05, dp);
      line.draw(base, v2(qMax, dp), {
        stroke: 0xffffff,
        width: 1,
        lineDash: [1, 5],
      });
      text.draw(axis, p.toFixed(2), { fontSize: 10 });
    }
  };

  /**
   * @param {RenderContext} context
   * @param {State} state
   */
  const render = (context, state) => {
    const { grid, line, renderer, viewport } = context;
    const { firmScale: { vec: [xmax, ymax] } } = state;

    clearCanvas(renderer, viewport);
    grid.draw({ step: [10 / xmax, 1 / ymax] });
    renderQuantityMarks(context, state);
    renderPriceMarks(context, state);
    renderer.setGlobalCompositeOperation('screen');

    if (state.firm == null) return null;
    const plots = econFirm.tablePlots(state.firm, state.firmScale);
    line.drawVector(plots.avgCostVar, { stroke: 0xff00cc, width: LINE_WIDTH });
    line.drawVector(plots.marginalCost, { stroke: COLOR.YELLOW, width: LINE_WIDTH });
    line.drawVector(plots.avgCostTotal, { stroke: COLOR.RED, width: LINE_WIDTH });
    line.drawVector(plots.price, { stroke: 0x00ff00, width: LINE_WIDTH });

    renderLegendItem(context, 1, COLOR.YELLOW, 'Marginal Cost');
    renderLegendItem(context, 2, 0xff00cc, 'Average Variable Cost');
    renderLegendItem(context, 3, COLOR.RED, 'Average Total Cost');
    renderLegendItem(context, 4, 0x00ff00, 'Price');
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
    render: render,
  }
}
