/**
 * @import { Vec2, ProjectionConstraint, Widget, E, RenderContextInit as Init } from '@app/prelude-type.ts';
 * @import { ComparisonChart2d, EquilibriumChart2d, Chart2d, State, Config, RenderContext } from './type.ts';
 */
import {
  v2,
  clearCanvas,
  renderPlaceholder,
  TextRenderer,
  math,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '@app/prelude.js';

/** @param {string} t @returns {E.Item} */
const mkTitle = t => ['h4', { className: 'chartLabel' },  t];

/** @type {ProjectionConstraint} */
const projT = { kind: 'transform' };

/** @type {ProjectionConstraint} */
const projAbs = {
  kind: 'viewbox-absolute',
  origin: [-0.1, -0.1],
  width: 1.1,
  height: 1.1,
};

/**
 * @param {Init} cfg
 * @returns {RenderContext}
 */
export function createRenderContext({ renderer, viewport }) {
  const grid = new Grid(renderer, viewport);
  const text = new TextRenderer(renderer, viewport);
  const line = new LineRenderer(renderer, viewport);
  const poly = new PolygonRenderer(renderer, viewport);
  return {
    renderer,
    viewport,
    poly,
    line,
    text,
    grid,
  };
}

/**
 * @param {string} title
 * @param {ProjectionConstraint} proj
 * @param {Widget<any, State, Config>['size']} size
 * @param {(ctx: RenderContext, state: State) => void} render
 * @returns {Widget<any, State, Config>}
 */
export function makeWidget(title, proj, size, render) {
  return {
    createContext: createRenderContext,
    header: mkTitle(title),
    size,
    meta: {
      kind: 'Canvas2d',
      pure: true,
      proj,
    },
    render,
  };
}

/**
 * @param {string} text
 * @param {Widget<any, State, Config>['size']} size
 */
export function makePlaceholer(text, size) {
  return makeWidget('Placeholder ' + text, projT, size, ctx => {
    const { renderer, viewport } = ctx;
    clearCanvas(renderer, viewport);
    renderPlaceholder(renderer, viewport, text);
  });
}

/**
 * @param {RenderContext} ctx
 * @param {Chart2d} chart
 */
function drawChart(ctx, { points, bounds, tick }) {
  const { line, grid } = ctx;
  clearCanvas(ctx.renderer, ctx.viewport);
  grid.draw({ step: math.el.inv(math.el.div(bounds, tick)) });
  line.drawVector(points.map(p => math.el.div(p, bounds)), {
    width: 4,
    stroke: 0xffffff,
  });
}

/**
 * @param {RenderContext} ctx
 * @param {ComparisonChart2d} chart
 */
function drawComparision(ctx, { points, bounds, tick }) {
  const { line, grid } = ctx;
  clearCanvas(ctx.renderer, ctx.viewport);
  grid.draw({ step: math.el.inv(math.el.div(bounds, tick)) });
  for (const { points: ps, colour } of Object.values(points)) {
    line.drawVector(ps.map(p => math.el.div(p, bounds)), {
      width: 4,
      stroke: colour,
    });
  }
}

/**
 * @param {RenderContext} ctx
 * @param {EquilibriumChart2d} chart
 */
function drawEquilibrium(ctx, { eq, points, bounds, tick }) {
  drawChart(ctx, { points, bounds, tick });
  const { line, grid } = ctx;
  line.drawVector([
    v2(0, eq.vec[1]),
    v2(bounds.vec[0], eq.vec[1]),
  ].map(p => math.el.div(p, bounds)), {
    width: 2,
    stroke: 0xff0000,
    lineDash: [5, 5],
  });
  line.drawVector([
    v2(eq.vec[0], 0),
    v2(eq.vec[0], bounds.vec[1]),
  ].map(p => math.el.div(p, bounds)), {
    width: 2,
    stroke: 0xff0000,
    lineDash: [5, 5],
  });
}

/**
 * @param {RenderContext} ctx
 * @param {Chart2d | undefined} chart
 */
function maybeDrawChart(ctx, chart) {
  chart && drawChart(ctx, chart);
}

/**
 * @param {RenderContext} ctx
 * @param {EquilibriumChart2d | undefined} chart
 */
function maybeDrawEquilibrium(ctx, chart) {
  chart && drawEquilibrium(ctx, chart);
}

export const deminishingReturnsToLabour = makeWidget(
  'Deminishing Returns to Labour',
  projAbs,
  { height: 400, gridColumn: { default: 1, s: 2 } },
  (ctx, state) => maybeDrawChart(ctx, state.charts.productivityOverLabour),
);

export const deminishingReturnsToCapital = makeWidget(
  'Deminishing Returns to Capital',
  projAbs,
  { height: 400, gridColumn: { default: 1, s: 2 } },
  (ctx, state) => maybeDrawChart(ctx, state.charts.productivityOverCapital),
);

export const marginalProductOfLabour = makeWidget(
  'Marginal Product of Labour',
  projAbs,
  { height: 400, gridColumn: { default: 1, s: 2 } },
  (ctx, state) => maybeDrawChart(ctx, state.charts.marginalProductOfLabor),
);

export const marginalProductOfCapital = makeWidget(
  'Marginal Product of Capital',
  projAbs,
  { height: 400, gridColumn: { default: 1, s: 2 } },
  (ctx, state) => maybeDrawChart(ctx, state.charts.marginalProductOfCapital),
);

export const equilibriumLabour = makeWidget(
  'Equilibrium of Labour',
  projAbs,
  { height: 400, gridColumn: { default: 1, s: 2 } },
  (ctx, state) => maybeDrawEquilibrium(ctx, state.charts.equilibriumLabour),
);

export const equilibriumCapital = makeWidget(
  'Equilibrium of Capital',
  projAbs,
  { height: 400, gridColumn: { default: 1, s: 2 } },
  (ctx, state) => maybeDrawEquilibrium(ctx, state.charts.equilibriumCapital),
);

export const productionCurvesOfChinaAndUsa = makeWidget(
  'Show difference between the USA and China',
  projAbs,
  { height: 400, gridColumn: { default: 2, s: 2 } },
  (ctx, state) => {
    if (!state.charts.usaVsChina) return;
    drawComparision(ctx, state.charts.usaVsChina)
  },
);
