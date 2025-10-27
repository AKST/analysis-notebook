/**
 * @import { Vec2, MakeConfigKnobs, Widget } from '../../prelude-type.ts';
 * @import { AgentState, Config, State, Event } from './type.ts';
 */

import * as prelude from '../prelude.js';
import {
  vector,
  convexHull,
  COLOR,
  math,
  doc,
  objects,
} from '../../prelude.js';
import * as render from './render.js';
import * as tables from './tables.js';
import * as mathml from './mathml.js';

const { todo, infobox, text } = prelude.components;
const {
  twoColumns,
  twoThree,
  container,
} = prelude.layout;

export { createStyle } from './style.js';

const ORIGIN = vector(2)(0, 0);

export const meta = {
  kind: 'multi',
  layout: {
    gridTemplateColumns: ['1fr', '1fr'],
    breakpoints: { s: 620 },
  },
};

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  /** @type {[number, number]} */
  const range = [0.01, 50];

  return {
    time: {
      kind: 'number',
      label: 'Time Constraint',
      of: 8,
      range: [1, 24],
    },
    priceX: { kind: 'number', of: 2, range: [0.01, 30] },
    priceY: { kind: 'number', of: 3, range: [0.01, 30] },
    agents: {
      kind: 'many',
      of: {
        a: { point: [.5, 1.5], color: COLOR.CYAN },
        b: { point: [2, 2], color: COLOR.YELLOW },
        c: { point: [1.5, .5], color: COLOR.LIME },
      },
      create: id => ({
        kind: 'group',
        label: `Agent ${id}`,
        of: { point: [1, 1], color: 0xcccccc },
        group: {
          point: { kind: 'complex', label: null, range: [range, range] },
          color: { kind: 'color', label: null },
        },
      }),
    },
    scale: { kind: 'number', of: 1/6, range: [0.01, 1] },
  }
}

/**
 * @param {number} time
 * @param {{ point: [number, number], color: number }} agent
 * @returns {AgentState}
 */
const constrain = (time, { point: [x, y], color }) => ({
  color,
  point: vector(2)(time/x, time/y)
});

/**
 * @param {Vec2[]} ppcPoints
 * @param {Vec2} price
 */
function findOptimalProductionPoint(ppcPoints, price) {
  return ppcPoints.reduce((best, current) => {
    const currentRevenue = math.vector.dot(current, price);
    const bestRevenue = math.vector.dot(best, price);
    return currentRevenue > bestRevenue ? current : best;
  });
}

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, event) {
  switch (event.kind) {
    case 'config': {
      const { config } = event;
      const { time, priceX, priceY } = config;
      const price = vector(2)(priceX, priceY);
      const agents = objects.map(config.agents, o => constrain(time, o));
      const econPPF = convexHull(Object.values(agents).map(p => p.point), ORIGIN)
      const optimal = findOptimalProductionPoint(econPPF, price);

      return {
        ...state,
        price,
        agents,
        econPPF,
        optimalProduction: optimal,
      };
    }
    default:
      return state;
  }
}

/**
 * @param {Config} config
 * @returns {State}
 */
