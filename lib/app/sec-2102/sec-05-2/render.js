/**
 * @import { ProjectionConstraint, Widget, E, RenderContextInit as Init } from '../../prelude-type.ts';
 * @import { Rendering, State, Config, RenderContext } from './type.ts';
 */
import {
  clearCanvas,
  renderPlaceholder,
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
  math,
  v2,
} from '../../prelude.js';

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

const Y_FORMAT = new Intl.NumberFormat("en-AU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const X_FORMAT = new Intl.NumberFormat("en-AU");

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
 * @param {Rendering.Basic2d} chart
 */
function drawChart(ctx, { points, bounds, tick }) {
  const { line, grid } = ctx;
  clearCanvas(ctx.renderer, ctx.viewport);
  line.draw(v2(0, 0), v2(0, 1));
  line.draw(v2(0, 0), v2(1, 0));
  line.drawVector(points.map(p => math.el.div(p, bounds)), {
    width: 4,
    stroke: 0xffffff,
  });
}

/**
 * @param {RenderContext} ctx
 * @param {Pick<Rendering.Equilibrium2d, 'eq' | 'bounds'>} chart
 */
function drawCrossHair(ctx, { eq, bounds }) {
  const { line } = ctx;
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
 * @param {Pick<Rendering.Equilibrium2d, 'eq' | 'bounds'>} chart
 */
function drawValues(ctx, { eq, bounds }) {
  const { text } = ctx;
  const [x, y] = eq.vec;
  const [xb, yb] = math.el.div(eq, bounds).vec;
  text.draw(v2(xb, -0.025), X_FORMAT.format(x), {
    fontSize: 12,
    textBaseline: 'top'
  });
  text.draw(v2(-0.01, yb), Y_FORMAT.format(y), {
    fontSize: 12,
    textBaseline: 'middle',
    textAlign: 'right',
  });
}

/**
 * @param {RenderContext} ctx
 * @param {Rendering.Equilibrium2d} chart
 */
function drawEquilibrium(ctx, { eq, points, bounds, tick }) {
  drawChart(ctx, { points, bounds, tick });
  drawCrossHair(ctx, { eq, bounds });
  drawValues(ctx, { eq, bounds });
}

export const isCurve = makeWidget(
  'Is Curve',
  projAbs,
  { height: 400, gridColumn: { default: 2, s: 2 } },
  (ctx, state) => {
    console.log(state);
    if (state.isCurveChart) {
      drawEquilibrium(ctx, state.isCurveChart);
    }
  }
);
