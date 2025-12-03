
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
  paper: {
    randomWalk: text.a({ href: 'https://www.jstor.org/stable/1840393' }),
    consumptionAndliquidityConstraints: text.a({
      href: 'https://www.aeaweb.org/articles?id=10.1257%2Fjep.15.3.23',
    }),
  },
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
          how much in the future. The parameter ${doc.b`β`} is some number
          such as 1.0/0.9 that captures the weight that the consumer places
          on the future, relative to today.
        `,
        dashbox(doc.details(
          doc.summary`Thought bubble on β`,
          doc.br(),
          doc.p`
            Do we understand the distribution of β in the population?
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
            doc.li`${doc.b`R`}: Real Interest Rate`,
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
            doc.li`${doc.b`β`}: weight placed on the future`,
            doc.li`${doc.b`X̄`}: Totl welaht over lifetime`,
          ),
        ),
        doc.dl(
          doc.dt`Substitution effect`,
          doc.dd`TODO`,
          doc.dt`Income effect`,
          doc.dd`TODO`,
        ),
        infobox({ title: 'Interpreting β' })(
          text.ul({ itemSpace: 'sparse', style: 'padding-left: 16px' })(
            doc.li`When ${doc.b`β = 1`}, utility from consumption today is equal from comsumption in the future`,
            doc.li`When ${doc.b`β < 1`}, utility from consumption today is worth more than in the future`,
            doc.li`When ${doc.b`β > 1`}, utility from consumption in the future is worth more than in the present`,
          ),
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
        ref({ page: 467 }, doc.h4`The Permanent-Income Hypothesis`),
        doc.p`
          Aspects of the ${doc.b`Permanent-Income Hypothesis`} can be
          expressed as a constraint on ${doc.b`X̄`} suggesting
          consumption is propotional to a consumers overall wealth.
        `,
        mathml.consumptionProportionalToWealth,
        doc.quote`This depends on the present ${doc.b`discount value of income`}.`,
        doc.p`
          The intuition behind the hypothesis suggests that consumers
          smooth their income over time, this suggests a period between
          two periods should resemble an average of the two, instead of
          precisely along the utility curve.
        `,
        mathml.averageUtility,
        ref({ page: 469 }, doc.h4`Ricardian Equivalence (RE)`),
        doc.quote`Ricardian Equivalence suggest ${doc.b`y`} is as income ${doc.b`after taxes`}.`,
        doc.p`
          The implication of the ${doc.b`Ricardian Equivalence`} suggests
          that ${doc.b`Taxes`} must be subtracted from the right
          hand side of the intertemporal budget constraint.
        `,
        mathml.richardianEquivalenceIbc,
        doc.p`
          Additional lifetime wealth ${doc.b`X̄`} now is the present discounted
          value of resources net of taxes.
        `,
        mathml.richardianEquivalenceTotalWealth,
        doc.p`
          Ricardian equivalence also suggests a change in the timing of taxes does not
          affect consumption. A tax cut today, financed by an increase in taxes
          in the future, will not affect consumption.
        `,
        ref({ page: 469 }, doc.h4`Borrowing Constraints`),
        doc.p`
          A key assumption of the neoclassical model is that Irving can freely
          save or borrow at the ${doc.b`market interest rate R`}. This describes
          the opportunities available to many consumers however it doesn't
          describe all consumers.
        `,
        doc.p`
          Some simply may not be able to borrow due any number of illustutional
          restrictions that determine whether someone can borrow or not. In
          such scenario the ${doc.b`intertemporal budget constraint`} is no
          longer an appropiate correct constraint.
        `,
        doc.p`Instead consumption is restricted by:`,
        mathml.irvingConstraint,
        doc.p`
          If consumption is below income then this will not bind
          and the consumer is saving, so the inability to borrow
          changes nothing.
        `,
        doc.p`
          Alternatively, if the consumers current income is sufficiently
          low, they may wish to borrow. In which case, the borrowing constraint
          binds, and consumption is constrained to equal their income.
        `,
        mathml.irvingConstraintLowIncome,
        doc.p`
          The marginal propensity to consume from an extra dollar of income
          changes significantly when borrowing constraints are present. More
          or less, when income increases by $1 we should expect consumption
          to increase by $1.
        `,
      ),
      container(
        doc.dl(
          doc.dt`permanent-income hypothesis`,
          doc.dd`
            The hypothesis suggests that consumption depends on some
            average value of income, rather than on current income.
            ${doc.br()}
            ${doc.br()}
            Stronger versions of the hypothesis explictly suggest
            consumption depends on the present discounted value of
            income.
          `,
          doc.dt`Marginal propensity to consume (MPC)`,
          doc.dd`
            Consumption shifts by the ${doc.b`MPC`}
            for each temporary unit increase in income.
            So for a $1 increase with a 1/2 MPC, there
            should be a $0.5 increase in consumption.
          `,
          doc.dt`Ricardian equivalence`,
          doc.dd`
            Ricardian approach to the government is that consumption
            depends on the present discounted value of taxes and is
            invariant to the timing of taxes.
          `,
        ),
        infobox({ title: 'Does Ricardian Equivalence hold?' })(
          doc.p`
            Generally it holds to the extent to which consumers
            are limited by borrowing constraints.
          `,
          doc.p`
            It can also break down when the tax cuts are given
            to people who differ from the people paying the higher
            taxes. This can happen because of:
          `,
          text.ol({ itemSpace: 'sparse' })(
            doc.li`A Progressive tax system.`,
            doc.li`A tax cut paid for by higher taxes on future generations.`,
          ),
        ),
      ),
    ),
    twoColumns(
      container(
        ref({ page: 470 }, doc.h4`Consumption as a Random Walk`),
        doc.quote`
          See ${LINKS.paper.randomWalk`Robert E. Hall (1978)`}.
        `,
        doc.p`
          What happens when income is uncertain? The neoclassical
          model suggests that today consumption will depend on
          all information the consumer has about the present value of
          lifetime resources. E.g.
        `,
        text.ol({ itemSpace: 'sparse' })(
          doc.li`
            If a consumer anticipates a raise, they increase spending
            as they anticipate the ability to repay their spending.
          `,
          doc.li`
            Hedge against the possibility of a large drop in income,
            perhaps associated with unemployment or disability.
          `,
        ),
        doc.p`
          This part of what is meant by ${doc.b`random walk view of
          consumption`}, as the exact behaviour of all consumers on
          an indivisual level can be fairly unpredictable (making
          modelling difficult).
        `,
        doc.p`
          Due to the nature of loss adversion, the magnitude of a
          response to a possible promotion will be smaller than the
          magnitude of a response to the posiblity of losing a job.
        `,
      ),
      container(
        ref({ page: 471 }, doc.h4`Precautionary Saving`),
        doc.quote`Read more ${LINKS.paper.consumptionAndliquidityConstraints`here`}.`,
        doc.p`
          This is permissitic response to income uncertainty,
          in that consumers may save to hedge against the possibility
          of a large drop in income, perhaps associated with unemployment
          or disability. This type of saving is called ${doc.b`precautionary
          saving`}.
        `,
        doc.p`
          As long as the possibility remains that income could fall even
          further, consumers may engage in precautionary saving to insure
          themselves against that outcome.
        `,
        doc.p`
          The precautionary saving motive can, lead consumers to ${doc.b`behave
          as if they ${doc.b`face borrowing constraints`} ${doc.i`even when they
          do not`}`}.
        `,
        doc.p`
          In the case of being subject to aa borrowing constraint, the
          consumer's consumption may be especially sensitive to their
          current income. This adds additional variance to a hypothetical
          spread of possible values of ${doc.b`β`}.
        `,
      ),
    ),
  ),
  dashbox(doc.details(
    doc.summary`💭 Information dynamics`,
    doc.br(),
    doc.p`
      I wonder if you can simulate information dynamics
      over time through a population of different actors
      to simulate this kind of thing. I imagine without
      more research simulating such a thing would be
      quite the task and be an incredibly speculative use
      of time given the number assumptions you'd need to
      make before you start modelling any outcomes.
    `,
  )),
));

