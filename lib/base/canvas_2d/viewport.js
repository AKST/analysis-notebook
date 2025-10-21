/**
 * @import { VectorOf } from '../math/type.ts';
 *
 * @typedef {VectorOf<'r', 2>} Vec2
 */
import * as m from '../math/value.js';

export class ComplexViewport {
  /**
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   * @param {Vec2} [origin]
   * @param {Vec2} [bounds]
   */
  constructor(
    canvasWidth,
    canvasHeight,
    origin = m.vector(2)(0, 0),
    bounds = m.vector(2)(8, 8),
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.origin = origin;
    this.bounds = bounds;
  }

  /**
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   * @param {Vec2} origin
   * @param {Vec2} bounds
   * @returns {ComplexViewport}
   */
  static create(canvasWidth, canvasHeight, origin, bounds) {
    return new ComplexViewport(canvasWidth, canvasHeight, origin, bounds);
  }

  /**
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   * @param {number} [size=16]
   * @returns {ComplexViewport}
   */
  static square(canvasWidth, canvasHeight, size = 16) {
    return new ComplexViewport(
      canvasWidth, canvasHeight,
      m.vector(2)(0, 0),
      m.vector(2)(size/2, size/2),
    );
  }

  /** @type {Vec2} */
  get min() { return m.el.sub(this.origin, this.bounds) }

  /** @type {Vec2} */
  get max() { return m.el.add(this.origin, this.bounds) }

  /** @type {Vec2} */
  get range() { return m.el.mul(this.bounds, 2); }

  get aspectRatio() {
    const [x, y] = this.range.vec
    return m.div(x, y);
  }

  /**
   * @param {Vec2} z
   * @returns {Vec2}
   */
  toCanvas(z) {
    const { el: { add, mul, div, sub }, vector } = m;
    const conj = vector(2)(1, -1);
    const size = vector(2)(this.canvasWidth, this.canvasHeight)
    const last = vector(2)(0, this.canvasHeight);
    return add(last, mul(conj, mul(size, div(sub(z, this.min), this.range))));
  }
}
