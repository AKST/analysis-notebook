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
  clsRef, infobox, ulLight, ulLightSm,
  dashbox, noteOn, note, todo,
} = prelude.components;
const { createDoc } = prelude.util;

const LINKS = {
  classicalLinearModel: doc.a({ target: '_blank', href: 'https://www.le.ac.uk/users/dsgp1/COURSES/MESOMET/ECMETXT/06mesmet.pdf' }),
  resampling: doc.a({ target: '_blank', href: 'https://en.wikipedia.org/wiki/Resampling_(statistics)#Bootstrap' }),
};

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const w3Ref = ({ slide, page }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 4, page }) : undefined,
    lec: slide != null ? ({ id: [3, 'Th'], slide }) : undefined,
  }, item)
);

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const w4Ref = ({ slide, page }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 4, page }) : undefined,
    lec: slide != null ? ({ id: [4, 'Tu'], slide }) : undefined,
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

export const hypothesisTestingTDist = createDoc(() => container(
  w3Ref({ page: 120 }, doc.h2`Hypothesis Testing `),
  dashbox(
    w3Ref({ page: 120 }, doc.h3`Testing Hypothesises about a population`),
    doc.quote.of(doc.small`Note the population regression function as expressed on the right.`),
    columns('even-2', [
      doc.small`
        Here we will move on to the topic of hypothesis testing which we can do
        for any parameter in the population regression function.
      `,
    ], [
      doc.div({ style: 'font-size: 12px' }).of(
        mathml.mlrExamples.regression,
      ),
    ]),
    dashbox(
      doc.details.of(
        doc.summary`What is a parameter`,
        doc.br(),
        doc.small`I actually forgot`,
        todo({}, 'what is a parameter'),
      ),
    ),
    container(
      doc.h3`T Distribution`,
      container(
        columns('even-2', [
          doc.small`
            In order to construct ao hypotheses test we need the construct
            the ${doc.b`t distribution`}. The T distribution comes from
            the fact that:
          `,
          ulLightSm([
            doc.span`The constant σ in SE(𝛽̂ⱼ) has been random variable 𝜎̂`,
            doc.span`The proof that leads to a t distribution with ${doc.b`n - k - 1`} is difficult demostrate`
          ]),
          todo({}, 'explain why for above'),
        ], [mathml.degreesOfFreedom]),
        doc.small`
          That theorum allow us to test hypothesis involving 𝛽ⱼ.
          Such as the null hypothesis with one such example being:
        `,
        mathml.nullHypothesisOfBetaJ,
        doc.small`
          Here j coresponds to any of the k number independent variables.
        `,
      ),
      container(
        doc.h4`An example`,
        doc.small`Given this model:`,
        mathml.createMLR('example Wage Model', 'wage %', ['edu', 'expr', 'tenure'], { yLog: true }),
        doc.small`
          A null hypothesis for ${vars.b2} might go ${vars.b2} = 0 suggesting
          once education and tenure have been accounted for expereince has no
          impact of the log(wage). Because the intution is that it does
          impact log(wage) our alternative hypothesis would be ${vars.b2} > 0
          (not just ≠ 0). ${ulLight([
            doc.span`H₀: 𝛽₂ = 0`,
            doc.span`H₁: 𝛽₂ > 0`,
          ])}
        `,
        doc.small`
          We don't just settle for it not being 0, because of intution we focus
          more on energy on the more meaningful suggestion that has an impact
          we believe it has which is likely necessary in some elaborate analysis.
        `,
      ),
    ),
  ),
  note(
    doc.span`t-distribution in Theorum 4.2, t-distribution${ulLight([
      't-distribution close to standard normal if degrees of freedom (N - K - 1) is large',
    ])}`,
  ),
));

