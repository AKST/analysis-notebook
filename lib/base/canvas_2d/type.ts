import { ComplexViewport } from './viewport.js';

export interface Renderer {
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void;
  fill(): void;
  setFillStyle(color: number): void;
  setFont(font: string): void;
  setGlobalCompositeOperation(mode: GlobalCompositeOperation): void;
  getGlobalCompositeOperation(): GlobalCompositeOperation;
  setLineWidth(width: number): void;
  setLineDash(lineDash: [number, number, ...number[]] | []): void;
  beginPath(): void;
  closePath(): void;
  fillRect(x: number, y: number, width: number, height: number): void;
  rotate(n: number): void;
  stroke(): void;
  setStrokeStyle(color: number): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  fillText(text: string, x: number, y: number): void;
  setTextAlign(align: CanvasTextAlign): void;
  setTextBaseline(baseline: CanvasTextBaseline): void;
  measureText(text: string): TextMetrics;
  getTransform(): DOMMatrix;
  setTransform(matrix: DOMMatrix): void;
  translate(x: number, y: number): void;
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
