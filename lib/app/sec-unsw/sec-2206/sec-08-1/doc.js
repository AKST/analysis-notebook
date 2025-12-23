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
  spuriousRegressions: text.a({ href: 'https://www.tylervigen.com/spurious-correlations' }),
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
      doc.h1.c(
        'Basic Regression Analysis with Time Series Data', doc.br(),
        doc.small.css({ color: '#aaaaff' }).t`ECON2206, W8, Lecture 1`,
      ),
    ),
    infobox({ title: 'Resources' }).c(
      text.ul(
        doc.li`Chapter 10 of the textbook.`,
        doc.li.c(LINKS.spuriousRegressions.t`Spurious regressions`),
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
            Generally, ${text.b`because the outcomes of our variables are
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
          Sometimes called a ${text.b`times series process`}, this
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
            ${text.b`FDL of order 2`} references at most 2 periods
            ${text.ul(
              doc.li`The above example is an example of FDL 2`,
              doc.li`FDL of order 2 can reference the current, last, and last last period.`,
              doc.li`If it had a variable with a subscript of ${text.b`t-3`}, then it would be FDL of order 3`,
            )}
          `,
        ),
        doc.p`The difference between a ${text.b`horizon`} and the ${text.b`LRP`}:`,
        text.ul({ itemSpace: 'sparse' }).c(
          doc.li`
            ${text.b.c(text.b`horizon`)}: This is the effect after a permanent ${text.b`1 unit change`}
            after h periods.
          `,
          doc.li`
            ${text.b.c(text.b`LRP`)}: This is the effect after a permanent ${text.b`change of any value`}
            after h periods.
          `,
        ),
        doc.blockquote`
          Several terms have been given explaination on the side.
        `,
        doc.p`
          Often the is substantial correlation in z at different
          lags resulting in multicollinearity leading to
          difficulty in obtaining precise estimates of the
          different iterations of the δⱼ.
        `,
        ref({ page: 338 }, doc.h3`A Convention about the Time Index`),
        doc.p`
          When models have lagged explanatory variables, confusion can
          arise concerning the treatment of initial observations. The
          convention followed here will be that these are the initial
          values in our sample, so that we can always start the time
          index at ${text.b`t = 1`}. In practise this isn't too
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
        infobox({ title: 'Example of static models' }).c(
          text.ul(
            doc.li`The phillips curve`,
          ),
        ),
        doc.dl(
          doc.dt`δ₀ Impact Multiplier`,
          doc.dd`
            In a finite distributed lag model, the
            coefficient referring to the current
            period is the ${text.b`impact propensity`}
            or ${text.b`impact multiplier`}, given it
            is the immediate effect on the dependent
            variable.
          `,
          doc.dt`δⱼ Lag distributor`,
          doc.dd`
            ${text.b`δⱼ`} is a function of ${text.b`j`} which
            takes the period and returns the effect.
          `,
          doc.dt`LRP`,
          doc.dd`
            ${text.b`Long run propensity`} or long run multiplier, this
            is when there's no further changes in a variable
            with a ${text.b`Lag distributor`}. E.g.${doc.br()}
            ${doc.br()}
            ${text.b`z(δ₀ + δ₁ + δ₂)`}
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
            h periods after a permanent ${text.b`one-unit`}
            increase in x given:${doc.br()}
            ${doc.br()}
            ${text.b`x(δ₀ + δ₁ + δ₂)`}

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
        doc.p`Time series OLS is unbias under TS.1, TS.2 & TS.3`,
        doc.h4`TS.1 Linear in Parameters`,
        container(
          mathml.assumption.ts1,
          doc.p`
            This is more or less the same as MLR, but since we
            are specifying a linear model for time series data. We
            formalise it differently. For reference purpose:
          `,
          text.ul(
            doc.li`Let ${text.b`X`} refer to the collection of all independent variables for all time periods.`,
            doc.li`Let ${text.b`xₜ`} refer to the set of independent variables in period ${text.b`t`}.`,
          ),
        ),
        container(
          doc.h4`TS.2 No Perfect Collinearity`,
          doc.p`This is also identical to the equliviant MLR assumption.`,
        ),
        container(
          doc.h4`TS.3 Zero Conditional Mean`,
          doc.blockquote`Require our explanator variables to be ${text.b`strictly exogenous`}.`,
          mathml.assumption.ts3.strictlyExogenous,
          doc.p`
            This is also similar to the equliviant MLR assumption, but slightly
            different.
          `,
          text.ul({ itemSpace: 'sparse' }).c(
            doc.li`
              ${text.b`MLR.4`}: for observation i, u${doc.sub`i`}
              should not correlate with an explanatory variable
              from that obsevation.
            `,
            doc.li`
              ${text.b`TS.3`}: for period t, u${doc.sub`t`} should
              not correlate an explanatory variable,
              ${text.b`from any period`}.
            `,
          ),
          doc.p`
            Generally explanatory variables need to be strictly exogenous so
            they cannot react to what has happened to y in the past (technically
            also the future but in practise this isn't something we need to be
            worried about unless we make some weird assumptions we can't even
            measure).
          `,
          doc.p`
            ${text.b`The reason for this difference`} is the fact is
            MLR assumes all observation are independent as result of based
            random sampling, our observations are absolutely not independent
            and almost always dependent on each other. Due to the very nature
            of times series we can not address this correlation problem via
            independence as a result of random sampling, due to the time nature
            of our observations our data can almost never be independent. So
            this shifts the responsibility of addressing this independence
            problem into our zero conditional mean assumption.
            ${text.b`Hence we need strict exogenity`}. When we only do it at
            the period level we call this ${text.b`Contemporaneously Exogenous`}.
          `,
          mathml.assumption.ts3.contemporaneouslyExogenous,
          doc.p`However there are some similarities:`,
          text.ul(
            doc.li`This requires us to specify the correct functional form.`
          ),
          infobox({ title: 'u correlated with xⱼ' }).c(
            doc.p`In practise:`,
            text.ul(
              doc.li`Present ${text.b`uₜ`} will not be correlated with past ${text.b`xⱼₜ`}`,
              doc.li`Present ${text.b`uₜ`} will almost correlate with future ${text.b`xⱼₜ`}`,
            ),
          ),
          doc.blockquote`
            ${text.b`TS.3`} is fairly unrealistic in practise, but we need to
            state it and be mindful of it and take steps to minimise
            violations of it.
            In the minimisation of coefficents in the OLS objective function
            the mathetmatical constraint assumes there is no correlation (it
            would be impossible to do otherwise as we have not observed the
            value), so while we might accept it isn't the case the mathematics
            does not so we need to be taking steps to minimise it (if not remedy
            it) where possible.
          `,
        ),
      ),
      container(
        infobox({ title: 'TS Assumptions' }).c(
          text.ol(
            doc.li`Linear in Parameters`,
            doc.li`No Perfect Collinearity`,
            doc.li`Zero Conditional Mean`,
            doc.li`Homoskedasticity`,
            doc.li`No Serial Correlation`,
            doc.li`Normality`,
          ),
        ),
        infobox({ title: 'Assumptions for unbiasness' }).c(
          text.ol(
            doc.li`Linear in Parameters`,
            doc.li`No Perfect Collinearity`,
            doc.li`Zero Conditional Mean`,
          ),
        ),
        doc.dl(
          doc.dt`Contemporaneously exogenous`,
          doc.dd`When TS.3 holds at an observation level we call our explanatory variables this.`,
          doc.dt`Strictly exogenous`,
          doc.dd`When TS.3 holds generally we call our explanatory variables this.`,
          doc.dt`Serial Correlation`,
          doc.dd`
            This is also called ${text.b`Auto-Correlation`}, it is
            when our errors are correlated across time.
          `,
        ),
        infobox({ title: "Theorum: unbiasness of OLS" }).c(
          doc.p`
            Under TS.1-3, the OLS estimators are unbiased
            conditional on ${text.b`X`} and therefore
            unconditionally as well as when:${doc.br()}
            ${doc.br()}
            ${text.b`E(β̂ⱼ) = βⱼ, j ∈ {0, 1, ..., k}`}
          `,
        ),
        infobox({ title: "Theorum: Unbiased Esimation of σ²" }).c(
          doc.p`
            Under TS.1-5, the estimator σ̂² = SSR/df is an
            unbiased estimator of σ² where:${doc.br()}
            ${text.b`df = n - k - 1`}.
          `,
          doc.h4`In FDL`,
          doc.p`
            In an FDL model, lag distributors are highly
            likely to be correlated because it isn't
            uncommon for them to be the same value alot
            of the time.
          `,
        ),
        infobox({ title: "Theorum: Guass-Markov Theorum" }).c(
          doc.p`
            Under TS.1-5, OLS estimators are the best linear
            unbiased estimators on ${text.b`X`}.
          `,
        ),
        infobox({ title: "Normal Sampling Distribution" }).c(
          doc.p`
            ${text.b`Theorum`}: Under TS.1-6, the CLM assumptions for time series, the OLS
            estimators are normally distributed, conditional on X.
            Usage contruction of t & F statistics are valid and have
            their respective distribution (t & F distributions). CI's
            are also valid.
          `,
        ),
      ),
    ),
    container(
      ref({ page: 342 }, doc.h3`The Variances of the OLS Estimators and the Gauss-Markov Theorem`),
      container(
        doc.h4`TS.4 Homoskedasticity`,
        doc.blockquote`Variance of unobservables is constant over time`,
        twoColumns(
          container(
            doc.p`
              This is similar to MLR.5, but like TS.3 being
              similar to MLR.4. Really what we are saying is
              the variance of our observable are constant over
              time.
            `,
            doc.p`
              This can be false sometimes when there's some kind
              of instutional reform of regulatory change which
              affect variance of our explanatory variables.
            `,
          ),
          mathml.assumption.ts4.def,
        ),
        doc.p`
          We can reuse the heteroskedascity tests from eariler
          chapters.
        `,
      ),
      container(
        doc.h4`TS.5 No Serial Correlation`,
        twoColumns(
          container(
            doc.p`
              This is largely saying that our unobservable are
              not correlated on previous unobservables. The
              reason this isn't explictly stated as an assumption
              for MLR is because under random sampling there's
              no reason to really expect it as its only a problem
              with time series data.
            `,
            doc.p`
              When this is false we say our errors suffer from
              ${text.b`serial correlation`}, it means our errors
              are correlated across time.
            `,
          ),
          mathml.assumption.ts5.def,
        ),
        doc.hr(),
        twoColumns(
          container(
            doc.p`
              The equation on the right is how we assume variance in time
              series data, its actually the same theorum we use for cross
              sectional data. So no need to examine it to spot the difference
              its the same. But it warrants repeating.
            `,
          ),
          mathml.assumption.theorum.samplingVariance
        ),
      ),
    ),
    container(
      ref({ page: 344 }, doc.h3`Inference under the Classical Linear Model Assumptions`),
      twoThree(
        doc.p`
          Assumption TS.6 implies TS.3-5, and it is the strongest assumption.
          It implies independence and normality, our standar errors,
          t statisitics, F statistics, etc. Operate as they did under
          MLR. However the classical linear model assumptions for time series
          data are much more restrictive than those for cross-sectional data.
        `,
        infobox({ title: 'TS.6 Normality' }).c(
          doc.p`
            The errors uₜ are independent of X and are independently and
            identically distributed as ${text.b`Normal(0, σ²)`}.
          `,
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
        doc.p`
          All of what we learnt in terms of functional forms in MLR apply
          for time series regressions. However alot of emphasis is placed
          on the value on the log of either the dependent variable or
          the explantory variables.
        `,
        doc.h4`dummy variables`,
        doc.p`
          These are useful for event indicators.
        `,
      ),
      container(
        doc.dl(
          doc.dt`short-run elasticity`,
          doc.dd`
            In a log log FDL model this is just
            the ${text.b`immediate propensity`} δ₀.
          `,
          doc.dt`long-run elasticity`,
          doc.dd`
            In a log log FDL model this is just
            the ${text.b`long run propensity`}.
          `,
        ),
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
        doc.dt`Time Trend`,
        doc.dd`The tendency for data to follow a directional trend over time.`,
        doc.dt`Exponential trend`,
        doc.dd`A trend where a series grows protional to previous periods.`,
        doc.dt`CAGR`,
        doc.dd`constant average growth rate`,
        doc.dt`growth rate`,
        doc.dd`
          ${mathml.growthRate}
        `,
        doc.dt`spurious regression problem`,
        doc.dd`
          The challenge of finding a relationship between
          two or more trending variables simply because
          each is growing over time.
        `,
        doc.dt`detrending`,
        doc.dd`
          The removal of a trend from a dataset.
        `,
        doc.dt`Linear Detrended`,
        doc.dd`
          Often annontated with ${text.b`Umlaut`} like so ${text.b`ÿ`}.
        `,
        doc.dt`Seasonality`,
        doc.dd`Exhibting a trend over a period`,
        doc.dt`Seasonally adjusted`,
        doc.dd`The removal of seasonality`,
      ),
    ),
  ),
));
