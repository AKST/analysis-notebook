import { ComplexViewport } from './viewport.js';

export interface Renderer {
  setFillStyle(color: number): void;
  setStrokeStyle(color: number): void;
  setLineWidth(width: number): void;
  setLineDash(lineDash: [number, number, ...number[]] | []): void;
  setGlobalCompositeOperation(mode: GlobalCompositeOperation): void;
  getGlobalCompositeOperation(): GlobalCompositeOperation;
  fillRect(x: number, y: number, width: number, height: number): void;
  beginPath(): void;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void;
  fill(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  closePath(): void;
  stroke(): void;
  setFont(font: string): void;
  fillText(text: string, x: number, y: number): void;
  setTextAlign(align: CanvasTextAlign): void;
  setTextBaseline(baseline: CanvasTextBaseline): void;
  measureText(text: string): TextMetrics;
}

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
