/**
 * @import { ProjectionConstraint, Widget, E, RenderContextInit as Init } from '../../prelude-type.ts';
 * @import { State, Config, RenderContext } from './type.ts';
 */
import {
  clearCanvas,
  renderPlaceholder,
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '../../prelude.js';

/** @param {string} t @returns {E.Item} */
const mkTitle = t => ['h4', { className: 'chartLabel' },  t];

/** @type {ProjectionConstraint} */
const projT = { kind: 'transform' };

/** @type {ProjectionConstraint} */
const projAbs = {
  kind: 'viewbox-absolute',
  origin: [-0.1, -0.1],
  width: 1.1,
  height: 1.1,
};

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
    header: mkTitle(title),
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

export const diminishingReturnToScale = makePlaceholer(
  'Diminishing Returns to Scale',
  { height: 400, gridColumn: { default: 2, s: 2 } },
);

export const marginalProductOfLabour = makePlaceholer(
  'Marginal Product of Labour',
  { height: 400, gridColumn: { default: 1, s: 2 } },
);

export const marginalProductOfCapital = makePlaceholer(
  'Marginal Product of Capital',
  { height: 400, gridColumn: { default: 1, s: 2 } },
);

export const demandForLabourAndCapital = makePlaceholer(
  'Show 4 different graphs for labour and capital',
  { height: 400, gridColumn: { default: 2, s: 2 } },
);

export const experimentCurves = makePlaceholer(
  'Show however many curves for experiments',
  { height: 400, gridColumn: { default: 2, s: 2 } },
);

export const productionCurvesOfChinaAndUsa = makePlaceholer(
  'Show however many curves for experiments',
  { height: 400, gridColumn: { default: 2, s: 2 } },
);
