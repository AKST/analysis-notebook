/**
 * @import { ComplexViewport } from '../viewport.js';
 * @import { VectorOf } from '../../math/type.ts';
 * @import { Renderer } from '../type.ts';
 *
 * @typedef {VectorOf<'r', 2>} V2
 */

/**
 * @typedef {[[number, number], [number, number]]} Scale
 *
 * @typedef {Object} RenderOptions
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
      fontSize = 1, // scalar multiplier
      fontFamily = 'monospace',
      fontStyle = '', // italic, bold, etc.
      textAlign = 'center',
      textBaseline = 'middle'
    } = options;

    const [x, y] = this.#viewport.toCanvas(z).vec;

    // Calculate final font size and build font string
    const finalSize = this.getInterpolatedSize() * fontSize;
    const finalFont = [fontStyle, `${finalSize}px`, fontFamily].filter(Boolean).join(' ');

    this.#renderer.setFillStyle(color);
    this.#renderer.setFont(finalFont);
    this.#renderer.setTextAlign(textAlign);
    this.#renderer.setTextBaseline(textBaseline);
    this.#renderer.fillText(text, x, y);
  }
}
