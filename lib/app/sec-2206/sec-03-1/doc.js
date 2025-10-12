/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container, responsiveGridAutoRow } = prelude.layout;
const {
  clsRef, infobox, ulLight,
  dashbox, noteOn, note, todo,
} = prelude.components;
const { createDoc } = prelude.util;

const LINKS = {
  classicalLinearModel: doc.a({ target: '_blank', href: 'https://www.le.ac.uk/users/dsgp1/COURSES/MESOMET/ECMETXT/06mesmet.pdf' }),
};

export const INFOBOX = {
  sampleDistribution: infobox('Sample Distribution', [container(
    todo({}, 'TODO'),
  )]),
  tDistribution: infobox('T Distribution', [container(
    todo({}, 'TODO'),
  )]),
  testStatistic: infobox('Test Statistic', [container(
    todo({}, 'TODO'),
  )]),
  criticalValue: infobox('Critical Value', [container(
    todo({}, 'TODO'),
  )]),
  type1Error: infobox('Type 1 Error', [container(
    todo({}, 'TODO'),
  )]),
  type2Error: infobox('Type 2 Error', [container(
    todo({}, 'TODO'),
  )]),
  significance: infobox('Significance', [container(
    todo({}, 'TODO'),
  )]),
}

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const w3Ref = ({ slide, page }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 3, page }) : undefined,
    lec: slide != null ? ({ id: [3, 'W'], slide }) : undefined,
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

const vars = {
  y: doc.b`y`,
  u: doc.b`u`,
  x1: doc.b`x${doc.sub`1`}`,
  x2: doc.b`x${doc.sub`2`}`,
  xk: doc.b`x${doc.sub`k`}`,
  xj: doc.b`x${doc.sub`j`}`,
  b0: doc.b`𝛽${doc.sub`1`}`,
  b1: doc.b`𝛽${doc.sub`1`}`,
  b2: doc.b`𝛽${doc.sub`2`}`,
  bk: doc.b`𝛽${doc.sub`k`}`,
  est: {
    y: doc.b`ŷ`,
    x1: doc.b`x̂${doc.sub`1`}`,
    x2: doc.b`x̂${doc.sub`2`}`,
    xk: doc.b`x̂${doc.sub`k`}`,
    b0: doc.b`𝛽̂${doc.sub`1`}`,
    b1: doc.b`𝛽̂${doc.sub`1`}`,
    b2: doc.b`𝛽̂${doc.sub`2`}`,
    bk: doc.b`𝛽̂${doc.sub`k`}`,
    bj: doc.b`𝛽̂${doc.sub`j`}`,
    rj: doc.b`r̂${doc.sub`i1`}`,
  },
  stddev: doc.b`𝜎${doc.sup`2`}`,
};

/**
 * @param {'even-2' | '2/3'} kind
 * @param {E.Item[]} left
 * @param {E.Item[]} right
 */
const columns = (kind, left, right) => (
  (kind === 'even-2' ? twoColumns : twoThree)(
    container(...left),
    container(...right),
  )
);

export const intro = createDoc(() => container(
  twoThree(
    container(
      ['h1', [
        'Intro to Econometrics', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W3, Lecture 2']],
      ]],
    ),
    infobox('Resources', [
      ulLight([
        doc.p`chapter 4 of the textbook`,
        doc.p`Week 3 Lecture 2`,
        doc.p`Week 4 Lecture 1`,
      ]),
    ]),
  ),
));

