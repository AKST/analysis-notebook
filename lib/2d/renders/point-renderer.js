/**
 * @import { ComplexViewport } from '../viewport.js';
 * @import { VectorOf } from '../../base/math/type.ts';
 * @import { Renderer } from '../type.ts';
 *
 * @typedef {VectorOf<'r', 2>} V2
 */

export class PointRenderer {
  /** @type {Renderer} */ #renderer;
  /** @type {ComplexViewport} */ #viewport;

  /**
   * @param {Renderer} renderer
   * @param {ComplexViewport} viewport
   */
  constructor(renderer, viewport) {
    this.#renderer = renderer;
    this.#viewport = viewport;
  }

  /**
   * @param {V2} z
   */
  draw(z, color = 0xffffff, size = 3) {
    const [x, y] = this.#viewport.toCanvas(z).vec;
    this.#renderer.setFillStyle(color);
    this.#renderer.beginPath();
    this.#renderer.arc(x, y, size, 0, Math.PI * 2);
    this.#renderer.fill();
  }

  /**
   * @param {V2[]} vector
   */
  drawVector(vector, color = 0xffffff, size = 3) {
    vector.forEach(z => this.draw(z, color, size));
  }
}
