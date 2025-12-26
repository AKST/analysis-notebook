/**
 * @import { VectorOf } from '../math/type.ts';
 * @import {
 *   ProjectionConstraint,
 *   ViewportConstraints as IViewportConstraints,
 * } from './type.ts';
 *
 * @typedef {VectorOf<'r', 2>} Vec2
 */
import * as m from '../math/value.js';
import { ComplexViewport } from './viewport.js';

/** @param {number} x @param {number} y @returns {Vec2} */
const v = (x, y) => ({ kind: 'v', n: 2, var: 'r', vec: [x, y] });

// Shared utilities for all viewport constraint classes
/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 * @param {number} height
 */
function setupCanvas(canvas, width, height) {
  const ctx = canvas.getContext('2d');
  if (ctx == null) throw new Error('no rendering ');

  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
}

/**
 * @param {ComplexViewport} viewport
 * @param {ComplexViewport} newViewport
 * @returns {ComplexViewport}
 */
function updateViewportFromCalculated(viewport, newViewport) {
  viewport.canvasWidth = newViewport.canvasWidth;
  viewport.canvasHeight = newViewport.canvasHeight;
  viewport.origin = newViewport.origin;
  viewport.bounds = newViewport.bounds;
  return viewport;
}

/**
 * @implements {IViewportConstraints}
 */
export class ViewportConstraints {
  /**
   * @param {number} [minRealRange=16]
   * @param {number} [minImagRange=16]
   * @param {Vec2} [origin]
   */
  constructor(minRealRange = 16, minImagRange = 16, origin = v(0, 0)) {
    this.minRealRange = minRealRange;
    this.minImagRange = minImagRange;
    this.origin = origin;
  }

  /**
   * @param {number} minRealRange
   * @param {number} minImagRange
   * @param {Vec2} origin
   * @returns {ViewportConstraints}
   */
  static create(minRealRange, minImagRange, origin) {
    return new ViewportConstraints(minRealRange, minImagRange, origin);
  }

  /**
   * @param {number} [minSize=16]
   * @param {Vec2} [origin]
   * @returns {ViewportConstraints}
   */
  static square(minSize = 16, origin = v(0, 0)) {
    return new ViewportConstraints(minSize, minSize, origin);
  }

  /**
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   * @returns {ComplexViewport}
   */
  calculateViewport(canvasWidth, canvasHeight) {
    const aspectRatio = canvasWidth / canvasHeight;

    // Start with minimum bounds
    let realRange = this.minRealRange;
    let imagRange = this.minImagRange;

    // Expand to fit canvas aspect ratio while maintaining minimums
    if (aspectRatio > realRange / imagRange) {
      // Canvas is wider than minimum aspect ratio - expand real range
      realRange = imagRange * aspectRatio;
    } else {
      // Canvas is taller than minimum aspect ratio - expand imaginary range
      imagRange = realRange / aspectRatio;
    }

    // Calculate bounds around origin
    const realBounds = realRange / 2;
    const imagBounds = imagRange / 2;

    return new ComplexViewport(
      canvasWidth,
      canvasHeight,
      this.origin,
      v(realBounds, imagBounds)
    );
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {ComplexViewport} viewport
   * @param {number} newCanvasWidth
   * @param {number} newCanvasHeight
   * @returns {ComplexViewport}
   */
  updateCanvasAndViewport(canvas, viewport, newCanvasWidth, newCanvasHeight) {
    setupCanvas(canvas, newCanvasWidth, newCanvasHeight);
    const newViewport = this.calculateViewport(newCanvasWidth, newCanvasHeight);
    return updateViewportFromCalculated(viewport, newViewport);
  }
}

/**
 * @implements {IViewportConstraints}
 */
export class ViewportConstraintsAbsolute {
  /**
   * @param {Vec2} origin
   * @param {number} width
   * @param {number} height
   */
  constructor(origin, width, height) {
    this.origin = origin;
    this.width = width;
    this.height = height;
  }

