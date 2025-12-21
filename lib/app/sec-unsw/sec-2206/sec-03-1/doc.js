/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { twoColumns, twoThree, container, responsiveGridAutoRow } from '@prelude-uni/layout.js';
import {
  text, clsRef, infobox,
  dashbox, noteOn, note, todo,
} from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const LINKS = {
  classicalLinearModel: text.a({ target: '_blank', href: 'https://www.le.ac.uk/users/dsgp1/COURSES/MESOMET/ECMETXT/06mesmet.pdf' }),
  resampling: text.a({ target: '_blank', href: 'https://en.wikipedia.org/wiki/Resampling_(statistics)#Bootstrap' }),
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

export const vars = {
  y: text.b`y`,
  u: text.b`u`,
  x1: text.b`x${doc.sub`1`}`,
  x2: text.b`x${doc.sub`2`}`,
  xk: text.b`x${doc.sub`k`}`,
  xj: text.b`x${doc.sub`j`}`,
  b0: text.b`β${doc.sub`1`}`,
  b1: text.b`β${doc.sub`1`}`,
  b2: text.b`β${doc.sub`2`}`,
  bk: text.b`β${doc.sub`k`}`,
  est: {
    y: text.b`ŷ`,
    x1: text.b`x̂${doc.sub`1`}`,
    x2: text.b`x̂${doc.sub`2`}`,
    xk: text.b`x̂${doc.sub`k`}`,
    b0: text.b`β̂${doc.sub`1`}`,
    b1: text.b`β̂${doc.sub`1`}`,
    b2: text.b`β̂${doc.sub`2`}`,
    bk: text.b`β̂${doc.sub`k`}`,
    bj: text.b`β̂${doc.sub`j`}`,
    rj: text.b`r̂${doc.sub`i1`}`,
  },
  stddev: text.b`σ${doc.sup`2`}`,
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
      doc.h1.c(
        'Intro to Econometrics', doc.br(),
        doc.small({ style: 'color: #aaaaff' }).t`ECON2206, W3, Lecture 2`,
      ),
    ),
    infobox({ title: 'Resources' }).c(
      text.ul(
        doc.li`chapter 4 of the textbook`,
        doc.li`Week 3 Lecture 2`,
        doc.li`Week 4 Lecture 1`,
      ),
    ),
  ),
));

