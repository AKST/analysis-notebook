/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { twoColumns, twoThree, container } from '@prelude-uni/layout.js';
import { text, clsRef, infobox, dashbox, note, todo } from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ page, slide }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 10, page }) : undefined,
    lec: slide != null ? ({ id: [8, 'M'], slide }) : undefined,
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
        'Basic Regression Analysis with Time Series Data', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W8, Lecture 1']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      text.ul(
        doc.li`Chapter 10 of the textbook.`,
      ),
    ),
  ),
));

export const natureOfTimeSeriesData = createDoc(() => container(
  ref({ page: 334 }, doc.h2`The Nature of Time Series Data`),
  dashbox(
    twoThree(
      container(
        doc.p`
          Time series data places heavy emphasis on the fact
          it has a temporal ordering. While this fact should not
          be surspring it is worth emphasising as it is the lense
          in which we'll be revaluating the methodologies we've
          learnt so far. We'll still have how tests, our estimators,
          our statistics, etc. But this temporal ordering aspect
          introduces so idiosyncrasies.
        `,
        doc.hr(),
        doc.p`
          Something else worth considering is the whole concept of
          a random variable over time. How do we think about the
          concept of randomness over a time series? In cross
          sectional data we thought of this as a random draw,
          which isn't immediately obvious how it translates
          to what into time series data.
        `,
        text.ul(
          doc.li`
            Generally, ${doc.b`because the outcomes of our variables are
            not foreknown, they are viewed as random variables`}.
          `,
          doc.li`
            One set over observations collected over a time series,
            is one possible outcome, or realization, of the stochastic
            process.
          `,
        ),
      ),
      doc.dl(
        doc.dt`temporal ordering`,
        doc.dd`Ordering over time`,
        doc.dt`stochastic process`,
        doc.dd`
          Sometimes called a ${doc.b`times series process`}, this
          is a sequence of random variables indexed by time.
        `,
        doc.dt`Stochastic`,
        doc.dd`A synonym for random`,
      ),
    ),
    doc.h3`Summary, Compared with Cross Sectional`,
    twoColumns(
      container(
        doc.h4`Cross Sectional Data`,
        doc.p`
          TODO. Observation are independent from each other.
          Until now most of the questions we've asked relating
          to our causation is what would have happened.
          Counterfactuals in cross sectional here have been
          like what would Y be if Xⱼ was blah.
        `,
      ),
      container(
        doc.h4`Time series data`,
        doc.p`
          TODO.
          Sample is one realised path. Due to serial correlation
          one draw is expected to be influenced by a previous draw.
          Counterfactuals in time series here are like, how would
          Y evolve given X.
        `,
      ),
    ),
    todo({}, 'fix summary, clarify what is randomw and what are counter factorals'),
  ),
));

export const examplesOfTimeSeriesModels = createDoc(() => container(
  ref({ page: 335 }, doc.h2`Examples of Time Series Regression Models`),
  dashbox(
    twoThree(
      container(
        ref({ page: 336 }, doc.h3`Static Models`),
        mathml.staticModels.example,
        doc.p`
          Above is an example of a static model, there is no
          reference to any other time period so any value of
          the explanatory variables are understood to have an
          immediate effect on the value of y.
        `,
        ref({ page: 336 }, doc.h3`Finite Distributed Lag Models`),
        mathml.lagModels.example,
        doc.p`
          Above is an example of a lagged model, their explanatory
          variables can consist of variables from 1 or more earlier
          periods. The variables from the current period do not
          entirely determine the value of the current period and
          their effect isn't immediate.
        `,
        doc.p`
          The order of the models lag effect is the number of periods
          referenced before the current period.
        `,
        text.ul(
          doc.li`
            ${doc.b`FDL of order 2`} references at most 2 periods
            ${text.ul(
              doc.li`The above example is an example of FDL 2`,
              doc.li`FDL of order 2 can reference the current, last, and last last period.`,
              doc.li`If it had a variable with a subscript of ${doc.b`t-3`}, then it would be FDL of order 3`,
            )}
          `,
        ),
        doc.p`The difference between a ${doc.b`horizon`} and the ${doc.b`LRP`}:`,
        text.ul({ itemSpace: 'sparse' })(
          doc.li`
            ${doc.b.of(doc.b`horizon`)}: This is the effect after a permanent ${doc.b`1 unit change`}
            after h periods.
          `,
          doc.li`
            ${doc.b.of(doc.b`LRP`)}: This is the effect after a permanent ${doc.b`change of any value`}
            after h periods.
          `,
        ),
        doc.quote`
          Several terms have been given explaination on the side.
        `,
        doc.p`
          Often the is substantial correlation in z at different
          lags resulting in multicollinearity leading to
          difficulty in obtaining precise estimates of the
          different iterations of the 𝛿ⱼ.
        `,
        ref({ page: 338 }, doc.h3`A Convention about the Time Index`),
        doc.p`
          When models have lagged explanatory variables, confusion can
          arise concerning the treatment of initial observations. The
          convention followed here will be that these are the initial
          values in our sample, so that we can always start the time
          index at ${doc.b`t = 1`}. In practise this isn't too
          important but it's worth being clear about this as we
          explain some examples below.
        `,
      ),
      container(
        doc.dl(
          doc.dt`Static model`,
          doc.dd`
            The name from the fact that it models a contemporaneous
            relationship between the dependent variable and its
            explanatory variables.
          `,
          doc.dt`Lagged model`,
          doc.dd`
            The explanatory model consists of dependent variables
            from one or more earlier time period.
          `,
        ),
        infobox({ title: 'Example of static models' }).of(
          text.ul(
            doc.li`The phillips curve`,
          ),
        ),
        doc.dl(
          doc.dt`𝛿₀ Impact Multiplier`,
          doc.dd`
            In a finite distributed lag model, the
            coefficient referring to the current
            period is the ${doc.b`impact propensity`}
            or ${doc.b`impact multiplier`}, given it
            is the immediate effect on the dependent
            variable.
          `,
          doc.dt`𝛿ⱼ Lag distributor`,
          doc.dd`
            ${doc.b`𝛿ⱼ`} is a function of ${doc.b`j`} which
            takes the period and returns the effect.
          `,
          doc.dt`LRP`,
          doc.dd`
            ${doc.b`Long run propensity`} or long run multiplier, this
            is when there's no further changes in a variable
            with a ${doc.b`Lag distributor`}. E.g.${doc.br()}
            ${doc.br()}
            ${doc.b`z(𝛿₀ + 𝛿₁ + 𝛿₂)`}
          `,
          doc.dt`Horizon (h)`,
          doc.dd`
            A time of h periods.
          `,
          doc.dt`Cummulative effect`,
          doc.dd`
            For a horizon h, the cumulative
            effective effect is the change
            in the dependent variable after
            h periods after a permanent ${doc.b`one-unit`}
            increase in x given:${doc.br()}
            ${doc.br()}
            ${doc.b`x(𝛿₀ + 𝛿₁ + 𝛿₂)`}

          `,
        ),
      ),
    ),
  ),
));

