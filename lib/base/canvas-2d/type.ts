import { ComplexViewport } from './viewport.js';

export type ProjectionConstraint =
  | { kind: 'transform', origin?: [number, number], scale?: number }
  | { kind: 'viewbox-min', origin?: [number, number], width?: number, height?: number }
  | { kind: 'viewbox-absolute',
      origin?: [number, number],
      width: number,
      height: number }

/**
 * Interface for viewport constraint implementations
 */
export interface ViewportConstraints {
  calculateViewport(canvasWidth: number, canvasHeight: number): ComplexViewport;

  updateCanvasAndViewport(
    canvas: HTMLCanvasElement,
    viewport: ComplexViewport,
    newCanvasWidth: number,
    newCanvasHeight: number
  ): ComplexViewport;
}
