/**
 * @import { ProjectionConstraint, Widget, E, RenderContextInit as Init } from '@app/prelude-type.ts';
 * @import { State, Config, RenderContext } from './type.ts';
 */
import {
  doc,
  clearCanvas,
  renderPlaceholder,
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '@app/prelude.js';

/** @type {ProjectionConstraint} */
const projT = { kind: 'transform' };

/**
 * @param {Init} cfg
 * @returns {RenderContext}
 */
export function createRenderContext({ renderer, viewport }) {
  const grid = new Grid(renderer, viewport);
  const text = new TextRenderer(renderer, viewport);
  const line = new LineRenderer(renderer, viewport);
  const poly = new PolygonRenderer(renderer, viewport);
  return {
    renderer,
    viewport,
    poly,
    line,
    text,
    grid,
  };
}

/**
 * @param {E.Item} title
 * @param {ProjectionConstraint} proj
 * @param {Widget<any, State, Config>['size']} size
 * @param {(ctx: RenderContext, state: State) => void} render
 * @returns {Widget<any, State, Config>}
 */
export function makeWidget(title, proj, size, render) {
  return {
    createContext: createRenderContext,
    header: title,
    size,
    meta: {
      kind: 'Canvas2d',
      pure: true,
      proj,
    },
    render,
  };
}

/**
 * @param {string} text
 * @param {Widget<any, State, Config>['size']} size
 */
export function makePlaceholer(text, size) {
  return makeWidget(doc.h4({ className: 'chartLabel' }).t`Placeholder ${text}`, projT, size, ctx => {
    const { renderer, viewport } = ctx;
    clearCanvas(renderer, viewport);
    renderPlaceholder(renderer, viewport, text);
  });
}

export const distributionOfSampleCoeffients = makePlaceholer(
  'histogram of a distribution of values of β̂₁',
  { height: 400, gridColumn: { default: 2, s: 2 } },
);

export const linearFunctionOfX = makePlaceholer(
  'E(y|x) as linear function of x',
  { height: 400, gridColumn: { default: 2, s: 2 } },
);
