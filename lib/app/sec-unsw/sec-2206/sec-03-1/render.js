/**
 * @import { ProjectionConstraint, Widget, E, RenderContextInit as Init } from '@app/prelude-type.ts';
 * @import { State, Config, RenderContext } from './type.ts';
 */
import {
  clearCanvas,
  doc,
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
 * @param {string} title
 * @param {ProjectionConstraint} proj
 * @param {Widget<any, State, Config>['size']} size
 * @param {(ctx: RenderContext, state: State) => void} render
 * @returns {Widget<any, State, Config>}
 */
export function makeWidget(title, proj, size, render) {
  return {
    createContext: createRenderContext,
    header: doc.h4({ className: 'chartLabel' }).c(title),
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
  return makeWidget('Placeholder ' + text, projT, size, ctx => {
    const { renderer, viewport } = ctx;
    clearCanvas(renderer, viewport);
    renderPlaceholder(renderer, viewport, text);
  });
}

export const distributionOfEstimator = makePlaceholer(
  'Slide 4, Distributions of βj',
  { height: 200, gridColumn: { default: 1, s: 2 } },
);

export const distributionOfSamplingDistribtion = makePlaceholer(
  'Slide 5, Distributions of βj',
  { height: 200, gridColumn: { default: 1, s: 2 } },
);

export const tDistributionWithHypothesises = makePlaceholer(
  'Slide 16, Testing for β1 = 1',
  { height: 200, gridColumn: { default: 2, s: 2 } },
);
