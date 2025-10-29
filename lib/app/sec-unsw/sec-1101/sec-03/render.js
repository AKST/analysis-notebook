/**
 * @import { GoodUtility, State, Config, RenderContext } from './type.ts';
 * @import { Vec2, E, Widget, RenderContextInit as Init } from '../../../prelude-type.ts';
 */
import {
  vector,
  numbers,
  TextRenderer,
  Grid,
  PointRenderer,
  LineRenderer,
  clearCanvas,
} from '../../../prelude.js';

/** @param {number} x @param {number} y */
const v2 = (x, y) => vector(2)(x, y);

const FONT_SIZE = 10;

/**
 * @param {Init} cfg
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
 * @param {GoodUtility} good
 * @param {GoodUtility} alt
 */
const plotGood = (good, alt) => {
  /** @param {number} v @param {number} i */
  const discrete = (v, i) => [v2(i, v), v2(i+1, v)];

  /** @param {number} v @param {number} i */
  const continuious = (v, i) => [v2(i, v)];

  /** @param {number} v */
  const perDollor = v => v / good.price;

  /** @param {number} v */
  const reservation = (v) => (
      v / (alt.marginal[1] / alt.price)
  );

  /** @param {number} v @param {number} i */
  const reservationRel = (v, i) => (
      v / (alt.marginal[i] / alt.price)
  );

  return {
    marginal: good.marginal.flatMap(discrete),
    marginalPer: good.marginal.map(perDollor)
      .flatMap(discrete),
    marginalPerC: good.marginal.map(perDollor)
      .flatMap(continuious),
    reservation: good.marginal.map(reservation)
      .flatMap(discrete),
    reservationC: good.marginal.map(reservation)
      .flatMap(continuious),
    reservationRel: good.marginal.map(reservationRel)
      .flatMap(discrete),
    reservationRelC: good.marginal.map(reservationRel)
      .flatMap(continuious),
  }
};

/** @type {Parameters<LineRenderer['draw']>[2]} */
const AXIS_LINE_CFG = {
  stroke: 0xffffff,
  width: 1,
  lineDash: [1, 5],
};

/**
 * @param {RenderContext} context
 * @param {{
 *   xmax: number,
 *   values: Vec2[][],
 *   margin: number,
 * }} cfg
 */
const renderYAxisMarkers = (context, { xmax, values, margin }) => {
  const { line, text } = context;
  const yValue = values.flatMap(vs => vs.map(v => v.vec[1]))
  const points = numbers.marginThrottle(
    Array.from(new Set(yValue)).sort(numbers.compareInv),
    margin,
  );

  for (const p of points) {
    if (p === 0) continue;

    const base = v2(0, p);
    const axis = v2(-0.25, p);
    line.draw(base, v2(xmax, p), AXIS_LINE_CFG);
    text.draw(axis, p.toFixed(2), {
      fontSize: FONT_SIZE,
      textAlign: 'right',
    });
  }
};

/**
 * @param {RenderContext} context
 * @param {{
 *   ymax: number,
 *   values: Vec2[][],
 *   margin: number,
 *   textYTop: number,
 * }} cfg
 */
const renderXAxisMarkers = (context, { ymax, values, margin, textYTop }) => {
  const { line, text } = context;
  const xValue = values.flatMap(vs => vs.map(v => v.vec[0]))
  const points = numbers.marginThrottle(
    Array.from(new Set(xValue)).sort(numbers.compareInv),
    margin,
  );

  for (const p of points) {
    if (p === 0) continue;

    const base = v2(p, 0);
    const axis = v2(p, -textYTop);
    line.draw(base, v2(p, ymax), AXIS_LINE_CFG);
    text.draw(axis, p.toFixed(0), {
      fontSize: FONT_SIZE,
      textBaseline: 'top',
    });
  }
};

const LINE_WIDTH = 4;
const width = 9;
const widthS = 0.25;

