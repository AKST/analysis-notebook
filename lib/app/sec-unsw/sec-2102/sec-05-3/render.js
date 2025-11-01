/**
 * @import { ProjectionConstraint, Widget, E, RenderContextInit as Init } from '@app/prelude-type.ts';
 * @import { Rendering } from '../common/type.ts';
 * @import { State, Config } from './type.ts';
 */
import {
  math,
  vector,
  clearCanvas,
  renderPlaceholder,
} from '@app/prelude.js';
import {
  createRenderContext,
  clearDraw,
  drawGrid,
  drawChart,
  drawCrossHair,
  drawValues,
} from '../common/chart.js';

/** @param {string} t @returns {E.Item} */
const mkTitle = t => ['h4', { className: 'chartLabel' },  t];

/** @type {ProjectionConstraint} */
const projT = { kind: 'transform' };

/** @type {ProjectionConstraint} */
const projMpIs = {
  kind: 'viewbox-absolute',
  origin: [-1, -0.1],
  width: 2,
  height: 1.1,
};

/** @type {ProjectionConstraint} */
const projPhilips = {
  kind: 'viewbox-absolute',
  origin: [-1, -1],
  width: 2,
  height: 2,
}

/**
 * @param {string} title
 * @param {ProjectionConstraint} proj
 * @param {Widget<any, State, Config>['size']} size
 * @param {(ctx: Rendering.ChartContext, state: State) => void} render
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

export const isCurve = makeWidget(
  'IS & MP Curve',
  projMpIs,
  { height: 400, gridColumn: { default: 1, s: 2 } },
  (ctx, state) => {
    if (state.isCurveChart == null) return;
    const { ticks, isCurve, mpCurves, bounds } = state.isCurveChart

    clearDraw(ctx);
    drawGrid(ctx, { bounds });
    drawChart(ctx, { points: isCurve, bounds, axisXNeg: true });

    const xMin = (bounds.vec[0] * -0.75);
    const xMinT = (bounds.vec[0] * -0.8);
    for (const eq of mpCurves) {
      drawCrossHair(ctx, eq, {
        bounds,
        h: { stroke: 0x0000ff, lineDash: [1, 0], width: 4, xMin },
      });
      drawValues(ctx, eq, { fontSize: 8, bounds, xMin: xMinT });
    }

    for (const tick of ticks) {
      drawValues(ctx, tick, { fontSize: 10, bounds, xMin: bounds.vec[0] * -0.1 });
    }
  }
);

export const philipsCurve = makeWidget(
  'Philips Curve',
  projPhilips,
  { height: 400, gridColumn: { default: 1, s: 2 } },
  (ctx, state) => {
    if (state.philipsCurve == null) return;
    const { curve, mpCurves, bounds } = state.philipsCurve

    clearDraw(ctx);
    drawGrid(ctx, { bounds });
    drawChart(ctx, {
      points: curve,
      axisXNeg: true,
      axisYNeg: true,
      bounds,
    });

    const [xMin, yMin] = math.el.mul(bounds, -0.75).vec;
    const [xMinT, yMinT] = math.el.mul(bounds, -0.8).vec;
    for (const eq of mpCurves) {
      drawCrossHair(ctx, eq, {
        bounds,
        h: { stroke: 0x0000ff, lineDash: [1, 0], width: 4, xMin },
        v: { yMin },
      });
      drawValues(ctx, eq, { fontSize: 8, bounds, xMin: xMinT, yMin: yMinT });
    }
  }
)
