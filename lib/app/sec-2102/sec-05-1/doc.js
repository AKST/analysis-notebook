
/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container } = prelude.layout;
const { clsRef, infobox_2, text, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

const LINKS = {
  potenialOutput: doc.a({ href: 'https://en.wikipedia.org/wiki/Potential_output' }),
};

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ page, slide }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 9, page }) : undefined,
    lec: slide != null ? ({ id: [5, 'M'], slide }) : undefined,
  }, item)
);

const vars = {
  potentialOutput: doc.b`Ȳ${doc.sub`t`}`,
  currentOutput: doc.b`Y${doc.sub`t`}`,
  shortrunFlux: doc.b`Ỹ${doc.sub`t`}`,
  longrunIR: doc.b`𝜋̄`,
  currentIR: doc.b`𝜋`,
  changeInIR: doc.b`∆𝜋`,
};

export const header = createDoc(() => container(
  twoThree(
    container(
      ['h1', [
        'The Short run', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W5, Lecture 1']],
      ]],
    ),
    infobox_2({ title: 'Resources' })(
      text.ul(
        doc.li`Chapter 11 of the textbook`,
        doc.li.of(LINKS.potenialOutput`Potential Output`),
      ),
    ),
  ),
));

export const intro = createDoc(() => container(
  ref({ page: 243 }, doc.h2`Introductions`),
  container(
    twoThree(
      dashbox(
        doc.p`
          The long run model we developed in the earlier sections are
          generally models to explain behaviour on average and in the
          long run. As Keynes point this long run average typically is
          not illustrative the current point in time at any given time
          in the economy.
        `,
        doc.p`
          A shortrun model is necessary to model is necessary to model
          how shocks and crisis unfold and lead to negative growth and
          sharply rising unemployment.
        `,
      ),
      doc.quote.of(
        doc.p`
          But this “long run” is a misleading guide to current affairs. “In the long run”
          we are all dead. Economists set themselves too easy, too useless a task if
          in tempestuous seasons they can only tell us that when the storm is long
          past the ocean is flat again.
        `,
        doc.p({ style: 'text-align: right' })`— John Maynard Keynes`,
      ),
    ),
  ),
));

