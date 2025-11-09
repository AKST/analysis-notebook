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
    book: page != null ? ({ chapter: 9, page }) : undefined,
    lec: slide != null ? ({ id: [7, 'Th'], slide }) : undefined,
  }, item)
);

const LINKS = {
  paper: {
    ramsey1969: text.a({ href: 'https://www.jstor.org/stable/2984219' }),
    mizon1986: text.a({ href: 'https://www.jstor.org/stable/1911313' }),
    davidson1981: text.a({ href: 'https://www.jstor.org/stable/1911522' }),
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
        'More on Specification and Data Issues', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W7, Lecture 1']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      doc.p`See here for resources relating to the lesson`,
      text.ul(
        doc.li.of(LINKS.paper.ramsey1969`Ramsey 1969, specification errors`),
      ),
    ),
  ),
));

export const functionalFormMisspecification = createDoc(() => container(
  ref({ page: 295 }, doc.h2`Functional Form Misspecification`),
  dashbox(
    twoThree(
      container(
        doc.p`Examples of functional form mispecification:`,
        text.ul(
          doc.li`Omitting independent Variables.`,
          doc.li`Log(y) as the dependent variable, when it should be y.`,
        ),
        doc.p`
          When the founctional form of a model has been mispecified we cannot
          obtain unbiased or consistent esimators for our coefficients.
        `,
        doc.h4`Testing for mispecification`,
        doc.p`
          An ${doc.b`F Test`} is already one such example we have to
          testing mispecified founctional form, in that it allows us
          to test for ${doc.b`join exclusion restrictions`}. However
          it is limited to making comparison with between a model and
          its superset. This Provides no help when the dependent
          variable has been incorrectly logged.
        `,
        ref({ page: 297 }, doc.h3`RESET as a General Test for Functional Form Misspecification`),
        doc.p`
          Narrowing the exact reason for a functional form mispecification
          can be difficult. The ${doc.b`RESET test`} is one such tool at our
          disposal in approaching this problem. ${doc.b`The general idea
          behind RESET is`}:
        `,
        text.ul(
          doc.li.of(doc.i`
            For any model that satifies MLR 4, no nonlinear functions
            of independent variables should be significant when added
            to the equation.
          `),
          doc.li`
            If the opposite is true, and they are significant, well
            then we've detected a mispecification.
          `,
        ),
        doc.p`
          You can test the above by adding squared and cubed versions
          of your all explanatory variables, and checking if they are
          significant. While the above works, it has the drawback of
          using many degrees of freedom. However we can do a similar
          trick to the one seen in the simplified ${doc.b`white test`}
          where we squared and cubed version of our fitted values (ŷ²
          and ŷ³)
        `,
        doc.h4`Notable Implementation Decision`,
        doc.p`
          Note, there isn't actually a right or wrong answer on
          how many fited values to include in the expanded
          regression, however squared and cubed is probably
          fine in most cases. But it's worth stressing the
          fact, that can add any number of nonlinear variants.
        `,
        doc.h4`Example`,
        doc.p`Take this model for example:`,
        mathml.reset.models.original,
        doc.p`Our variant for attempting the RESET test looks like this:`,
        mathml.reset.models.resetVariant,
        doc.p`And we test it like so:`,
        mathml.reset.hypothesis.null,
        doc.h4`Testing`,
        doc.p`Testing can be either performed with:`,
        text.ul(
          doc.li`
            An F Statistic (with a df of ${doc.b`n - k - 3`}),
            where a significant F statistic suggests some
            sort of functional problem.
          `,
          doc.li`
            You can alo test with an LM statistic using a 𝜒²
            distribution (with a df of 2).
          `,
        ),
        doc.h4`Some drawbacks`,
        text.ul(
          doc.li`
            One drawback of this kind of test is it doesn't
            really provide you any sense of direction on where
            next to proceed once a model is reject.
          `,
          doc.li`
            No real ability for detecting omitted variables.
          `,
          doc.li`
            No real ability for detecting heteroskedacity.
          `,
        ),
        doc.p`
          Ultimately this is fine as we have other ways to
          think about those problems. Just remember that
          RESET is just a functional form test and nothing
          more.
        `,
      ),
      container(
        doc.dl(
          doc.dt`Functional Form Misspecification`,
          doc.dd`
            A multiple regression model suffers from functional form
            misspecification when it does not properly account
            for the relationship between the dependent and the observed
            explanatory variables.
          `,
        ),
        infobox({ title: "Adding Quadratics" }).of(
          doc.p`
            Using logarithms/quadratics of various variables is quite
            useful for detecting many nonlinear relationships in
            economics. However excess can be sympotomatic of other
            functional forms problems.
          `,
        ),
        doc.dl(
          doc.dt`RESET`,
          doc.dd`
            RESET stands for ${doc.b`Regression Specification
            Error Test`}, and it was originally designed by
            ${LINKS.paper.ramsey1969`Ramsey`} published in his
            1969 paper.
          `,
        ),
        infobox({ title: "ŷ² and ŷ³ as nonlinear functions" }).of(
          mathml.nonlinearFittedValues.ySquared,
          mathml.nonlinearFittedValues.yCubed,
        ),
        doc.dl(
          doc.dt`df`,
          doc.dd`Degrees of Freedom`,
        ),
      )
    ),
    container(
      ref({ page: 298 }, doc.h3`Tests against Nonnested Alternatives`),
      doc.p`
        What about when there's no overlap between two models
        you're testing? As in a nonnested model?
      `,
      mathml.nonnested.example,
      doc.p`
        One method is the one divised by ${LINKS.paper.mizon1986`Mizon
        and Richardson (1986)`} where you assemble a comprehensive model,
        and use one models coefficients for the null hypothesis.
      `,
      mathml.nonnested.mizon,
      doc.p`
        The above approach has a familar problem with a familar
        solution, being the number of degrees of freedom. And the
        answer to that is the ${LINKS.paper.davidson1981`davidson
        mackinnon test`} (note ŷ ≠ y̌).
      `,
      twoColumns(
        mathml.nonnested.davidson.model,
        mathml.nonnested.davidson.assumption,
      ),
      doc.quote`
        Note there's no reason you can't do it the other way around
        and place the fitted values of the nonlog model in the log model.
      `,
      doc.p`
        To test we just check if 𝜃₁ has a singificant t statistic
        (two sided test) to reject the model in which the fitted
        value was added. ${doc.b`It's worthwhile doing both`}, as
        it's possible no clear winner emerges with both model
        rejected or neither models are rejected. ${doc.b`If neither
        are rejected`}, often the R² is used to decide between the
        two.
      `,
      doc.quote`
        Also note when there is a clear winner with the Davidson-Macinnon
        Test, it does not necessarily mean that model is correct.
      `,
    ),
  ),
));

export const usingProxyVariables = createDoc(() => container(
  ref({ page: 299 }, doc.h2`Using Proxy Variables for Unobserved Explanatory Variables`),
  dashbox(
    twoThree(
      container(
        doc.p`
          Proxy variables are typically used in cases where measuring the desired
          variable is not possible, but there is another variable that is a
          highly correlated with (or at least is belived to be highly correlated
          with it).
        `,
        doc.quote`
          The text I am reading from unforunately uses IQ as an example of a
          substitute for measuring a vague concept like ability. I personally
          don't think the concept of IQ is particularlly credible, but if you
          see if used here just know it's not an endorsement by me or anything.
        `,
        doc.p`
          In order that we produce unbias estimators we need to
          at least make sure that the following hold.
        `,
        text.ol(
          doc.li`
            Like with many other models we require for the error term to
            not be correlated with any of our independent variables.
          `,
          doc.li`
            ${doc.b`v`} in the hypothetical model for deriving
            ${doc.b`x₃*`} (shown below0 is not correlated with any of
            the dependent variables either.
          `,
        ),
        doc.p`Stated as:`,
        mathml.proxy.assumption,
        doc.p`
          If these above assumptions are violated we can expect
          bias in our proxy variables. All said this is how we
          understand the proxy variable to relate unobservable
          variable.
        `,
        mathml.proxy.solve,
        doc.h4`When the assumption is violated`,
        doc.p`
          Say our proxy variable relates to all our dependent
          variables? Well this leads to multicollinearity, however
          it still reduces the error variance if it removes the
          removes the part explained by the unobservable variable
          from the error. Secondarly the added multicollinearity is
          a necessary evil to get an estimator with less bias of
          all other variables.
        `,
      ),
      doc.dl(
        doc.dt`Proxy Variable`,
        doc.dd`
          This is when we substutiute a variable we cannot
          measure for one that we can that we believe is
          a good enough substitute.
        `,
        doc.dt`plug-in solution to the omitted variables problem`,
        doc.dd`
          This when we pretend a proxy variable and the variable
          it replaces are the same things.
        `,
      ),
    ),
    container(
      ref({ page: 303 }, doc.h3`Using Lagged Dependent Variables as Proxy Variables`),
      doc.quote`Using a lagged dependent variable in a cross-sectional equation increases the data requirements`,
      doc.p`
        In such cases, we can include, as a control, the value of the
        dependent variable from an earlier time period. This is
        especially useful for policy analysis. But it also provides a
        simple way to account for historical factors that cause current
        differences in the dependent variable that are difficult to
        account for in other ways. ${doc.b`Inertial effects`} are also
        captured by putting in lags of y.
      `,
      note(),
      ref({ page: 304 }, doc.h3`A Different Slant on Multiple Regression`),
      doc.p`
        Until now, we have specified the population model of interest
        with an additive error. When we are unable to observe one of
        those variables we condider a proxy variable. However a less
        structured, more general approach to multiple regression is
        to forego specifying models with unobservables. Rather, we
        begin with the premise that we have access to a set of
        observable explanatory variables.
      `,
      doc.p`
        The difference now is that we set our goals more modestly, we
        are not longer trying to measure a nebalous crtieria. While we
        may not be answering a question relating to an underlying
        plantonic equation, we are answering a question of interest
        relating to what we can measure.
      `,
      ref({ page: 305 }, doc.h3`Potential Outcomes and Proxy Variables`),
      twoThree(
        text.ul(
          doc.li`
            The notion of proxy variables can be related to the
            potential outcomes framework.
          `,
          doc.li`
            The notion of proxy variables can be related to the
            potential outcomes framework
          `,
        ),
        mathml.potentialOutcomes.example,
      ),
      mathml.potentialOutcomes.conditionalExpectations,
      todo({}, 'reread and complete notes'),
    ),
  ),
));

export const modelsWithRandomSlopes = createDoc(() => container(
  ref({ page: 306 }, doc.h2`Models with Random Slopes`),
  dashbox(
    todo({}, 'This chapter was really confusing, I need to reread'),
  ),
));

export const olsUnderMeasurementError = createDoc(() => container(
  ref({ page: 308 }, doc.h2`Properties of OLS under Measurement Error`),
  dashbox(
    container(
      doc.p`
        Measurement error generally occurs from slopy or misreported
        information. Like when someone is filling out a complusorary
        survey and they're pulling a number from memory (like regular
        grocery spending).
      `,
      text.ul({ className: 'c2', style: 'grid-gap: 32px' })(
        doc.li`
          When we use an imprecise measure of an economic variable in a
          regression model, then our model contains measurement error
        `,
        doc.li`
          OLS will be consistent under certain assumptions, but there are
          others under which it is inconsistent. In some of these cases,
          we can derive the size of the asymptotic bias.
        `,
      ),
      doc.h4`Differences with Proxy Variables`,
      doc.p`
        There are similar statistical structure to the omitted variable–proxy
        discussed above. Obviously they are conceptually different when you
        consider the origin of these errors, even so — ${doc.i`perhaps there's a temptation to
        consider them close enough to each other that they can be treated
        identically`}?
      `,
      doc.p`
        This would be a mistake, ${doc.b.of(doc.b`its worth stressing
        ${doc.i`two`} ways in which how the nature of these two things are
        fundermentally different`)}:
      `,
      text.ol({ className: 'c2', style: 'grid-gap: 32px' })(
        doc.li`
          With ${doc.b.of(doc.b`Proxy Variables`)}, we are looking for a
          variable that is somehow associated with the unobserved variable.
          With ${doc.b.of(doc.i`Measurement Error`)}, the variable that we
          do not observe has a well-defined, quantitative meaning (such as
          a marginal tax rate or annual income), but our recorded measures
          of it may contain error.
        `,
        doc.li`
          With ${doc.b.of(doc.i`Measurement Error`)} the primary thing of
          interst is  mismeasured independent variable. However with
          ${doc.b.of(doc.b`Proxy Variables`)}, the partial effect of the
          omitted variable is rarely of central interest, as we are
          usually more concerned with the effects of the other independent
          variables. The goal of a ${doc.b.of(doc.b`Proxy Variables`)} is
          typically to control for the effect of the unobserved variable.
        `,
      ),
      doc.p`
        In summary, ${doc.b.of(doc.i`one is a subsitute for what we like to
        measure`, ' ', doc.b`the other is a poor measurment of what we would
        like to measure`)}.
      `,
    ),
    ref({ page: 308 }, doc.h3`Measurement Error in the Dependent Variable`),
    twoThree(
      container(
        doc.quote`y* is not measured instead we have y`,
        mathml.measurementError.model.dependentVar,
        doc.p`
          Measurement error in the dependent variable can cause biases in OLS
          if it is systematically related to one or more of the explanatory
          variables. If the measurement error is just a random reporting error
          that is independent of the explanatory variables, as is often assumed,
          then OLS is perfectly appropriate.
        `,
        mathml.measurementError.model.dependentVarControlled,
        doc.p`
          So one assumptions we would like to make is the ${doc.b`measurement
          error has zero mean`}, which would satisify the zero conditional mean
          assumption for MLR. If this isn't the case we'd simply get an biased
          estimator of the intercept (𝛽₀). However assumption being incorrect
          seems to rarely be a cause for concern. It allows us of more more
          concern is the relationship between the measurement error (e₀) and
          the explanatory variables (xⱼ).
        `,
        doc.p`
          When its the case that measurement error is uncorrelated with the
          independent variables, we can rest assure that our OLS estimations
          have good properties.
        `,
        mathml.measurementError.assumption.depVarErrorUnrelatedToExplanatoryVar,
        doc.p`
          When e₀ and u are uncorrelated, we usually make this assumption,
          which mostly means there is greater variance then when no error
          occurs, and larger standard errors for our estimators. There's
          nothing we can do about this other than collecting better data.
        `,
      ),
      container(
        doc.dl(
          doc.dt`Measurement error`,
          doc.dd`
            defined as the difference between the observed
            value and the actual value
          `,
        ),
        mathml.measurementError.error.dependentVar,
        mathml.measurementError.error.dependentVarRandomDraw,
        infobox({ title: 'On error zero mean assumption' }).of(
          doc.p`
            As far as I can tell, there does not really seem
            to be an evidence reinforcing this assumption other
            than an appeal to concequences... I guess the text
            is saying we don't need to worry about this usually
            but I'm guessing its implied that we should use our
            judgment when there's reason to think errors are
            more likely to be over or under estimated.
            Which I guess has to be an educated guess based on
            the dependent variable.
          `,
        ),
        doc.dl(
          doc.dt`Multiplicative measurement error`,
          doc.dd`
            This is when the measurement erorr is on
            a dependent variable which is logarithmic.
          `,
        ),
        mathml.measurementError.error.dependentVarLog,
      ),
    ),
    ref({ page: 310 }, doc.h3`Measurement Error in an Explanatory Variable`),
    twoThree(
      container(
        doc.quote`x* is not measured instead we have x`,
        doc.p`
          Measurement error in an explanatory variable has been considered
          a much more important problem than measurement error in the
          dependent variable. Lets start with this model where we annotate
          the measurement error:
        `,
        mathml.measurementError.model.explanatoryVar,
        doc.p`
          We start by assuming it satisifies the first 4 Causs-Markov
          assumptions, so OLS produced unbias consistent estimators of
          our slope and intercept. Let eⱼ be the error between our
          ${doc.b`plantonic variable`} and the ${doc.b`measured variable`}.
          We also assume a mean measurement error of zero in the population.
        `,
        twoColumns(
          mathml.measurementError.assumption.expErrMean,
          mathml.measurementError.assumption.expErrMeanImplication,
        ),
        doc.p`From here however there are 2 scenarios we need to consider:`,
        text.ol(
          doc.li`
            measurement error of zero correlates ${doc.b`observed`} value
          `,
          doc.li`
            measurement error of zero correlates ${doc.b`unobserved`} value
          `,
        ),
        twoColumns(
          mathml.measurementError.assumption.expErrCoVarA,
          mathml.measurementError.assumption.expErrCoVarB,
        ),
      ),
      container(
        mathml.measurementError.error.explanatoryVar,
        doc.quote`
          eⱼ can either be positive or negative.
        `,
        doc.dl(
          doc.dt`Attenuation bias`,
          doc.dd`
            When the estimated OLS effect is attenuated
          `,
          doc.dt`CEV`,
          doc.dd`
            ${doc.b`classical errors-in-variables`}, which is
            the assumption that the measurement error is
            uncorrelated with the unobserved explanatory variable.
          `,
        ),
      ),
    ),
    doc.h4`When Covar(eⱼ, xⱼ) = 0`,
    container(
      doc.p`When this assumptions hold, our model takes this form:`,
      mathml.measurementError.assumption.expErrCoVarAImplication,
      mathml.measurementError.model.explanatoryVarSolved,
      doc.p`What this means:`,
      text.ul(
        doc.li`Estimator will be bias`,
        doc.li`But estimator will be consistent`,
      ),
      mathml.measurementError.assumption.expErrCoVarA2,
      doc.p`
        This is the best case as its a more desirable outcome.
        Despite measurement increasing the error variance, it
        does not affect any of the properties of OLS. Besides
        a variance in 𝛽̂ⱼ than what we would otherwise get when
        observing xⱼ* directly.
      `,
    ),
    doc.h4`When Covar(eⱼ, xⱼ*) = 0`,
    container(
      doc.p`
        Because the other assumption implies OLS has nice
        properties it is of less concern. This assumption
        suggests the measurement error is uncorrelated with
        the unobserved explanatory variable:
      `,
      mathml.measurementError.assumption.expErrCoVarB2,
      doc.p`All this implies:`,
      mathml.measurementError.assumption.expErrCoVarB3,
      doc.p`
        Because u and xⱼ are uncorrelated, the covariance
        between xⱼ and the composite error is:
      `,
      mathml.measurementError.cev.covariance,
      doc.p`
        As a result OLS gives us a biased and inconsistent estimator:
      `,
      mathml.measurementError.cev.plim,
      doc.p`
        Given the above 𝛽̂ⱼ is always closer to zero than 𝛽ⱼ which
        gives us an ${doc.b`attenuation bias`} due to ${doc.b`CEV`}.
        So on average estimated OLS effect will be attenuated. So
        if 𝛽ⱼ is positive, 𝛽̂ⱼ will tend to underestimate 𝛽ⱼ.
        Things get more complicated when we add more explanatory
        variables, ${doc.b`all our estimators will end up with
        bias not just 𝛽̂ⱼ`}.
      `,
      mathml.measurementError.cev.r,
      mathml.measurementError.cev.plimSimplified,
    ),
    doc.h4`Word of Warning`,
    doc.p`
      Measurement error can be present in more than one explanatory
      variable, or in some explanatory variables and the dependent
      variable.
    `,
  ),
));

export const missingDataAndOutliers = createDoc(() => container(
  ref({ page: 313 }, doc.h2`Missing Data, Nonrandom Samples, and Outlying Observations`),
  dashbox(
    twoThree(
      container(
        ref({ page: 313 }, doc.h3`Missing Data`),
        doc.p`
          When data is missing at random, a common “solution” is to create
          two new variables. For a unit i the first variable, say
          ${doc.b`Z${doc.sub`ik`}`}, is defined to be ${doc.b`x${doc.sub`ik`}`}
          when ${doc.b`x${doc.sub`ik`}`} is observed, and zero otherwise.
          The second variable is a “missing data indicator,” say
          ${doc.b`m${doc.sub`ik`}`}, which equals one when
          ${doc.b`x${doc.sub`ik`}`} is missing and equals zero when
          ${doc.b`x${doc.sub`ik`}`} is observed. It looks something like this:
        `,
        mathml.missingData.regression,
        doc.p`
          This only works when data is missing completely at random (MCAR)
          and there isn't some kind of condition that correlates with the
          data as to why its missing. As a result MCAR is a fairly strong
          assumption, and unforunately not something we can reasonably
          count in reality.
        `,
        ref({ page: 315 }, doc.h3`Nonrandom Samples`),
        doc.h4`Exogenous Selection`,
        doc.p`
          When data isn't missing at random this is called, it doesn't
          always led any kind of statistical problem, ${doc.b`exogenous
          sample selection`} is one such case where sample selection is
          based on an independent variable. While this is not ideal, we
          can still get unbiased and consistent estimators of the
          parameters in the population model, using the nonrandom sample.
        `,
        doc.p`
          The reason why, is that the regression function is the same for
          ${doc.b`E(y|x₁,⋯,xₖ)`} any subset of the population described by
          x₁, x₂, etc. Provided there is enough variation in the independent
          variables in the subpopulation, selection on the basis of the
          independent variables is not a serious problem, other than that it
          results in smaller sample sizes.
        `,
        doc.h4`Endogenous Selection`,
        doc.p`
          The situation is much different when selection is based
          on the dependent variable (y), which is generally called
          ${doc.b`endogenous sample selection`}. If the sample is
          based on whether the dependent variable is above or below a
          given value, bias always occurs in OLS in estimating the
          population model.
        `,
        todo({}, 'reread to identify scenarios where this isn\'t an issue'),
      ),
      doc.dl(
        doc.dt`complete cases estimator`,
        doc.dd`
           This is the term used to refere to an estimator that uses only
           observations with a complete set of data on its dependent and
           explanatory variables.
        `,
        doc.dt`MIM`,
        doc.dd`missing indicator method`,
        doc.dt`MCAR`,
        doc.dd`
          missing completely at random
        `,
        doc.dt`MAR`,
        doc.dd`
          missing at random, when data is only missing
          based on a independent variable as opposed
          to unobserved variables (u).
        `,
        doc.dt`Exogenous selection`,
        doc.dd`
          A violation of MCAR which doesn't lead to any
          serious statisical problems, when sample selection is
          based on the independent variables.
        `,
        doc.dt`Endogenous selection`,
        doc.dd`
          When sample selection is based on the dependent variable.
        `,
        doc.dt`stratified sampling`,
        doc.dd`
          The population is divided into nonoverlapping, exhaustive groups.
        `,
        doc.dt`Studentized residuals`,
        doc.dd`
          Obtained from the original OLS residuals by dividing them by an
          estimate of their standard deviation (they rely on matrix algebra).
        `,
      ),
    ),
    container(
      ref({ page: 317 }, doc.h4`Outliers and Influential Observations`),
      doc.p`
        Loosely speaking an observation is an influential observation if
        dropping it from the analysis changes the key OLS estimates
        by a practically “large” amount. The notion of an outlier is also a
        bit vague, because it requires comparing values of the variables for
        one observation with those for the remaining sample. Nevertheless, one
        wants to be on the lookout for “unusual” observations because they can
        greatly affect the OLS estimates.
      `,
      doc.p`
        OLS is susceptible to outlying observations because it minimizes the
        sum of squared residuals: large residuals (positive or negative) receive
        a lot of weight in the least squares minimization problem. If the
        estimates change by a practically large amount when we slightly modify
        our sample, we should be concerned.
      `,
      doc.p`
        Largely outlying observations can occur for two reasons.
      `,
      text.ol(
        doc.li`
          One scenario is when a mistake has been made in entering the data.
        `,
        doc.li`
          Outliers can also arise when sampling from a small population if one
          or several members of the population are very different in some
          relevant aspect from the rest of the population. The decision to keep
          or drop such observations in a regression analysis can be a difficult
          one, and the statistical properties of the resulting estimators are
          complicated.
        `,
      ),
      doc.p`
        OLS results should be reported with and without outlying observations
        in cases where one or several data points substantially change the
        results.
      `,
      todo({}, 'make sure I reread and make sure I haven\'t missed anything'),
    ),
  ),
));

export const leastAbsoluteDeviations = createDoc(() => container(
  ref({ page: 321 }, doc.h2`Least Absolute Deviations Estimation`),
  dashbox(
    doc.quote`LAD estimators are justified only in large samples.`,
    twoThree(
      container(
        mathml.lad.lad,
        doc.p`
           A different approach to guarding against outliers is to use
           an estimation method that is less sensitive to outliers than OLS,
           such as least absolute deviations (LAD). LAD estimates are not
           available in closed form, in that we can't write a formular
           for them.
        `,
      ),
      doc.dl(
        doc.dt`LAD`,
        doc.dd`least absolute deviations`,
      ),
    ),
    container(
      doc.h4`Drawbacks`,
      doc.p`
        Because LAD does not give increasing weight to larger residuals,
        it is much less sensitive to changes in the extreme values of the
        data than OLS. In fact, it is known that LAD is designed to
        estimate the parameters of the ${doc.b`conditional median`} of
        y given x₁, x₂, ⋯, xₖ rather than the conditional mean. Because the
        median is not affected by large changes in the extreme observations,
        it follows that the LAD parameter estimates are more resilient to
        outlying observations.
      `,
      doc.p`
        A more subtle but important drawback to LAD is that it does not
        always consistently estimate the parameters appearing in the
        conditional mean function ${doc.i`(Given the fact it is based on
        the conditional Median)`}. Generally, the mean and median are the
        same only when the distribution of y and its explanatory variables
        are symmetric.
      `,
      doc.p`
        When LAD and OLS are applied to cases with asymmetric distributions,
        the estimated partial effect of, say x₁, obtained from LAD can be
        very different from the partial effect obtained from OLS. When the
        population error u is independent of the explanatory variables
        then the OLS and LAD slope estimates should differ only by sampling
        error whether or not the distribution of u is symmetric.
      `,
      doc.p`
        Unfortunately, independence between the error and the explanatory
        variables is often unrealistically strong when LAD is applied.
        In particular, independence rules out heteroskedasticity, a
        problem that often arises in applications with asymmetric
        distributions.
      `,
      doc.h4`Advantage`,
      twoThree(
        container(
          doc.p`
            An advantage that LAD has over OLS is that, because LAD estimates
            the median, it is easy to obtain partial effects—and predictions
            using monotonic transformations.
          `,
          doc.h4`Technicalites`,
          doc.p`LAD is a special case of:`,
          text.ul(
            doc.li`
              ${doc.b`robust regression`}: In the statistics literature, a
              robust regression estimator is relatively insensitive to extreme
              observations.
            `,
            doc.li`
              ${doc.b`quantile regression`}: which is used to estimate the
              effect of the xⱼ on different parts of the distribution
              not just the median (or mean).
            `,
          ),
        ),
        mathml.lad.implication,
      ),
    ),
  ),
));
