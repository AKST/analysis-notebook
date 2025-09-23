
/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as diagram from './diagram.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container } = prelude.layout;
const { noteOn, infobox, ulLight, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

/**
 * @type {Record<string, E.Item>}
 */
const LINKS = {
  romerInterview: ['a', {href: 'https://www.youtube.com/watch?v=iCdr86rkVBc' }, ['Romer Interview']],
  nobelPrize: ['a', { href: 'https://www.youtube.com/watch?v=vZmgZGIZtiM' }, ['Nobel Prize']],
  base44: ['a', { href: 'https://base44.com' }, ['AI app platform']],
};

/**
 * @param {string} label
 * @returns {Widget<any, State, Config>}
 */
export const createPlaceholder = (label) => (
  createDoc(() => container(
    todo({}, `for "${label.trim()}"`),
  ))
);

export const intro = createDoc(() => container(
  twoThree(
    container(
      ['h1', [
        'Macroeconomics 2', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W2, Lecture 1']],
      ]],
      doc.small(`
        This idea isn't commonly used however its easy
        to teach, and we'll use it as a stepping stone
        to more complicated ideas.
      `),
    ),
    infobox('Resources', [container(
      doc.p('See here for resources relating to the lesson'),
      ulLight([
        LINKS.romerInterview,
        LINKS.nobelPrize,
        LINKS.base44,
      ]),
    )]),
  ),
));

export const economicsOfIdeas = createDoc(() => dashbox(
  ['h2', 'The Economics of Ideas'],
  note(
    'Ideas are instructions and recipes',
    'Increasing return to scales means declining marginal costs',
  ),
  diagram.ideaDiagram(),
  twoColumns(
    container(
      ['h4', 'Non-Rival'],
      note(
        'When someone hears it there is nothing stopping them from implementing it',
        'Objects are rival and this can lead to scarscity, but what about ideas?',
        'Ideas are non-rivial. One person\'s use of an idea does not reduce availablity of that to other people',
      ),
    ),
    container(
      ['h4', 'Excludability'],
      doc.small(`
        When we have a no-rivial idea, we can make it excludable
        if we grant parent protection.
      `),
      todo({}, 'rivalry =/= excludability'),
      note(
        'This refers to the exten to which someone has property rights to a good (or an idea) and can legally restrict the use of the good',
        'Societies often grant properties right to people over ideas — parents.',
      ),
    ),
  ),
  ['h3', 'Example'],
  diagram.glassMakingExample(),
  diagram.correctiveEyelense(),
  diagram.siliconComputerChips(),
  note(
    'Qadratic formula is not scarce',
  ),
  doc.small(`
    Ideas are clearly imporant; and they have
    important properties that make them
    different from objects. Ideas are like
    recipes.
  `),
  note(
    'lecture say they are just firms',
    'talked about public goods',
  ),
));

export const increasingReturnsToScale = createDoc(() => dashbox(
  ['h2', 'Increasing returns to scale'],
  note(
    'Non-rival ideas leads to increasing retursn to production',
  ),
  todo({}, 'revisit slides, here lecture skipped over this'),
  mathml.irsExampleOfDoublingTechnology(),
  twoColumns(
    container(
      noteOn('CRS')(
        'CRS means Constant returns to scale',
        'if CRS just means X, as Y/X = A is constant',
        'As in as output increases and you divide by X A remains the same',
        'Double the inputs, output doubles',
      ),
    ),
    container(
      noteOn('IRS')(
        'IRS means Increasing returns to scale',
        'if IRS means A & X, as Y/X = A is increasing',
        'As in as output increases and you divide by X, A increases',
        'Double the inputs, output more than doubles',
      ),
    ),
  ),
));

export const problemsWithPerfectCompetition = createDoc(() => dashbox(
  ['h2', 'Problems with Perfect Competition'],
  noteOn('perfect competition')(
    'IRS is at odds with perfect competition',
    doc.span('firm behaviour', ulLight([
      'perfect competition => Price = Marginal Cost',
      'This conditions is unlikely hold',
    ])),
  ),
  todo({}, 'what is a comenstsar, 10:19'),
  noteOn('in relation to ideas')(
    doc.span('Ideas also have fixed costs', ulLight([
      'Cost of developing drugs',
      'A startups seed funding',
    ])),
  ),
));

export const romerGrowthModel = createDoc(() => dashbox(
  ['h2', 'Romer Growth Model'],
  mathml.romerGrowthModel(),
  note('Y_t = A_t * L_yt'),
  note(
    'we need distinguish between goods and ideas',
    'In the previous Solow-Swan idea we saw stagnation',
    'This idea introduces ideas into the model',
  ),
  noteOn('Assumptions')(
    'Capital becomes fixed, e.g. K = 1',
  ),
  mathml.romerModelProductionOfNewIdeas(),
  noteOn('Production of new ideas')(
    doc.span('ΔA_(t+1) = z̄ Aₜ Lₐₜ', ulLight([
      'What is z̄?',
    ])),
    'Some people have repurposed this to resemble the education sector',
  ),
  mathml.romerModelLabour(),
  noteOn('Labour Supply and Allocation of Labour Across Sectors')(
    'Labour is not non-rival; either in one sector or the other and seubject to availabilty of labour supply',
  ),
  ['h3', 'Complete Model'],
  mathml.romerModelComplete(),
  note(
  ),
));

export const solvingRomerModel = createDoc(() => dashbox(
  ['h2', 'Solving the Model'],
  mathml.romerSolvingAssumptions(),
  mathml.romerGrowthOfIdeas(),
  note(
  ),
));

export const growthAccounting = createDoc(() => dashbox(
  ['h2', 'Growth Accounting'],
  note(
  ),
));

export const summary = createDoc(() => dashbox(
  ['h2', 'Summary'],
  note(
  ),
  todo({}, 'Combine swan-solow and rommer model'),
));
