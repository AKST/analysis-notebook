/**
 * @import { Renderer } from '../platform/canvas_2d/type.ts'
 * @import { ComplexViewport } from './viewport.js';
 */
import { TextRenderer } from './renders/text-renderer.js';
import { vector } from '../math/value.js';

/**
 * @param {Renderer} renderer
 * @param {ComplexViewport} viewport
 */
export function clearCanvas(renderer, viewport, clear = true) {
  const currentCompositeOp = renderer.getGlobalCompositeOperation();

  // Set to source-over for clearing
  renderer.setGlobalCompositeOperation('source-over');

  if (clear) {
    renderer.setFillStyle(0x000000);
    renderer.fillRect(0, 0, viewport.canvasWidth, viewport.canvasHeight);
  }

  // Restore previous composite operation
  renderer.setGlobalCompositeOperation(currentCompositeOp);
}

/**
 * @param {Renderer} renderer
 * @param {ComplexViewport} viewport
 * @param {string} text
 */
export function renderPlaceholder(renderer, viewport, text) {
  clearCanvas(renderer, viewport, true);

  const textRenderer = new TextRenderer(renderer, viewport);

  // Center text at the viewport center in complex space
  const centerComplex = vector(2)(0, 0);

  textRenderer.draw(centerComplex, text, {
    color: 0xffffff,
    fontFamily: 'monospace',
    fontSize: 16,
    textAlign: 'center',
    textBaseline: 'bottom'
  });

  textRenderer.draw(vector(2)(0, -1), 'Not implemented', {
    color: 0xffffff,
    fontFamily: 'monospace',
    fontSize: 16,
    textAlign: 'center',
    textBaseline: 'top'
  });
}