export function createState(config) {
  return onUpdate({
    price: vector(2)(0, 0),
    agents: {},
    econPPF: [],
    optimalProduction: ORIGIN,
  }, { kind: 'config', config });
}

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  {
    meta: { kind: 'document' },
    render: (_ctx, state, _cfg) => ['div', { className: 'container' }, [
      doc.h1`Production Possiblity Curves (PPC)`,
      twoThree(
        container(
          text.p.l`
            This notebook provides a playground to experiment
            different configurations for PPC's. There are 3
            different agents, denoted as A, B and C. Each of
            them produces a certain amount of good X and Y
            (which is mapped to the X & Y axises respectively).
          `,
          doc.h2`Modelling PPCs and OC`,
        ),
        infobox({ title: 'What is a PPC?' })(
          text.p.m`
            A PPC (or Production Possiblity Curve)
            is a way of representing all the possible
            production combinations between
            (at least in our case) 2 goods.
          `,
        ),
      ),
      twoColumns(
        container(
          doc.h4`Computing a PPC`,
          mathml.ppc(),
        ),
        container(
          doc.h4`Computing Opportunity cost`,
          mathml.ocMatrix(),
          text.quote.l`
            Note that Output is unit per hour. Not hours or
            the cost associated with the output,
          `,
        ),
      ),
      doc.h2`Opportunity Cost`,
      twoColumns(
        container(
          text.p.l`We can get the opportunity cost of:`,
          doc.ul.of(
            text.li.l.of(text.p.l`${doc.b`α:`} by dividing β by α.`),
            text.li.l.of(text.p.l`${doc.b`β:`} by dividing α by β.`),
          ),
          todo({}, "explain how OC is used for minimial acceptable trade"),
        ),
        tables.opportunityCostTable(state),
      ),
      text.p.l`
        Depending on what data you have, you can compute
        opportunity cost differently. Sometimes your inputs
        is the time it takes to produce one unit of a good
        per agent, other times it'll be the total number of
        goods an agent can produce in a consisnent descrete
        time frame.
      `,
      doc.h2`Comparitive Advantage `,
      twoColumns(
        text.p.l`
          To find who has the comparitive advantage in
          producing a specific good, it is simply a
          matter of finding which agent has the
          lowest opportunity cost in producing that
          good.
        `,
        tables.comparitiveAdvantageTable(state),
      ),
      twoThree(
        container(
          doc.h2`Creating Curves from PPCs`,
          text.p.l`
            From there you can create your PPC curve where
            "y" is defined in terms of "x". On the right hand
            side as well, you'll see vectors representing the
            maximum outputs for either good. Notice what
            happens when the ordering of the rotation of
            those vectors change. You'll notice in the below
            plot that the kinks in the combined ppc change.
          `,
        ),
        container(
          infobox({ title: 'Absolute Advantage' })(
            text.p.m`
              An agent (or an economy) has an Absolute Advantage
              in production or a good when they can carry on this
              activity with less resources than another agent
            `,
          ),
          // show table?
        ),
      ),
    ]]
  },
  {
    size: { height: 250, gridColumn: { default: 1 } },
    meta: {
      kind: 'Canvas2d',
      pure: true,
      proj: { kind: 'transform', origin: [-3, -3], scale: 2 },
    },
    createContext: render.createRenderContext,
    render: render.renderPpcAsVectors,
  },
  {
    size: { height: 250, gridColumn: { default: 1 } },
    meta: {
      kind: 'Canvas2d',
      pure: true,
      proj: { kind: 'transform', origin: [-3, -3], scale: 2 },
    },
    createContext: render.createRenderContext,
    render: render.renderPPC
  },
  {
    meta: { kind: 'document' },
    render: () => container(
      twoThree(
        ['p', { style: 'grid-row: 1 / 2' }, [`
          Above we can see 3 different curves for our
          given agents (A, B and C). Judging by the curve
          Agents like A & B (at least with the default
          configuration) clearly specialise in of the 2
          goods. While there are agents like B who is
          overall worse at producing any good than every
          other agent. Yet as you'll see shortly (in the
          section), even when A & C are better at producing
          than B, they are better off if they all work together.`,
          doc.i`Possiblities`, ' that come from trade.',
        ]],
        infobox({ title: 'What causes a PPC to move?' })(
          ['p', `
            In the model, its simply when any actor
            starts producing a different number (more
            or less) of any good for the same cost, or
            another actor is introduced.

            In the real world, an increase can come
            from better infrastructure or population
            growth, or an improvement in technology.
          `],
        ),
      ),
      doc.h2`Economy wide PPC and CPC`,
      text.p.l`
        Below you can see the the Economy wide PPC as well as
        the CPC, which represents consumption possiblities.
      `,
      ['div', { className: 'c2' }, [
        ['div', { className: 'container' }, [
          doc.h3`Modelling PPC`,
          todo({}, 'insert algorithm/forumular'),
        ]],
        ['div', { className: 'container' }, [
          doc.h3`Modelling CPC`,
          todo({}, 'TODO - insert algorithm/forumular'),
        ]],
      ]],
    ),
  },
  {
    size: { height: 250, gridColumn: { default: 1 } },
    meta: {
      kind: 'Canvas2d',
      pure: true,
      proj: { kind: 'transform', origin: [-3, -3], scale: 2 },
    },
    createContext: render.createRenderContext,
    render: render.renderJointPPC
  },
  {
    size: { height: 250, gridColumn: { default: 1 } },
    meta: {
      kind: 'Canvas2d',
      pure: true,
      proj: { kind: 'transform', origin: [-3, -3], scale: 2 },
    },
    createContext: render.createRenderContext,
    render: render.renderEconomyCPC
  },
  {
    meta: { kind: 'document' },
    render: (_ctx, state, cfg) => ['div', { className: 'container' }, [
      doc.h3`Outcomes in different specialisations`,
      ['div', { className: 'c2' }, [
        text.p.l`
          In the optimal scenario we'll have the highest
          amount of revenue. Which should enable the
          agents a higher amount of consumption.
        `,
        tables.profitTable(state, cfg),
      ]],
    ]]
  },
];