  /**
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   * @returns {ComplexViewport}
   */
  calculateViewport(canvasWidth, canvasHeight) {
    // RFC 8: origin is bottom-left corner, not center
    const centerX = this.origin.vec[0] + this.width / 2;
    const centerY = this.origin.vec[1] + this.height / 2;
    const center = v(centerX, centerY);
    const bounds = v(this.width / 2, this.height / 2);
    return new ComplexViewport(canvasWidth, canvasHeight, center, bounds);
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {ComplexViewport} viewport
   * @param {number} newCanvasWidth
   * @param {number} newCanvasHeight
   * @returns {ComplexViewport}
   */
  updateCanvasAndViewport(canvas, viewport, newCanvasWidth, newCanvasHeight) {
    setupCanvas(canvas, newCanvasWidth, newCanvasHeight);
    const newViewport = this.calculateViewport(newCanvasWidth, newCanvasHeight);
    return updateViewportFromCalculated(viewport, newViewport);
  }
}

/**
 * @implements {IViewportConstraints}
 */
export class ViewportConstraintsMin {
  /**
   * @param {Vec2} origin
   * @param {number | undefined} width
   * @param {number | undefined} height
   */
  constructor(origin, width, height) {
    this.origin = origin;
    this.width = width;
    this.height = height;
  }

  /**
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   * @returns {ComplexViewport}
   */
  calculateViewport(canvasWidth, canvasHeight) {
    const canvasAspectRatio = canvasWidth / canvasHeight;

    let actualWidth, actualHeight;

    // Handle cases where only width or height is specified
    if (this.width != null && this.height != null) {
      // Both specified - use minimum viewport logic like transform projection
      const specifiedAspectRatio = this.width / this.height;

      if (canvasAspectRatio > specifiedAspectRatio) {
        // Canvas is wider - expand width, keep height exact
        actualHeight = this.height;
        actualWidth = this.height * canvasAspectRatio;
      } else {
        // Canvas is taller - expand height, keep width exact
        actualWidth = this.width;
        actualHeight = this.width / canvasAspectRatio;
      }
    } else if (this.width != null) {
      // Only width specified - scale height to match canvas aspect ratio
      actualWidth = this.width;
      actualHeight = this.width / canvasAspectRatio;
    } else if (this.height != null) {
      // Only height specified - scale width to match canvas aspect ratio
      actualHeight = this.height;
      actualWidth = this.height * canvasAspectRatio;
    } else {
      // Neither specified - fallback to 16x16
      actualWidth = 16;
      actualHeight = 16;
    }

    // Calculate center like transform projection: center the specified area, pad the excess
    let centerX, centerY;

    if (this.width != null && this.height != null) {
      const specifiedAspectRatio = this.width / this.height;

      if (canvasAspectRatio > specifiedAspectRatio) {
        // Excess width - center horizontally, specified area fills height
        centerX = this.origin.vec[0] + actualWidth / 2;
        centerY = this.origin.vec[1] + this.height / 2;
      } else {
        // Excess height - center vertically, specified area fills width
        centerX = this.origin.vec[0] + this.width / 2;
        centerY = this.origin.vec[1] + actualHeight / 2;
      }
    } else {
      // Single dimension specified - center normally
      centerX = this.origin.vec[0] + actualWidth / 2;
      centerY = this.origin.vec[1] + actualHeight / 2;
    }

    const center = v(centerX, centerY);
    const bounds = v(actualWidth / 2, actualHeight / 2);
    return new ComplexViewport(canvasWidth, canvasHeight, center, bounds);
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {ComplexViewport} viewport
   * @param {number} newCanvasWidth
   * @param {number} newCanvasHeight
   * @returns {ComplexViewport}
   */
  updateCanvasAndViewport(canvas, viewport, newCanvasWidth, newCanvasHeight) {
    setupCanvas(canvas, newCanvasWidth, newCanvasHeight);
    const newViewport = this.calculateViewport(newCanvasWidth, newCanvasHeight);
    return updateViewportFromCalculated(viewport, newViewport);
  }
}

/**
 * @param {ProjectionConstraint | undefined} projectionIn
 * @returns {IViewportConstraints}
 */
export function createViewportConstraints(projectionIn) {
  const projection = projectionIn ?? {
    kind: 'transform',
    origin: [0, 0],
    scale: 1,
  };

  switch (projection.kind) {
    case 'transform': {
      const [offsetX, offsetY] = projection.origin ?? [0, 0];
      const scale = 16 / (projection.scale ?? 1);
      const origin = v(offsetX, offsetY);
      return ViewportConstraints.square(scale, m.neg(origin));
    }

    case 'viewbox-absolute': {
      const [offsetX, offsetY] = projection.origin ?? [0, 0];
      const origin = v(offsetX, offsetY);
      return new ViewportConstraintsAbsolute(origin, projection.width, projection.height);
    }

    case 'viewbox-min': {
      const [offsetX, offsetY] = projection.origin ?? [0, 0];
      const origin = v(offsetX, offsetY);
      return new ViewportConstraintsMin(origin, projection.width, projection.height);
    }

    default:
      console.error(projection);
      throw new Error(`Unknown projection kind: ${projection}`);
  }
}