export const hypothesisTestingTStat = createDoc(() => dashbox(
  twoThree(
    container(
	    w3Ref({ page: 121 }, doc.h3`The Test Statistic`),
      doc.small`
        On the right is the t statistic for this specific hypothesis,
        there is a more general form that will be given attention later.
        If you've ever built a model in anything like R or Python you
        will have seen those tools tend to compute these for you.
      `,
    ),
    mathml.tStatisticForBJ,
  ),
  doc.small`
    To understand its application take the following question
    "${doc.b`How far is 𝛽̂ⱼ from 0`}?" Consider the following:
  `,
  ulLightSm([
    doc.span`A sample value of 𝛽̂ⱼ provides evidence against H₀`,
    doc.span`We much recognise there is a ${doc.b`sampling error`} in our estimate of 𝛽̂ⱼ`,
    doc.span`The size of 𝛽ⱼ must be weighed aginst its sampling error`,
    doc.span`The standard error of 𝛽̂ⱼ is an estimate of the standard deviation of 𝛽̂ⱼ`,
    doc.span`t${doc.sub`𝛽̂ⱼ`} measures how many estimated standard deviatoions 𝛽̂ⱼ is away from zero`,
  ]),
  doc.small`
    In order to reject H₀ we need values of ${doc.b`t${doc.sub`𝛽̂ⱼ`}`}
    sufficiently far from zero. The precise rejection rule depends on
    the alternative hypothesis and the choosen ${doc.b`significance level`}.
  `,
  doc.quote.of(doc.small`
    The signifcance level is detremined by the probability of the null hypothesis being true.
  `),
  doc.details.of(
    doc.summary`Layman terms`,
    doc.br(),
    container(
      doc.small`
        You need to think backwards and you also need to be confindent
        about the shape of the distribution of population parameter
        your performing your hypothesis against to make any sense of
        what a t statistics. So a ${doc.b`test statitic won't make
        any sense outside the context of a null hypothesis test`}.
      `,
      doc.small`Given the following:${ulLight([
        doc.span`You have an unbiased estimate for the sample distribution`,
        doc.span`Create a distribution around the expected value of your population parameter`,
      ])}`,
      doc.small`
        You can compute a test statistic using the formular specified above,
        but the ${doc.b`test statistic`} is the number of standard devivations
        between the same result and the expected value of the null hypothesis.
      `,
    ),
  ),
));

export const hypothesisTestingOneSided = createDoc(() => dashbox(
  twoThree(
    container(
      w3Ref({ page: 122 }, doc.h3`Testing Against One Sided Alternatives`),
      doc.quote.of(doc.small`Example of One Sided Alternative Hypothesis ${doc.b`H₁:  𝛽ⱼ > 0`}`),
      doc.small`
        An alternative hypothesis is needed before a null hypothesis can be
        rejected. One such alternative hypothesis is the
        ${doc.b`one sided alternative`}. After choosing our null and alternative
        hypothesis in order to test either hyothesis we need to:
      `,
      ulLightSm([
        doc.span`Decided on your significance level`,
        doc.span`Derive your critical value from your significance level`,
        doc.span`Compute the test statistic based on the sample statistic`,
        doc.span`Perform your hypthosis tests (shown on the right)`,
      ]),
    ),
    mathml.hypothSet(
      m => m.sub(m.i('𝛽'), m.i('j')),
      { alt: '>', null: '≤' },
      m => m.n(0),
      '𝛽ⱼ hypothesis tests',
      { test: 'one-sided' }
    ),
  ),
  todo({}, 'confirm significance level to reject the alternatie hypothesis'),
  columns('even-2', [
    doc.h4`Significance level (𝛼)`,
    doc.small`
      What is a significance level? Well it's the
      ${doc.b`probability of rejecting H₀ when it's true`}.
      What does that mean? It is the ${doc.u`Maximum
      probability you're willing to accept of making a
      ${doc.b`Type I error`}`}.
    `,
    mathml.signficantLevel,
    doc.details.of(
      doc.summary`Layman Terms`,
      doc.br(),
      container(
        doc.small`
          Outside the context of the null hypthosis the
          signficance has little meaning, it's a area
          under the distribution your sample statistic
          would need to fall ${doc.b`within a distribution
          constructed on the assumption the null hypothesis
          is true`} in which you'd be comfortable in rejecting
          the null hypothesis.
        `,
        doc.small`This means:`,
        ulLightSm([
          doc.span`You need to have some idea of the distribution`,
        ]),
        doc.small`
          So if you assumed the null to be true and you created
          a normal distribution based on that assumption and
          with a distribution around what the null hypothesis
          suggests is the expected value. The ${doc.b`significance
          level`} is the area under that distribution based on
          that expected value and variance that your sample
          result would need to fall in order for you to reject
          the null hypothesis.
        `,
        doc.small`
          Sorry if that is repeatitive, but you could say it is a
          significant point of confusion. I think you need to
          think backwards to make sense of what all this means.
        `,
      ),
    ),
  ], [
    doc.h4`Critical Value (c)`,
    doc.small`
      What is a critical value? Well it's the result you get when find
      the position of your ${doc.b`significance level`} (so you need to
      figure that out first), offset by you degree of degrees of freedom
      on the inverse cumulative density function.
    `,
    doc.small`In our case it will be on a t distribution`,
    mathml.criticalValue,
  ]),
));

export const hypothesisTestingTwoSided = createDoc(() => dashbox(
  twoThree(
    container(
      w3Ref({ page: 126 }, doc.h3`Testing Against Two Sided Alternatives`),
      doc.small`
        A 2 sided test makes more sense when the exact effect of the
        population parameter is not well understood. So it opens up to
        the possibility of the effect being negative or positive. Steps
        such as computing a test statitic is the same,
      `,
      todo({}, 'confirm nothing else changes'),
    ),
    mathml.hypothSet(
      m => m.sub(m.i('𝛽'), m.i('j')),
      { alt: '≠', null: '=' },
      m => m.n(0),
      'two tailed 𝛽ⱼ hypothesis test',
      { test: 'two-sided' }
    ),
  ),
  w3Ref({ page: 128 }, doc.h4`There are other kinds of tests`),
  doc.small`But they will not be covered here.`,
));

export const stataOutputExample = createDoc(() => container(
  tables.stataOutputExample,
));

export const significaneLevelTable = createDoc(() => container(
  doc.details.of(
    doc.summary.of(
      doc.h4.attr({
        style: 'background: var(--bg-pink); color: var(--fg-black-on-pink)',
      })`Open to view Significance level table`,
    ),
    doc.br(),
    dashbox(
      tables.significanceTable,
      doc.small`In practise don't bother using this table`,
    ),
  ),
));

