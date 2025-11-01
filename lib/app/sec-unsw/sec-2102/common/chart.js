/**
 * @import { Vec2, RenderContextInit as Init } from '@app/prelude-type.ts';
 * @import { Rendering } from './type.ts';
 */
import {
  clearCanvas,
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
  math,
  v2,
} from '@app/prelude.js';

const Y_FORMAT = new Intl.NumberFormat("en-AU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const X_FORMAT = new Intl.NumberFormat("en-AU");

/**
 * @param {Init} cfg
 * @returns {Rendering.ChartContext}
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
 * @param {Rendering.ChartContext} ctx
 * @param {Pick<Rendering.Equilibrium2d, 'bounds'> & {
 *   v?: { width?: number, stroke?: number?, lineDash?: [number, number] },
 *   h?: { width?: number, stroke?: number?, lineDash?: [number, number] },
 * }} chart
 */
export function drawGrid(ctx, { bounds, v = {}, h = {} }) {
  /** @param {number} n */
  const step = n => 10 ** (Math.floor(Math.log10(n) - 1));

  /** @param {number} max @param {number} step */
  const steps = (max, step) => {
    const out = []
    for (let i = step; i < max; i += step) out.push(i);
    return out;
  };

  const { line } = ctx;
  const [xb, yb] = bounds.vec;

  for (const x of steps(xb, step(xb))) {
    line.drawVector([
      v2(x / xb, 0),
      v2(x / xb, yb),
    ], {
      width: v.width ?? 1,
      stroke: v.stroke ?? 0x666666,
      lineDash: v.lineDash ?? [1, 2],
    });
  }

  for (const y of steps(yb, step(yb))) {
    line.drawVector([
      v2(0, y / yb),
      v2(1, y / yb),
    ], {
      width: h.width ?? 1,
      stroke: h.stroke ?? 0x666666,
      lineDash: h.lineDash ?? [1, 2],
    });
  }
}

/**
 * @param {Rendering.ChartContext} ctx
 */
export function clearDraw(ctx) {
  clearCanvas(ctx.renderer, ctx.viewport);
}

/**
 * @param {Rendering.ChartContext} ctx
 * @param {Rendering.Basic2d} chart
 */
export function drawChart(ctx, { points, bounds }) {
  const { line } = ctx;
  line.draw(v2(0, 0), v2(0, 1));
  line.draw(v2(0, 0), v2(1, 0));

  line.drawVector(points.map(p => math.el.div(p, bounds)), {
    width: 4,
    stroke: 0xffffff,
  });

}

/**
 * @param {Rendering.ChartContext} ctx
 * @param {Vec2} point
 * @param {Pick<Rendering.Equilibrium2d, 'bounds'> & {
 *   v?: { width?: number, stroke?: number?, lineDash?: [number, number] },
 *   h?: { width?: number, stroke?: number?, lineDash?: [number, number] },
 * }} chart
 */
export function drawCrossHair(ctx, point, { bounds, v = {}, h = {} }) {
  const { line } = ctx;
  const [x, y] = point.vec;
  line.drawVector([
    v2(0, y),
    v2(bounds.vec[0], y),
  ].map(p => math.el.div(p, bounds)), {
    width: h.width ?? 2,
    stroke: h.stroke ?? 0xff0000,
    lineDash: h.lineDash ?? [5, 5],
  });
  line.drawVector([
    v2(x, 0),
    v2(x, bounds.vec[1]),
  ].map(p => math.el.div(p, bounds)), {
    width: v.width ?? 2,
    stroke: v.stroke ?? 0xff0000,
    lineDash: v.lineDash ?? [5, 5],
  });
}

/**
 * @param {Rendering.ChartContext} ctx
 * @param {Vec2} point
 * @param {Pick<Rendering.Equilibrium2d, 'bounds'>} chart
 */
export function drawValues(ctx, point, { bounds }) {
  const { text } = ctx;
  const [x, y] = point.vec;
  const [xb, yb] = math.el.div(point, bounds).vec;
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
 * @param {Rendering.ChartContext} ctx
 * @param {Rendering.Equilibrium2d} chart
 */
export function drawEquilibrium(ctx, { ticks, eq, points, bounds }) {
  clearDraw(ctx);
  drawChart(ctx, { points, bounds });
  drawCrossHair(ctx, eq, { bounds });
  drawValues(ctx, eq, { bounds });
  for (const tick of ticks) {
    drawValues(ctx, tick, { bounds });
  }
}

