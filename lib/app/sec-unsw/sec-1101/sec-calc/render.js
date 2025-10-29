/**
 * @import { State, Config, RenderContext } from './type.ts';
 * @import { E, Widget, RenderContextInit as Init } from '../../../prelude-type.ts';
 */
import * as prelude from '../prelude.js';
import { clearCanvas } from '../../../prelude.js';

const { createModelRenderer } = prelude.vis2dModel;

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
 * @param {(context: RenderContext, state: State) => void} render
 * @returns {Widget<any, State, Config>}
 */
const makeWidget = ({
  title,
  gridSize,
  viewbox,
}, render) => {
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
        width: 1.1,
        height: 1.1,
      },
    },
    createContext: createRenderContext,
    render: render,
    header: title,
  }
};

/** @param {string} t @returns {E.Item} */
const mkTitle = t => ['h4', { className: 'chartLabel' },  t];

/**
 * @returns {Widget<any, State, Config>}
 */
export const surplus = makeWidget({
  title: mkTitle('Aggregate S&D Surplus (Summation)'),
  gridSize: 2,
  viewbox: { height: window.innerHeight - 300 },
}, (context, { model: snapshot, input, bounds }) => {
  if (!snapshot || !input) return;
  const { model, renderer, viewport } = context;
  clearCanvas(renderer, viewport);
  renderer.setGlobalCompositeOperation('source-over');
  model.plotWithInputs(input, snapshot, bounds);
});