export const typeErrors = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'W'], slide: 21 } }, doc.h2`Type I & Type II Errors`),
  doc.small`
    This was elaborated on in the earlier section on
    selecting an appropiate significance level, but
    here is a bit more on the topic. But not a ton
    more.
  `,
  twoColumns(
    infobox('Type 1 Error', [container(
      ulLight([
        doc.i`False negative`,
        doc.i`Rejecting H₀ when H₀ is true`,
      ]),
    )]),
    infobox('Type 2 Error', [container(
      ulLight([
        doc.i`False Positive.`,
        doc.i`Not Rejecting H₀ when H₀ is false`,
      ]),
    )]),
  ),
));

const tDist = doc.b`t${doc.sub`N-K-1`}`;
const tBetaJ = doc.b`t${doc.sub`β̂${doc.sub`j`}`}`;

export const pValues = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'W'], slide: 22 } }, doc.h2`P-Value`),
  doc.small`
    Above describes the ${doc.b`classical approach`} to testing
    hypothesises, however it isn't the only way to perform
    hypothesis testing. One criticism of the classical approach
    is there a level of arbitrariness with the selection of the
    significance level. This is where ${doc.b`P-Values`} come in.
  `,
  doc.small`The long and short of it is: ${ulLight([
    'Small P Value are evidence against of null hypothesis',
    'Large P Value are evidence in favour of null hypothesis',
    'p Value simmarise infomration on any number of tests at fixed signifiance levels',
  ])}`,
  doc.h4`What P-Values do`,
  doc.small`
    A P Value flips the process on its head and instead of
    asking you what significance value would be needed to
    reject the null hypothesis and checking it tells you the
    smallest significance level at which the null hypothesis
    would need to reject. It's basically a value between zero
    and one. ${doc.b`Overally general rule of thumb`}, the
    smaller the value the better.
  `,
  twoThree(
    doc.small`
      When you're working on a model when you see the regression
      output show P Values, it is assuming your null hypothesis is
      ${doc.b`H₀: 𝛽ⱼ = 0`} and is telling the smallest significance
      value at which those are rejected. But I have no doubt there
      are tools that let you specify your own hypothesis.
    `,
    container(
      w3Ref({ page: 132 }, doc.h4`Computing a P-Value`),
      mathml.pValue,
      ulLightSm([
        doc.span`${doc.b`T`} denotes a t distribution with ${doc.b`n - k - 1`} degrees of freedom`,
      ]),
    ),
  ),
  w3Ref({ page: 132 }, doc.h4`General interpretation`),
  doc.small`
    The p-value is the probability of observing a t statistic as extreme as we did if the null hypothesis is true.
  `,
  twoColumns(
    ulLightSm([
      doc.span`Big P-Value Bad ${ulLight([
        doc.span`They provide evidence in favour of the H₀`,
      ])}`,
      doc.span`Small P-Value Good ${ulLight([
        doc.span`They provide little evidence in favour of the H₀`,
        doc.span`They is largely evidence against the H₀`,
      ])}`,
    ]),
    container(
      w3Ref({ slide: 23 }, doc.h4`Difference in application`),
      ulLightSm([
        doc.span`2 tail P(${tDist} > ${tBetaJ}) + P(${tDist} < -${tBetaJ})`,
        doc.span`Upper tail P(${tDist} > ${tBetaJ})`,
        doc.span`Lower tail P(${tDist} < -${tBetaJ})`,
      ]),
    ),
  ),
  twoColumns(
    doc.details.of(
      doc.summary`Language relating Hypothesis testing`,
      doc.br(),
      doc.small`
        We never say ${doc.b`we accept the null hypothesis`},
        we do not reject a null hypothesis. We simply say
        ${doc.b`we failed to reject the null hypothesis`}.
      `,
    ),
    doc.details.of(
      doc.summary`Why is there a dash between P & Value`,
      doc.br(),
      doc.small`I don't know man, I think there's more important things to consider`,
    ),
  ),
));

