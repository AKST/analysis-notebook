
/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { responsiveGridAutoRow, twoColumns, twoThree, container } from '@prelude-uni/layout.js';
import { text, noteOn, infobox, dashbox, note, todo } from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const LINKS = {
  romerInterview: text.a({ href: 'https://www.youtube.com/watch?v=iCdr86rkVBc' }),
  nobelPrize: text.a({ href: 'https://www.youtube.com/watch?v=vZmgZGIZtiM' }),
  base44: text.a({ href: 'https://base44.com' }),
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
      doc.p`
        This idea isn't commonly used however its easy
        to teach, and we'll use it as a stepping stone
        to more complicated ideas.
      `,
    ),
    infobox({ title: 'Resources' })(
      doc.p`See here for resources relating to the lesson`,
      text.ul(
        doc.li.of(LINKS.romerInterview`Romer Interview`),
        doc.li.of(LINKS.nobelPrize`Nobel Prize`),
        doc.li.of(LINKS.base44`AI app platform`),
      ),
    ),
  ),
));

export const economicsOfIdeas = createDoc(() => dashbox(
  doc.h2`The Economics of Ideas`,
  mathml.ideaDiagram,
  twoColumns(
    container(
      doc.h4`Non-Rival`,
      doc.p`
        The extent which something is "Rival" describes the extent
        to which ones persons use prevents other peoples use. You
        can't use a fork if someone else is using it, if the apple
        store runs out of iPhones they won't sell you the right to
        use someone elses iPhone, you have to wait till there's
        more in stock.
      `,
    ),
    container(
      doc.h4`Excludability`,
      doc.p`
        It's important not to confuse rivary and excludability.
        An idea however can be used by many people simultaneously,
        but it can still exhibt qualities of exclusicivity. In
        practice this is often the result of something like a
        patent of Intellectual Property rights.
      `,
    ),
  ),
));

export const increasingReturnsToScale = createDoc(() => dashbox(
  doc.h2`Increasing returns to scale`,
  note(
    'Non-rival ideas leads to increasing retursn to production',
  ),
  todo({}, 'revisit slides, here lecture skipped over this'),
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
  doc.h2`Problems with Perfect Competition`,
  noteOn('perfect competition')(
    'IRS is at odds with perfect competition',
    doc.li`firm behaviour${text.ul(
      doc.li`perfect competition => Price = Marginal Cost`,
      doc.li`This conditions is unlikely hold`,
    )}`,
  ),
  todo({}, 'what is a comenstsar, 10:19'),
  noteOn('in relation to ideas')(
    doc.li`Ideas also have fixed costs${text.ul(
      doc.li`Cost of developing drugs`,
      doc.li`A startups seed funding`,
    )}`,
  ),
));

export const romerGrowthModel = createDoc(() => dashbox(
  doc.h2`Romer Growth Model`,

  responsiveGridAutoRow([
    doc.figure(mathml.romerLabour(), doc.figcaption`Romer Labour`),
    doc.figure(mathml.romerLabourResearch(), doc.figcaption`Research Labour`),
    doc.figure(mathml.romerLabourOutput(), doc.figcaption`Output Labour`),
    doc.figure(mathml.romerGrowthRateOfKnowledge(), doc.figcaption`Growth of Knowledge`),
  ], {
    columns: {
      desktop: 'auto auto auto auto',
    },
  }),
  responsiveGridAutoRow([
    doc.figure(mathml.romerModelProductionOfNewIdeas(), doc.figcaption`Production of new Ideas`),
    doc.figure(mathml.romerGrowthModel(), doc.figcaption`Romer Output`),
    doc.figure(mathml.stockOfKnowledge(), doc.figcaption`Stock of Knowledge`),
  ], {
    columns: {
      desktop: 'auto auto auto',
    },
  }),
  doc.figure(mathml.perCapitaStockOfKnowledge(), doc.figcaption`Output Per Capita`),
  twoColumns(
    note(
      'we need distinguish between goods and ideas',
      'In the previous Solow-Swan idea we saw stagnation',
      'This idea introduces ideas into the model',
      'Capital becomes fixed, e.g. K = 1',
    ),
    note(
      'z̄ is probably something small like 0.0005',
      '𝓁 is similarly small',
      'Some people have repurposed this to resemble the education sector',
    ),
  ),
  noteOn('Labour Supply and Allocation of Labour Across Sectors')(
    'Labour is not non-rival; either in one sector or the other and seubject to availabilty of labour supply',
  ),
));

export const solvingRomerModel = createDoc(() => dashbox(
  doc.h2`Solving the Model`,
  mathml.romerSolvingAssumptions(),
  note(
  ),
));

export const balancedGrowthPath = createDoc(() => dashbox(
  doc.h2`Balanced Growth Path`,
  doc.p`
    Given the Romer model exhibts sustained growth it doesn't
    have a steady state in the same way the Solow Swan does.
    The growth rate is constant and is expressed as:
  `,
  doc.figure(mathml.constantGrowth, doc.figcaption`Constant Growth Parameters`),
));

export const growthAccounting = createDoc(() => dashbox(
  doc.h2`Growth Accounting`,
  doc.figure(mathml.romerGrowthAccounting(), doc.figcaption`Growth Accounting`),
  doc.figure(mathml.romerGrowthAccounting2(), doc.figcaption`???`),
));

export const summary = createDoc(() => dashbox(
  doc.h2`Summary`,
  note(
  ),
  todo({}, 'Combine swan-solow and rommer model'),
));

export const continiousRomerSolow = createDoc(() => dashbox(
  doc.h2`Extra — Continious`,
  twoColumns(
    doc.figure(mathml.continiousA(), doc.figcaption`Continious A`),
    doc.figure(mathml.continiousY(), doc.figcaption`Continious Y`),
  ),
  doc.figure(mathml.continiousK(), doc.figcaption`Continious K`),
));
