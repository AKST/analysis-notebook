/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container, responsiveGridAutoRow } = prelude.layout;
const { text, clsRef, infobox, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

const LINKS = {
  conditionalProbability: text.a({ href: 'https://en.wikipedia.org/wiki/Conditional_probability' }),
};

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const w5Ref = ({ slide, page }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 7, page }) : undefined,
    lec: slide != null ? ({ id: [5, 'Tu'], slide }) : undefined,
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

export const intro = createDoc(() => container(
  twoThree(
    container(
      ['h1', [
        'Multiple Regression Analysis with Qualitative Info', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W5, Lecture 1']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      text.ul(
        doc.li`Chapter 7`,
      )
    ),
  ),
  w5Ref({ page: 220 }, doc.h2`Introduction`),
  dashbox(
    text.ul({ itemSpace: 'sparse' })(
      doc.li`
        The purpose of this section is to provide a comprehensive analysis of
        how to include qualitative factors into regression models
      `,
      doc.li`
        The ${doc.b`linear probability model`} (LPM) will be introduced which is a
        variant of multiple regression, where the coefficients can be
        interpreted as changes in a probability.
      `,
      doc.li`
        The simplicity of the LPM makes it useful in many empirical contexts,
        although it appears to be maligned by some econometricians.
      `,
    ),
  ),
));

export const describingQualitativeInformation = createDoc(() => container(
  w5Ref({ page: 221 }, doc.h2`Describing Qualitative Information`),
  dashbox(
    twoThree(
      container(
        text.ul({ itemSpace: 'sparse' })(
          doc.li`
            When we put a binary categorical variable in a model, we
            often decide which one is explictly specified as a parameter
            as the effects of the omitted one gets baked into the
            intercept. Specifying both causes multicolinary problems.
          `,
        ),
      ),
      doc.dl(
        doc.dt`Dummy Variable`,
        doc.dd`
          A binary variable, which is either zero or 1, it is used to
          demark the different qualitative states of a category variable.
        `,
      ),
    ),
  ),
));

export const aSingleDummyIndependentVariable = createDoc(() => container(
  w5Ref({ page: 222 }, doc.h2`A Single Dummy Independent Variable`),
  dashbox(
    twoThree(
      container(
        text.ul({ itemSpace: 'sparse' })(
          doc.li`When you have a single Categorical and quantative variable${text.ul(
            doc.li`The Categorical variable acts as intercept shift`,
          )}`,
        ),
        mathml.dummyEffects,
        doc.p`
          ${doc.b`𝛿₀`} represents the mean difference in the
          absense of presence of a dummy. A less abstract example
          might be the difference between man and women if the
          dummy was gender.
        `,
        w5Ref({ page: 226 }, doc.h4`Interpretation Coefficients with (log(y))`),
        text.ul({ itemSpace: 'sparse' })(
          doc.li`Coefficients have a percentage interpretation${text.ul({ itemSpace: 'sparse' })(
            doc.li`
              Holding all other factors Fixed, the coefficient on a dummy
              variable can be interpretded as a % difference (when multiplying
              by 100).
            `,
            doc.li`
              When the coefficient on a dummy variable suggests a large
              proportionate change in the dependent variable, the exact
              % difference can be obtained exactly as with the
              semi-elasticity calculation. ${mathml.semiElasticCalc}
            `,
          )}`,
        ),
      ),
      doc.dl(
        doc.dt`Intercept Shift`,
        doc.dd`
          The effect of the represense of a dummy variable and
          the value of its coefficient.
        `,
        doc.dt`Dummy Variable Trap`,
        doc.dd`
          Arises when too many dummy variables describe a given
          number of groups. A simple case of this is including
          both state of a categorical variable.
        `,
        doc.dt`Base Group`,
        doc.dd`
          This is the state of a binary variable baked into
          the intercept and not explictly specified as a
          variable.
        `,
      ),
    ),
  ),
));

export const dummyVariablesForMultiCategories = createDoc(() => container(
  doc.h2`Using Dummy Variables for Multiple Categories`,
  dashbox(
    twoThree(
      container(
        text.ul(
          doc.li`Say you have a model with 2 variables, ${doc.b`gender`} and ${doc.b`married`}.${text.ul({ itemSpace: 'sparse' })(
            doc.li`If you have a coefficient for married, can you assume it's the same for both genders?`,
            doc.li`One thing you can do is have a seperate variable for each permutation of these categories${text.ul(
              doc.li`And then you omit one of the permutations (like single men)`,
            )}`,
            doc.li`Another approach is to omit the intercept coefficent for each dummy${text.ol(
              doc.li`1st drawback of this is it more cumbersome to test for differences relative to a base group.`,
              doc.li`2nd drawback is some statitcal packages change how R-Squared is computed.`,
            )}`,
          )}`,
        ),
      ),
      doc.dl(
        doc.dt`Uncentererd R-Squared R₀²`,
        doc.dd`
          The R squared computed when the intercept is omitted.
          It is rarely suitable as a goodness of fit measure.
        `,
        doc.dt`Ordinal Variable`,
        doc.dd`This is categorical information with a meaningful ordering.`,
      ),
    ),
    container(
      w5Ref({ page: 230 }, doc.h4`Ordinal data as Dummy Variables`),
      text.ul(
        doc.li`
          Ordinal variables, such as a rating out of 1-5 may not make sense
          especaully if there are discrete criterias for movement between
          each value. Such as a credit score, which might reserve certain
          events to move to more extreme values.
        `,
      ),
      todo({}, 'write something about testing'),
    ),
  ),
));

export const dummyInteractions = createDoc(() => container(
  w5Ref({ page: 232 }, doc.h2`Interactions Involving Dummy Variables`),
  dashbox(
    twoThree(
      container(
        doc.p`
          Having interactions between multiple dumies is basically the
          same as creating seperate permutations for each dummy.
        `,
        doc.h4`Allowing for different slopes`,
        todo({}, 'content, write any notes'),
        doc.h4`Testing for differences in regression functions across groups`,
        mathml.dummySlopehypothesisTest,
        todo({}, 'content, write any notes'),
      ),
      doc.dl(
        doc.dt`Difference in slope`,
        doc.dd`
          This similar but different to shifting the intercept.
          It's more of a change in multiplier for the same
          quantative explanatory variable.
        `,
        doc.dt`Chow Test`,
        doc.dd.of(todo({}, 'define')),
        doc.dt`SSR F statistic`,
        doc.dd`
          ${todo({}, 'write meaning')}
        `,
      ),
    ),
  ),
));

export const binaryDependentVariable = createDoc(() => container(
  doc.h2`A Binary Dependent Variable: The Linear Probability Model`,
  dashbox(
    doc.quote`You may want to do this if you want to explain a ${doc.b`Qualitative event`}.`,
    twoThree(
      container(
        doc.p`
          ${doc.b`When the ${doc.i`dependent variable`} of a model is a ${doc.b`qualative
          variable`}, it takes on ${doc.i`only 2 values`}, being ${doc.b`zero`} or
          ${doc.b`one`}`}. One Interpretation of this is the model output acts as
          likilhood of an event occuring while the the inputs are the conditions
          (or determinants) for the probability, like in Conditional probability.
        `,
        mathml.conditionalProbability,
        doc.p`
          Given the possible values for the dependent value is 1 or 0, the
          ${doc.b`${doc.b`Coefficients`} cannot be interpreted as a one unit
          change in ${doc.i`x${doc.sub`j`}`} in the value of ${doc.i`y`}`}.
        `,
        mathml.lpmCoefficentInterpretation,
        doc.p`
          Given all this, we can continue to write our models
          as before, but this is something to keep in mind with
          interpretating the models outputs, and coefficients.
          Another thing to keep in mind ${doc.b`with correctly
          interpreting a linear probability model, we must know
          what ${doc.i`constitutes`} a ${doc.b`“success”`}`}.
          It also helps to give the dependent variable a name
          that describes an event occuring.
        `,
        doc.quote`
          To interpret the estimates, we must remember that a
          change in the independent variable changes the
          probability that ${doc.b`y = 1`}. These models are
          fairly easy to estimate and interpret.
        `,
      ),
      doc.dl(
        doc.dt`Conditional Probability`,
        doc.dd.of(doc.quote`
          ... ${LINKS.conditionalProbability`Conditional Probability`}
          is a measure of the probability of an event occurring, given
          that another event (by assumption, presumption, assertion or
          evidence) is already known to have occurred.
          [${doc.cite.of(doc.b`wikipedia, 2025-10-23`)}]
        `),
        doc.dt`Linear probability model (LPM)`,
        doc.dd`
          A linear regression model (multiple or singular)
          where the response value is the probablity.
        `,
        doc.dt`Response Probablility`,
        doc.dd`
          The response value of the a linear probablity model.
        `,
        doc.dt`Quantative Variable`,
        doc.dd`
          A variable that can be measured in continious
          or in discrete unit, but exists in terms of
          quantities.
        `,
        doc.dt`Qualitative Variable`,
        doc.dd`
          A variable that describes a quality of a
          characteristic which cannot be directly measured
          as a qunatity. Qualitative values can be ordinal
          with a natural ordering (e.g. properties with by
          number of bedrooms), and it can be without a
          natural ordering.
        `,
      ),
    ),
    doc.h4`Short comings of these models`,
    doc.p`
      Even with these problems, the linear probability model is
      useful and often applied in economics, but they are worth
      noting to understand their limitations:
    `,
    twoThree(
      text.ul({ itemSpace: 'sparse' })(
        doc.li`
          ${doc.b`We can get predictions either less than zero or greater than one`}:
          This is unideal as these are predicted probabilities, and probabilities must be between zero and one.
        `,
        doc.li`
          A related problem is that a probability cannot be linearly related to the
          independent variables for all their possible values.
        `,
        doc.li`
          LPM works well for values of the independent variables that are near the
          averages of the sample (Outliers from small samples will get extreme %'s).${(
            text.ul(
              doc.li`
                One such example is employability of women in the workforce, when 96%
                women have have zero or one child (in a sample at least), the effect of
                children may be over pronounced for anyone with 2 or more.
              `,
            )
          )}
        `,
      ),
      doc.dl(
        doc.dt`Precent correctly Predicted`,
        doc.dd`
          Let ŷᵢ denote the fitted values—which may not be bounded between zero
          and one. Define a predicted value as ${doc.b.of(doc.b`ỹᵢ = 1 if ŷᵢ ≥ .5 and ỹᵢ < .5`)}.
          Now we have a set of predicted values, ${doc.b.of(doc.b`ỹᵢ = { 1, ..., n }`)}
          that, like the yi, are either zero or one.
          ${doc.br()}${doc.br()}

          We can use the data on ${doc.b`yᵢ = 1 and yᵢ = 0`} as the proportion
          of overall correct predictions.
        `,
      ),
    ),
    doc.p`
      Due to the binary nature of y, the linear probability model does violate
      one of the Gauss-Markov assumptions. ${doc.b`When y is a binary variable,
      its variance, conditional on x`}, is:
      ${doc.br()}${mathml.lpmAssumptionViolation}${doc.br()}
      The implication is ${doc.b`heteroskedasticity`}.
    `,
  ),
));

export const policyAnalysis = createDoc(() => container(
  doc.h2`More on Policy Analysis and Program Evaluation`,
  dashbox(
    todo({}, 'content'),
  ),
));

export const interpretingRegressionResults = createDoc(() => container(
  doc.h2`Interpreting Regression Results with Discrete Dependent Variables`,
  dashbox(
    todo({}, 'content'),
  ),
));