export const confindenceIntervals = createDoc(() => dashbox(
  w4Ref({ page: 136 }, doc.h2`Confindence Intervals`),
  twoThree(
    doc.small`
      A 95 Confidence Interval (CI) is an interval in which
      we are 95% confindent that the population parameter
      sit in. Not just a point estimate. Typically this
      requires collecting many samples over and over, although
      computers kind of fudge this for a single sample with
      ${LINKS.resampling`performing resampling over same sample`}
      in which it simulates multiple samples. Obviously this is
      less ideal than actually collecting multiple samples, but
      it's the not the worse thing in the world if your sample
      is really a random sample and representative of the general
      population.
    `,

    mathml.ci95,
  ),
  columns('even-2', [
    w4Ref({ page: 135 }, doc.h4`What is the 95% CI?`),
    doc.small`
      It is the smallest range in which the estimate 𝛽̂ⱼ for 𝛽ⱼ
      sits for 95% of all samples. ${doc.b`Put another way`},
      If random samples were obtained over and over
      again, with 𝛽̱ⱼ and 𝛽̄ⱼ computed each time, then the (unknown)
      population value 𝛽ⱼ would lie in the interval (𝛽̱ⱼ and 𝛽̄ⱼ) for
      95% of the samples.
    `,
  ], [
    doc.h4`Testing Hypothesises`,
    doc.small`
      Back to hypothesis testing, if your null hypothesis
      is something like "${doc.b`H₀: 𝛽ⱼ = 0`}, then using
      rejecting null hypothesis is simply a matter getting
      a confindence interval which is not inclusive of zero.
    `,
  ]),
  doc.h3`⚠️ Important Assumption ⚠️`,
  doc.small`
    While this entire time we've been making assumptions about
    our data being normally distributed. It's is worth noting
    the way it is being described here in terms of calculation
    and based on an assumption is the fact the data is normally
    distributed. Especailly when you're involving the ${doc.b`Central
    Limit Theorum`}.
  `,
));