export const finiteSamplePropertiesOLS = createDoc(() => container(
  ref({ page: 339 }, doc.h2`Finite Sample Properties of OLS under Classical Assumptions`),
  dashbox(
    doc.p`
      Here we'll go through the 6 assumptions
      needed to ensure unbiasness in OLS.
    `,
    twoThree(
      container(
        ref({ page: 339 }, doc.h3`Unbiasedness of OLS`),
        doc.h4`TS.1 Linear in Parameters`,
        container(
          todo({}, 'insert math for TS1'),
          doc.p`
            This is more or less the same as MLR, but since we
            are specifying a linear model for time series data. We
            formalise it differently. For reference purpose:
          `,
          text.ul(
            doc.li`Let ${doc.b`X`} refer to the collection of all independent variables for all time periods.`,
            doc.li`Let ${doc.b`xₜ`} refer to the set of independent variables in period ${doc.b`t`}.`,
          ),
        ),
        container(
          doc.h4`TS.2 No Perfect Collinearity`,
          doc.p`This is also identical to the equliviant MLR assumption.`,
        ),
        container(
          doc.h4`TS.3 Zero Conditional Mean`,
          todo({}, 'insert math for TS3'),
          doc.p`
            This is also similar to the equliviant MLR assumption,
            however emphasis is place on all time periods.
          `,
        ),
        ref({ page: 342 }, doc.h3`The Variances of the OLS Estimators and the Gauss-Markov Theorem`),
        note(),
        ref({ page: 344 }, doc.h3`Inference under the Classical Linear Model Assumptions`),
        note(),
      ),
      container(
        infobox({ title: 'TS Assumptions' }).of(
          text.ol(
            doc.li`Linear in Parameters`,
            doc.li`No Perfect Collinearity`,
            doc.li`Zero Conditional Mean`,
            doc.li`Homoskedasticity`,
            doc.li`No Serial Correlation`,
            doc.li`Normality`,
          ),
        ),
        doc.dl(
        ),
      ),
    ),
  ),
));

export const functionalFormDummyVariables = createDoc(() => container(
  ref({ page: 345 }, doc.h2`Functional Form, Dummy Variables, and Index Numbers`),
  dashbox(
    twoThree(
      container(
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const trendsAndSeasonality = createDoc(() => container(
  ref({ page: 351 }, doc.h2`Trends and Seasonality`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 351 }, doc.h4`Characterizing Trending Time Series`),
        note(),
        ref({ page: 354 }, doc.h4`Using Trending Variables in Regression Analysis`),
        note(),
        ref({ page: 356 }, doc.h4`A Detrending Interpretation of Regressions with a Time Trend`),
        note(),
        ref({ page: 357 }, doc.h4`Computing R-Squared When the Dependent Variable Is Trending`),
        note(),
        ref({ page: 358 }, doc.h4`Seasonality`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));
