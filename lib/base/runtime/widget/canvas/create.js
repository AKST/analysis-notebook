/**
 * @import { ViewportConstraints } from '../../../../2d/type.ts';
 * @import { ComplexViewport as Viewport } from '../../../../2d/viewport.js';
 * @import { WidgetFactory } from '../../type.ts';
 * @import { RenderContextInit, RenderWidget } from './type.ts';
 *
 * @typedef {Object} RenderWidgetInit
 * @property {HTMLElement} container
 * @property {number} viewportWidth
 * @property {number} viewportHeight
 */

import { CanvasRenderer } from '../../../../canvas/base.js';
import { createViewportConstraints } from '../../../../2d/viewport-constraints.js';

/**
 * @returns {WidgetFactory}
 */
export function createCanvasWidgetFactory() {
  return /** @type {any} */ ({
    /**
     * @template A
     * @template B
     * @template C
     * @param {RenderWidget<A, B, C>} module
     * @param {RenderWidgetInit} cfg
     * @returns {CanvasWidgetEngine<A, B, C>}
     */
    create(module, { container, viewportWidth, viewportHeight }) {
      if (!module.render) {
        throw new Error(`App missing required exports`);
      }

      // Validate required parameters for fixed scaling widget
      if (viewportHeight === undefined) {
        throw new Error('Canvas widgets require viewportHeight parameter');
      }

      const canvas = createCanvas(container, viewportWidth, viewportHeight);
      const constraints = createViewportConstraints(module.meta.proj);
      // @ts-ignore - not worth it
      const renderer = new CanvasRenderer(canvas.getContext('2d'));
      const viewport = constraints.calculateViewport(viewportWidth, viewportHeight);
      const contextInit = { viewport, renderer };
      const context = /** @type {any} */ (
        module.createContext?.(contextInit) ?? contextInit
      );

      return new CanvasWidgetEngine(
        module,
        canvas,
        renderer,
        viewport,
        constraints,
        context,
      );
    }
  });
}

/**
 * @template {RenderContextInit} Ctx
 * @template St
 * @template Cfg
 */
export class CanvasWidgetEngine {
  static renderStrategy = 'frame';
  scalingStrategy = 'fixed';

  /** @type {St | undefined} */
  #lastDrew = undefined;

  /* @type {Ctx} */ #context;

  /**
   * @param {RenderWidget<Ctx, St, Cfg>} module
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderer} renderer
   * @param {Viewport} viewport
   * @param {ViewportConstraints} constraints
   * @param {Ctx} context
   */
  constructor(
    module,
    canvas,
    renderer,
    viewport,
    constraints,
    context,
  ) {
    this.module = module;
    this.canvas = canvas;
    this.renderer = renderer;
    this.viewport = viewport;
    this.constraints = constraints;
    this.#context = context;
  }

  initialize() {
  }

  /**
   * @param {Cfg} config
   * @param {St} state
   */
  render(config, state) {
    if (
      this.module.meta.pure &&
      this.#lastDrew != null &&
      this.#lastDrew === state
    ) return;
    this.module.render(this.#context, state, config);
    this.#lastDrew = state;
  }

  /**
   * @param {number} newWidth
   * @param {number} newHeight
   */
  resize(newWidth, newHeight) {

    if (newHeight === undefined) {
      throw new Error('Canvas widgets require both width and height for resize');
    }
    const width = (
      this.canvas.parentElement?.getBoundingClientRect().width
      || newWidth
    );
    this.constraints.updateCanvasAndViewport(this.canvas, this.viewport, width, newHeight);
    this.#lastDrew = undefined;
  }

  /**
   * @param {Record<string, string | null>} styles
   */
  setStyle(styles) {
    for (const [property, value] of Object.entries(styles)) {
      if (value == null) {
        this.canvas.style.removeProperty(property);
      } else {
        // @ts-ignore - not worth it
        this.canvas.style[property] = value;
      }
    }
  }

  getHUD() {
    const { header } = this.module;
    return { header }
  }

  getAnchors() {
    return [];
  }
}

/**
 * @param {HTMLElement} container
 * @param {number} width
 * @param {number} height
 * @returns {HTMLCanvasElement}
 */
function createCanvas(container, width, height) {
  // Create canvas element
  const canvas = document.createElement('canvas');

  // Setup high DPI
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('broken');

  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  // Add to container
  container.appendChild(canvas);

  return canvas;
}
