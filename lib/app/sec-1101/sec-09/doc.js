/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { CoaseProblem, Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import {
  alternating, dashbox,
  crossSectionTable, ulLight,
  defineTerm, readmore, todo,
} from '../common/components.js';
import { container, twoColumns, twoThree } from '../common/layout.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

/**
 * @param {string} label
 * @returns {Widget<any, State, Config>}
 */
export const createPlaceholder = (label) => ({
  meta: { kind: 'document' },
  render: () => container(
    todo({}, `for "${label.trim()}" graphic`),
  ),
});

const TERMS = {
  externality: defineTerm({
    word: 'externality',
    etymology: { origin: ['english'] },
    pronunciation: {
      accent: 'rp',
      syntax: '/ɛkstəˈnælɪti/',
    },
    meaning: [
      [
        'An impact, positive or negative, on any party not ',
        'involved in a given economic transaction or act.',
      ],
      [
        'A cost or benefit in the production or consumption ',
        'of a good not bourne by the market participants.',
      ],
    ],
    source: {
      Wikipedia: 'https://en.wikipedia.org/wiki/Externality',
      Wikitionary: 'https://en.wiktionary.org/wiki/externality',
    },
  })
};

const READMORE = {
  coarseTheorem: readmore({
    summary: ['Coarse Theorem'],
    details: [
      doc.small`
        If trade in an externality is possible
        and there are no transaction costs,
        bargaining will lead to an efficient
        outcome regardless of the initial
        allocaiton of property right.
      `
    ],
  }),
  externalityModelingConsiderations: readmore({
    summary: ['Modelling Externalities'],
    details: [
      doc.small`Either:${
        ['ol', {}, [
          ['li', {}, [ulLight([
            'Graph all external benefits as a demand increase.',
            'Graph all external costs as a supply decrease. ',
          ]), ['br']]],
          ['li', {}, [ulLight([
            'Graph consumption externalities as affecting demand.',
            'Graph production externalities as affecting supply.',
            'Shift curve up or demand according to whether it\'s positive or negative.',
          ])]],
        ]]
      }`,
      doc.small`If you don't have floors/ceilings or anything it won't matter which`,
    ],
  }),
  leviesInAustralia: readmore({
    summary: ['Levies, Industry specific taxes on industry specific inputs in Australia'],
    details: [
      doc.small`
        TODO
      `,
    ],
  }),
};

const TABLES = {
  externalityTypes: crossSectionTable({
    rowColor: {},
    colColor: { positive: 'blue', negative: 'red'  },
    outcomes: {
      consumption: {
        positive: alternating([
          'Exercise',
          'vaccination',
          'education',
        ]),
        negative: alternating([
          'smoking',
          'alchol abuse',
          ['span', [['br'], 'listening to bad music in public without headphones.']]
        ]),
      },
      production: {
        positive: alternating([
          'Research and Development',
          'Technological innovation',
          ['span', [['br'], 'job training']]
        ]),
        negative: alternating([
          'Over-fishing',
          'polluting production',
          'excessive risk-taking',
        ]),
      },
    },
  }),
  coaseExample: tables.coaseTable({
    transaction: 25,
    table: {
      initator: { refrain: 0, exercise: 20 },
      bystander: { refrain: 100, exercise: 70 },
    },
    footer: [
      doc.small`
        +right is when the right exercised can be bought by the 3rd party.
        ${['br']} -right is when the right to exercise an action needs to first
        be bought.
      `,
      ['br'],
      doc.small`The size of the transaction is $25`,
    ],
  }),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const header = {
  meta: { kind: 'document' },
  render: () => container(
    twoThree(
      container(
        ['h1', 'Externalities'],
        doc.small`
          Externalities can either be positive or negative, and they
          can arise from production or consumption of a good. Generally:
        `,
        doc.small`${['ul', { className: 'no-item-padding' }, [
          ['li', [doc.b('Positive'), ': MB(social) > MB(private)']],
          ['li', [doc.b('Negative'), ': MC(social) > MC(private)']],
        ]]}`,
        ['h2', 'Externality Variants'],
      ),
      container(
        TERMS.externality,
      ),
    ),
    container(
      twoColumns(
        container(
          doc.dl([
            ['Positive Consumption Externality', [doc.small`
              A Positive Consumption Externality represents a benefit
              accrued to someone who is not involved in the consumption
              of a given good.
            `]],
            ['Positive Production Externality', [doc.small`
              A Positive Production Externality represents a benefit
              accrued to someone who is not involved in the production
              of a given good.
            `]],
          ])
        ),
        container(
          doc.dl([
            ['Negative Consumption Externality', [doc.small`
              A Negative Consumption Externality represents a cost incurred by
              someone who is not involved in the consumption of a given good.
            `]],
            ['Negative Production Externality', [doc.small`
              A Negative Production Externality represents a cost incurred
              by someone who is not involved in the production of a given good.
            `]],
          ])
        ),
      ),
      ['h3', 'Examples'],
      TABLES.externalityTypes,
      ['hr'],
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const coaseTheorem = {
  meta: { kind: 'document' },
  render: () => container(
    dashbox(
      twoColumns(
        container(
          ['h2', 'Coarse Theorem'],
          doc.small`
            If trade in an externality is possible
            and there are no transaction costs,
            bargaining will lead to an efficient
            outcome regardless of the initial
            allocaiton of property right.
          `,
          doc.small`${ulLight([
            'Rights are well defined',
            'People act rationally (attempt to maximise surplus)',
            'Low/no tranaction cost — often small number of parties are also necessary',
            'complete information',
          ])}`,
        ),
        container(
          ['h4', 'Example of a Coarse table'],
          doc.small`
            Below is an example of where someone
            exercising their right to do something when
            it negatively effects a bystander (like a
            dog deciding to bark).
          `,
          TABLES.coaseExample,
        ),
      ),
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const largerMarkets = {
  meta: { kind: 'document' },
  render: () => container(
    dashbox(
      ['h2', 'Externalities in larger markets'],
      twoColumns(
        doc.dl([
          ['Positive Externalities', [container(
            doc.small`Causes marginal external benefit (MEB)`,
            mathml.positiveExtern(),
            doc.small`
              This MEB creates a social demand curve which
              reflects the private demand curve + this marginal
              external benefit. This demand curve will be higher.
            `,
            doc.small`
              Due to this MEB not being accounted
              for in interactions between private sellers and
              buyers it will be ${doc.b('underprovided')} by the
              private market in respect to what is the optimal
              social outcome, without government intervention.
            `,
          )]],
        ]),
        doc.dl([
          ['Negative Externalities', [container(
            doc.small`Causes marginal external cost (MEC)`,
            mathml.negativeExtern(),
            doc.small`
              This similarlly creates a socially (optimal)
              supply curve which will reflect the private
              supply + this marginaal external cost, which
              will be higher than the private curve.
            `,
            doc.small`
              Similarly due to this MEC not being accounted for
              in private transactions, it will be ${
              doc.b('Overprovided')}
              by the private market in respect the socially
              optimial outcome, without government intervention.
            `,
          )]],
        ]),
      ),
    ),
    READMORE.externalityModelingConsiderations,
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const internalisingLargerMarketsExternalities = {
  meta: { kind: 'document' },
  render: () => container(
    dashbox(
      ['h2', 'Internalising Externalities'],
      doc.p(`
        Coarse theorem is insufficient to solve externalities
        in larger markets, due to the infeasiblity of private
        bargaining to work on that scale. As a result it in
        order to internalise these external cost/benefits,
        government intervention is necessary to archive the
        socially optimal outcome.
      `),
      twoColumns(
        doc.dl([
          ['In Markets with positive Externalities', [container(
            doc.small`
              The good is underprovided by the private market.
              Or put another way, the market equilibrium will
              default to below the socially optimal equilibrium.
              Governments can address this with a subsidy equal
              to the marginal external benefit.
            `,
          )]],
        ]),
        doc.dl([
          ['In Markets with negative Externalities', [container(
            doc.small`
              The good is overprovided by the private market.
              As in the market equilibrium defaults to above
              the socially optimial equilibrium. In order to
              address this the government ought to tax equal
              to the marginal external cost.
            `,
          )]],
        ]),
      ),
    ),
    READMORE.leviesInAustralia,
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const deadWeightLossTable = {
  meta: { kind: 'document' },
  render: (_ctx, _state, config) => container(
    tables.deadWeightLoss(config),
  ),
};


/**
 * @type {Widget<any, State, Config>}
 */
export const computeExternalityFromDesiredQuantity = {
  meta: { kind: 'document' },
  render: () => dashbox(
    ['h2', 'Computing Externality from desired Quantity'],
    doc.small`
      Here is how you can compute the size of the externality
      from a preferred produced quantity.
    `,
    mathml.externalitySizeFromPreferredQuantity(),
  ),
};
