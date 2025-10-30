/**
 * @import { RenderWidgetMeta, Complex, RenderContextInit } from '@app/prelude-type.ts';
 */
import {
  c,
  vector,
  math as op,
  Grid,
  VectorRenderer,
  TextRenderer,
  clearCanvas,
  COLOR,
} from '@app/prelude.js';

/** @type {RenderWidgetMeta} */
export const meta = {
  kind: 'Canvas2d',
  pure: false,
  proj: { kind: 'transform' },
};

/** @param {Complex} c */
const vFromC = c => vector(2)(c.real, c.imag);

const [nw, ne] = [
  c(-4, 3),
  c(4, 3),
];

class AdditionLine {
  /** @param {VectorRenderer} line */
  constructor(line) {
    this._line = line
  }

  /**
   * @param {Complex} a
   * @param {Complex} b
   * @param {number} colour
   */
  draw(a, b, colour) {
    this._line.draw(vFromC(a), vFromC(op.add(a, b)), colour, 10)
  }
}

class Text {
  /** @param {TextRenderer} text */
  constructor(text) {
    this._text = text
  }

  /**
   * @param {Complex} origin
   * @param {string} text
   * @param {number | undefined} color
   * @param {any} options
   */
  draw(origin, text, color, options) {
    const shadow = c(-0.03, 0.03)
    this._text.draw(vFromC(origin), text, { color, ...options });
    if (color != null) {
      this._text.draw(vFromC(op.add(origin, shadow)), text, options);
    }
  }
}


/**
 * @typedef {RenderContextInit & {
 *   text: Text,
 *   line: AdditionLine,
 *   grid: Grid,
 * }} RenderContext
 *
 * @typedef {{ r: number, start: number }} State
 * @typedef {{ time: number }} Event
 */

/**
 * @param {RenderContextInit} cfg
 * @return {RenderContext}
 */
export function createContext({ renderer, viewport }) {
  const grid = new Grid(renderer, viewport);
  const text = new Text(new TextRenderer(renderer, viewport, [[900, 36], [400, 16]]));
  const line = new AdditionLine(new VectorRenderer(renderer, viewport));
  return { text, line, grid, renderer, viewport };
}

/**
 * @returns {State}
 */
export function createState() {
  const start = performance.now()
  return { start, r: 0 };
}

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, { time }) {
  return { ...state, r: time - state.start };
}

const italicSerif = { fontStyle: 'italic', fontFamily: 'serif' };
const italicSerifC = { ...italicSerif, textAlign: 'center' };

/**
 * @param {RenderContext} ctx
 * @param {State} state
 */
export function render({ line, text, grid, ...ctx }, state) {
  clearCanvas(ctx.renderer, ctx.viewport);

  const styleA = { fontSize: 1, ...italicSerif }
  const styleB = { fontSize: 30/36, ...italicSerifC }

  const scale = 6;
  const alpha = scale * Math.cos(state.r / 1000);
  const beta = scale * Math.sin(state.r / 1000);
  const a = c(alpha, beta);
  const b = c(-alpha, beta);

  const left = c(-alpha, 0),
        right = c(alpha, 0),
        bottom = c(0, -beta);

  grid.draw();
  text.draw(op.mul(nw, 1.3), "𝛼 = r cos(𝜑)", undefined, styleA);
  text.draw(op.mul(ne, 1.3), "β = r sin(𝜑)", undefined, styleA);
  text.draw(nw, "a =  𝛼+βi", COLOR.RED, styleA);
  text.draw(ne, "b = —𝛼+βi", COLOR.CYAN, styleA);
  text.draw(c(1.5, 0.5), " a — b", COLOR.MAGENTA, styleB);
  text.draw(c(-1, 1.5), " a + b", COLOR.YELLOW, styleB);

  line.draw(left, a, COLOR.RED);
  line.draw(right, b, COLOR.CYAN);
  line.draw(bottom, b, COLOR.CYAN);
  line.draw(bottom, a, COLOR.RED);
  line.draw(left, op.sub(a, b), COLOR.MAGENTA);
  line.draw(bottom, op.add(a, b), COLOR.YELLOW);
}