export const empiricalEvidence = createDoc(() => container(
  ref({ page: 472 }, doc.h2`Empirical Evidence on Consumption`),
  dashbox(
    twoColumns(
      container(
        ref({ page: 472 }, doc.h4`Evidence from Individual Households`),
        doc.p`
          Determinants of consumption at the household level is one of the
          most studied areas in modern macroeconomics. Households are
          ${doc.b`Heterogeneous`}, meaning we can come up with a common
          universal household measure that can be applied to all households.
          Some may have similar or the same marginal perpensity to consume at
          a point in time but there is no single measure of the ${doc.b`marginal
          Perpensity to consume`}.
        `,
        doc.quote`
          The microeconomics side of this is very messy. For each countries
          the effect seems to be between 25 to 30 percent.
        `,
        doc.p`
          More generally:
        `,
        text.ol({ itemSpace: 'sparse' })(
          doc.li`
            The euler equation and permanent-income hypothesis provide a
            useful description of the consumption behaviour of many
            households, particullarly of those with above average wealth.
          `,
          doc.li`
            Some households (especially low income) behave as if they have
            borrowing constraints, or engage in precautionary savings.
          `,
          doc.li`
            Lastly there are many anomalies where the wheels fall
            off the neclassical consumption model.
          `,
        ),
        doc.p`
          ${doc.b`Behaviour economics`} is one of the most active areas
          of research in the past decade. With its fusion of economics,
          psychology and neuroscience it is helping us gain a better
          idea of how indivisuals make eocnomic decisions.
        `,
      ),
      container(
        ref({ page: 474 }, doc.h4`Aggregate Evidence`),
        doc.p`
          Since the 1970s consumption as part of GDP has
          risen from 60% of GDP to 68%.
        `,
        doc.p`
          In terms of what changed, part of the answer lies in
          increased borrowing by households. Since the 1970s
          household debt has risen from 50% of GDP to about 67%
          of GDP by the 2000s. As of 2009 it reached nearly 100%,
          the GFC followed some time after. The time Since 2009
          has been one of the sharpest declines in household debt
          to GDP (we call the this decrease ${doc.b`deleveraging`}).
        `,
        doc.p`
          This rise in household debt was coincided with a decrease
          in a large steady declince in the ${doc.b`personal savings rate`}.
          The personal savings rate is the ratio between personal savings
          and disposable income (as portions of income after paying taxes).
        `,
        doc.p`
          One of the more widely held views is that gains in the stock
          market have reduced the need for additional saving. Additionally
          large gains in real estate in the 1980-1990s reduced the need
          for personal savings. Consist with that suggestion we've seen the
          rate of personal savings increase since the GFC.
        `,
      ),
    ),
  ),
));

export const deriveUtilityFunction = createDoc(() => container(
  doc.h2`Extra: Deriving utility function using Lagrangean`,
  dashbox(
    text.figure(
      responsiveGridAutoRow([
        doc.div({
          className: 'container',
          style: 'justify-items: left',
        })(
          responsiveGridAutoRow([
            mathml.lagrangian.functions,
            mathml.lagrangian.definitions,
          ], {
            columns: { desktop: 'auto auto' },
            align: 'start',
          }),
          container(
            mathml.lagrangian.l,
            mathml.lagrangian.firstOrderCondition,
            doc.hr(),
            mathml.lagrangian.optimalConsumption,
          ),
        ),
      ], {
        columns: { desktop: 'auto 1fr' },
      }),
      doc.figcaption`Solving Larangian`,
    ),
  ),
));
