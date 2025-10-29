/**
 * @import { RenderWidgetMeta, RenderContextInit } from '../../../../prelude-type.ts';
 */
import { renderPlaceholder } from '../../../../prelude.js';

/** @type {RenderWidgetMeta} */
export const meta = {
  kind: 'Canvas2d',
  pure: false,
  proj: { kind: 'transform' },
};

/**
 * @param {RenderContextInit} context
 */
export function render(context) {
  renderPlaceholder(context.renderer, context.viewport, '[1.2.2] Binomial Equation');
}