export const samplingDistribution = createDoc(() => dashbox(
  w3Ref({ page: 117, slide: 3 }, doc.h2`Sampling Distribution of OLS Estimators`),
  columns('2/3', [
    doc.p`
      In the earlier chapter we discussed how to obtain expected value and
      variance of the OLS estimators, however in order to perform
      ${text.b`statistical inference`}, we need to know more than just the
      first two moments of ${vars.est.bj} we need to know the full
      sampling distribution of ${vars.est.bj}. Even under Gauss-Markov
      assumptions ${vars.est.bj} can have virtually any shape.
    `,
  ], [
    infobox({ title: 'First 2 Moments?' }).c(todo({}, 'describe what that means')),
  ]),
  columns('2/3', [
    doc.p`
      When we condition on the values of the independent variables in our
      sample, it is clear that the sampling distribution of the OLS estimators
      depend on the underlying distribution of the errors. To make sampling
      disibution of the ${vars.est.bj} managable we now assume the error rate
      to be normally distributed. We call this the ${text.b`normality assumption`}.
    `,
  ], [
    infobox({ title: 'Normality Assumption' }).c(
      todo({}, 'Do research on why this is acceptable and not some appeal to concequences'),
    ),
  ]),
  container(
    w3Ref({ page: 118 }, infobox({ title: 'MLR 6, Normality' }).c(
      doc.p`
        The population error ${text.b`u`} is independent of the
        explanatory variables, ${vars.x1}, ${vars.x2}, ${vars.xk}
        and is normally distibuted with zero mean and variance of
        ${vars.stddev}, which we can write as...
      `,
      mathml.normality,
    )),
    w3Ref({ page: 118, slide: 3 }, doc.h4`Normality Assumption`),
    columns('2/3', [
      doc.p`
        The normality assumption is stronger than any of the
        earlier Gauss Markov assumptions. Under MLR 6, ${vars.u}
        is indepenet of the value ${vars.xj}. This assumption by
        default assumes MLR4 and MLR5. Combined these are called
        the ${LINKS.classicalLinearModel.t`Classical Linear Model (CLM)
        Assumptions`}.
      `,
      doc.p`
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
          doc.details.c(
            doc.summary`Thought bubble... 💭`,
            doc.br(),
            container(
              doc.p`
                How does this last assumption not entirely undermine the legitmacy of any
                research done under this model? It is stated this is done for practicallity
                purposes, okay and? Sure it's simplier but it's modelling something different from
                what is being described.
              `,
              doc.quote`
                I wrote this before finding the answer on the right
                hand side, however I am not entirely sure I am
                satisified with it.
              `,
            ),
          ),
        ),
      ], [
        dashbox(
          doc.details.c(
            doc.summary.c(w3Ref({ page: 119 }, 'Justification for CLM')),
            doc.br(),
            container(
              doc.h4`The justification`,
              doc.p`
                The textbok says the argument justifying this goes like ${text.i`
                  "Because u is the sum of many different unobserved factors
                  affecting y, we can invoke the central limit theorem (CLT)
                  to conclude that u has an approximate normal distribution"`}.
              `,
              doc.h4`Weaknesses admitted with the assumption`,
              doc.p`
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
        doc.details.c(
          doc.summary`Problems with the CLT Arugment`,
          doc.br(),
          container(
            doc.p`The textbook states that:`,
            doc.quote`
              A more serious problem with the CLT argument is that it assumes
              that all unobserved factors affect ${vars.y} in a separate, additive
              fashion. Nothing guarantees that this is so. If ${vars.u} is a
              complicated function of the unobserved factors, then the CLT
              argument does not really apply.
            `,
            doc.p`
              Why do I get the feeling people just ignore that? I have no doubt
              I am not the first to ask this and wonder if people make this
              assumption to readily. The Textbook goes on to say
            `,
            doc.quote`
              ... whether normality of u can be assumed is really an
              empirical matter ... Nevertheless, as a practical matter, we can
              ask whether the conditional wage distribution is “close” to
              being normal. ${text.b`Past empirical evidence suggests that normality is
              not a good assumption for wages`}.
            `,
            doc.p`
              Then why do we assume this? If the answer is ${text.b`Practicallity`}
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
    doc.quote`Note the population regression function as expressed on the right.`,
    columns('even-2', [
      doc.p`
        Here we will move on to the topic of hypothesis testing which we can do
        for any parameter in the population regression function.
      `,
    ], [
      doc.div({ style: 'font-size: 12px' }).c(
        mathml.mlrExamples.regression,
      ),
    ]),
    dashbox(
      doc.details.c(
        doc.summary`What is a parameter`,
        doc.br(),
        doc.p`I actually forgot`,
        todo({}, 'what is a parameter'),
      ),
    ),
    container(
      doc.h3`T Distribution`,
      container(
        columns('even-2', [
          doc.p`
            In order to construct ao hypotheses test we need the construct
            the ${text.b`t distribution`}. The T distribution comes from
            the fact that:
          `,
          text.ul(
            doc.li`The constant σ in SE(β̂ⱼ) has been random variable σ̂`,
            doc.li`The proof that leads to a t distribution with ${text.b`n - k - 1`} is difficult demostrate`,
          ),
          todo({}, 'explain why for above'),
        ], [mathml.degreesOfFreedom]),
        doc.p`
          That theorum allow us to test hypothesis involving βⱼ.
          Such as the null hypothesis with one such example being:
        `,
        mathml.nullHypothesisOfBetaJ,
        doc.p`
          Here j coresponds to any of the k number independent variables.
        `,
      ),
      container(
        doc.h4`An example`,
        doc.p`Given this model:`,
        mathml.createMLR('example Wage Model', 'wage %', ['edu', 'expr', 'tenure'], { yLog: true }),
        doc.p`
          A null hypothesis for ${vars.b2} might go ${vars.b2} = 0 suggesting
          once education and tenure have been accounted for expereince has no
          impact of the log(wage). Because the intution is that it does
          impact log(wage) our alternative hypothesis would be ${vars.b2} > 0
          (not just ≠ 0).
        `,
        text.ul(
          doc.li`H₀: β₂ = 0`,
          doc.li`H₁: β₂ > 0`,
        ),
        doc.p`
          We don't just settle for it not being 0, because of intution we focus
          more on energy on the more meaningful suggestion that has an impact
          we believe it has which is likely necessary in some elaborate analysis.
        `,
      ),
    ),
  ),
  note(
    doc.li`t-distribution in Theorum 4.2, t-distribution${text.ul(
      doc.li`t-distribution close to standard normal if degrees of freedom (N - K - 1) is large`,
    )}`,
  ),
));

export const hypothesisTestingTStat = createDoc(() => dashbox(
  twoThree(
    container(
	    w3Ref({ page: 121 }, doc.h3`The Test Statistic`),
      doc.p`
        On the right is the t statistic for this specific hypothesis,
        there is a more general form that will be given attention later.
        If you've ever built a model in anything like R or Python you
        will have seen those tools tend to compute these for you.
      `,
    ),
    mathml.tStatisticForBJ,
  ),
  doc.p`
    To understand its application take the following question
    "${text.b`How far is β̂ⱼ from 0`}?" Consider the following:
  `,
  text.ul(
    doc.li`A sample value of β̂ⱼ provides evidence against H₀`,
    doc.li`We much recognise there is a ${text.b`sampling error`} in our estimate of β̂ⱼ`,
    doc.li`The size of βⱼ must be weighed aginst its sampling error`,
    doc.li`The standard error of β̂ⱼ is an estimate of the standard deviation of β̂ⱼ`,
    doc.li`t${doc.sub`β̂ⱼ`} measures how many estimated standard deviatoions β̂ⱼ is away from zero`,
  ),
  doc.p`
    In order to reject H₀ we need values of ${text.b`t${doc.sub`β̂ⱼ`}`}
    sufficiently far from zero. The precise rejection rule depends on
    the alternative hypothesis and the choosen ${text.b`significance level`}.
  `,
  doc.quote`
    The signifcance level is detremined by the probability of the null hypothesis being true.
  `,
  doc.details.c(
    doc.summary`Layman terms`,
    doc.br(),
    container(
      doc.p`
        You need to think backwards and you also need to be confindent
        about the shape of the distribution of population parameter
        your performing your hypothesis against to make any sense of
        what a t statistics. So a ${text.b`test statitic won't make
        any sense outside the context of a null hypothesis test`}.
      `,
      doc.p`Given the following:`,
      text.ul(
        doc.li`You have an unbiased estimate for the sample distribution`,
        doc.li`Create a distribution around the expected value of your population parameter`,
      ),
      doc.p`
        You can compute a test statistic using the formular specified above,
        but the ${text.b`test statistic`} is the number of standard devivations
        between the same result and the expected value of the null hypothesis.
      `,
    ),
  ),
));

export const hypothesisTestingOneSided = createDoc(() => dashbox(
  twoThree(
    container(
      w3Ref({ page: 122 }, doc.h3`Testing Against One Sided Alternatives`),
      doc.quote`Example of One Sided Alternative Hypothesis ${text.b`H₁:  βⱼ > 0`}`,
      doc.p`
        An alternative hypothesis is needed before a null hypothesis can be
        rejected. One such alternative hypothesis is the
        ${text.b`one sided alternative`}. After choosing our null and alternative
        hypothesis in order to test either hyothesis we need to:
      `,
      text.ul(
        doc.li`Decided on your significance level`,
        doc.li`Derive your critical value from your significance level`,
        doc.li`Compute the test statistic based on the sample statistic`,
        doc.li`Perform your hypthosis tests (shown on the right)`,
      ),
    ),
    mathml.hypothSet(
      m => m.msub(m.mi`β`, m.mi`j`),
      { alt: '>', null: '≤' },
      m => m.mn(0),
      'βⱼ hypothesis tests',
      { test: 'one-sided' }
    ),
  ),
  todo({}, 'confirm significance level to reject the alternatie hypothesis'),
  columns('even-2', [
    doc.h4`Significance level (α)`,
    doc.p`
      What is a significance level? Well it's the
      ${text.b`probability of rejecting H₀ when it's true`}.
      What does that mean? It is the ${doc.u`Maximum
      probability you're willing to accept of making a
      ${text.b`Type I error`}`}.
    `,
    mathml.signficantLevel,
    doc.details.c(
      doc.summary`Layman Terms`,
      doc.br(),
      container(
        doc.p`
          Outside the context of the null hypthosis the
          signficance has little meaning, it's a area
          under the distribution your sample statistic
          would need to fall ${text.b`within a distribution
          constructed on the assumption the null hypothesis
          is true`} in which you'd be comfortable in rejecting
          the null hypothesis.
        `,
        doc.p`This means:`,
        text.ul(
          doc.li`You need to have some idea of the distribution`,
        ),
        doc.p`
          So if you assumed the null to be true and you created
          a normal distribution based on that assumption and
          with a distribution around what the null hypothesis
          suggests is the expected value. The ${text.b`significance
          level`} is the area under that distribution based on
          that expected value and variance that your sample
          result would need to fall in order for you to reject
          the null hypothesis.
        `,
        doc.p`
          Sorry if that is repeatitive, but you could say it is a
          significant point of confusion. I think you need to
          think backwards to make sense of what all this means.
        `,
      ),
    ),
  ], [
    doc.h4`Critical Value (c)`,
    doc.p`
      What is a critical value? Well it's the result you get when find
      the position of your ${text.b`significance level`} (so you need to
      figure that out first), offset by you degree of degrees of freedom
      on the inverse cumulative density function.
    `,
    doc.p`In our case it will be on a t distribution`,
    mathml.criticalValue,
  ]),
));

export const hypothesisTestingTwoSided = createDoc(() => dashbox(
  twoThree(
    container(
      w3Ref({ page: 126 }, doc.h3`Testing Against Two Sided Alternatives`),
      doc.p`
        A 2 sided test makes more sense when the exact effect of the
        population parameter is not well understood. So it opens up to
        the possibility of the effect being negative or positive. Steps
        such as computing a test statitic is the same,
      `,
      todo({}, 'confirm nothing else changes'),
    ),
    mathml.hypothSet(
      m => m.msub(m.mi`β`, m.mi`j`),
      { alt: '≠', null: '=' },
      m => m.mn(0),
      'two tailed βⱼ hypothesis test',
      { test: 'two-sided' }
    ),
  ),
  w3Ref({ page: 128 }, doc.h4`There are other kinds of tests`),
  doc.p`But they will not be covered here.`,
));

export const stataOutputExample = createDoc(() => container(
  tables.stataOutputExample,
));

export const significaneLevelTable = createDoc(() => container(
  doc.details.c(
    doc.summary({ className: 'grid-layout pink' }).c(
      doc.h4`Open to view Significance level table`,
    ),
    doc.br(),
    dashbox(
      tables.significanceTable,
      doc.p`In practise don't bother using this table`,
    ),
  ),
));

export const typeErrors = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'W'], slide: 21 } }, doc.h2`Type I & Type II Errors`),
  doc.p`
    This was elaborated on in the earlier section on
    selecting an appropiate significance level, but
    here is a bit more on the topic. But not a ton
    more.
  `,
  twoColumns(
    infobox({ title: 'Type 1 Error' }).c(
      text.ul(
        doc.li.c(text.i`False negative`),
        doc.li.c(text.i`Rejecting H₀ when H₀ is true`),
      ),
    ),
    infobox({ title: 'Type 2 Error' }).c(
      text.ul(
        doc.li.c(text.i`False Positive.`),
        doc.li.c(text.i`Not Rejecting H₀ when H₀ is false`),
      ),
    ),
  ),
));

