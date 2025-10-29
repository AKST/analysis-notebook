/**
 * @import { Econ, Vec2, Widget, E, RenderContextInit as Init } from '../../../prelude-type.ts';
 * @import { State, Config, RenderContext } from './type.ts';
 */
import {
  v2,
  math,
  econCurve,
  clearCanvas,
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '../../../prelude.js';

/** @param {string} t @returns {E.Item} */
const mkTitle = t => ['h4', { className: 'chartLabel' },  t];

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
 * @param {RenderContext} ctx
 * @param {Vec2[]} points
 * @param {Vec2} bounds
 * @param {{
 *   width?: number,
 *   stroke?: number,
 *   lineDash?: [number, number],
 * }} [cfg]
 */
export function renderLine({
  line,
}, points, bounds, cfg = {}) {
  line.drawVector(points.map(p => math.el.div(p, bounds)), {
    width: 4,
    stroke: 0xffffff,
    ...cfg,
  });
}

/**
 * @param {RenderContext} ctx
 * @param {'x' | 'y'} axis
 * @param {number} value
 * @param {Vec2} bounds
 */
export function renderTick({
  text,
}, axis, value, bounds) {
  if (axis === 'x') {
    const x = value / bounds.vec[0];
    text.draw(v2(x, -0.025), value.toFixed(2), {
      fontSize: 10,
      textBaseline: 'top'
    });
  } else {
    const y = value / bounds.vec[1];
    text.draw(v2(-0.01, y), value.toFixed(2), {
      fontSize: 10,
      textBaseline: 'middle',
      textAlign: 'right'
    });
  }
}


/**
 * @param {RenderContext} ctx
 * @param {Econ.Curve.Continious} curve
 * @param {Vec2} bounds
 * @param {{
 *   showQIntercept?: boolean,
 *   marginalCost?: number,
 *   aggregate?: Econ.Curve.Continious,
 * }} bounds
 * @param {{
 *   width?: number,
 *   stroke?: number,
 * }} [cfg]
 */
export function renderCurve(ctx, curve, bounds, {
  showQIntercept = false,
  marginalCost,
  aggregate,
}, cfg = {}) {
  const qMax = econCurve.getQuantityAtPrice(curve, 0);
  const mcQ = marginalCost
    ? econCurve.getQuantityAtPrice(curve, marginalCost)
    : { ok: true, q: -1, p: 0 };

  if (!qMax.ok) return;
  renderLine(ctx, [v2(0, curve.i), v2(qMax.q, 0)], bounds, cfg);

  renderTick(ctx, 'y', curve.i, bounds);
  renderLine(ctx, [
    v2(0, curve.i),
    v2(bounds.vec[0], curve.i),
  ], bounds, {
    width: 2,
    lineDash: [1, 5],
  });

  if (showQIntercept) {
    renderTick(ctx, 'x', qMax.q, bounds);
    renderLine(ctx, [
      v2(qMax.q, 0),
      v2(qMax.q, bounds.vec[1]),
    ], bounds, {
      width: 1,
      lineDash: [1, 5],
    });
  }

  if (mcQ.ok && mcQ.q > 0) {
    renderTick(ctx, 'x', mcQ.q, bounds);
    renderLine(ctx, [
      v2(mcQ.q, 0),
      v2(mcQ.q, bounds.vec[1]),
    ], bounds, {
      width: 2,
      lineDash: [5, 5],
    });
  }

  const aggregateP = aggregate != null && mcQ.ok
    ? econCurve.getPriceAtQuantity(aggregate, mcQ.q)
    : undefined;

  if (aggregateP?.ok) {
    renderTick(ctx, 'y', aggregateP.p, bounds);
    renderLine(ctx, [
      v2(0, aggregateP.p),
      v2(bounds.vec[0], aggregateP.p),
    ], bounds, {
      width: 2,
      lineDash: [5, 5],
    });

  }
}

/**
 * @type {Widget<any, State, Config>}
 */
export const aggregateDemand = {
  createContext: createRenderContext,
  header: mkTitle('Vertical Summation'),
  size: {
    height: 600,
    gridColumn: { default: 2, m: 2 },
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
  /**
   * @param {RenderContext} ctx
   * @param {State} state
   */
  render: (ctx, {
    bounds,
    marginalCost: mc,
    aggregateDemand,
    consumers,
    produced: { contribute: lindahlQ },
  }) => {
    const gridStep = math.el.inv(math.el.mod(bounds, 100));
    const { renderer, viewport } = ctx;
    const aggOptions = {
      lindahlQ,
      showQIntercept: true,
    };

    clearCanvas(renderer, viewport);
    renderer.setGlobalCompositeOperation('screen');

    ctx.grid.draw({ step: gridStep });

    if (aggregateDemand == null) return;
    renderCurve(ctx, aggregateDemand, bounds, aggOptions, { stroke: 0xFF0000 });

    for (const { curve } of Object.values(consumers)) {
      renderCurve(ctx, curve, bounds, {
        marginalCost: mc,
        aggregate: aggregateDemand,
      }, { stroke: 0x0000FF });
    }

    renderTick(ctx, 'y', mc, bounds);
    renderLine(ctx, [
      v2(0, mc),
      v2(bounds.vec[0], mc),
    ], bounds, { stroke: 0x00FF00 })

    renderTick(ctx, 'x', lindahlQ, bounds);
    renderLine(ctx, [v2(lindahlQ, 0), v2(lindahlQ, bounds.vec[1])], bounds, {
      width: 2,
      stroke: 0xffffff,
    })
  },
};
