/**
 * @import { Renderer } from '../../platform/canvas_2d/type.ts';
 * @import { ComplexViewport } from '../viewport.js';
 * @import { VectorOf } from '../../math/type.ts';
 *
 * @typedef {VectorOf<'r', 2>} V2
 */

/**
 * @typedef {[[number, number], [number, number]]} Scale
 *
 * @typedef {Object} RenderOptions
 * @property {{ color: number, padding?: number } | undefined} [bg]
 * @property {number | undefined} [rotRadians],
 * @property {number | undefined} [color]
 * @property {number | undefined} [fontSize]
 * @property {string | undefined} [fontFamily]
 * @property {string | undefined} [fontStyle]
 * @property {CanvasTextAlign | undefined} [textAlign]
 * @property {CanvasTextBaseline | undefined} [textBaseline]
 */

export class TextRenderer {
  /** @type {Renderer} */ #renderer;
  /** @type {ComplexViewport} */ #viewport;
  /** @type {Scale | undefined} */ #responsiveScale;

  /**
   * @param {Renderer} renderer
   * @param {ComplexViewport} viewport
   * @param {Scale | undefined} responsiveScale
   */
  constructor(renderer, viewport, responsiveScale = undefined) {
    this.#renderer = renderer;
    this.#viewport = viewport;
    this.#responsiveScale = responsiveScale; // [[width1, baseSize1], [width2, baseSize2]]
  }

  getInterpolatedSize() {
    if (!this.#responsiveScale) return 1

    const [[width1, size1], [width2, size2]] = this.#responsiveScale;
    const currentWidth = this.#viewport.canvasWidth;

    // Linear interpolation between the two points
    const ratio = (currentWidth - width1) / (width2 - width1);
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    return size1 + (size2 - size1) * clampedRatio;
  }

  /**
   * @param {V2} z
   * @param {string} text
   * @param {RenderOptions} options
   */
  draw(z, text, options = {}) {
    const {
      color = 0xffffff,
      bg = undefined,
      rotRadians = undefined,
      fontSize = 1, // scalar multiplier
      fontFamily = 'monospace',
      fontStyle = '', // italic, bold, etc.
      textAlign = 'center',
      textBaseline = 'middle'
    } = options;

    let [x, y] = this.#viewport.toCanvas(z).vec;

    // Calculate final font size and build font string
    const finalSize = this.getInterpolatedSize() * fontSize;
    const finalFont = [fontStyle, `${finalSize}px`, fontFamily].filter(Boolean).join(' ');

    this.#renderer.setFont(finalFont);

    /** @type {DOMMatrix | undefined} */
    let initialTransform = undefined;
    if (rotRadians) {
      initialTransform = this.#renderer.getTransform();
      this.#renderer.translate(x, y);
      this.#renderer.rotate(Math.PI / rotRadians);
      x = y = 0;
    }

    if (bg) {
      const padding = this.getInterpolatedSize() * (bg.padding ?? 0);
      const { width } = this.#renderer.measureText(text);
      const rx = x - (width / 2) - padding;
      const ry = y - (finalSize / 2) - padding;
      const rw = width + padding * 2;
      const rh = finalSize + padding * 2;
      this.#renderer.setFillStyle(bg.color);
      this.#renderer.fillRect(rx, ry, rw, rh);
    }

    this.#renderer.setFillStyle(color);
    this.#renderer.setTextAlign(textAlign);
    this.#renderer.setTextBaseline(textBaseline);
    this.#renderer.fillText(text, x, y);

    if (initialTransform) {
      this.#renderer.setTransform(initialTransform);
    }
  }
}
