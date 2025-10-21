/**
 * @import { ComplexViewport } from '../viewport.js';
 * @import { VectorOf } from '../../math/type.ts';
 * @import { Renderer } from '../type.ts';
 *
 * @typedef {VectorOf<'r', 2>} V2
 *
 * @typedef {{
 *   stroke?: number,
 *   width?: number,
 *   lineDash?: [number, number, ...number[]],
 * }} Cfg
 *
 * @typedef {Cfg & {
 *   closed?: boolean,
 * }} CfgMany
 */

export class LineRenderer {
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
   * @param {V2} start
   * @param {V2} end
   * @param {Cfg} [cfg]
   */
  draw(start, end, { stroke = 0xffffff, width = 1, lineDash } = {}) {
    const [x1, y1] = this.#viewport.toCanvas(start).vec;
    const [x2, y2] = this.#viewport.toCanvas(end).vec;

    this.#renderer.setLineDash(lineDash ?? []);
    this.#renderer.setStrokeStyle(stroke);
    this.#renderer.setLineWidth(width);
    this.#renderer.beginPath();
    this.#renderer.moveTo(x1, y1);
    this.#renderer.lineTo(x2, y2);
    this.#renderer.stroke();
  }

  /**
   * @param {readonly VectorOf<'r', 2>[]} items
   * @param {CfgMany} [cfg]
   */
  drawVector(items, {
    stroke = 0xffffff,
    width = 1,
    closed = false,
    lineDash,
  } = {}) {
    if (items.length < 2) return;
    const [head, ...tail] = items;

    this.#renderer.setLineDash(lineDash ?? []);
    this.#renderer.setStrokeStyle(stroke);
    this.#renderer.setLineWidth(width);
    this.#renderer.beginPath();

    const [x1, y1] = this.#viewport.toCanvas(head).vec;
    this.#renderer.moveTo(x1, y1)

    for (let i = 0; i < tail.length; i++) {
      const [x, y] = this.#viewport.toCanvas(tail[i]).vec;
      this.#renderer.lineTo(x, y);
    }

    if (closed) this.#renderer.closePath();
    this.#renderer.stroke();
  }
}
