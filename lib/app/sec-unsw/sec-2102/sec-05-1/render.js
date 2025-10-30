/**
 * @import { ProjectionConstraint, Widget, E, RenderContextInit as Init } from '@app/prelude-type.ts';
 * @import { State, Config, RenderContext } from './type.ts';
 */
import {
  clearCanvas,
  renderPlaceholder,
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '@app/prelude.js';

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

export const economicFlucuationA = makePlaceholer(
  'Page 245 Output over Time',
  { height: 300, gridColumn: { default: 1, s: 2 } },
);

export const economicFlucuationB = makePlaceholer(
  'Page 245 Short run Output over Time',
  { height: 300, gridColumn: { default: 1, s: 2 } },
);

export const phillipsCurve = makePlaceholer(
  'Page 252 Short run Output over Time',
  { height: 300, gridColumn: { default: 2, s: 2 } },
);
