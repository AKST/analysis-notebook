/**
 * @import { Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import { doc } from '@app/prelude.js';
import { todo, infobox, text } from '@prelude-uni/components.js';
import { twoThree, twoColumns, container } from '@prelude-uni/layout.js';
import * as render from './render.js';
import * as tables from './tables.js';
import * as mathml from './mathml.js';

export { getConfig, onUpdate, createState } from './util.js';

export const meta = {
  kind: 'multi',
  sheets: [
    import.meta.resolve('@prelude-uni/styles.css'),
    import.meta.resolve('./style.css'),
  ],
  layout: {
    gridTemplateColumns: ['1fr', '1fr'],
    breakpoints: { s: 620 },
  },
};

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

