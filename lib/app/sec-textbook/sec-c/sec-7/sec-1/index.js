/**
 * @import { RenderWidgetMeta, RenderContextInit } from '@app/prelude-type.ts';
 */
import { renderPlaceholder } from '@app/prelude.js';

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
  renderPlaceholder(context.renderer, context.viewport, '[7.1.1] Representation by Exponentials');
}
