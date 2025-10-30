
/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import {
  twoColumns, twoThree, container,
  responsiveGridAutoRow,
} from '@prelude-uni/layout.js';
import { text, clsRef, infobox, dashbox, note, noteOn, todo } from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const LINKS = {
  worldBankReturnsToEducation: text.a({ href: 'https://openknowledge.worldbank.org/server/api/core/bitstreams/cb09c589-14c6-5675-8026-39333ff71532/content' }),
  scienceDirectReturnsToEducation: text.a({ href: 'https://www.sciencedirect.com/topics/social-sciences/return-to-education' }),
  educationNSWReturnsToEducation: text.a({ href: 'https://education.nsw.gov.au/content/dam/main-education/about-us/educational-data/cese/2016-measuring-economic-returns-to-post-school-education-in-australia.pdf' }),
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
      doc.h1.of('Labour Markets', ['br'], (
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W3, Lecture 1']]
      )),
      doc.p`
        The goal of this chapter is look at the labour market,
        and build a basic model for it.
      `,
    ),
    infobox({ title: 'Resources' })(
      text.ul(
        doc.li`Chapter 7 of the textbook`,
      ),
    ),
  ),
));

export const intro = createDoc(() => dashbox(
  ref({ page: 180 }, doc.h2`Introduction`),
  doc.p`
    This section covers the labour market in terms of the following:
  `,
  text.ul(
    doc.li`Different ways of measuring Unemployment`,
    doc.li`The Bathtub Model`,
    doc.li`Present Discounted Value`,
  ),
));

export const unemploymentRate = createDoc(() => dashbox(
  doc.h2`Employment`,
  twoThree(
    container(
      container(
        ref({ page: 181 }, doc.h3`Employment Measurements`),
        doc.p`Two of the ways employment can be measured include:`,
        text.ul(
          doc.li`${doc.b`Employment-population Ratio`}:
            the employed portion of the civilian population.
            For example in the US can see a large spike in
            this number since the 1960s with women entering
            the labour force.
          `,
          doc.li`${doc.b`Unemployment Rate`}:
            the fraction of the population that is unemployed.
            This is the fraction of the population that is unemployed.
            This only includes people looking for jobs not people who
            have stopped or never started looking.
          `,
        ),
        mathml.unemploymentRate,
      ),
      container(
        ref({ page: 183 }, doc.h3`Dynamics of Labour Market`),
        doc.p`
          Both ${doc.b`job creation`} and ${doc.b`job destruction`}
          can be generalised under the term ${doc.b`gross flows`}.
          Breifly some important facts about the dynamics of the labour
          market.
        `,
        text.ul(
          doc.li`
            Most spells of unemployment are relatively short, typically every
            month about 25 percent of people who are unemployed will find a job,
            and a ${doc.b`job finding rate`} means most spells on unemployment
            are short lived. This isn't to say it isn't an entirely pleasant process
            but it is typically something over within a few months or so.
          `,
          doc.li`
            Most weeks of lost work are accounted for by people who are unemployed
            for a long period of time. While most can find a job in a few months
            thee are significant fraction who unremain unemployed for much longer.
          `,
        ),
      ),
    ),
    doc.dl(
      doc.dt`Working age Population`,
      doc.dd`
        Everyone of working age or older, including everyone in the labour
        force and everyone not in the ${doc.b`labour force`}
        (occassionally excludes in the military).
      `,
      doc.dt`Employed population Ratio`,
      doc.dd`
        This is the ${doc.b`Working age population`} divided by the
        number of people who are ${doc.b`Employed`}.
      `,
      doc.dt`Labour Force`,
      doc.dd`
        Everyone who is ${doc.b`Employed`} and ${doc.b`Unemployed`}. Or
        the working population minus those not working and not looking
        for work.
      `,
      doc.dt`Not in the workforce`,
      doc.dd`
        Those in the ${doc.b`working age population`} who are not working
        and are not looking for a job. Such as a student or stay at home
        parent.
      `,
      doc.dt`Gross Flows`,
      doc.dd`
        The Net sum of ${doc.b`job creations`} and ${doc.b`job destructions`}.
      `,
    ),
  ),
  ref({ page: 184 }, doc.h3`Summary`),
  doc.p`
    From a policy perspective, balancing the roles of
    providing reasonable unemployment insurance and
    encouraging people to return to work is one of the
    important challenges relating to the labour market.
  `,
));