export const testingHypothesisAboutASingleLinearCombinationOfParameters = createDoc(() => dashbox(
  w4Ref({ page: 136 }, doc.h2`Testing Hypothesis for a combination of parameters`),
  doc.small`
    This is where it gets more interesting. So far we have written tests
    for about indivisual parameters. However we can actually also write
    tests for more than one parameter at a time. Here's an example.
  `,
  doc.h4`Example`,
  twoThree(
    container(
      mathml.createMLR('Wage Model', 'wage', ['jc', 'univ', 'exper'], { yLog: true }),
      doc.small`
        Using the above model as an example we can write
        a null and alternative hypothesis like we've done
        on the right side (or below). Where the null says
        there is no difference, but in the alternative
        hypothesis we make a positive claim that the
        effect of one parameter is greater the effect
        of another parameter from the same model.
      `,
    ),
    mathml.exampleOfMultiParaHypothesis.set,
  ),
  twoThree(
    doc.small`
      Besides the tests being different one thing you may
      notice now is the test statitic is now written different.
      We actually arrive at this by rearranging our hypothesis
      like on the right. And then plugging them into the
      earlier function.
    `,
    mathml.exampleOfMultiParaHypothesis.rearranged,
  ),
  doc.h4`unsorted`,
  todo({}, 'better explain this section'),
  mathml.exampleOfMultiParaHypothesis.constraint,
  mathml.exampleOfMultiParaHypothesis.seConstraint,
  doc.small`
    Matrix Algebra is necessary to compute s${doc.sub`12`}
  `,
  todo({}, 'Something about writing the forumla'),
  w4Ref({ page: 138 }, doc.h4`When matrix math is too hard`),
  responsiveGridAutoRow([
    mathml.aliasOf2Params.alias,
    mathml.aliasOf2Params.null,
    mathml.aliasOf2Params.alt,
    mathml.aliasOf2Params.tStat,
  ], { columns: { desktop: 'auto auto auto auto' } }),
  responsiveGridAutoRow([
    mathml.aliasOf2Params.plugAlias,
    mathml.aliasOf2Params.ci95,
  ], { columns: { desktop: '1fr auto' } }),
  todo({}, 'write about reparameterising models'),
));

export const fTest = createDoc(() => dashbox(
  w4Ref({ page: 134 },  doc.h2`F Test`),
  doc.small`
    While a ${doc.b`t statistic`} associated with any OLS
    coefficient can be used to test whether its corresponding
    unknown population parameter is equal to any given constant
    (normally zero), and we've seen how to test the relationship
    between any two parameters. But what is we were like ${doc.i`"fuck it
    lets test all the hypothesises"?`} Well you're in luck, it's called
    the ${doc.b`F test`}.
  `,
  doc.h4`Testing Restrictions`,
  mathml.createMLR('log Salary model', 'a', ['b', 'c', 'd', 'e', 'f'], { yLog: true }),
  twoThree(
    container(
      doc.small`
        On the right we have constructed a null hypothesis using
        multiple parameters. These are ${doc.b`Exclusion restrictions`}
        that say ${doc.i`if true, the subsequent regressors have no effect
        on the dependent variable and should be excluded from the model`}.
        This is also an example of a set of  ${doc.b`multiple restictions`}
        as we are putting more than 1 restictions on the parameters. A set
        of multiple restirctions is also called a ${doc.b`multiple hypothesis
        test`} or my preferred name ${doc.b`joint hypothesis test`}.
      `,
      doc.small`
        Thankfully the alternative hypothesis is much simpler.
      `,
    ),
    mathml.jointHypothesisTest,
  ),
  doc.small`Now how do we approach this?`,
  doc.small`
    We can't test each statistically indivisually with
    the test statistic, because they put no restriction
    on the other parameters. We need to test the
    exclusion jointly to do so.
  `,
  todo({}, 'explain theory'),
  w4Ref({ page: 140 }, note('write about restricted model', 'write about unrestricted model')),
  responsiveGridAutoRow([
    mathml.fStat,
    mathml.fStatDistribution,
  ], { columns: { desktop: 'auto auto' } }),
  w4Ref({ page: 142 }, todo({}, 'Write about more about this')),
  w4Ref({ page: 142 }, note(
    'why do we want the f stat',
    'what is the go with the critical value for f',
    'what is the f stat distribution',
    'what is jointly insignificance?',
  )),
  w4Ref({ page: 144 }, doc.h4`Relationship between F and t Statistic`),
  todo({}, 'write more'),
  w4Ref({ page: 145 }, doc.h4`The R-Squared From of the F statistic`),
  mathml.fStatInTermsOfRSq,
  todo({}, 'write more'),
  w4Ref({ page: 146 }, doc.h4`Writing P values for F Statistics`),
  mathml.pValues,
  todo({}, 'write more'),
  w4Ref({ page: 147 }, doc.h4`The F Statistic for Overall Significance of a Regression`),
  todo({}, 'write more'),
  note('overall significance of the regression'),
  w4Ref({ page: 148 }, doc.h4`Testing General Linear Restrictions`),
  todo({}, 'write more'),
));
