/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import * as prelude from '../prelude.js';
import { doc } from '../../prelude.js';

const {
  dashbox, todo, simultaneousGame,
  defineTerm, readmore, infobox, text,
} = prelude.components;
const { container, twoColumns, twoThree } = prelude.layout;

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

const LINKS = {
  supermarketEnquiry: 'https://www.accc.gov.au/inquiries-and-consultations/supermarkets-inquiry-2024-25',
  woolworthsButtsHeadWithCouncil: 'https://www.smh.com.au/national/nsw/woolworths-accuses-council-of-inventing-fake-planning-rules-to-stymie-supermarket-20210525-p57uyx.html',
};

const IMAGES = {
  supermarketEnquiry: doc.image({
    src: './assets/econ/supermarket-enquiry.png',
    height: '100px',
    style: 'float: left; margin-right: 8px',
  }),
}


const READMORE = {
  dominantStrategy: readmore({
    summary: ['Dominant Strategy'],
    details: [
      doc.p`
        A Dominant Strategy represents a strategy that
        is preferred by a player irrespective of the
        strategy selected by the other player.
      `,
      doc.p`
        When it "depends" what your opponent is doing
        you do not have a dominant strategy.
      `,
    ],
  }),
  iterativeElimination: readmore({
    summary: ['Iterated Elimination of Dominated Strategies'],
    details: [
      doc.p`
        The Iterated Elimination of Dominated Strategies is
        solution concept that involves iteratively removing
        strategies that are not dominant.
      `,
    ],
  }),
  nashEquilibrium: readmore({
    summary: ['Nash Equilibrium'],
    details: [
      doc.p`
        A strategy profile at which neither player
        has incentive to unilaterally deivate.
        It is the result of mutual best responses.
      `,
      doc.p`
        It isn't always the case that the nash
        equilibrium will be pareto efficient
        for the two players, this is in part due
        to the tendency for players to deviate.
      `,
    ],
  }),
  unilateralDeviation: readmore({
    summary: ['Unilateral Deviation'],
    details: [
      doc.p`
        TODO
      `,
    ],
  }),
  coordinationGame: readmore({
    summary: ['Coordination Game'],
    details: [
      doc.p`
        A type of game in which players benefit
        from coordinating their decisions.
      `,
    ],
  }),
  cartel: readmore({
    summary: ['Cartel'],
    details: [
      doc.p`
        A private agreement aimed at increasing the profit
        of cartel members by reducing competition in the
        market (by controlling prices or preventing entry
        into the market).
      `,
      doc.p`
        Cartels will behave as if they are a monopoly (find
        profite maximising quantity where MR = MC, price
        along the demand curve) and then split the profits
        at the end. However, there's a strong temptation
        to slightly undercut your opponent to steal all the
        customers in the market.
      `,
    ],
  }),
  mixedStrategyGames: readmore({
    summary: ['Mixed Strategy Games'],
    details: [
      doc.p`
        Some games do not have a Nash Equilibrium in
        pure strategries. Instead, players best respond
        by playing each strategy with a certain probability.
        Games with pure strategy Nash Equilibrium may have
        mixed strategy Nash Equilibria.
      `,
    ],
  }),
};

const TERMS = {
  oligopoly: defineTerm({
    word: 'Oligpoly',
    meaning: [
      ['An economic condition in which a small number of sellers exert control over the market of a commodity.'],
    ],
    etymology: { origin: ['greek'] },
    source: {
      Wikitionary: 'https://en.wiktionary.org/wiki/oligopoly',
      Wikipedia: 'https://en.wikipedia.org/wiki/Oligopoly',
    },
    pronunciation: {
      accent: 'rp',
      syntax: '/ɒlɪˈɡɒpəli/',
    }
  }),
};

