/** @import { Renderer } from './type.ts' */
import { colorHex } from '../util/color/index.js';

/** @implements {Renderer} */
export class CanvasRenderer {
  /** @type {CanvasRenderingContext2D} */ #ctx

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    this.#ctx = ctx;
  }

  /**
   * @param {number} color
   */
  setFillStyle(color) {
    this.#ctx.fillStyle = colorHex(color);
  }

  /**
   * @param {number} color
   */
  setStrokeStyle(color) {
    this.#ctx.strokeStyle = colorHex(color);
  }

  /**
   * @param {number} width
   */
  setLineWidth(width) {
    this.#ctx.lineWidth = width;
  }

  /**
   * @param {[number, number, ...number[]] | []} lineDash
   */
  setLineDash(lineDash) {
    this.#ctx.setLineDash(lineDash);
  }

  /**
   * @param {GlobalCompositeOperation} mode
   */
  setGlobalCompositeOperation(mode) {
    this.#ctx.globalCompositeOperation = mode;
  }

  /**
   * @returns {GlobalCompositeOperation}
   */
  getGlobalCompositeOperation() {
    return this.#ctx.globalCompositeOperation;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  fillRect(x, y, width, height) {
    this.#ctx.fillRect(x, y, width, height);
  }

  beginPath() {
    this.#ctx.beginPath();
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {number} startAngle
   * @param {number} endAngle
   */
  arc(x, y, radius, startAngle, endAngle) {
    this.#ctx.arc(x, y, radius, startAngle, endAngle);
  }

  fill() {
    this.#ctx.fill();
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  moveTo(x, y) {
    this.#ctx.moveTo(x, y);
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  lineTo(x, y) {
    this.#ctx.lineTo(x, y);
  }

  closePath() {
    this.#ctx.closePath();
  }

  stroke() {
    this.#ctx.stroke();
  }

  /**
   * @param {string} font
   */
  setFont(font) {
    this.#ctx.font = font;
  }

  /**
   * @param {string} text
   * @param {number} x
   * @param {number} y
   */
  fillText(text, x, y) {
    this.#ctx.fillText(text, x, y);
  }

  /**
   * @param {CanvasTextAlign} align
   */
  setTextAlign(align) {
    this.#ctx.textAlign = align;
  }

  /**
   * @param {CanvasTextBaseline} baseline
   */
  setTextBaseline(baseline) {
    this.#ctx.textBaseline = baseline;
  }

  /**
   * @param {string} text
   */
  measureText(text) {
    return this.#ctx.measureText(text);
  }
}
