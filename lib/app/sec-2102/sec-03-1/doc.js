
/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const {
  twoColumns, twoThree, container,
  responsiveGridAutoRow,
} = prelude.layout;
const { clsRef, infobox, ulLight, ulLightSm, dashbox, note, noteOn, todo } = prelude.components;
const { createDoc } = prelude.util;

/**
 * @type {Record<string, E.Item>}
 */
const LINKS = {
};

/**
 * @param {{
 *   page?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ page }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 7, page }) : undefined,
  }, item)
);

/**
 * @param {string} label
 * @returns {Widget<any, State, Config>}
 */
export const createPlaceholder = (label) => (
  createDoc(() => container(
    todo({}, `for "${label.trim()}"`),
  ))
);

export const header = createDoc(() => container(
  twoThree(
    container(
      ['h1', [
        'Labour Markets', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W3, Lecture 1']],
      ]],
      doc.small`
        The goal of this chapter is look at the labour market,
        and build a basic model for it.
      `,
    ),
    infobox('Resources', [
      ulLight([
        'Chapter 7 of the textbook',
      ]),
    ]),
  ),
));

export const intro = createDoc(() => dashbox(
  ref({ page: 180 }, ['h2', 'Introduction']),
  doc.small`
    This section covers the labour market in terms of the following:
  `,
  ulLightSm([
    doc.span('Different ways of measuring Unemployment'),
    doc.span('The Bathtub Model'),
    doc.span('Present Discounted Value'),
  ]),
));

export const unemploymentRate = createDoc(() => dashbox(
  ['h2', 'Employment'],
  twoColumns(
    container(
      ref({ page: 181 }, ['h3', 'Employment Measurements']),
      doc.small`
        Two of the ways employment can be measured include:
      `,
      ulLightSm([
        doc.span(doc.b('Employment-population Ratio'), `:
          the employed portion of the civilian population.
          For example in the US can see a large spike in
          this number since the 1960s with women entering
          the labour force.
        `),
        doc.span(doc.b('Unemployment Rate'), `:
          the fraction of the population that is unemployed.
          This is the fraction of the population that is unemployed.
          This only includes people looking for jobs not people who
          have stopped or never started looking.
        `),
      ]),
      mathml.unemploymentRate,
    ),
    container(
      ref({ page: 183 }, ['h3', 'Dynamics of Labour Market']),
      doc.small`
        Both ${doc.b('job creation')} and ${doc.b('job destruction')}
        can be generalised under the term ${doc.b('gross flows')}.
        Breifly some important facts about the dynamics of the labour
        market.
      `,
      ulLightSm([
        doc.span(`
          Most spells of unemployment are relatively short, typically every
          month about 25 percent of people who are unemployed will find a job,
          and a `, doc.b('job finding rate'), ` means most spells on unemployment
          are short lived. This isn't to say it isn't an entirely pleasant process
          but it is typically something over within a few months or so.
        `),
        doc.span(`
          Most weeks of lost work are accounted for by people who are unemployed
          for a long period of time. While most can find a job in a few months
          thee are significant fraction who unremain unemployed for much longer.
        `),
      ]),
    ),
  ),
  ref({ page: 184 }, ['h3', 'Summary']),
  doc.small`
    From a policy perspective, balancing the roles of
    providing reasonable unemployment insurance and
    encouraging people to return to work is one of the
    important challenges relating to the labour market.
  `,
));