const INFOBOXES = {
  supermarketEnquiry: infobox('2024-25 Supermarket Enquiry', [
    text.p.m`${IMAGES.supermarketEnquiry}
      During the 2024-25, the ACCC conducted an enquiry in the
      supermarket "duopoly" (as they are often called), one thing
      found during the enquiry they found was the Planning
      System (or planning systems of different states) imposed higher
      barriers to entry for new partipants. [${
        ['a', { href: LINKS.supermarketEnquiry }, [
          'read more here'
        ]]
      }]`,
    ['br'],
    text.p.m`
      The role of the planning system in this industry is an example
      of an entry cost. It is often the case, that development
      applications to build a grocery store get ${
        ['a', { href: LINKS.woolworthsButtsHeadWithCouncil }, [
          'challenged'
        ]]
      } by members of the community for whatever reason.
    `,
  ]),
};

const GAMES = {
  entryGame: simultaneousGame({
    playerOne: { name: 'Woolworths', color: 'green' },
    playerTwo: { name: 'Cottoncosts', color: 'blue' },
    outcomes: {
      Stay: { Entry: [8, -20], "No Entry": [10, 0] },
      Exit: { Entry: [0, -10], "No Entry": [0, 0] },
    },
  }),
  exampleOne: simultaneousGame({
    playerOne: { name: 'Player One', color: 'blue' },
    playerTwo: { name: 'Player Two', color: 'red' },
    outcomes: {
      up: { left: [8, 10], right: [6, 7] },
      down: { left: [3, 5], right: [8, 3] },
    },
  }),
  exampleTwo: simultaneousGame({
    playerOne: { name: 'Ernie', color: 'blue' },
    playerTwo: { name: 'Bert', color: 'red' },
    outcomes: {
      top: { left: [5, 5], center: [6, 3], right: [3, 4] },
      middle: { left: [6, 6], center: [2, 5], right: [5, 3] },
      bottom: { left: [3, 5], center: [4, 7], right: [4, 1] },
    },
  }),
  studentExampleOne: simultaneousGame({
    playerOne: { name: 'Player A', color: 'blue' },
    playerTwo: { name: 'Player B', color: 'red' },
    outcomes: {
      'Copy': { 'Copy': ['Fail', 'Fail'], 'Own Work': ['HD', 'Pass'] },
      'Own Work': { 'Copy': ['Pass', 'HD'], 'Own Work': ['Credit', 'Credit'] },
    },
  }),
  studentExampleTwo: simultaneousGame({
    playerOne: { name: 'Player A', color: 'blue' },
    playerTwo: { name: 'Player B', color: 'red' },
    outcomes: {
      'Copy': { 'Copy': [30, 30], 'Own Work': [90, 50] },
      'Own Work': { 'Copy': [50, 90], 'Own Work': [65, 65] },
    },
  }),
  prisonerDelimmaOne: simultaneousGame({
    playerOne: { name: 'Player A', color: 'blue' },
    playerTwo: { name: 'Player B', color: 'red' },
    outcomes: {
      'Confess': {
        'Confess': ['Suspension', 'Suspension'],
        'Keep Quite': ['Scholarship', 'Expelled'],
      },
      'Keep Quite': {
        'Confess': ['Expelled', 'Scholarship'],
        'Keep Quite': ['Nothing', 'Nothing'],
      },
    },
  }),
  prisonerDelimmaTwo: simultaneousGame({
    playerOne: { name: 'Player A', color: 'blue' },
    playerTwo: { name: 'Player B', color: 'red' },
    outcomes: {
      'Confess': {
        'Confess': [30, 30],
        'Keep Quite': [60, 0],
      },
      'Keep Quite': {
        'Confess': [0, 60],
        'Keep Quite': [50, 50],
      },
    },
  }),
  mixedStrategy: simultaneousGame({
    playerOne: { name: 'Player A', color: 'blue' },
    playerTwo: { name: 'Player B', color: 'red' },
    outcomes: {
      rock: {
        rock: [0, 0],
        paper: [-1, 1],
        scissors: [1, -1],
      },
      paper: {
        rock: [1, -1],
        paper: [0, 0],
        scissors: [-1, 1],
      },
      scissors: {
        rock: [-1, 1],
        paper: [1, -1],
        scissors: [0, 0],
      },
    },
  }),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const header = {
  meta: { kind: 'document' },
  render: (_ctx) => container(
    twoThree(
      container(
        doc.h1`Market Power and Oligopolies`,
        dashbox(
          doc.h2`Game Theory`,
          doc.p`
            Much of this topic will be modelled and expressed
            in terms of basic game theory, using examples of
            ${doc.b`Simultaneous Games`}.
          `,
          doc.h3`Simultaneous Game`,
          doc.p`
            A Simultaneous Game is a game in which the
            players move simultaneously. As in each player
            has to plays their move in the same time frame
            as the other player, and the outcome of their move
            will depend on a combination of their move and
            their competitors move.
          `,
          doc.p`
            Meaning one challenge for players in this type of
            game is they can't play in response their competitors,
            which can be ethier a blessing or a curse.
          `,
          doc.h3`Game ground rules:`,
          doc.ul.of(
            text.li.m`${doc.b`Games are simultaneous`},
              Players move simultaneously, or at least
              no player knows how what straegy their
              opponent played unilt they play their own.
            `,
            text.li.m`${doc.b`There is full information`},
              All players know their payoffs and the
              payoffs of their opponent.
            `,
            text.li.m`${doc.b`Players are rational`},
              Players are attempting to maximise
              their own payoffs.
            `,
          ),
        ),
      ),
      container(
        TERMS.oligopoly,
        doc.h4`Example Games`,
        GAMES.exampleOne,
        GAMES.exampleTwo,
      ),
    ),
    ['hr'],
    ['div', { className: 'c2' }, [
      READMORE.nashEquilibrium,
      READMORE.unilateralDeviation,
      READMORE.coordinationGame,
    ]],
    ['hr'],
    todo({}, 'Point out which is a coordination game'),
    ['div', { className: 'c2' }, [
      GAMES.studentExampleOne,
      GAMES.studentExampleTwo,
    ]],
    ['hr'],
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const entryGame = {
  meta: { kind: 'document' },
  render: (_ctx) => container(
    twoThree(
      dashbox(
        doc.h2`Existing Oligpolies in Australia`,
        doc.p`
          In Australia one example of oligipolies we encounter in our
          day to day itinerary and routines are Grocery chances such as
          Coles and Woolworths. The Oligolic nature of this industry is
          in big part of entry and exit costs (entry moreso) for new
          partipants.
        `,
        doc.p`
          In order to compete with woolworths, competitor must:
        `,
        text.ul(
          doc.li`Pay upfront costs for instore infrastructure`,
          doc.li`Compete on Wages with existing labour pool`,
          doc.li`Establish relationships with suppliers`,
          doc.li`Establish supply chains`,
          doc.li`Accessing to large land lots`,
          doc.li`Aquiring planning permissions to build store`,
        ),
        doc.h3`Entry Game`,
        doc.p`
          One way of modelling this is with an entry game (a
          specialised case of a simulatenous game), where
          the dominant strategy of the encumbant is stay and
          dominant strategy of the entrant is "no entry" (often
          the result of entry fees).
        `,
      ),
      container(
        doc.h4`Entry Game Example`,
        GAMES.entryGame,
        INFOBOXES.supermarketEnquiry,
      ),
    ),
    twoColumns(READMORE.dominantStrategy, READMORE.iterativeElimination),
    ['hr'],
  ),
};


/**
 * @type {Widget<any, State, Config>}
 */
export const prisonerDelimma = {
  meta: { kind: 'document' },
  render: (_ctx) => container(
    doc.h2`Prisoners Delimma`,
    todo({}, 'Provide examples'),
    GAMES.prisonerDelimmaOne,
  ),
};


/**
 * 14:07 @ https://www.youtube.com/watch?v=LFbx8OBPIrA
 *
 * @type {Widget<any, State, Config>}
 */
export const cartels = {
  meta: { kind: 'document' },
  render: (_ctx) => container(
    doc.h2`Cartel Games`,
    todo({}, 'provide examples of Cartel games'),
    READMORE.cartel,
  ),
};

/**
 * 25:00 @ https://www.youtube.com/watch?v=LFbx8OBPIrA
 *
 * @type {Widget<any, State, Config>}
 */
export const mixedStrategy = {
  meta: { kind: 'document' },
  render: (_ctx) => container(
    doc.h2`Mixed Strategy Games`,
    READMORE.mixedStrategyGames,
    GAMES.mixedStrategy,
  ),
};
