/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { twoColumns, twoThree, container } from '@prelude-uni/layout.js';
import { text, infobox, dashbox, note, todo } from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';

const LINKS = {
  welcomeToStata: text.a({ href: 'https://www.princeton.edu/~otorres/Stata/' }),
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
        'Nature of Economic Data', doc.br(),
        doc.small({ style: 'color: #aaaaff' }).t`ECON2206, W1, Lecture 1`,
      ),
    ),
    infobox({ title: 'Resources' }).c(
      doc.p`Lesson resources`,
      text.ul(
        doc.li`Chapter 1 of textbook`,
        doc.li.c(LINKS.welcomeToStata.t`Welcome to Stata`),
      ),
    ),
  ),
));

export const about = createDoc(() => dashbox(
  doc.h2`What is Econometrics`,
  doc.p`
    Econometrics is largely about applying statical methods to
    estimate economic relations, testing economics theories and
    hypothesises, as well as evaluating and understanding
    government, business and institutional polices. However as
    a field it has developed as a seperate disccipline from
    mathemathical statistics.
  `,
  doc.p`
    While in the natural science experiments, are often performed under
    laboratory conditions where each variable can be
    controlled and understood, and there are no moral concequences from
    making variation between the control and test cohorts of an experiment.
    In the social sciences to do the same is often impossible, if it is possible
    it is likely an unjustiable use of resources to answer the question at hand
    and in many cases for some of most pressing moral issues such experiments
    would likely be morally repugnant.
  `,
  doc.p`
    In the absense of being able to apply those methods, those same questions
    still remain and in order to answer them as best we can we need to
    consider other methods, that's what econometrics is about.
  `,
  doc.h3`Type of data`,
  text.ul(
    doc.li`${text.b`Nonexperimental data`}:
      Not accumulated through controlled experiments on indivisuals firms, or
      any segment of the economy instead it's typically
      ${text.b`observational data`} or ${text.b`retrospective data`} to
      emphasize the fact the researcher is a passive collector of the data.
    `,
    doc.li`${text.b`Experimental data`}: collected under laboratory conditions,
      the bare minimum required for the natural sciences
    `,
  ),
  doc.p`
    Despite the constraints of nonexperimental data, econometricians try to
    borrow as much as they can from mathematical statisticians whenever possible.
  `,
  doc.h3`Empirical Ecnomic Analysis`,
  doc.p`
    Econometric methods are relevant in virtually all branches of applied economics.
    They come into play largely when there's an economic theory to be tested or
    relationship that needs testing in relation to a business policy or policy analysis.
    Testing these is called an ${text.b`Empirical analysis`}.
  `,
  text.ul(
    doc.li`Sometimes that means testing if something is consistent with an existing economic theory`,
    doc.li`Other times it may mean constructing a formal ${text.b`Economic model`}.`,
  ),
  todo({}, 'How utility maximisation is an underlying premise in many models, page 2'),
));

const crossSectionalData = container(
  doc.h4`Cross Sectional Data`,
  doc.p`A ${text.b`Cross sectional`} dataset consists
    of a sample of indivisual subjects at a specfic point in
    time. Although sometimes the data isn't observed precisely
    at the same time and instead during different points in a week
    or weeks in a year.
  `,
  doc.p`
    An important consideration with analyzing cross-sectional
    data is whether it was ${text.b`Randomly sampled`}.
    The absense off this can lead to serious limitations with
    the application of the dataset. Some cases where this can
    occur include:${text.ul(
      doc.li`An opt in wealth survey, seeing as wealth familes are less likely to disclose their wealth.`,
      doc.li`Population spread over a large geographic area and population is not large enough to assume observations are indepenent draws.`,
    )}
  `,
  todo({}, 'Provide example table'),
);

const timeSeriesData = container(
  doc.h4`Time Series Data`,
  doc.p`
    ${text.b`Time series Data`} is largely a dataset consisting of
    one or more observation per ${text.b`subject`} over time. Such
    as GDP, money, supply, CPI, certain crime stats. Another consideration
    is the ${text.b`time frame`} in which these observations are collected,
    or the ${text.b`sample rate`} in which data is collected.
  `,
  doc.p`
    A key feature of time series data that can make the more difficult to
    analysis than cross-sectional data is that economic observations can rarely
    if ever be assumed to be independent across time. For this reason more
    needs to be done in specifying econometric models for time series data
    before econometric methods can be justified.
  `,
  todo({}, 'Provide example table'),
);

const pooledCrossSectionalData = container(
  doc.h4`Pooled Cross Section`,
  doc.p`
    ${text.b`Pooled Cross Sectional`} data is a combination of cross
    sectional and time series features. One application of Pooling cross
    sectional data is to analysis a poliy effect before and after the
    implemenations of a policy.
  `,
  todo({}, 'Provide example table'),
);

const panelData = container(
  doc.h4`Panel or Longitudinal Data`,
  doc.p`
    A ${text.b`panel data`} (or longitudinal data) consists of a
    time series for each cross sectional subject of the dataset.
    How this varies from a ${text.b`Pooled cross sectional dataset`}
    is the samples in panel data consists of the same subjects
    repeatedly sampled.
  `,
  doc.p`
    While the structure of pooled cross sectional data is
    inclusive of panel data, the specific structure of panel
    data lends itself to specific kinds of analysis, answering
    questions that cannot be answered from analysis on a
    simple pooled cross sectional dataset.
  `,
  todo({}, 'Provide example of table'),
);

export const structureOfEconomicData = createDoc(() => dashbox(
  doc.h2`The Structure of Economic Data`,
  twoColumns(
    container(crossSectionalData, pooledCrossSectionalData),
    container(timeSeriesData, panelData),
  ),
));

export const causality = createDoc(() => dashbox(
  doc.h2`Causality, Ceteris Paribus, and Counterfactual Reasoning`,
  todo({}, 'Complete this section, page 10-14'),
));

