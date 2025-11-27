/**
 * @import { State, Config, RenderContext } from './type.ts';
 * @import { E, Widget, RenderContextInit as Init } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type.ts';
 */
import { clearCanvas } from '@app/prelude.js';
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
const mkTitle = t => ['h4', { className: 'chartLabel' },  t];

/**
 * @returns {Widget<any, State, Config>}
 */
export const importing = makeWidget({
  title: mkTitle('Importing'),
  gridSize: 1,
  viewbox: { height: 300 },
}, state => state.examples.importing);

/**
 * @returns {Widget<any, State, Config>}
 */
export const exporting = makeWidget({
  title: mkTitle('Exporting'),
  gridSize: 1,
  viewbox: { height: 300 },
}, state => state.examples.exporting);

/**
 * @returns {Widget<any, State, Config>}
 */
export const tariff = makeWidget({
  title: mkTitle('Tariff Outcome'),
  gridSize: 1,
  viewbox: { height: 300 },
}, state => state.models.tariff);

/**
 * @returns {Widget<any, State, Config>}
 */
export const quota = makeWidget({
  title: mkTitle('Quota Outcome'),
  gridSize: 1,
  viewbox: { height: 300 },
}, state => state.models.quota);