export const supplyAndDemand = createDoc(() => dashbox(
  ref({ page: 184 }, ['h2', 'Supply and Demand']),
  doc.small`
    This more or less works like the price and quantity
    supply and demand chart from micro 1.
  `,
  twoColumns(
    ulLightSm([
      doc.span(doc.b('The Labour demand curve'), ulLight([
        'This curve is largely derived from a firms marginal product of labour (MPL).',
        'The curve slopes downloads dur to the diminishing marginal product of labour',
      ])),
      doc.span(doc.b('The Labour supply curve'), ulLight([
        'This curve is derived from price of leisure time.',
        'It slope upwards the cost of spending an extra hour working cost more than the last',
      ])),
    ]),
    ulLightSm([
      doc.span(doc.b('The X axis'), ulLight([
        'Units of labour provided by workers',
      ])),
      doc.span(doc.b('The Y axis'), ulLight([
        'Units of wages offered by employers',
      ])),
      doc.span(doc.b('Equilibrium'), ' this represents', ulLight([
        'The level of employment',
        'The market wage',
      ])),
    ]),
  ),
  twoColumns(
    container(
      ref({ page: 185 }, ['h3', 'Reasons for change in supply']),
      doc.small`
        A government could impose a tax on income would decrease the supply of labour.
      `,
      ulLightSm([
        doc.span(`
          While the wage offered by the employer might be the same the take
          home pay will be smaller. An income tax effectively acts as a wedge.
        `),
        doc.span(`
          It should be expected that the introduction of an income
          tax decreases the employmention-population-ratio.
        `),
        doc.span(`
          The impact on the employment rate would not be immediately obvious.
        `),
      ]),
    ),
    container(
      ref({ page: 186 }, ['h3', 'Reasons for change in demand']),
      doc.small`
        Many things can change labour demand, such as increase in
        the cost of an input would likely decrease demand. Something
        less obvious is the government making it harder to fire people.
      `,
      ulLightSm([
        doc.span('While during a recession firms will be less capable of laying off workers.'),
        doc.span('They are unlikely hire additional workers.'),
      ]),
      doc.small`
        That said, companies are capable of managing workers out of their company,
        through a demoralising performance improvement plans.
      `,
    ),
  ),
  container(
    ref({ page: 187 }, ['h3', 'Wage Rigidity']),
    doc.small`
      Sometimes the labour demand curve can sharply shift down due to
      an inability to offer a lower wage as labour demand, as a result
      the number of available jobs significantly drops while the same
      wage is maintained.
      In ${doc.b('The General Theory of Employment, Interest, and Money')}
      John Maynard Kenes showed wage rigidities can lead to large
      movements in employment.
    `,
  ),
  container(
    ref({ page: 189 }, ['h3', 'Different kinds of unemployment']),
    mathml.actualUnemployment,
    twoColumns(
      container(
        ['h4', 'Natural Rate of Unemployment'],
        doc.small`This is the prevailing rate of employment outside of boom or recession.`,
        ['h4', 'Cyclical unemployment'],
        doc.small`This is difference in the natural rate and the actual rate of employment.`,
      ),
      container(
        ['h4', 'Frictional Unemployment'],
        doc.small`
          This is the period during which employees are changing jobs.
        `,
        ['h4', 'Structural Unemployment'],
        doc.small`
          This is largely a result of a mismatch between
          the skills of the people looking for work and the
          skills employers are looking to hire.
        `,
      ),
    ),
  ),
));

export const bathtubModel = createDoc(() => dashbox(
  container(
    ref({ page: 189 }, ['h2', 'Bathtub Model']),
    twoThree(
      container(
        doc.small`
          The Bathtubs Model earns it name due to the nature
          in which labour pours into the market (job finding),
          and exits through the bottom of the drain (job seperation).
          And the height of the water is representative of the
          current stock of labour active in the work force.
        `,
        doc.small`
          The terms of the model are specified on the right.
        `,
      ),
      container(
        ['h4', 'Model Terms'],
        ulLightSm([
          doc.span(doc.b('s'), ': job seperation rate'),
          doc.span(doc.b('f'), ': job finding rate'),
          doc.span(doc.b('L'), ': Labour'),
          doc.span(doc.b('E'), ': Employment'),
          doc.span(doc.b('U'), ': Unemployment'),
        ]),
      ),
    ),
    responsiveGridAutoRow([
      mathml.bathtubModel.labourForce,
      mathml.bathtubModel.labourDynamics,
    ], {
      columns: { desktop: 'auto auto' },
    }),
    twoColumns(
      container(
        ['h4', 'Job Seperation Rate'],
        doc.small`
          This is the rate at which people leave or lose
          their jobs. Empirically the job loss rate is
          a realtively small number.
        `,
      ),
      container(
        ['h4', 'Job Finding Rate'],
        doc.small`
          The job finding rate is the rate at which
          unemployed people find new work. This is
          often a much larger number than the seperation
          rate but note it is the portion of the population
          drawn from currently unemployed people.
        `,
      ),
    ),
    ['h3', 'Solving the Model'],
    responsiveGridAutoRow([
      mathml.bathtubModel.solveForUnemployment,
      mathml.bathtubModel.unemploymentRate,
    ], {
      columns: { desktop: 'auto auto' },
    }),
    doc.small`
      Much like other dynamic models we've looked at so far
      (like the Solow Swan), there's also a steady state.
      As you reach the steady state the sum of sE and fU
      should be zero, and we can use that to solve for the
      steady state.
    `,
  ),
));

export const labourMarketsAroundTheWorld = createDoc(() => container(
  ref({ page: 195 }, noteOn('Labour Markets around the world')(
    doc.span(`
      A substantial part of the explanation for why per capita GDP is lower
      in Europe than in the United States is simply that Europeans work
      fewer hours
    `)
  )),
));

export const valueOfHumanCapital = createDoc(() => container(
  ['h2', 'Value of Human Capital'],
  dashbox(
    ['h3', 'Present Discounted Value'],
    twoThree(
      container(
        doc.small`
          The ${doc.b('Present discounted value')}
        `,
      ),
      mathml.valueOfHumanCapital.presentDiscountedRate,
    ),
  ),
));

export const risingReturnToEducation = createDoc(() => dashbox(
  container(
    ['h3', 'Rising Return To Education'],
    noteOn('Skill-biased Technical change')(

    ),
    noteOn('Globalisation')(

    ),
  ),
));

export const economicGrowthAndIncomeInequality = createDoc(() => dashbox(
  container(
    ['h3', 'Economic Growth and Income Inequality'],
    note(),
  ),
));