/**
 * @param {(v: ReturnType<typeof plotGood>) => Vec2[]} f
 * @param {{
 *   hideDonut?: boolean
 *   title?: E.Item,
 *   height: number,
 *   gridSize: number,
 *   ws: number,
 *   viewbox: { height: number },
 * }} cfg
 * @returns {Widget<any, State, Config>}
 */
const makeWidget = (f, {
  title,
  height,
  gridSize,
  ws,
  viewbox,
  hideDonut = false,
}) => {
  /**
   * @param {RenderContext} context
   * @param {State} state
   */
  const render = (context, state) => {
    if (state.utility == null) return;
    const { donuts, muffins } = state.utility;
    const { grid, line, renderer, viewport } = context;

    const donutU = plotGood(donuts, muffins);
    const muffinU = plotGood(muffins, donuts);

    clearCanvas(renderer, viewport);
    grid.draw({ step: [1, 5] });
    renderer.setGlobalCompositeOperation('screen');

    const a = f(donutU), b = f(muffinU);
    line.drawVector(b, { stroke: muffins.color, width: LINE_WIDTH });

    let axisValues;
    if (hideDonut) {
      line.drawVector(b, { stroke: muffins.color, width: LINE_WIDTH });
      axisValues = [b];
    } else {
      line.drawVector(a, { stroke: donuts.color, width: LINE_WIDTH });
      line.drawVector(b, { stroke: muffins.color, width: LINE_WIDTH });
      axisValues = [a, b];
    }

    renderYAxisMarkers(context, {
      xmax: 10,
      values: axisValues,
      margin: height / 15
    });
    renderXAxisMarkers(context, {
      ymax: height,
      textYTop: height * 0.03,
      values: axisValues,
      margin: 0,
    });
  };

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
        origin: [-ws * width, -0.1 * height],
        width: width * (1 + ws),
        height: height * 1.1,
      },
    },
    createContext: createRenderContext,
    render: render,
    header: title,
  }
};

/** @param {string} t @returns {E.Item} */
const mkTitle = t => ['h4', { className: 'chartLabel' },  t];

/**
 * @returns {Widget<any, State, Config>[]}
 */
export function renderMarginalUtilityPerDollar() {
  return [
    makeWidget(good => good.marginal.slice(2), {
      title: mkTitle('Marginal Utility (MU)'),
      ws: 0.1,
      height: 45,
      gridSize: 4,
      viewbox: { height: 250 },
    }),
    makeWidget(good => good.marginalPer.slice(2), {
      title: mkTitle('MU/$ (Discrete)'),
      ws: 0.20,
      height: 15,
      gridSize: 2,
      viewbox: { height: 250 },
    }),
    makeWidget(good => good.marginalPerC.slice(1), {
      title: mkTitle('MU/$ (Continuous)'),
      ws: 0.20,
      height: 15,
      gridSize: 2,
      viewbox: { height: 250 },
    }),
  ]
}

/**
 * @returns {Widget<any, State, Config>[]}
 */
export function renderReservationPrice() {
  return [
    makeWidget(good => good.reservationRel.slice(2), {
      hideDonut: true,
      title: mkTitle('Reservation Price (Discrete)'),
      ws: 0.20,
      height: 15,
      gridSize: 2,
      viewbox: { height: 250 },
    }),
    makeWidget(good => good.reservationRelC.slice(1), {
      hideDonut: true,
      title: mkTitle('Reservation Price (Continious)'),
      ws: 0.20,
      height: 15,
      gridSize: 2,
      viewbox: { height: 250 },
    }),
  ]
}

/**
 * @returns {Widget<any, State, Config>[]}
 */
export function renderRelativePrice() {
  return [
    makeWidget(good => good.reservationRel.slice(2), {
      title: mkTitle('Relative Value (Discrete)'),
      ws: 0.20,
      height: 15,
      gridSize: 2,
      viewbox: { height: 250 },
    }),
    makeWidget(good => good.reservationRelC.slice(1), {
      title: mkTitle('Relative Value (Continious)'),
      ws: 0.20,
      height: 15,
      gridSize: 2,
      viewbox: { height: 250 },
    }),
  ]
}