export const theLongrunTheShortrun = createDoc(() => container(
  ref({ page: 244 }, doc.h2`The Long-Run, the Short-Run, shocks`),
  dashbox(
    twoColumns(
      doc.p`
        The long long model is useful for determining the level of
        potential output aand long run inflation rate. In contrast,
        the short run model is useful for detemining the current levels
        of outptu and inflation that we observe on a reguarly periodic
        basis (year to year or quarter to quarter).
      `,
      mathml.modelComparison,
    ),
    doc.ul.of(
      doc.li`
        ${doc.b`Potenial Output`}, is the amount the economy would
        produce if all inputs were utlized at their long-run sustainable
        levels.
      `,
      doc.li`
        ${doc.b`Actual Output`}, can deviate from this in that it
        reflects the economy responding to shocks, responding to
        new technology, the disappointment when some of those
        technologies turn out to be duds, changes to taxes and
        government spending.
      `,
      doc.li`
        The ${doc.b`short run`} is generally the period in which these
        all unfold which is typicallly 2 years give or take.
      `,
    ),
    doc.p`
      The long and short run models aren't entirely independent of
      each other. Outputs of a long run model are still important for
      a short run model, such as ${doc.b`potenial output`} and the
      ${doc.b`long-run inflation rate`} which are taken as
      ${doc.b`exogenous`} variables in the short run model. Our model
      also has 2 ${doc.b`endogenous`} variables, the ${doc.b`current
      level of output`} and the ${doc.b`current level of inflation`}.
    `,
    doc.h4`Notation`,
    text.ul(
      doc.li`
        ${doc.b`Potential output`} is expressed as ${vars.potentialOutput},
        and is generally determined using a combined Solow-Romer model.
      `,
      doc.li`
        ${doc.b`Long run inflation`} is expressed as ${vars.longrunIR}, for now
        it will be expressed without of time, hence no time subscript.
      `,
      doc.li`
        ${doc.b`Current output`} (or current level of output) is expressed
        in terms of ${vars.currentOutput}.
      `,
      doc.li`
        ${doc.b`Current inflation`} (or the current rate of inflation) is
        expressed in terms of ${vars.currentIR}.
      `,
    ),
    container(
      doc.h3`Trends and Fluation`,
      twoColumns(
        container(
          doc.p`
            The actual rate can be viewed as the sum of the long-run trend
            and the short-run fluctuations (${vars.shortrunFlux} which is
            also referred to as ${doc.b`detrended output`} or ${doc.b`short-run
            output`}).
          `,
          mathml.actualOutput,
        ),
        container(
          doc.p`
            ${vars.potentialOutput} is generally thought of as a relatively
            smooth trend, where as the ${vars.shortrunFlux} is the difference
            between the long run and the actual output (everything else).
          `,
          mathml.shortrunFluctuation,
        ),
      ),
      doc.p`
        In the USA the ${doc.u`Business Cycle Dating Committee of the National Bureau of Economic Research`}
        defines a ${doc.b`recession`} as the point at which acutal output
        falls below potential output, and it is declared over once output
        return or exceeds potenial output. Although in Australia we generally
        define a recesssion as 2 periods of negative growth.
      `,
      text.ul(
        doc.li`
          A recession can be quite costly and the cost of a recession is
          not borne evenly by the general public.
        `,
      ),
    ),
    container(
      doc.h3`Measuring Potential Output`,
      doc.p`
        How do you measure an unobservable concept such as potenial
        output? There are a few approaches, one such approach is to
        take the average actual GDP of the surrounding quarters. The
        ${doc.b`Congresssional Budget Office`} uses a version of the
        Solow model to construct its measure of ${vars.potentialOutput}.
        One characteristic of that model is eventually you see a slowdown
        in invesment allowing for a narrowing of the gap between actual
        and potenial GDP, this is something you can observer in data since
        2008.
      `,
      doc.p`
        There isn't one exact way to accomplish measuring this, generally in
        practise conomist consult a variety of indicators such as the job
        finding rate (or some measurement of it), survey on economic activity
        in particuar industries, and so on. However it is no less difficult
        to discren whether a change in GDP reflects changes in ${vars.potentialOutput}
        or the ${vars.shortrunFlux}.
      `,
    ),
  ),
  dashbox(doc.details.of(
    doc.summary`Hot Take`,
    doc.br(),
    container(
      doc.p`
        We are still in the vials of mercury, treatment by leeches,
        earth rotating around the sun era in our understanding the
        nature of how macro economics works. In the defence of macro
        economics we are trying to quantify something like this is
        orders of magnitude more difficult than observing something
        that exists right in front of you or we have a well documented
        of experiments (ethical and unethical) on the these subjects
        providing us with an information base. Performing such
        experiments in an economic basis is orders of magnitude more
        risky.
      `,
      doc.p`
        This doesn't this entitled us to to insist any sense of
        authority over the way things work, but I don't think it
        also suggests our models are useless either. But they tell
        us alot less than we would otherwise like. Like concepts
        such as potenial output or total factor productivity don't
        really exist. TFP is a residual from the models we have for
        measuring output, and potenial output is like this plantonic
        concept that also doesn't really exist in practise either. And
        so we end up with a litany of ways of measuring this concept
        that doesn't really exist, there is no exgaustive anchor points
        in reality (or at least reasonably measure) that we can work off
        to confirm if any of these things work. It very well may exist
        but it we can't really be for sure.
      `,
      doc.p`
        Such platonic models like this exist in macroeconomics
        as well, and we see this more than I would like (and shouldn't)
        in econometrics where the normal distribution or Central Limit
        Theorum is invoke to justify a litany of ${doc.s`excuses`}
        assumptions.
      `,
    ),
  )),
  dashbox(
    container(
      doc.h3`Inflation Rate`,
      doc.p`
        During a recesssion typically the rate of inflation falls, so
        when you look at a chart of inflation typically the point at
        which inflation starts falling indicates a recesssion.
      `,
    ),
  ),
));

