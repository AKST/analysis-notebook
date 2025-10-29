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
  renderPlaceholder(context.renderer, context.viewport, '[3.1.1] Sets and Elements');
}
