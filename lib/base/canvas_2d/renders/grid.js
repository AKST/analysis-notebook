/**
 * @import { ComplexViewport } from '../viewport.js';
 * @import { Vec2 } from '../../geom_2d/type.ts';
 * @import { Renderer } from '../type.ts';
 */

import { complex, vector as v } from '../../math/value.js';

const { real } = complex;

export class Grid {
  /** @type {Renderer} */
  #renderer;

  /** @type {ComplexViewport} */
  #viewport;

  /**
   * @param {Renderer} renderer
   * @param {ComplexViewport} viewport
   */
  constructor(renderer, viewport) {
    this.#renderer = renderer;
    this.#viewport = viewport;
  }


  /**
   * @param {{
   *    step?: Vec2 | [number, number],
   *    lineDash?: {
   *      axis?: [number, number, ...number[]],
   *      tick?: [number, number, ...number[]],
   *    },
   * }} cfg
   */
  draw({
    step,
    lineDash: {
      axis: axisLineDash,
      tick: tickLineDash,
    } = {}
  } = {}) {
    const [xStep, yStep] = destep(step);
    const { canvasWidth, canvasHeight } = this.#viewport;

    // Grid lines
    this.#renderer.setStrokeStyle(0x333333);
    this.#renderer.setLineDash(tickLineDash ?? []);
    this.#renderer.setLineWidth(1);

    for (
      let i = Math.floor(real(this.#viewport.min.vec[0]));
      i <= Math.ceil(real(this.#viewport.max.vec[0]));
      i += xStep
    ) {
      const [x, _] = this.#viewport.toCanvas(v(2)(i, 0)).vec;
      this.#renderer.beginPath();
      this.#renderer.moveTo(x, 0);
      this.#renderer.lineTo(x, canvasHeight);
      this.#renderer.stroke();
    }

    for (
      let i = Math.floor(real(this.#viewport.min.vec[1]));
      i <= Math.ceil(real(this.#viewport.max.vec[1]));
      i += yStep
    ) {
      const [_, y] = this.#viewport.toCanvas(v(2)(0, i)).vec;
      this.#renderer.beginPath();
      this.#renderer.moveTo(0, y);
      this.#renderer.lineTo(canvasWidth, y);
      this.#renderer.stroke();
    }

    // Axes
    this.#renderer.setLineDash(axisLineDash ?? []);
    this.#renderer.setStrokeStyle(0x666666);
    this.#renderer.setLineWidth(2);
    const [ox, oy] = this.#viewport.toCanvas(v(2)(0, 0)).vec;

    this.#renderer.beginPath();
    this.#renderer.moveTo(0, oy);
    this.#renderer.lineTo(canvasWidth, oy);
    this.#renderer.moveTo(ox, 0);
    this.#renderer.lineTo(ox, canvasHeight);
    this.#renderer.stroke();
  }
}

/**
 * @param {Vec2 | [number, number] | undefined} steps
 * @returns {[number, number]}
 */
function destep(steps) {
  if (steps == null) return [1, 1];
  if (Array.isArray(steps)) return steps;
  return /** @type {any} */ (steps.vec);
}