export const theShortrunModel = createDoc(() => container(
  ref({ page: 251 }, doc.h2`The Short-Run Model`),
  dashbox(
    doc.p`The short run mode is based on three premises.`,
    doc.ul.of(
      doc.li`
        ${doc.i`The economy is constantly being hit by shocks`}. These are
        ${doc.b`Economic shocks`}, which is inclusive of changes in resource
        prices, disruptions in financial markets, new technologies, changes
        in government spending on any number of government sectors. Such shocks
        can push actual output further away from actual output or move inflation
        rate away from its long-run value.
      `,
      doc.li`
        ${doc.i`Monetary and fiscal policy affect output`}. The Government has
        monetary abd fiscal tools at its disposal that can affect the economic
        activity in the short run. This means discretionary means to negative
        shocks to the economy while, while also being able to stimulate the
        economy and keep output from falling below potential.
      `,
      doc.li`
        ${doc.i`There is a dynamic trade-off between output and inflation`}.
        While the government can affect output this isn't a free lunch, there
        are trade offs to be made, a booming economy can lead to an increase
        in the inflation rate (especailly when propelled by government spending).
        If this does happen, well policy makers will want to lower it, but that
        would require a trade-off. We can model this trade off using  the
        ${doc.b`Phillips Curve`}.
      `,
    ),
  ),
  ref({ page: 252 }, doc.h3`A graph of the short run model`),
  dashbox(
    doc.ul.of(
      doc.li.of(
        doc.p`
          The Phillips curve shows how a booming economy
          leads to an increase in the inflation rate. It
          also shows how a recession leads to a decrease.
        `,
        text.ul(
          doc.li`
            If output is above potential ${vars.shortrunFlux} will be positive,
            and the ${vars.changeInIR} will also be positive.
          `,
          doc.li`
            If output is below potential ${vars.shortrunFlux} will be negative,
            and the ${vars.changeInIR} will also be negative.
          `,
        )
      ),
      doc.li`
        This trade off can be confusing if it's unclear what
        is meant by ${doc.b`Potential output`}. It actually
        doesn't mean something always out of reach, its some
        what like an equilibrium output where inflation isn't
        growthing or decreasing and employments stay about the
        same (${doc.b`I need to fact check this`}).
      `,
      doc.li.of(
        doc.p`In a ${doc.b`booming`} economy`,
        text.ul(
          doc.li.of(doc.p`Say the prevailing inflation rate is 5%`),
          doc.li.of(doc.p`All firms are raising their prices by 7%`),
        ),
      ),
      doc.li.of(
        doc.p`In a ${doc.b`contracting`} economy`,
        text.ul(
          doc.li.of(doc.p`Say the prevailing inflation rate is 5%`),
          doc.li.of(doc.p`All firms are raising their prices by 3%`),
          doc.li.of(doc.p.of(doc.i`
            (They are effectively lowering their price
            by not increasing with the rate of inflation)
          `)),
        ),
      ),
    ),
    infobox_2({ title: 'Summary' })(
      doc.p`
        The short- run model says that a booming economy leads
        the inflation rate to increase, and a slumping economy
        leads the inflation rate to fall.
      `,
    ),
  ),
));

export const okunsLaw = createDoc(() => container(
  ref({ page: 255 }, doc.h2`Okuns Law: Output and Unemployment`),
  dashbox(
    doc.p`
      When we analyse economic fluctations we focus on either
      unemployment of output. Note that:
    `,
    text.ul(
      doc.li`A recession, for example, is a time when output is below potential and unemployment is high`,
      doc.li`A boom is a time when output is above potential and unemployment is low`,
    ),
    twoThree(
      doc.p`
        There's a relationship between levels of employment and
        output relative to potential output. Capturing that relationship
        is precisely what Okuns law. What this does is allow for to
        focus on one or the other, or infer something about the one of
        these from the other.
        Another thing, levels of output and unemployment tend to move together.
      `,
      mathml.okunsLaw,
    ),
    doc.h4`Notes from the lecturer`,
    text.ul(
      doc.li`
        We don't use this in research too much any
        more but the RBA still uses it.
      `,
      doc.li`
        When the economy is on the trend line, it means
        ${doc.font({ color: 'red' })`TODO: insert meaning`}.
      `,
    ),
  ),
));