const tDist = text.b`t${doc.sub`N-K-1`}`;
const tBetaJ = text.b`t${doc.sub`β̂${doc.sub`j`}`}`;

export const pValues = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'W'], slide: 22 } }, doc.h2`P-Value`),
  doc.p`
    Above describes the ${text.b`classical approach`} to testing
    hypothesises, however it isn't the only way to perform
    hypothesis testing. One criticism of the classical approach
    is there a level of arbitrariness with the selection of the
    significance level. This is where ${text.b`P-Values`} come in.
  `,
  doc.p`The long and short of it is:`,
  text.ul(
    doc.li`Small P Value are evidence against of null hypothesis`,
    doc.li`Large P Value are evidence in favour of null hypothesis`,
    doc.li`p Value simmarise infomration on any number of tests at fixed signifiance levels`,
  ),
  doc.h4`What P-Values do`,
  doc.p`
    A P Value flips the process on its head and instead of
    asking you what significance value would be needed to
    reject the null hypothesis and checking it tells you the
    smallest significance level at which the null hypothesis
    would need to reject. It's basically a value between zero
    and one. ${text.b`Overally general rule of thumb`}, the
    smaller the value the better.
  `,
  twoThree(
    doc.p`
      When you're working on a model when you see the regression
      output show P Values, it is assuming your null hypothesis is
      ${text.b`H₀: βⱼ = 0`} and is telling the smallest significance
      value at which those are rejected. But I have no doubt there
      are tools that let you specify your own hypothesis.
    `,
    container(
      w3Ref({ page: 132 }, doc.h4`Computing a P-Value`),
      mathml.pValue,
      text.ul(
        doc.li`${text.b`T`} denotes a t distribution with ${text.b`n - k - 1`} degrees of freedom`,
      ),
    ),
  ),
  w3Ref({ page: 132 }, doc.h4`General interpretation`),
  doc.p`
    The p-value is the probability of observing a t statistic as extreme as we did if the null hypothesis is true.
  `,
  twoColumns(
    text.ul(
      doc.li`Big P-Value Bad ${text.ul(
        doc.li`They provide evidence in favour of the H₀`,
      )}`,
      doc.li`Small P-Value Good ${text.ul(
        doc.li`They provide little evidence in favour of the H₀`,
        doc.li`They is largely evidence against the H₀`,
      )}`,
    ),
    container(
      w3Ref({ slide: 23 }, doc.h4`Difference in application`),
      text.ul(
        doc.li`2 tail P(${tDist} > ${tBetaJ}) + P(${tDist} < -${tBetaJ})`,
        doc.li`Upper tail P(${tDist} > ${tBetaJ})`,
        doc.li`Lower tail P(${tDist} < -${tBetaJ})`,
      ),
    ),
  ),
  twoColumns(
    doc.details.c(
      doc.summary`Language relating Hypothesis testing`,
      doc.br(),
      doc.p`
        We never say ${text.b`we accept the null hypothesis`},
        we do not reject a null hypothesis. We simply say
        ${text.b`we failed to reject the null hypothesis`}.
      `,
    ),
    doc.details.c(
      doc.summary`Why is there a dash between P & Value`,
      doc.br(),
      doc.p`I don't know man, I think there's more important things to consider`,
    ),
  ),
));

