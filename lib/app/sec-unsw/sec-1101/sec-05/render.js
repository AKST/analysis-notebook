/**
 * @import { State, Config, RenderContext } from './type.ts';
 * @import { E, Widget, RenderContextInit as Init } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type.ts';
 */
import { doc, clearCanvas } from '@app/prelude.js';
import { createModelRenderer } from '@prelude-econ/2d-micro/model.js';

/**
 * @param {Init} cfg
 * @returns {RenderContext}
 */
export function createRenderContext({ renderer, viewport }) {
  return {
    renderer,
    viewport,
    model: createModelRenderer({
      renderer,
      viewport,
      style: {
        fontSize: 10,
      },
    }),
  };
}

/**
 * @param {{
 *   title?: E.Item,
 *   gridSize: number,
 *   viewbox: { height: number },
 * }} cfg
 * @param {(state: State) => ([Econ.Model.Config.T, Econ.Model.Desc.T] | undefined)} getModel
 * @returns {Widget<any, State, Config>}
 */
const makeWidget = ({
  title,
  gridSize,
  viewbox,
}, getModel) => {
  return {
    size: {
      height: viewbox.height,
      gridColumn: { default: gridSize, m: gridSize },
    },
    meta: {
      kind: 'Canvas2d',
      pure: true,
      proj: {
        kind: 'viewbox-absolute',
        origin: [-0.1, -0.1],
        width: 1.15,
        height: 1.1,
      },
    },
    createContext: createRenderContext,
    render: (context, state) => {
      const { renderer, viewport } = context;
      const m = getModel(state);
      if (m == null) return;
      const [input, model] = m;

      clearCanvas(renderer, viewport);
      renderer.setGlobalCompositeOperation('source-over');
      context.model.plotWithInputs(input, model, model.bounds);
    },
    header: title,
  }
};

/** @param {string} t @returns {E.Item} */
const mkTitle = t => doc.h4({ className: 'chartLabel' }).of(t);

/**
 * @returns {Widget<any, State, Config>}
 */
export const priceFloor = makeWidget({
  title: mkTitle('Price Floor'),
  gridSize: 1,
  viewbox: { height: 300 },
}, state => state.floor);

/**
 * @returns {Widget<any, State, Config>}
 */
export const priceCeil = makeWidget({
  title: mkTitle('Price Ceiling'),
  gridSize: 1,
  viewbox: { height: 300 },
}, state => state.ceiling);

/**
 * @returns {Widget<any, State, Config>}
 */
export const demandTax = makeWidget({
  title: mkTitle('Example of Tax'),
  gridSize: 1,
  viewbox: { height: 300 },
}, state => state.tax);

/**
 * @returns {Widget<any, State, Config>}
 */
export const demandSubsidy = makeWidget({
  title: mkTitle('Example of Subsidy'),
  gridSize: 1,
  viewbox: { height: 300 },
}, state => state.subsidy);
