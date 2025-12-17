/**
 * @import { ProjectionConstraint, Widget, RenderContextInit as Init } from '@app/prelude-type.ts';
 * @import { Rendering } from '../common/type.ts';
 * @import { State, Config } from './type.ts';
 */
import {
  doc2 as doc,
  clearCanvas,
  renderPlaceholder,
} from '@app/prelude.js';
import * as charts from '../common/chart.js';

/** @param {string} t */
const mkTitle = t => doc.h4({ className: 'chartLabel' }).of(t);

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
 * @param {string} title
 * @param {ProjectionConstraint} proj
 * @param {Widget<any, State, Config>['size']} size
 * @param {(ctx: Rendering.ChartContext, state: State) => void} render
 * @returns {Widget<any, State, Config>}
 */
export function makeWidget(title, proj, size, render) {
  return {
    createContext: charts.createRenderContext,
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


export const isCurve = makeWidget(
  'Is Curve',
  projAbs,
  { height: 400, gridColumn: { default: 2, s: 2 } },
  (ctx, state) => {
    console.log(state);
    if (state.isCurveChart) {
      charts.drawEquilibrium(ctx, state.isCurveChart);
    }
  }
);
