/**
 * @import { Agent, State, Config, RenderContext } from './type.ts';
 * @import { Vec2, E, Widget, RenderContextInit as Init } from '../../prelude-type.ts';
 */
import {
  v2,
  TextRenderer,
  math,
  Grid,
  PolygonRenderer,
  LineRenderer,
  clearCanvas,
} from '../../prelude.js';
import { createModelRenderer } from '../common/2d/model.js';
import * as util from './util.js';

const FONT_SIZE = 10;

/**
 * @param {Init} cfg
 * @returns {RenderContext}
 */
export function createRenderContext({ renderer, viewport }) {
  const grid = new Grid(renderer, viewport);
  const text = new TextRenderer(renderer, viewport);
  const line = new LineRenderer(renderer, viewport);
  const poly = new PolygonRenderer(renderer, viewport);
  const model = createModelRenderer({ renderer, viewport })
  return { model, text, grid, line, poly, renderer, viewport };
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
 * @param {Vec2} bounds
 * @returns {Vec2}
 */
function gridStepFromBounds(bounds, mod=100) {
  return math.el.inv(math.el.mod(bounds, mod));
}

/**
 * @param {RenderContext} context
 * @param {Vec2} target
 * @param {Vec2} bounds
 */
function plotCrossHair(context, target, bounds) {
  const { text, line } = context;
  const eq2 = math.el.div(target, bounds);

  line.drawVector([v2(0, eq2.vec[1]), eq2, v2(eq2.vec[0], 0)], {
    width: 2,
    lineDash: [5, 5],
  });

  text.draw(v2(eq2.vec[0], -0.025), target.vec[0].toFixed(2), {
    fontSize: FONT_SIZE,
    textBaseline: 'top',
  });

  text.draw(v2(-0.01, eq2.vec[1]), target.vec[1].toFixed(2), {
    fontSize: FONT_SIZE,
    textBaseline: 'middle',
    textAlign: 'right',
  });
}


/**
 * @param {Agent} agent
 * @param {Vec2} bounds
 * @returns {[Vec2, Vec2]}
 */
function plotAgent(agent, bounds) {
  const { div } = math.el;

  const yAt0 = agent.i
  const yAtX = agent.i + agent.m*bounds.vec[0];
  const xAtYAtX = (yAtX - agent.i)/agent.m;

  return [
    div(v2(0, yAt0), bounds),
    div(v2(xAtYAtX, yAtX), bounds),
  ];
};

/**
 * @returns {Widget<any, State, Config>}
 */
export const aggregateCurves = makeWidget({
  title: mkTitle('Aggregate S&D (Summation)'),
  gridSize: 2,
  viewbox: { height: 250 },
}, (context, {
  summation: {
    model: snapshot,
    modelState,
    bounds,
    consumers,
    producers,
  },
}) => {
  if (!snapshot || !modelState)  return;

  const { model, line, renderer, viewport } = context;
  clearCanvas(renderer, viewport);
  model.plotGrid(bounds);

  for (const agent of consumers) {
    line.drawVector(plotAgent(agent, bounds), {
      stroke: 0x006600,
      width: 2,
      lineDash: [5, 5],
    });
  }

  for (const agent of producers) {
    line.drawVector(plotAgent(agent, bounds), {
      stroke: 0x003366,
      width: 2,
      lineDash: [5, 5],
    });
  }

  model.plotCurveLines(snapshot, bounds);
  model.plotEquilibrium(snapshot, bounds);
  model.plotPolicy(snapshot, modelState.policy, bounds);
});

/**
 * @returns {Widget<any, State, Config>}
 */
export const aggregateCurveSurplus = makeWidget({
  title: mkTitle('Aggregate S&D Surplus (Summation)'),
  gridSize: 2,
  viewbox: { height: 250 },
}, (context, {
  summation: { model: snapshot, modelState, bounds },
}) => {
  if (!snapshot || !modelState) return;
  const { model, renderer, viewport } = context;
  clearCanvas(renderer, viewport);
  renderer.setGlobalCompositeOperation('source-over');
  model.plotWithInputs(modelState, snapshot, bounds);
});

/**
 * @returns {Widget<any, State, Config>}
 */
export const discreteCurve = makeWidget({
  title: mkTitle('Aggregate S&D (Reservation Prices)'),
  gridSize: 2,
  viewbox: { height: 250 },
}, (context, {
  discrete: {
    bounds,
    consumers,
    producers,
    equilibrium: eq,
  },
}) => {
  const { grid, line, renderer, viewport } = context;
  clearCanvas(renderer, viewport);
  grid.draw({ step: gridStepFromBounds(bounds) });
  line.drawVector(util.plotDiscrete(consumers.curve, bounds), { stroke: 0x0000ff, width: 4 });
  line.drawVector(util.plotDiscrete(producers.curve, bounds), { stroke: 0x00ff00, width: 4 });
  if (eq) plotCrossHair(context, eq, bounds);
});


/**
 * @returns {Widget<any, State, Config>}
 */
export const discreteSurplus = makeWidget({
  title: mkTitle('Aggregate S&D (Surplus)'),
  gridSize: 2,
  viewbox: { height: 250 },
}, (context, {
  discrete: {
    bounds,
    consumers,
    producers,
    equilibrium: eq,
  },
}) => {
  const { grid, poly, renderer, viewport } = context;
  clearCanvas(renderer, viewport);
  if (eq == null) return;
  grid.draw({ step: gridStepFromBounds(bounds) });

  renderer.setGlobalCompositeOperation('screen');

  for (const consumer of consumers.curve) {
    if (consumer.vec[1] < eq.vec[1]) continue;
    const points = util.bound([
      math.el.add(consumer, v2(-1, 0)),
      consumer,
      v2(consumer.vec[0], eq.vec[1]),
      v2(consumer.vec[0] - 1, eq.vec[1]),
    ], bounds);
    poly.draw(points, { fill: 0x0000cc, closed: true })
  }

  for (const producer of producers.curve) {
    if (producer.vec[1] > eq.vec[1]) continue;
    const points = util.bound([
      math.el.add(producer, v2(-1, 0)),
      producer,
      v2(producer.vec[0], eq.vec[1]),
      v2(producer.vec[0] - 1, eq.vec[1]),
    ], bounds);
    poly.draw(points, { fill: 0x00cc00, closed: true })
  }

  plotCrossHair(context, eq, bounds);
});
