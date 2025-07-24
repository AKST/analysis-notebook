/**
 * @import { ComplexViewport } from '../viewport.js';
 * @import { VectorOf } from '../../base/math/type.ts';
 * @import { Renderer } from '../type.ts';
 *
 * @typedef {VectorOf<'r', 2>} V2
 */

export class VectorRenderer {
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
   */
  draw(start, end, color = 0xffffff, width = 2, arrowSize = 8) {
    const [x1, y1] = this.#viewport.toCanvas(start).vec;
    const [x2, y2] = this.#viewport.toCanvas(end).vec;

    // Calculate line angle and shortened endpoint
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const scaledArrowSize = arrowSize + width * 1.5;
    const lineEndX = x2 - scaledArrowSize * 0.7 * Math.cos(angle); // Shorten line by 70% of arrow size
    const lineEndY = y2 - scaledArrowSize * 0.7 * Math.sin(angle);

    // Draw main line (shortened to not overlap arrow)
    this.#renderer.setStrokeStyle(color);
    this.#renderer.setLineWidth(width);
    this.#renderer.beginPath();
    this.#renderer.moveTo(x1, y1);
    this.#renderer.lineTo(lineEndX, lineEndY);
    this.#renderer.stroke();

    // Draw arrowhead - scale with line width for better visibility
    const arrowAngle = Math.PI / 6; // 30 degrees

    this.#renderer.setFillStyle(color);
    this.#renderer.beginPath();
    this.#renderer.moveTo(x2, y2);
    this.#renderer.lineTo(
      x2 - scaledArrowSize * Math.cos(angle - arrowAngle),
      y2 - scaledArrowSize * Math.sin(angle - arrowAngle)
    );
    this.#renderer.lineTo(
      x2 - scaledArrowSize * Math.cos(angle + arrowAngle),
      y2 - scaledArrowSize * Math.sin(angle + arrowAngle)
    );
    this.#renderer.lineTo(x2, y2);
    this.#renderer.fill();
  }

  /**
   * @param {V2} origin
   * @param {V2} z
   */
  drawFrom(origin, z, color = 0xffffff, width = 2, arrowSize = 8) {
    this.draw(origin, z, color, width, arrowSize);
  }

  /**
   * @param {V2} origin
   * @param {readonly V2[]} vector
   */
  drawVectorFrom(origin, vector, color = 0xffffff, width = 2, arrowSize = 8) {
    vector.forEach(z => this.drawFrom(origin, z, color, width, arrowSize));
  }
}
