/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container, responsiveGridAutoRow } = prelude.layout;
const { ulLightSm, clsRef, infobox, ulLight, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

/**
 * @type {Record<string, E.Item>}
 */
const LINKS = {
};

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ slide, page }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 5, page }) : undefined,
    lec: slide != null ? ({ id: [4, 'Th'], slide }) : undefined,
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
      doc.h1.of('Multiple Regression Analysis: OLS Asymptotics', doc.br(), (
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W4']]
      )),
    ),
    infobox('Resources', [
      ulLight([
        doc.span`Chapter 5`,
      ])
    ]),
  ),
));

export const introduction = createDoc(() => dashbox(
  ref({ page: 164 }, doc.h2`Intro`),
  doc.small`${doc.b`Finite Sample Properties`} of OLS`,
  ulLightSm([
    doc.span`
      Unbiasness under the first 4 Gauss-Markvo Assumptions is a
      ${doc.b`finite sample property`} because ${doc.u`it holds
      for any sample size ${doc.b`n`} where ${doc.b`n`} is
      greater than the number of variables (${doc.b`k`})`}.
    `,
    doc.span`
      OLS being the best unbiased estimator under the full set of
      the Gauss-Markov assumtions.
    `,
  ]),
  doc.small`
    However these are not the only properties of estimators and test
    statistics we should know about. There are also ${doc.b`asympototic
    properties`} or ${doc.b`large sample properties`} of estimators
    and test statistics. These are properties as the size of samples
    grow. OLS continues to work large properties but these are properties
    observable with larger samples.
  `,
));

export const consistency = createDoc(() => container(
  ref({ page: 164 }, doc.h2`Consistency`),
  dashbox(
    doc.small`
      Consistency in this context can be described a number of ways,
      but here's an example. An example of this is the way in which
      an estimator an ${doc.b`𝛽̂ⱼ`} narrows around a true value of
      ${doc.b`𝛽ⱼ`} as the size of the sample to esimate ${doc.b`𝛽ⱼ`}
      increases. As the sample size increasese the inifinity
      (or the total population) the estimate ${doc.b`𝛽̂ⱼ`}
      converges to the value ${doc.b`𝛽ⱼ`}.
    `,
    mathml.consistency.proofOfUnbiasness,
    mathml.consistency.probabilityLimits,
    doc.small`
      Above demostrating this via ${doc.b`probability limits`},
    `,
    mathml.consistency.assumption,
    mathml.consistency.strongerMLR4_1,
    doc.small`
      Above is a stronger conditional mean assumption necessary,
      but it also means we have properly modelled the population
      regression function (PRF). Under the this updated
      assumption looks something like this:
    `,
    mathml.consistency.prf,
  ),
  twoColumns(
    dashbox(
      doc.details.of(
        doc.summary`Definition of consistency (TODO)`,
        doc.br(),
        container(
          todo({}, 'refer to the definintion of consistency under math refersher C'),
        ),
      ),
    ),
    dashbox(
      doc.details.of(
        doc.summary`Probability Limits (TODO)`,
        doc.br(),
        container(
          todo({}, 'refer to the definintion of Probability Limits under math refersher C'),
        ),
      ),
    ),
  ),
  dashbox(
    doc.h3`Deriving the Inconsistency in OLS`,
    twoThree(
      doc.small`
        When the unconditional mean assumption mean fails, it
        suggests all the OLS estimators to be inconsistent.
        Put another way ${doc.b`if the error is correlated with
        any of the independent variables, then OLS is biased and
        inconsistent`}. This can be written more formually as:
      `,
      infobox('Asymptotic Bias', [doc.small`This is another name for inconsistency in an estimator such as 𝛽̂ⱼ`]),
    ),
    mathml.inconsistency.asymptoticBias,
    doc.small`When Var(x₁) > 0, this means`,
    ulLightSm([
      doc.span`
        When x₁ and u are positively correlated,
        the inconsistency in 𝛽̂₁ is positive.
      `,
      doc.span`
        When x₁ and u are negatively correlated,
        the inconsistency in 𝛽̂₁ is negative.
      `,
      doc.span`
        When the covariance between x₁ and u is
        small the inconsistency can be negligible.
        Unforunately we cannot estimate how big the
        covariance is because u is unobserved.
      `,
    ]),
    doc.small`
      But in order demostrate this point we use an example
      of an omitted variable to demostrate this. For
      practical purposes here we can treat inconsistency as
      the same as the bias, the main difference largely being
      that an inconsistency is generally expressed in terms
      of the population variance of ${doc.b`x₁`} and the
      covariance between ${doc.b`x₁`} and ${doc.b`x₂`}.
      While the bias is based on their sample counterparts.
    `,
    mathml.inconsistency.omittedVarExample,
    doc.small`
      If the 2 variables aren't correlated then 𝛿₁ is 0 and
      the estimator of 𝛽₁ is consistent. Otherwise for any
      kind of bias (positive or negative) for a given
      correlation (positive or negative) there will be a
      like inconsistency (posititve or negative). But an
      important point about inconsistency in OLS estimators
      is it doesn't go away by adding more observations to the
      sample. ${doc.b`It actually gets harder as you increase
      the sample size`}.
    `,
  ),
));

export const asymptoticNormality = createDoc(() => container(
  ref({ page: 168 }, doc.h2`Asymptotic Normality and Large Sample Inference`),
  dashbox(
    todo({}, 'Asymptotic Normality and Large Sample Inference'),
  ),
  dashbox(
    todo({}, 'Other Large Sample Tests: The Lagrange Multiplier Statistic'),
  ),
  dashbox(
    todo({}, 'The Lagrange Multiplier Statistic for q Exclusion Restrictions'),
  ),
));

export const asymptoticEfficiencyOfOLS = createDoc(() => container(
  ref({ page: 175 }, doc.h2`Asymptotic Efficiency of OLS`),
  dashbox(

  ),
));