export const samplingDistribution = createDoc(() => dashbox(
  w3Ref({ page: 117, slide: 3 }, doc.h2`Sampling Distribution of OLS Estimators`),
  columns('2/3', [
    doc.small`
      In the earlier chapter we discussed how to obtain expected value and
      variance of the OLS estimators, however in order to perform
      ${doc.b`statistical inference`}, we need to know more than just the
      first two moments of ${vars.est.bj} we need to know the full
      sampling distribution of ${vars.est.bj}. Even under Gauss-Markov
      assumptions ${vars.est.bj} can have virtually any shape.
    `,
  ], [
    infobox('First 2 Moments?', [todo({}, 'describe what that means')]),
  ]),
  columns('2/3', [
    doc.small`
      When we condition on the values of the independent variables in our
      sample, it is clear that the sampling distribution of the OLS estimators
      depend on the underlying distribution of the errors. To make sampling
      disibution of the ${vars.est.bj} managable we now assume the error rate
      to be normally distributed. We call this the ${doc.b`normality assumption`}.
    `,
  ], [
    infobox('Normality Assumption', [
      todo({}, 'Do research on why this is acceptable and not some appeal to concequences'),
    ]),
  ]),
  container(
    w3Ref({ page: 118 }, infobox('MLR 6, Normality', [container(
      doc.small`
        The population error ${doc.b`u`} is independent of the
        explanatory variables, ${vars.x1}, ${vars.x2}, ${vars.xk}
        and is normally distibuted with zero mean and variance of
        ${vars.stddev}, which we can write as...
      `,
      mathml.normality,
    )])),
    w3Ref({ page: 118, slide: 3 }, doc.h4`Normality Assumption`),
    columns('2/3', [
      doc.small`
        The normality assumption is stronger than any of the
        earlier Gauss Markov assumptions. Under MLR 6, ${vars.u}
        is indepenet of the value ${vars.xj}. This assumption by
        default assumes MLR4 and MLR5. Combined these are called
        the ${LINKS.classicalLinearModel`Classical Linear Model (CLM)
        Assumptions`}.
      `,
      doc.small`
        It is best to think of the CLM assumptions as containing
        all of the Gauss-Markov assumptions plus the assumption
        of a normally distributed error term. This additional
        strengthens the efficiency properties of our estimators
        than they would be otherwise under the Gauss-Marov
        assumptions.
      `,
    ], [
      mathml.samplingDistribution,
    ]),
    mathml.classicalLinearModel,
    container(
      doc.h4`Notes on my thoughts on these assumptions`,
      columns('even-2', [
        dashbox(
          doc.details.of(
            doc.summary`Thought bubble... 💭`,
            doc.br(),
            container(
              doc.small`
                How does this last assumption not entirely undermine the legitmacy of any
                research done under this model? It is stated this is done for practicallity
                purposes, okay and? Sure it's simplier but it's modelling something different from
                what is being described.
              `,
              doc.quote.of(doc.small`
                I wrote this before finding the answer on the right
                hand side, however I am not entirely sure I am
                satisified with it.
              `),
            ),
          ),
        ),
      ], [
        dashbox(
          doc.details.of(
            doc.summary.of(w3Ref({ page: 119 }, 'Justification for CLM')),
            doc.br(),
            container(
              doc.h4`The justification`,
              doc.small`
                The textbok says the argument justifying this goes like ${doc.i`
                  "Because u is the sum of many different unobserved factors
                  affecting y, we can invoke the central limit theorem (CLT)
                  to conclude that u has an approximate normal distribution"`}.
              `,
              doc.h4`Weaknesses admitted with the assumption`,
              doc.small`
                It goes on to say this does have some weakness, given the
                factors in u can have very different distributions in the
                population (which is exactly my point). Then it proceeds to
                say it is good enough, which feels like we just went around
                in a circle.
              `,
            ),
          ),
        ),
      ]),
      dashbox(
        doc.details.of(
          doc.summary`Problems with the CLT Arugment`,
          doc.br(),
          container(
            doc.small`The textbook states that:`,
            doc.quote.of(doc.small`
              A more serious problem with the CLT argument is that it assumes
              that all unobserved factors affect ${vars.y} in a separate, additive
              fashion. Nothing guarantees that this is so. If ${vars.u} is a
              complicated function of the unobserved factors, then the CLT
              argument does not really apply.
            `),
            doc.small`
              Why do I get the feeling people just ignore that? I have no doubt
              I am not the first to ask this and wonder if people make this
              assumption to readily. The Textbook goes on to say
            `,
            doc.quote.of(doc.small`
              ... whether normality of u can be assumed is really an
              empirical matter ... Nevertheless, as a practical matter, we can
              ask whether the conditional wage distribution is “close” to
              being normal. ${doc.b`Past empirical evidence suggests that normality is
              not a good assumption for wages`}.
            `),
            doc.small`
              Then why do we assume this? If the answer is ${doc.b`Practicallity`}
              that really just sounds like a cope and a refusal admit we don't know
              shit.
            `,
          ),
        ),
      ),
      todo({}, 'Understand why the CLT isn\'t just cope.'),
    ),
    mathml.tDistributionOfEstimators,
  ),
));

export const importantDefinitions = createDoc(() => dashbox(
  doc.h3`Some definitions`,
  twoColumns(
    container(
      INFOBOX.sampleDistribution,
      INFOBOX.tDistribution,
    ),
    container(
      INFOBOX.testStatistic,
      INFOBOX.criticalValue,
    ),
  ),
));

export const hypothesisTestingTTest = createDoc(() => container(
  w3Ref({ page: 120 }, doc.h2`Hypothesis testing`),
  dashbox(
		doc.h3`The Test Statistic`,
  ),
));

export const hypothesisTestingNotes = createDoc(() => dashbox(
  note(
    doc.span`t-distribution in Theorum 4.2, t-distribution${ulLight([
      't-distribution close to standard normal if degrees of freedom (N - K - 1) is large',
    ])}`,
  ),
));

export const hypothesisTestingCont = createDoc(() => dashbox(
  w3Ref({ page: 120 }, doc.h3`Hypothesis testing`),
  twoColumns(
    container(
      clsRef({ lec: { id: [3, 'W'], slide: 8 } }, doc.h4`General Hypothesis testing`),
      todo({}, 'notes from slide 8'),
    ),
    container(
      clsRef({ lec: { id: [3, 'W'], slide: 9 } }, doc.h4`General Hypothesis testing`),
      todo({}, 'notes from slide 9'),
    ),
  ),
  clsRef({ lec: { id: [3, 'W'], slide: 13 } }, doc.h3`The process`),
  twoThree(
    container(
      note(
        'Generally start by writing your null hypothesis.',
        'You can start writing it in plain english',
        'But you ought to at least write it in the appropiate mathematic syntax',
      ),
    ),
    mathml.tStatistic,
  ),
  clsRef({ lec: { id: [3, 'W'], slide: 14 } }, note(
    'rejection rule',
  )),
));

export const stataOutputExample = createDoc(() => container(
  tables.stataOutputExample,
  todo({}, 'Describe the table'),
));

export const hypothesisTestingContCont = createDoc(() => dashbox(
  doc.h4`Example of Stata output`,
  clsRef({ lec: { id: [3, 'W'], slide: 18 } }, note(
    'calculate the t statistic',
    doc.span`rejection rule is satisified if${ulLight([
      'test statistics magnitude is greater than significance',
      'e.g. 2 sided tβ̂ᵢ > 1.96 or tβ̂ᵢ < -1.96',
    ])}`,
  )),
  clsRef({ lec: { id: [3, 'W'], slide: 19 } }, note(
    doc.span`rejection rule is satisified if${ulLight([
      'test statistics magnitude is greater than significance',
      'e.g. 2 sided tβ̂ᵢ > 1.96 or tβ̂ᵢ < -1.96',
    ])}`,
  )),
));

export const significaneLevelTable = createDoc(() => container(
  ['details', {}, [
    ['summary', {}, [
      ['h4', {
        style: 'background: var(--bg-pink); color: var(--fg-black-on-pink)',
      }, 'Open to view Significance level table'],
    ]],
    container(
      tables.significaneLevelTable,
      todo({}, 'How to read this table'),
    ),
  ]],
));

export const significance = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'W'], slide: 20 } }, doc.h2`Significance`),
  twoThree(
    todo({}, 'notes'),
    INFOBOX.significance,
  ),
));

export const typeErrors = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'W'], slide: 21 } }, doc.h2`Type I & Type II Errors`),
  twoThree(
    todo({}, 'notes'),
    container(
      INFOBOX.type1Error,
      INFOBOX.type2Error,
    ),
  ),
));

const tDist = doc.b`t${doc.sub`N-K-1`}`;
const tBetaJ = doc.b`t${doc.sub`β̂${doc.sub`j`}`}`;

export const pValues = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'W'], slide: 22 } }, doc.h2`P Value`),
  note(
    'Small P Value are evidence against of null hypothesis',
    'Large P Value are evidence in favour of null hypothesis',
    'p Value simmarise infomration on any number of tests at fixed signifiance levels',
  ),
  clsRef({ lec: { id: [3, 'W'], slide: 23 } }, note(
    'Define your hypothesis, and your significance',
    'find the t value',
    'check it against the significance',
    'refect null hypothesis if ??',
  )),
  clsRef({ lec: { id: [3, 'W'], slide: 23 } }, doc.h3`P Values in Practise`),
  noteOn('Find the P Value')(
    'Define the hypothesis',
    doc.span`find the distribution of the test statistic ${tDist}`,
    doc.span`Calculate the realization of the test statistic ${tBetaJ}`,
    doc.span`P Value is${ulLight([
      doc.span`${doc.b`2 tail`} P(${tDist} > ${tBetaJ}) + P(${tDist} < -${tBetaJ})`,
      doc.span`${doc.b`upper tail`} P(${tDist} > ${tBetaJ})`,
      doc.span`${doc.b`lower tail`} P(${tDist} < -${tBetaJ})`,
    ])}`,
  ),
));
