/**
 * @import { Vec2, RenderContextInit } from '../../prelude-type.ts';
 * @import { Config, State, RenderConfig } from './type.ts';
 */
import{
  vector,
  math as op,
  convexHull,
  Grid,
  PointRenderer,
  VectorRenderer,
  clearCanvas,
  COLOR,
} from '../../prelude.js';


/**
 * Shared between each of the canvas 2d widgets
 * @param {RenderContextInit} init
 * @returns {RenderConfig}
 */
export function createRenderContext({ renderer, viewport }) {
  const grid = new Grid(renderer, viewport);
  const point = new PointRenderer(renderer, viewport);
  const vec = new VectorRenderer(renderer, viewport);
  return { grid, point, vec, renderer, viewport };
}


const ORIGIN = vector(2)(0, 0);

/**
 * @param {RenderConfig} context
 * @param {State} state
 * @param {Config} config
 */
export function renderPpcAsVectors(context, state, config) {
  const { grid, point, vec, renderer, viewport } = context;
  const { scale } = config;

  clearCanvas(renderer, viewport);
  grid.draw();

  for (const vector of Object.values(state.agents)) {
    const scaled = op.el.mul(vector.point, scale);
    vec.draw(ORIGIN, scaled, vector.color, 5);
    point.draw(scaled, COLOR.WHITE, 3);
  }
}

/**
 * @param {RenderConfig} context
 * @param {State} state
 * @param {Config} config
 */
export function renderPPC(context, state, config) {
  const { grid, point, vec, renderer, viewport } = context;

  clearCanvas(renderer, viewport);
  grid.draw();

  const { scale } = config;

  for (const { point: p, color } of Object.values(state.agents)) {
    const points = convexHull([op.el.mul(p, scale)], ORIGIN);
    points.forEach((p, i) => {
      point.draw(p, COLOR.WHITE, 5);
      // @ts-ignore - irrelevant
      vec.draw(points.at(i - 1), p, color, 2);
    });
  }
}

/**
 * @param {RenderConfig} context
 * @param {State} state
 * @param {Config} config
 */
export function renderJointPPC(context, state, config) {
  renderPPC(context, state, config);
  const { point, vec } = context;
  const { econPPF } = state;
  const { scale } = config;

  const points = econPPF.map(p => op.el.mul(p, scale));
  points.forEach((p, i) => {
    point.draw(p, COLOR.WHITE, 5);
      // @ts-ignore - irrelevant
    vec.draw(points.at(i - 1), p, COLOR.RED, 2);
  });
}

/**
 * @param {RenderConfig} context
 * @param {Vec2} optimalPoint
 * @param {Vec2} price
 */
export function drawCPCLine(context, optimalPoint, price) {
  const { vec } = context;
  const totalRevenue = op.vector.dot(price, optimalPoint);
  const xIntercept = vector(2)(totalRevenue / price.vec[0], 0);
  const yIntercept = vector(2)(0, totalRevenue / price.vec[1]);
  vec.draw(yIntercept, xIntercept, 0xff00ff, 3);
}

/**
 * @param {RenderConfig} context
 * @param {State} state
 * @param {Config} config
 */
export function renderEconomyCPC(context, state, config) {
  const { grid, point, vec, renderer, viewport } = context;
  const { scale } = config;
  const { econPPF, price, optimalProduction } = state;

  clearCanvas(renderer, viewport);
  grid.draw();

  // Render joint PPC
  const points = econPPF.map(p => op.el.mul(p, scale));
  points.forEach((p, i) => {
    point.draw(p, COLOR.WHITE, 5);
      // @ts-ignore - irrelevant
    vec.draw(points.at(i - 1), p, COLOR.RED, 2);
  });

  const optimalPoint = op.el.mul(optimalProduction, scale);
  drawCPCLine(context, optimalPoint, price);
  point.draw(optimalPoint, COLOR.WHITE, 8);
  point.draw(optimalPoint, 0x00ff00, 6); // Green center for optimal
  console.log(state, config);
}

