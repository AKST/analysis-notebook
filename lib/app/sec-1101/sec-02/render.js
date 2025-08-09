/**
 * @import {
 *   Widget,
 *   Vec2,
 *   Econ,
 *   ProjectionConstraint,
 *   RenderContextInit,
 * } from '../../prelude-type.ts';
 * @import { Config, Good, RenderContext, State } from './type.ts';
 */
import {
  vector,
  COLOR,
  econFirm,
  TextRenderer,
  Grid,
  numbers,
  PointRenderer,
  LineRenderer,
  clearCanvas,
} from '../../prelude.js';

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
 * @param {readonly number[]} array
 * @param {'start' | 'end'} position
 */
function intoSteps(array, position = 'end') {
  if (position === 'start') {
    return [0, ...array].flatMap((it, i, all) => [
      i === 0 ? v2(0, 0) : v2(i, all[i-1]),
      v2(i, it),
    ]);
  }
  const last = array.at(-1);
  if (last == null) throw new TypeError();

  return [...array, last].flatMap((it, i, all) => [
    i === 0 ? v2(0, 0) : v2(i, all[i-1]),
    v2(i, it),
  ]);
}

/**
 * @returns {Widget<any, State, Config>[]}
 */
export function renderMarginalCosts() {
  /**
   * @param {Good} good
   * @param {Econ.Firm.BehaviourTable} table
   * @returns {{ color: number, curve: Vec2[] }}
   */
  function createProfitLine({ price: value, color }, { costTotal: cost }) {
    return {
      color,
      curve: [v2(0, 0), ...cost.map((cost, i) => v2(cost, value * (i+1)))],
    };
  }

  /**
   * @param {Good} good
   * @param {Econ.Firm.BehaviourTable} table
   * @param {keyof Econ.Firm.BehaviourTable} key
   * @param {'end' | 'start'} position
   */
  function createLine(good, table, key, position = 'end') {
    return {
      color: good.color,
      curve: intoSteps(table[key], position),
    };
  }

  /**
   * @param {(
   *    (good: Good) => ({
   *      color: number,
   *      curve: Vec2[],
   *    })
   * )} f
   * @returns {(c: RenderContext, s: State) => void}
   */
  const rendererFactory = f => (context, state) => {
    if (state.examples == null) return;
    const { grid, line, renderer, viewport } = context;
    const { examples: { fish, apple } } = state;

    clearCanvas(renderer, viewport);
    grid.draw();

    for (const { color, curve } of [fish, apple].map(f)) {
      line.drawVector(curve, { stroke: color, width: 2 })
    }
  };

  const renderMarginalTime =
    rendererFactory(e => createLine(e, e.table, 'costVar'));
  const renderMarginalBenefit =
    rendererFactory(e => createLine(e, e.table, 'marginalBenefit'));

  /**
   * @param {RenderContext} context
   * @param {State} state
   */
  function renderMarginalOC(context, state) {
    if (state.examples == null) return;
    const { grid, line, renderer, viewport } = context;
    const { examples: { fish: a, apple: b } } = state;

    clearCanvas(renderer, viewport);
    grid.draw();

    for (const { color, table, other } of [
      { color: a.color, table: a.table, other: b.table },
      { color: b.color, table: b.table, other: a.table },
    ]) {
      const curve = table.marginalBenefit.map((a, i) => other.marginalBenefit[i] - a);
      line.drawVector(intoSteps(curve), { stroke: color, width: 2 })
    }
  }

  /**
   * @param {RenderContext} context
   * @param {State} state
   */
  function renderMarginalProfit(context, state) {
    if (state.examples == null) return;
    const { examples: { fish, apple } } = state;
    const { grid, line, renderer, viewport } = context;

    clearCanvas(renderer, viewport);
    grid.draw();

    for (const good of [fish, apple]) {
      const { color, curve } = createProfitLine(good, good.table);
      line.drawVector(curve, { stroke: color, width: 2 })
    }
  }

  /** @type {ProjectionConstraint} */
  const marginalP = { kind: 'viewbox-min', height: 8, origin: [-1, -4] };

  /**
   * @type {{
   *   f: (c: RenderContext, s: State) => void,
   *   p: ProjectionConstraint
   * }[]}
   */
  const items = [
    { f: renderMarginalTime, p: { kind: 'viewbox-min', width: 6 } },
    { f: renderMarginalProfit, p: { kind: 'viewbox-min', width: 20 } },
    { f: renderMarginalBenefit, p: marginalP },
    { f: renderMarginalOC, p: marginalP },
  ]

  return items.map(o => ({
    size: { height: 250, gridColumn: { default: 1, m: 2 } },
    meta: { kind: 'Canvas2d', proj: o.p, pure: true },
    createContext: createRenderContext,
    render: o.f,
  }))
}

/**
 * @returns {Widget<any, State, Config>[]}
 */
export function renderQuantityProduced() {
  /**
   * @param {'fish' | 'apple'} f
   * @param {'fish' | 'apple'} o
   * @returns {(c: RenderContext, s: State) => void}
   */
  const factory = (f, o) => (context, state) => {
    if (state.examples == null) return;
    const { grid, line, renderer, viewport } = context;
    const [a, b] = [state.examples[f], state.examples[o]];
    clearCanvas(renderer, viewport);
    grid.draw();

    if (a.table == null || b.table == null) return;
    const [am, bm] = [a.table.marginalBenefit, b.table.marginalBenefit];
    const curve = intoSteps(am.map((a, i) => bm[i] - a));
    line.drawVector(curve, { stroke: a.color, width: 2 });

    const start = v2(-am.length, a.price);
    const end = v2(am.length, a.price);
    line.drawVector([start, end], { stroke: 0x00ff00 });
  };


  /**
   * @type {{
   *   f: (c: RenderContext, s: State) => void,
   *   origin?: [number, number],
   *   scale?: number,
   * }[]}
   */
  const items = [
    { f: factory('fish', 'apple') },
    { f: factory('apple', 'fish'), origin: [-5, -7], scale: 1 },
  ];

  return items.map(o => /** @type {Widget<any, State, Config>} */ ({
    size: { height: 250, gridColumn: { default: 2, m: 2 } },
    meta: {
      kind: 'Canvas2d',
      pure: true,
      proj: { kind: 'transform', origin: [-2, 0], scale: 1.5 },
    },
    createContext: createRenderContext,
    render: o.f,
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
