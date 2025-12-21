/**
 * @import { Vec2, ProjectionConstraint, Widget, RenderContextInit as Init } from '@app/prelude-type.ts';
 * @import { Rendering } from '../common/type.ts';
 * @import { State, Config } from './type.ts';
 */
import {
  v2,
  math,
  doc2 as doc,
  clearCanvas,
  renderPlaceholder,
} from '@app/prelude.js';
import {
  createRenderContext as createInitRenderContext,
  clearDraw,
  drawGrid,
  drawChart,
  drawCrossHair,
  drawValues,
  renderScale,
} from '../common/chart.js';

/** @param {string} t */
const mkTitle = t => doc.h4({ className: 'chartLabel' }).c(t);

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

/** @param {Init} init */
function createRenderContext(init) {
  const ctx = createInitRenderContext(init);

  return ctx;
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

    renderScale(ctx, bounds, 0, 0.95);
    ctx.text.draw(v2(0, -0.07), 'Output Gap', {
      bg: { color: 0xffffff, padding: 4 },
      color: 0x000000,
      fontSize: 10,
      textBaseline: 'middle',
      textAlign: 'center',
    });
    ctx.text.draw(v2(-0.96, 0.5), 'Real Interest Rate', {
      bg: { color: 0xffffff, padding: 4 },
      color: 0x000000,
      rotRadians: -2,
      fontSize: 8,
      textBaseline: 'middle',
      textAlign: 'center',
    });
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

    renderScale(ctx, bounds);
    ctx.text.draw(v2(0, -0.96), 'Output Gap', {
      bg: { color: 0xffffff, padding: 4 },
      color: 0x000000,
      fontSize: 8,
      textBaseline: 'middle',
      textAlign: 'center',
    });
    ctx.text.draw(v2(-0.96, 0), 'Inflation Change', {
      bg: { color: 0xffffff, padding: 4 },
      color: 0x000000,
      rotRadians: -2,
      fontSize: 8,
      textBaseline: 'middle',
      textAlign: 'center',
    });
  }
)
