/**
 * @import { Renderer } from '../../platform/canvas-2d/type.ts';
 * @import { ComplexViewport } from '../viewport.js';
 * @import { VectorOf } from '../../math/type.ts';
 *
 * @typedef {VectorOf<'r', 2>} V2
 */

export class PolygonRenderer {
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
   * @param {readonly V2[]} items
   * @param {{
   *   stroke?: number | undefined,
   *   fill?: number | undefined,
   *   closed?: boolean,
   * }} cfg
   */
  draw(items, {
    fill = 0xffffff,
    closed = false,
  }) {
    if (items.length < 3) return;
    const [head, ...tail] = items;

    this.#renderer.setFillStyle(fill);
    this.#renderer.beginPath();

    const [x1, y1] = this.#viewport.toCanvas(head).vec;
    this.#renderer.moveTo(x1, y1);

    for (let i = 0; i < tail.length; i++) {
      const [x, y] = this.#viewport.toCanvas(tail[i]).vec;
      this.#renderer.lineTo(x, y);
    }

    if (closed) this.#renderer.closePath();
    this.#renderer.fill();
  }
}
