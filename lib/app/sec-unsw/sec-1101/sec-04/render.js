/**
 * @import { State, Config, RenderContext } from './type.ts';
 * @import {
 *   Vec2, E2 as E, Widget,
 *   RenderContextInit as Init,
 * } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type.ts';
 */
import {
  doc2 as doc,
  v2,
  TextRenderer,
  math,
  Grid,
  PolygonRenderer,
  LineRenderer,
  clearCanvas,
} from '@app/prelude.js';
import * as econCurve from '@base/econ/micro/curve.js';
import { createModelRenderer } from '@prelude-econ/2d-micro/model.js';
import * as util from './util.js';

const FONT_SIZE = 10;

/**
 * @param {Init} cfg
 * @returns {RenderContext}
 */
export function createRenderContext({ renderer, viewport }) {
  const grid = new Grid(renderer, viewport);
  const text = new TextRenderer(renderer, viewport);
  const line = new LineRenderer(renderer, viewport);
  const poly = new PolygonRenderer(renderer, viewport);
  const model = createModelRenderer({ renderer, viewport });
  return { model, text, grid, line, poly, renderer, viewport };
}

/**
 * @param {{
 *   title?: E.Item,
 *   gridSize: number,
 *   viewbox: { height: number },
 * }} cfg
 * @param {(context: RenderContext, state: State) => void} render
 * @returns {Widget<any, State, Config>}
 */
const makeWidget = ({
  title,
  gridSize,
  viewbox,
}, render) => {
  return {
    size: {
      height: viewbox.height,
      gridColumn: { default: gridSize, m: gridSize },
    },
    meta: {
      kind: 'Canvas2d',
      pure: true,
      proj: {
        kind: 'viewbox-absolute',
        origin: [-0.1, -0.1],
        width: 1.1,
        height: 1.1,
      },
    },
    createContext: createRenderContext,
    render: render,
    header: title,
  }
};

/** @param {string} t @returns {E.Item} */
const mkTitle = t => doc.h4({ className: 'chartLabel' }).c(t);

/**
 * @param {Vec2} bounds
 * @returns {Vec2}
 */
function gridStepFromBounds(bounds, mod=100) {
  return math.el.inv(math.el.mod(bounds, mod));
}

/**
 * @param {RenderContext} context
 * @param {Vec2} target
 * @param {Vec2} bounds
 */
function plotCrossHair(context, target, bounds) {
  const { text, line } = context;
  const eq2 = math.el.div(target, bounds);

  line.drawVector([v2(0, eq2.vec[1]), eq2, v2(eq2.vec[0], 0)], {
    width: 2,
    lineDash: [5, 5],
  });

  text.draw(v2(eq2.vec[0], -0.025), target.vec[0].toFixed(2), {
    fontSize: FONT_SIZE,
    textBaseline: 'top',
  });

  text.draw(v2(-0.01, eq2.vec[1]), target.vec[1].toFixed(2), {
    fontSize: FONT_SIZE,
    textBaseline: 'middle',
    textAlign: 'right',
  });
}

/**
 * @param {Econ.Curve.T} curve
 * @param {Vec2} bounds
 * @returns {Vec2[]}
 */
function plotAgent(curve, bounds) {
  const points = econCurve.getPoints(curve, bounds.vec[0]);
  return points.map(p => math.el.div(p, bounds));
};

/**
 * @returns {Widget<any, State, Config>}
 */
export const aggregateCurves = makeWidget({
  title: mkTitle('Aggregate S&D (Summation)'),
  gridSize: 2,
  viewbox: { height: 250 },
}, (context, {
  summation: {
    model: snapshot,
    modelState,
    bounds,
    consumers,
    producers,
  },
}) => {
  if (!snapshot || !modelState)  return;

  const { model, line, renderer, viewport } = context;
  clearCanvas(renderer, viewport);
  model.plotGrid(bounds);

  for (const agent of Object.values(consumers)) {
    line.drawVector(plotAgent(agent, bounds), {
      stroke: 0x006600,
      width: 2,
      lineDash: [5, 5],
    });
  }

  for (const agent of Object.values(producers)) {
    line.drawVector(plotAgent(agent, bounds), {
      stroke: 0x003366,
      width: 2,
      lineDash: [5, 5],
    });
  }

  model.plotCurveLines(snapshot, bounds);
  model.plotCrossHairs(snapshot, modelState, bounds);
});

/**
 * @returns {Widget<any, State, Config>}
 */
export const aggregateCurveSurplus = makeWidget({
  title: mkTitle('Aggregate S&D Surplus (Summation)'),
  gridSize: 2,
  viewbox: { height: 250 },
}, (context, {
  summation: { model: snapshot, modelState, bounds },
}) => {
  if (!snapshot || !modelState) return;
  const { model, renderer, viewport } = context;
  clearCanvas(renderer, viewport);
  renderer.setGlobalCompositeOperation('source-over');
  model.plotWithInputs(modelState, snapshot, bounds);
});

/**
 * @returns {Widget<any, State, Config>}
 */
export const discreteCurve = makeWidget({
  title: mkTitle('Aggregate S&D (Reservation Prices)'),
  gridSize: 2,
  viewbox: { height: 250 },
}, (context, {
  discrete: {
    bounds,
    model,
    equilibrium: eq,
  },
}) => {
  const { grid, line, renderer, viewport } = context;
  clearCanvas(renderer, viewport);
  if (model == null) return;

  grid.draw({ step: gridStepFromBounds(bounds) });
  line.drawVector(util.bound(model.demand.market.line, bounds), { stroke: 0x0000ff, width: 4 });
  line.drawVector(util.bound(model.supply.market.line, bounds), { stroke: 0x00ff00, width: 4 });
  if (eq) plotCrossHair(context, eq, bounds);
});


/**
 * @returns {Widget<any, State, Config>}
 */
export const discreteSurplus = makeWidget({
  title: mkTitle('Aggregate S&D (Surplus)'),
  gridSize: 2,
  viewbox: { height: 250 },
}, (context, {
  discrete: {
    bounds,
    model,
    equilibrium: eq,
  },
}) => {
  const { grid, poly, renderer, viewport } = context;
  clearCanvas(renderer, viewport);
  if (model == null || eq == null) return;
  grid.draw({ step: gridStepFromBounds(bounds) });
  renderer.setGlobalCompositeOperation('screen');
  const d = model.demand.market.surplus.geom;
  const s = model.supply.market.surplus.geom;

  poly.draw(util.bound(d, bounds), { fill: 0x0000cc, closed: true })
  poly.draw(util.bound(s, bounds), { fill: 0x00cc00, closed: true })
  plotCrossHair(context, eq, bounds);
});
