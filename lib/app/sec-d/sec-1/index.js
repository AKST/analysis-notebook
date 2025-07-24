/**
 * @import {
 *   RenderWidgetMeta,
 *   Complex,
 *   RenderContextInit,
 * } from '../../prelude-type.ts';
 */
import {
  c,
  vector,
  math,
  Grid,
  PointRenderer,
  LineRenderer,
  VectorRenderer,
  clearCanvas,
  COLOR,
} from '../../prelude.js';

/**
 * @typedef {{ t: number }} State
 *
 * @typedef {RenderContextInit & {
 *   grid: Grid,
 *   line: LineRenderer,
 *   point: PointRenderer,
 *   vec: VectorRenderer
 * }} Context
 */

/** @type {RenderWidgetMeta} */
export const meta = {
  kind: 'Canvas2d',
  pure: false,
  proj: { kind: 'transform' }
};

/**
 * @param {RenderContextInit} cfg
 * @returns {Context}
 */
export function createContext({ renderer, viewport }) {
  const grid = new Grid(renderer, viewport);
  const point = new PointRenderer(renderer, viewport);
  const line = new LineRenderer(renderer, viewport);
  const vec = new VectorRenderer(renderer, viewport);

  return {
    renderer,
    viewport,
    grid,
    point,
    line,
    vec,
  };
}

export function createState() {
  return {
    t: 0
  };
}

/**
 * @param {State} state
 * @param {never} _event
 * @returns {State}
 */
export function onUpdate(state, _event) {
  return {
    ...state,
    t: state.t + 0.025
  };
}


const CIRCLE_POINTS = Array.from({ length: 63 }, (_, i) => (
  c(Math.cos(i * 0.1), Math.sin(i * 0.1))
));

/** @param {number} a @param {number} b */
const v2 = (a, b) => vector(2)(a, b);

/** @param {Complex} c */
const vFromC = c => vector(2)(c.real, c.imag);

/** @param {Complex[]} ls @param {Complex} s */
const muls = (ls, s) => ls.map(it => math.mul(it, s)).map(vFromC);
const ORIGIN = v2(0, 0);
const SAMPLE_POINTS = [c(+1, 0), c(0, +1), c(-1, 0), c(0, -1)];

/**
 * @param {Context} context
 * @param {State} state
 */
export function render(context, state) {
  const { t } = state;

  const inner = c.createMagAngle(5, t);
  const outer = c.createMagAngle(7, Math.exp(t * 0.1));

  clearCanvas(context.renderer, context.viewport, Math.random() > 0.9);
  context.renderer.setGlobalCompositeOperation('screen');
  context.grid.draw();
  context.point.draw(vFromC(outer), COLOR.CYAN, 10);

  const circlePoints = muls(CIRCLE_POINTS, c.createMagAngle(5.25, 0));
  context.line.drawVector(circlePoints, {
    stroke: COLOR.CYAN,
    width: 10,
    closed: true,
  });

  for (const [scale, colour] of [
    [c.createMagAngle(5, t/1.2), COLOR.LIME],
    [c.createMagAngle(5, 0), COLOR.YELLOW],
    [inner, COLOR.RED],
  ]) {
    const v = muls(SAMPLE_POINTS, scale);
    context.vec.drawVectorFrom(ORIGIN, v, colour, 5);
  }
}
