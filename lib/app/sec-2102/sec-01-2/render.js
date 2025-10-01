/**
 * @import { Vec2, ProjectionConstraint, Widget, E, RenderContextInit as Init } from '../../prelude-type.ts';
 * @import { CameraTransform, State, Config, RenderContext } from './type.ts';
 */
import {
  math,
  clearCanvas,
  renderPlaceholder,
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
  v2,
} from '../../prelude.js';
import * as util from './util.js';

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

/** @type {ProjectionConstraint} */
const projAbs0_2 = {
  kind: 'viewbox-absolute',
  origin: [-0.2, -0.1],
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
 * @param {boolean} pure
 * @param {string} title
 * @param {ProjectionConstraint} proj
 * @param {Widget<any, State, Config>['size']} size
 * @param {(ctx: RenderContext, state: State, config: Config) => void} render
 * @returns {Widget<any, State, Config>}
 */
export function makeWidget(pure, title, proj, size, render) {
  return {
    createContext: createRenderContext,
    header: mkTitle(title),
    size,
    meta: { kind: 'Canvas2d', pure, proj },
    render,
  };
}

/**
 * @param {string} text
 * @param {Widget<any, State, Config>['size']} size
 */
export function makePlaceholer(text, size) {
  return makeWidget(true, 'Placeholder ' + text, projT, size, ctx => {
    const { renderer, viewport } = ctx;
    clearCanvas(renderer, viewport);
    renderPlaceholder(renderer, viewport, text);
  });
}

export const dynamicsOfCapital = makeWidget(false, 'Captial Dynamics', projAbs0_2, {
  height: 300,
  gridColumn: { default: 1, s: 2 },
},
  (ctx, state) => {
    clearCanvas(ctx.renderer, ctx.viewport);

    const { time, model, chart: { camera, prerenderedTrajectory: points } } = state.solowSwan;
    const tA = (performance.now() - time.start) / time.period;
    const tB = (performance.now() - time.branch) / time.period;
    const k = util.solveCapitalAtT(model, tB);
    drawDyanmics(ctx, camera.capital, v2(tA, k), points.initial?.capital, points.current.capital);
  },
);

export const dynamicsOfOutput = makeWidget(false, 'Output Dynamics', projAbs0_2, {
  height: 300,
  gridColumn: { default: 1, s: 2 },
},
  (ctx, state) => {
    clearCanvas(ctx.renderer, ctx.viewport);

    const { time, model, chart: { camera, prerenderedTrajectory: points } } = state.solowSwan;
    const tA = (performance.now() - time.start) / time.period;
    const tB = (performance.now() - time.branch) / time.period;

    const y = util.solveOutputAtT(model, tB);
    drawDyanmics(ctx, camera.output, v2(tA, y), points.initial?.output, points.current.output);
  },
);

export const dynamicsOfCapitalAndOutput = makeWidget(false, 'Output Dynamics', projAbs0_2, {
  height: 300,
  gridColumn: { default: 2, s: 2 },
},
  (ctx, state) => {
    clearCanvas(ctx.renderer, ctx.viewport);

    const { time, model, chart: { camera, prerenderedTrajectory: points } } = state.solowSwan;
    const tA = (performance.now() - time.start) / time.period;
    const tB = (performance.now() - time.branch) / time.period;

    const y = util.solveOutputAtT(model, tB);
    const k = util.solveCapitalAtT(model, tB);
    drawDyanmics(ctx, camera.capital, v2(tA, y), points.initial?.outputByK, points.current.outputByK);
    drawDyanmics(ctx, camera.capital, v2(tA, k), points.initial?.capital, points.current.capital);
  },
);

/**
 * @param {RenderContext} ctx
 * @param {CameraTransform} camera
 * @param {Vec2} xyIn
 * @param {readonly Vec2[] | undefined} initial
 * @param {readonly Vec2[]} current
 */
function drawDyanmics(ctx, camera, xyIn, initial, current) {
  const { grid, line } = ctx;
  const { bounds, dest, translate } = camera;
  const xy = math.el.div(math.el.sub(xyIn, translate), bounds);
  grid.draw({ step: bounds });

  // const tick = v2(10, 1000);
  // grid.draw({ step: math.el.inv(math.el.div(bounds, math.el.mul(tick, v2(1, technology / 2)))) });
  line.drawVector(initial ?? [], { width: 4, stroke: 0x0000ff });
  line.drawVector(current, { width: 4, stroke: 0xffffff });

  const hLine = [v2(0, xy.vec[1]), v2(bounds.vec[0], xy.vec[1])];
  const vLine = [v2(xy.vec[0], 0), v2(xy.vec[0], bounds.vec[1])];
  line.drawVector(hLine, { width: 2, stroke: 0xff0000, lineDash: [5, 5] });
  line.drawVector(vLine, { width: 2, stroke: 0xff0000, lineDash: [5, 5] });
  drawAxisTick(ctx, xyIn, translate, bounds);
  drawAxisTick(ctx, translate, translate, bounds);
  drawAxisTick(ctx, dest, translate, bounds);
}

const xFormat = new Intl.NumberFormat("en-AU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const yFormat = new Intl.NumberFormat("en-AU", {
  maximumFractionDigits: 0,
});

/**
 * @param {RenderContext} ctx
 * @param {Vec2} p
 * @param {Vec2} translate,
 * @param {Vec2} bounds,
 */
function drawAxisTick({ text }, p, translate, bounds) {
  const [x, y] = p.vec;
  const [xb, yb] = math.el.div(math.el.sub(p, translate), bounds).vec;
  text.draw(v2(xb, -0.025), xFormat.format(x), {
    fontSize: 8,
    textBaseline: 'top'
  });
  text.draw(v2(-0.01, yb), yFormat.format(y), {
    fontSize: 8,
    textBaseline: 'middle',
    textAlign: 'right',
  });
}

export const diagrammaticalSolving = makePlaceholer(
  'Show Diagramatically solving the model, 30:54',
  { height: 400, gridColumn: { default: 2, s: 2 } },
);

export const modelSteadyState = makePlaceholer(
  'Show Diagramatically solving the model',
  { height: 400, gridColumn: { default: 2, s: 2 } },
);

export const effectsOfIncreasingToS = makePlaceholer(
  'Show Diagramatically solving the model',
  { height: 400, gridColumn: { default: 2, s: 2 } },
);