export const confindenceIntervals = createDoc(() => dashbox(
  w4Ref({ page: 136 }, doc.h2`Confindence Intervals`),
  twoThree(
    doc.p`
      A 95 Confidence Interval (CI) is an interval in which
      we are 95% confindent that the population parameter
      sit in. Not just a point estimate. Typically this
      requires collecting many samples over and over, although
      computers kind of fudge this for a single sample with
      ${LINKS.resampling.t`performing resampling over same sample`}
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
    doc.p`
      It is the smallest range in which the estimate β̂ⱼ for βⱼ
      sits for 95% of all samples. ${text.b`Put another way`},
      If random samples were obtained over and over
      again, with β̱ⱼ and β̄ⱼ computed each time, then the (unknown)
      population value βⱼ would lie in the interval (β̱ⱼ and β̄ⱼ) for
      95% of the samples.
    `,
  ], [
    doc.h4`Testing Hypothesises`,
    doc.p`
      Back to hypothesis testing, if your null hypothesis
      is something like "${text.b`H₀: βⱼ = 0`}, then using
      rejecting null hypothesis is simply a matter getting
      a confindence interval which is not inclusive of zero.
    `,
  ]),
  doc.h3`⚠️ Important Assumption ⚠️`,
  doc.p`
    While this entire time we've been making assumptions about
    our data being normally distributed. It's is worth noting
    the way it is being described here in terms of calculation
    and based on an assumption is the fact the data is normally
    distributed. Especailly when you're involving the ${text.b`Central
    Limit Theorum`}.
  `,
));

export const testingHypothesisAboutASingleLinearCombinationOfParameters = createDoc(() => dashbox(
  container(
    w4Ref({ page: 136 }, doc.h2`Testing Hypothesis for a combination of parameters`),
    doc.p`
      This is where it gets more interesting. So far we have written tests
      for about indivisual parameters. However we can actually also write
      tests for more than one parameter at a time. Here's an example.
    `,
    doc.h4`Example`,
    twoThree(
      container(
        mathml.createMLR('Wage Model', 'wage', ['jc', 'univ', 'exper'], { yLog: true }),
        doc.p`
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
      doc.p`
        Besides the tests being different one thing you may
        notice now is the test statitic is now written different.
        We actually arrive at this by rearranging our hypothesis
        like on the right. And then plugging them into the
        earlier function.
      `,
      mathml.exampleOfMultiParaHypothesis.rearranged,
    ),
  ),
  container(
    doc.h4`Obtaining the Standard Error`,
    doc.p`
      We should have no problem obtaining our t statistic, and we
      can specify significance level and obtain a critical value
      using our degrees of freedom. ${doc.u`One thing we'll need to approach
      differently is ${text.b`obtaining our standard error`}`}.
    `,
    mathml.exampleOfMultiParaHypothesis.constraint,
    mathml.exampleOfMultiParaHypothesis.seConstraint,
    doc.p`
      You can solve for s${doc.sub`12`} using a bit of matrix algebra
      as shown below but lets also look at a simpler approach.
    `,
    responsiveGridAutoRow([
      mathml.exampleOfMultiParaHypothesis.matrixP1,
      mathml.exampleOfMultiParaHypothesis.matrixP2,
    ], { columns: { desktop: 'auto auto' } }),
  ),
  w4Ref({ page: 138 }, doc.h4`Something simpler than matrix math`),
  container(
    doc.p`
      Instead of computing the Standard Error of (β̂₁ - β̂₂)
      we can simply create a model that includes a coefficient
      that yields the same standard error.
    `,
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
    doc.p`
      Note the changes in the hypothesis test. The null is
      theta is zero, and the alternative is theta is less
      than zero. As it will now be trying to correct for
      the impact of coefficent of the combined years of
      study (junior college and four years at college).
    `,
  ),
));

export const fTest = createDoc(() => dashbox(
  container(
    w4Ref({ page: 134 },  doc.h2`F Test`),
    doc.p`
      While a ${text.b`t statistic`} associated with any OLS
      coefficient can be used to test whether its corresponding
      unknown population parameter is equal to any given constant
      (normally zero), and we've seen how to test the relationship
      between any two parameters. But what is we were like ${text.i`"fuck it
      lets test all the hypothesises"?`} Well you're in luck, it's called
      the ${text.b`F test`}.
    `,
    doc.h4`Testing Restrictions`,
    doc.p`
      One kind of test we can perform is one where we state that some variables
      ${text.b`d`}, ${text.b`d`}, and ${text.b`e`} have no effect when controlling
      for other varibles.
    `,
    mathml.createMLR('log Salary model', 'a', ['b', 'c', 'd', 'e', 'f'], { yLog: true }),
    twoThree(
      doc.p`
        On the right we have constructed a null hypothesis using
        multiple parameters. These are ${text.b`Exclusion restrictions`}
        that say ${text.i`if true, the subsequent regressors have no effect
        on the dependent variable and should be excluded from the model`}.
        This is also an example of a set of  ${text.b`multiple restictions`}
        as we are putting more than 1 restictions on the parameters. A set
        of multiple restirctions is also called a ${text.b`multiple hypothesis
        test`} or my preferred name ${text.b`joint hypothesis test`}.
      `,
      mathml.jointHypothesisTest,
    ),
    doc.p`
      Thankfully the alternative hypothesis is much simpler.
      ${text.b`Now how do we approach this`}?
      We can't test each statistically indivisually with
      the test statistic, because they put no restriction
      on the other parameters. We need to test the
      exclusion jointly to do so.
    `,
    columns('even-2', [
      doc.h4`Why can't we test each variable?`,
      doc.p`
        It may have crossed your mind (and admittedly mine as well) why not just
        look at the t statistics of each variables we want to omit? The problem
        is that a ${text.b`t statistic places no restrictions on the other parameters`},
        even if this wasn't an issue there are several logisitical issues that
        arise such as ${text.b`do we want to have the same or different significance
        level for each test`}? But ultimately it just an inappropiate methodology
        to test the claim. They need to be tested jointly.
      `,
    ], [
      doc.h4`Restricted model`,
      doc.p`
        This is our model in which we omit the variables we believe have no effect.
      `,
      doc.h4`Unrestricted model`,
      doc.p`
        This is our model where we omit no variables.
      `,
      doc.h4`Multiple Restrictions`,
      doc.p`
        This when a hypothesis is saying something about more than one parameter.
      `,
    ]),
    twoThree(
      doc.p`
        The result from checking the T statistic of each variable
        independently will consistently yield irrelevant results
        sometimes it will be correctly rejected or not rejected
        others it won't be. It's just the wrong methodology. Instead
        we will want to look at a method that places more emphasis on
        a difference in residuals between the restricted and
        unrestricted models.
      `,
      infobox({ title: 'What is q?' }).c(doc.p`This is the number of exclusion restrictions`),
    ),
  ),
  container(
    w4Ref({ page: 141 }, doc.h3`Methodology — F Stat`),
    responsiveGridAutoRow([
      mathml.fStat,
      mathml.fStatDistribution,
    ], { columns: { desktop: 'auto auto' } }),
    doc.p`
      Our null hypothesis will roughly state the ${text.b`q`}
      excluded variables will be zero. Above we define the
      ${text.b`F Statistic`} which can be broken down like so:
    `,
    text.ul(
      doc.li`${text.b`numerator`}: differences in residuals divided by the number of omitted.`,
      doc.li`${text.b`demonator`}: unrestricted divided by normal degrees of freedom.`,
    ),
    twoThree(
      doc.p`
        The F Statistic, will never be negative. In order to test it we need to
        know the critical value and rejection rules, and in order to get those
        we must know the sampling distribution under the null hypothesis. Once
        we know that we let ${text.b`c be the 95${doc.sup`th`} percentile`} from
        the F distribution and the rejection rule is ${text.b`F > c`}.
        When we reject the ${text.b`null hypothesis`} we say the excluded variables
        are ${text.b`jointly statistically significant`} (or jointly significant).
        When we fail to reject the ${text.b`null hypothesis`} we say those excluded
        variables are ${text.b`jointly insignificant`}.
      `,
      infobox({ title: 'When to use this?' }).c(
        doc.p`
          When the omitted variables are highly correlated
          and exhibt multicollinearity sometimes their t
          statistic will be statically insignificant, and
          the multicollinearity makes it difficult to
          uncover the effect of each variable.
        `,
      ),
    ),
  ),
  container(
    twoColumns(
      container(
        doc.h4`Relationship between F and t Statistic`,
        text.ul(
          doc.li`Do we have two seperate ways of testing hypothesis about a single coefficent?${text.ul(
            doc.li`
              No, as either approach using the F statistic and t statistic
              will lead to the same outcome.
            `,
          )}`,
          doc.li`
            In practise there really is no good reason to use the
            F statistic over the t statistic for a single variable.
          `,
        ),
      ),
      container(
        doc.h4`The R-Squared From of the F statistic`,
        mathml.fStatInTermsOfRSq,
        doc.p`
          While the R-squared form of the F statistic is very convenient for
          testing exclusion restrictions, it cannot be applied for testing all
          linear restrictions.
        `,
      ),
    ),
    twoColumns(
      container(
        doc.h4`Writing P values for F Statistics`,
        mathml.pValues,
        doc.p`
          Let ℱ be an F random variable with (q,n2 k2 1) degrees of freedom.
          The P Value has a similar interpretation as it does for the
          t statistic, in that it is the probability of observing the value
          of F in the even the null hypothesis is true.
        `,
      ),
      container(
        doc.h4`The F Statistic for Overall Significance of a Regression`,
        doc.p`
          Sometimes the F statistic is used to reject the
          null hypothesis that none of the explanatory
          variables has an effect on the depentent variable.
          With an alternative that at least one of the
          coefficients is different from zero.
        `,
        doc.p`
          This tends to be what most statisical packages
          report by default.
        `,
      ),
    ),
    container(
      w4Ref({ page: 148 }, doc.h4`Testing General Linear Restrictions`),
      doc.p`
        This is the most important application of the F statistic. Note
        this is different from exclusion restrictions but instead
        more general linear restrictions (where you can't use the
        F statistic based on the R squared).
      `,
      mathml.testingGeneralLinearRestrictions.null,
      responsiveGridAutoRow([
        mathml.testingGeneralLinearRestrictions.unrestricted,
        mathml.testingGeneralLinearRestrictions.restricted,
      ], { columns: { desktop: 'auto auto auto' } }),
    ),
    doc.p`
      In some cases if you use the t statistic to check
      each variable you may fail to correclty reject
      the null hypothesis. Again this is because this is
      aj ${text.b`joint hypothesis`}.
    `,
  ),
));

export const fDistribution = createDoc(() => container(
  doc.details.c(
    doc.summary({ className: 'grid-layout pink' }).c(
      doc.h4`10% Critical Values of F Distribution`,
    ),
    doc.br(),
    dashbox(
      tables.criticalValuesFDistribution10p,
    ),
  ),
  doc.details.c(
    doc.summary({ className: 'grid-layout pink' }).c(
      doc.h4`5% Critical Values of F Distribution`,
    ),
    doc.br(),
    dashbox(
      tables.criticalValuesFDistribution5p,
    ),
  ),
  doc.details.c(
    doc.summary({ className: 'grid-layout pink' }).c(
      doc.h4`1% Critical Values of F Distribution`,
    ),
    doc.br(),
    dashbox(
      tables.criticalValuesFDistribution1p,
    ),
  ),
));
