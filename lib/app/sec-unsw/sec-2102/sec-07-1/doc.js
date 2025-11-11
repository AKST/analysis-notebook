
/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { responsiveGridAutoRow, twoThree, twoColumns, container } from '@prelude-uni/layout.js';
import { text, clsRef, infobox, dashbox, todo, note, noteOn } from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';
import { vars as isCurveVars } from '../sec-05-2/doc.js';

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ page, slide }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 16, page }) : undefined,
    lec: slide != null ? ({ id: [7, 'M'], slide }) : undefined,
  }, item)
);

const LINKS = {
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
        'Consumption', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W7, Lecture 1']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      text.ul(
        doc.li`Chapter 16`
      ),
    ),
  ),
));

export const introduction = createDoc(() => container(
  ref({ page: 461 }, doc.h2`Introduction`),
  dashbox(
    doc.p`
      In the ${doc.b`neoclassical consumption model`}, individuals choose
      consumption at each moment in time to maximize a lifetime utility function
      that depends on current and future consumption. People recognize that
      income in the future may differ from income today, and such differences
      influence consumption today.
    `,
  ),
));

export const neoclassicalModel = createDoc(() => container(
  ref({ page: 461 }, doc.h2`The Neoclassical Consumption Model`),
  dashbox(
    doc.p`
      In the neoclassical consumption model we can simply things by
      thinking of time as involving only two periods:
      ${doc.b`today and the future`}.
    `,
    text.ul(
      doc.li`People may earn income today and in the future`,
      doc.li`People consume today and in the future`,
      doc.li`People have to decide how much to consume today versus in the future`,
    ),
    doc.p`
      This is the essence of the neoclassical model, and we model this with
      two main elements, an ${doc.b`intertemporal budget constraint`} and a
      ${doc.b`utility function`}.
    `,
    twoThree(
      container(
        ref({ page: 461 }, doc.h4`The Intertemporal Budget Constraint`),
        doc.div({ style: '--fontsize-math-m: 12px' })(
          mathml.irvingBudgetConstraint,
        ),
        doc.p`
          Above is a budget constraint, they mean
        `,
        text.ol(
          doc.li`The first equation represents today`,
          doc.li`The second equation represents the future`,
        ),
        doc.div({ style: '--fontsize-math-m: 12px' })(
          mathml.intertemporalBudgetConstraint,
        ),
        doc.p`
          This equation says that the present discounted value of consumption
          must equal total wealth. It includes both ${doc.b`financial wealth`}
          (todays wealth), and ${doc.b`human wealth`} (income today and
          present discounted value of future income).
        `,
        ref({ page: 462 }, doc.h4`Utility`),
        doc.p`
          Consumption delivers utility through a utility function. For example,
          if someone consumes some amount ${doc.b`c`} in a given period, we
          assume that he receives ${doc.b`u(c)`} units of utility, sometimes
          called ${doc.b`“utils”`}.
        `,
        doc.p`
          Consumption exhibits diminishing marginal utility: each additional
          unit of consumption raises utility by a smaller than the last unit
          of consumption. This applies to all kinds of consumption.
        `,
        mathml.lifetimeUtilityFunction,
        doc.p`
          The lifetime utility depends on how much he consumes today and
          how much in the future. The parameter ${doc.b`𝛽`} is some number
          such as 1.0/0.9 that captures the weight that the consumer places
          on the future, relative to today.
        `,
        dashbox(doc.details(
          doc.summary`Thought bubble on 𝛽`,
          doc.br(),
          doc.p`
            Do we understand the distribution of 𝛽 in the population?
            I was interested to know more on this but the lecturer
            said not to think about it too hard because we know very
            little about the behaviour of consumption in reality.
          `,
        )),
        ref({ page: 463 }, doc.h4`Choosing Consumption to Maximize Utility`),
        doc.p`
          The model assumes consumers will choose their consumption
          so as to maximisse utility subject to their budget constraint.
        `,
        mathml.utilityMaximisation,
        doc.p`
          ${doc.b`X̄`} denotes total wealth which is the sum of financial
          wealth and human wealth. Solving this can be done with a bit
          of calculus.
        `,
        mathml.solvingMaximisation1,
        doc.p`This expression is called the Euler equation for consumption.`,
        mathml.indifferenceCondition,
        doc.p`
          The Euler equation essentially says that the consumer must be
          indifferent between consuming one more unit today on the one hand
          and saving that unit and consuming it in the future on the other.
        `,
      ),
      container(
        infobox({ title: 'Legend' })(
          text.ul(
            doc.li`${doc.b`f`}: Financial wealth`,
            doc.li`${doc.b`y`}: Labour Income`,
            doc.li`${doc.b`c`}: Consumption`,
          ),
        ),
        doc.dl(
          doc.dt`Intertemporal Budget Constraint`,
          doc.dd`Says that the present discounted value of consumption must equal ${doc.b`total wealth`}`,
          doc.dt`Total Wealth`,
          doc.dd`A combination of ${doc.b`financial wealth`} and ${doc.b`human wealth`}`,
          doc.dt`Financial Wealth`,
          doc.dd`
            This is expressed as ${doc.b`f${doc.sub`today`}`}, and is generally stuff
            such as savings, stock, bonds, and other financial assets.
          `,
          doc.dt`Human Wealth`,
          doc.dd`
            The present discounted value of labour income, also expressed as
            ${doc.b`f${doc.sub`future`}`}.
          `,
          doc.dt`Utility Function`,
          doc.dd`A function form for expressing utility received from consumption.`,
          doc.dt`Utils`,
          doc.dd`Units of Utility, and how utility from consumption is measured.`,
          doc.dt`Diminishing marginal utilities`,
          doc.dd`
            The way in how the next unit of consumptions results in less
            additional utility the unit act of consumption.
          `,
        ),
        infobox({ title: 'Legend' })(
          text.ul(
            doc.li`${doc.b`𝛽`}: weight placed on the future`,
            doc.li`${doc.b`X̄`}: Totl welaht over lifetime`,
          ),
        ),
        doc.dl(
          doc.dt`Substitution effect`,
          doc.dd`TODO`,
          doc.dt`Income effect`,
          doc.dd`TODO`,
        ),
      ),
    ),
    container(
      ref({ page: 465 }, doc.h4`Solving the Euler: Log Utility`),
      twoColumns(
        container(
          doc.p`
            A common choice for the consumption curve is the logarithmic
            function given its deminishing returns. It has a nice perk
            of being easy to derive ${doc.b`u'(c) = 1/c`}.
          `,
          doc.p`
            Here is the euler function written using the log
            implementation of consumption, and rearranged to
            get the ratio.
          `,
        ),
        mathml.solvingLogUtility,
      ),
      ref({ page: 466 }, doc.h4`Solving the Euler: Log Utility at β = 1`),
      twoThree(
        container(
          doc.p`
            The solved equation suggests that consumers choose their consumption
            so that the growth rate of consumption is the product of the
            discount parameter and the interest rate that he can earn on his
            saving. It also suggests:
          `,
          text.ul({ itemSpace: 'sparse' })(
            doc.li`
              A higher interest rate raises the return to saving, and
              consumption growth is faster
            `,
            doc.li`
              If the consumer is impatient, they may places less weight
              on future utility (a lower b), and consumption growth is
              lower.
            `,
          ),
          doc.p`
            It also suggests whey interest rates and growth rates
            are similar numbers.
          `,
        ),
        mathml.solvingConsumptionWhenBetaIs1,
      ),
      todo({}, 'explain, the Euler equation explains how interest rates and growth rates are linked'),
      ref({ page: 467 }, doc.h4`The Effect of a Rise in R on Consumption`),
      doc.p`
        How does consumption respond to a rise in the interest rate?
        A higher interest rate will reduce this present value, therefore
        reducing consumption in the case of log utility. This force is called
        the wealth effect of a higher interest rate, because it works through
        the total wealth term.
      `,
      text.ul(
        doc.li`
          ${doc.b`The substitution effect`} of a higher interest rate is that
          current consumption is now more expensive (because saving will lead
          to even more consumption in the future), so consumers will tend to
          reduce their consumption today.
        `,
        doc.li`
          ${doc.b`The income effect`} says that consumers are now richer
          because their current saving leads to more income in the future
          which makes them want to consume more today.
        `,
      ),
      doc.p`A higher interest rate can either raise or lower consumption.`,
    ),
  ),
));

export const lessonsFromModel = createDoc(() => container(
  ref({ page: 467 }, doc.h2`Lessons from the Neoclassical Model`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 467 }, doc.h4`The Permanent-Income Hypothesis`),
        mathml.consumptionProportionalToWealth,
        note(),
        ref({ page: 469 }, doc.h4`Ricardian Equivalence`),
        note(),
        ref({ page: 469 }, doc.h4`Borrowing Constraints`),
        mathml.irvingConstraint,
        mathml.irvingConstraintLowIncome,
        note(),
        ref({ page: 470 }, doc.h4`Consumption as a Random Walk`),
        note(),
        ref({ page: 471 }, doc.h4`Precautionary Saving`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const empiricalEvidence = createDoc(() => container(
  ref({ page: 472 }, doc.h2`Empirical Evidence on Consumption`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 472 }, doc.h4`Evidence from Individual Households`),
        note(),
        ref({ page: 474 }, doc.h4`Aggregate Evidence`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const deriveUtilityFunction = createDoc(() => container(
  doc.h2`Extra: Deriving utility function using Lagrangean`,
  dashbox(
    todo({}, 'Post notes from tutorial here'),
  ),
));