export const supplyAndDemand = createDoc(() => dashbox(
  ref({ page: 184 }, doc.h2`Supply and Demand`),
  doc.p`
    This more or less works like the price and quantity
    supply and demand chart from micro 1.
  `,
  twoColumns(
    text.ul(
      doc.li`${doc.b`The Labour demand curve`}${text.ul(
        doc.li`This curve is largely derived from a firms marginal product of labour (MPL).`,
        doc.li`The curve slopes downloads dur to the diminishing marginal product of labour`,
      )}`,
      doc.li`${doc.b`The Labour supply curve`}${text.ul(
        doc.li`This curve is derived from price of leisure time.`,
        doc.li`It slope upwards the cost of spending an extra hour working cost more than the last`,
      )}`,
    ),
    text.ul(
      doc.li`${doc.b`The X axis`}${text.ul(
        doc.li`Units of labour provided by workers`,
      )}`,
      doc.li`${doc.b`The Y axis`}${text.ul(
        doc.li`Units of wages offered by employers`,
      )}`,
      doc.li`${doc.b`Equilibrium`} this represents${text.ul(
        doc.li`The level of employment`,
        doc.li`The market wage`,
      )}`,
    ),
  ),
  twoColumns(
    container(
      ref({ page: 185 }, doc.h3`Reasons for change in supply`),
      doc.p`
        A government could impose a tax on income would decrease the supply of labour.
      `,
      text.ul(
        doc.li`
          While the wage offered by the employer might be the same the take
          home pay will be smaller. An income tax effectively acts as a wedge.
        `,
        doc.li`
          It should be expected that the introduction of an income
          tax decreases the employmention-population-ratio.
        `,
        doc.li`
          The impact on the employment rate would not be immediately obvious.
        `,
      ),
    ),
    container(
      ref({ page: 186 }, doc.h3`Reasons for change in demand`),
      doc.p`
        Many things can change labour demand, such as increase in
        the cost of an input would likely decrease demand. Something
        less obvious is the government making it harder to fire people.
      `,
      text.ul(
        doc.li`While during a recession firms will be less capable of laying off workers.`,
        doc.li`They are unlikely hire additional workers.`,
      ),
      doc.p`
        That said, companies are capable of managing workers out of their company,
        through a demoralising performance improvement plans.
      `,
    ),
  ),
  container(
    ref({ page: 187 }, doc.h3`Wage Rigidity`),
    doc.p`
      Sometimes the labour demand curve can sharply shift down due to
      an inability to offer a lower wage as labour demand, as a result
      the number of available jobs significantly drops while the same
      wage is maintained.
      In ${doc.b`The General Theory of Employment, Interest, and Money`}
      John Maynard Kenes showed wage rigidities can lead to large
      movements in employment.
    `,
  ),
  container(
    ref({ page: 189 }, doc.h3`Different kinds of unemployment`),
    mathml.actualUnemployment,
    twoColumns(
      container(
        doc.h4`Natural Rate of Unemployment`,
        doc.p`This is the prevailing rate of employment outside of boom or recession.`,
        doc.h4`Cyclical unemployment`,
        doc.p`This is difference in the natural rate and the actual rate of employment.`,
      ),
      container(
        doc.h4`Frictional Unemployment`,
        doc.p`
          This is the period during which employees are changing jobs.
        `,
        doc.h4`Structural Unemployment`,
        doc.p`
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
    ref({ page: 189 }, doc.h2`Bathtub Model`),
    twoThree(
      container(
        doc.p`
          The Bathtubs Model earns it name due to the nature
          in which labour pours into the market (job finding),
          and exits through the bottom of the drain (job seperation).
          And the height of the water is representative of the
          current stock of labour active in the work force.
        `,
        doc.p`
          The terms of the model are specified on the right.
        `,
      ),
      container(
        doc.h4`Model Terms`,
        text.ul(
          doc.li`${doc.b`s`}: job seperation rate`,
          doc.li`${doc.b`f`}: job finding rate`,
          doc.li`${doc.b`L`}: Labour`,
          doc.li`${doc.b`E`}: Employment`,
          doc.li`${doc.b`U`}: Unemployment`,
        ),
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
        doc.h4`Job Seperation Rate`,
        doc.p`
          This is the rate at which people leave or lose
          their jobs. Empirically the job loss rate is
          a realtively small number.
        `,
      ),
      container(
        doc.h4`Job Finding Rate`,
        doc.p`
          The job finding rate is the rate at which
          unemployed people find new work. This is
          often a much larger number than the seperation
          rate but note it is the portion of the population
          drawn from currently unemployed people.
        `,
      ),
    ),
    doc.h3`Solving the Model`,
    responsiveGridAutoRow([
      mathml.bathtubModel.solveForUnemployment,
      mathml.bathtubModel.unemploymentRate,
    ], {
      columns: { desktop: 'auto auto' },
    }),
    doc.p`
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
    doc.li`
      A substantial part of the explanation for why per capita GDP is lower
      in Europe than in the United States is simply that Europeans work
      fewer hours
    `,
  )),
));

export const valueOfHumanCapital = createDoc(() => container(
  ref({ page: 195 }, doc.h2`Value of Human Capital`),
  dashbox(
    ref({ page: 196 }, doc.h3`Present Discounted Value`),
    twoThree(
      doc.p`
        ${doc.b`Present discounted value`} is useful for calculating
        the current day value of future earnings. The example on the
        right is the general form for a single payment but you can
        rearrange it to model life time earnings.
      `,
      mathml.valueOfHumanCapital.presentDiscountedRate,
    ),
    twoThree(
      doc.p`
        The steps to solve for the equation on the right are in
        the textbook, but it is basically a geometric series of
        each payment over time which can be rearranged into that.
        ${doc.b`R`} is the expected rate of interest, and ${doc.b`T`}
        is the time spent working. This is ignoring for future
        wage growth.
      `,
      mathml.valueOfHumanCapital.presentDiscountedValueOfSalary,
    ),
  ),
));

export const risingReturnToEducation = createDoc(() => dashbox(
  container(
    twoThree(
      container(
        ref({ page: 197 }, doc.h3`Rising Return To Education`),
        doc.p`
          The returns to education is increase in returns over
          a lifetime; usually in reference to a college education.
          In the USA the premium income has gone from 50% in
          1963 to about 10% in 2012. This preimum is responsible
          in an increased up take in college education.
        `,
        doc.p`
          With a massive increase in college educated young people
          a question arises... ${doc.b`How is it that the wage of
          college graduates is also growing`}? It isn't too complicate,
          it's just the growth in demand for those with a college
          education is greater then the growth in supply of people
          with a college education.
        `,
      ),
      infobox({ title: 'Returns To Education' })(
        doc.p`You can read more here:`,
        doc.ul({ className: 'no-item-padding' }).of(
          doc.li.of(LINKS.worldBankReturnsToEducation`World Bank`),
          doc.li.of(LINKS.scienceDirectReturnsToEducation`Science Direct`),
          doc.li.of(LINKS.educationNSWReturnsToEducation`Education NSW`),
        ),
      ),
    ),
    twoColumns(
      container(
        ref({ page: 199 }, doc.h4`Skill-biased Technical Change`),
        doc.p`
          With the passage of time tools such as computers the
          internet and all sorts of new technology has dispropotionately
          improved the productivity of highly skilled workers.
        `,
      ),
      container(
        ref({ page: 200 }, doc.h4`Globalisation`),
        doc.p`
          Another explation for how the demand for those with a college
          is globalisation. With opening up trade to the world, global
          demand is added to local demand for these skills.
        `,
      ),
    ),
  ),
));

export const economicGrowthAndIncomeInequality = createDoc(() => dashbox(
  ref({ page: 203 }, doc.h3`Economic Growth and Income Inequality`),
  doc.p`
    In recent decades it appears the top portion of the wealth distribution.
    The allocation of those with college educations has implications for
    global inequality.
  `,
  doc.p`
    Between 1980 and 2014 saw slower rough than the developed world, however
    prior to this between 1946 adn 1980 the opposite is true. ${doc.b`That said`},
    I'm not sure I'd entirely attribute this to education. There's alot we
    don't know about the nature of economic growth. The fact Korean growth out
    paced Filipino growth since WW2 is at odds with the suggestion education is
    by any means a requirement, although it by no measns suggests its not a
    contributing factor.
  `,
  todo({}, 'show wealth distribution'),
));
