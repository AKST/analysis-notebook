/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc, table } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container } = prelude.layout;
const { infobox, ulLight, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

/**
 * @type {Record<string, E.Item>}
 */
const LINKS = {
};

const TABLES = {
  terminology: table(['Y', 'X'], [
    ['Dependent variable', 'Independent variable'],
    ['Explained variable', 'Explanatory variable'],
    ['Response variable', 'Control variable'],
    ['Predicted variable', 'Predictor variable'],
    ['Regressand variable', 'Regressor variable'],
  ])
};

const ASSUMPTIONS = {

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
        'Simple Regression Model', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W1, Lecture 2']],
      ]],
      doc.small(`
        To start with analysing cross sectional data we are
        going to look at simple regression models.
      `),
    ),
    infobox('Resources', [container(
      doc.p('See chapter 2 of the textbook.'),
    )]),
  ),
));

export const models = createDoc(() => dashbox(
  ['h2', 'Modelling and understanding problems'],
  twoColumns(
    container(
      ['h3', 'Theoretical Model'],
      doc.small(`
        When tackling economic problems or understanding the
        economic nature of a system (an economy, institution,
        industry, etc), or economic characteristic of a system
        and its partipants, it helps to start with an theoretical
        model in which modifications to the system can be thought
        through and quantitied.
      `),
      doc.small(`
        In a way its an attempt to explain the nature of the economic
        system in terms of the thing in of itself, and it can be
        expressed in terms of properties that observable and unobservable.
        The problem of measuring these things will come later.
      `),
    ),
    container(
      ['h3', 'Economic Models'],
      doc.small(`
        This can also be thought of an `, doc.b('Econometric model'), `
        and its when we start to concern ourselves with what we can
        and cannot measure. The goal is to map theory to what we can
        observe, and vice versa. Eventually to see where reality relates
        to these models, or if our models are actually representive of
        reality.
      `),
      doc.small(`
        Given the focus on what we can measure, we only include
        what we can measure within the model. In a simple
        linear regression model, this is captured in the error term,
        so there are at least some way of accounting for these in
        relative terms to what we can observe. We call these `,
        doc.b('unobservable variables'), '.',
      ),
    ),
  ),
));

export const linearRegression = createDoc(() => dashbox(
  ['h2', 'Linear Regression'],
  ['h3', 'Terminology'],
  twoThree(
    container(
      doc.figure(mathml.simpleLinearRegresion, 'Simple Linear regression'),
      doc.small(doc.b('u'), `
        is sometimes called the erro term of distubance in
        the relationship, representing factors other than
        x that affect y. You can also simply think of it as `,
        doc.b('unobserved'), '.',
      ),
    ),
    TABLES.terminology,
  ),
  ['h3', 'Population Assumptions and Definitions'],
  twoColumns(
    container(
      ['h4', 'Linear Effect of X on Y'],
      doc.figure(mathml.xyFunctionalRelationship, 'Linear effect requirement'),
      doc.small(`
        Given the above is derived from the regression with β₀, we should
        see a zero change in u with an increase in x, this also means β₁
        is the `, doc.b('slope'), ` of the relationship between x and y.
      `),
    ),
    container(
      ['h4', 'Average value of u'],
      doc.figure(mathml.assumeExpectedUToBe0, 'Average u in the population given β₀'),
      doc.small(`
        One assumption we need to make before we assume how x and u
        relate to one another is that for our model the average u
        in the population should be zero.
      `),
    ),
  ),
  container(
    ['h4', 'Average U does not depent on X'],
    doc.figure(mathml.assumeExpectedUDoesNotDependOnX, 'Assume U does not depend on X'),
    doc.small(`
      This says that the average `, doc.b('u'), ` across the
      population determined by x is equal to the average `, doc.b('u'), `
      over the population. Put another way, this says that u is `,
      doc.b('mean independent'), ` of x. Combining this with E(u) = 0,
      we get the zero conditional mean assumption.
    `),
    doc.figure(mathml.assumeZeroConditionalMean, 'Zero Conditional mean assumption'),
  ),
  ['hr'],
  container(
    ['h4', 'Population regression function'],
    doc.figure(mathml.populationRegressionFunction, 'Population Regression Function'),
    doc.small(`
      The right hand side does not mean, y = [right hand side]. It is
      more accurate to read it as a one input increase in x changes the
      expected value by the amount of β₁. So if you collected all observations
      of Y and X where Y was the same value, you'd see a normal distribution
      for all the values of X where the average value was (Y - β₀) ÷ β₁.
      Given this we can break the regression down into 2 components:
    `),
    doc.small(ulLight([
      doc.span(doc.b('Systematic part of y'), ': E(y|x) or β₀ + β₁x'),
      doc.span(doc.b('Unsystematic part of y'), ': u, or the part y not explained by x'),
    ])),
  ),
));

export const estimation = createDoc(() => dashbox(
  ['h2', 'Estimation'],
  ['h3', 'Population vs Sample Regression'],
  doc.small(`
    In reality we only work with a sample of the population.
  `),
  note(
    'It is expensive to observe the entire population',
    'As a result you work with samples',
  ),
  ['h3', 'On notation'],
  note(
    'Estimates are denoted hats',
    'An example an estimate of y would be written as ŷ',
  ),
));

export const ols = createDoc(() => dashbox(
  ['h2', 'Simple Regression Model'],
  note(
    'talk about linear regression',
    'talk about ordinary least squares',
  ),
  ['h3', 'OLS Intuition'],
  todo({}, 'revisit notes'),
  ['h3', 'OLS, Ordinary Least Squares'],
  note(
    doc.p('It\'s a fit that is as good as possible through the data'),
    doc.p('û', ['sub', 'i'], ' is the distance between y', ['sub', 'i'], ' and ŷ', ['sub', 'i']),
    doc.p('Revisit the significance of the square of the û', ['sub', 'i']),
  ),
  todo({}, 'Insert formular of Ordinary least square from slide 11 & 17'),
));

export const simulatedExample = createDoc(() => dashbox(
  ['h2', 'Simulated Example'],
  todo({}, 'revisit notes, pages 19 - 23'),
  ['h3', 'β̂₁ as a Random Variable'],
  todo({}, 'Complete notes from slide 24'),
  note(
    'β̂₁ is a random variable, because every time you go into the field you get different results',
  ),
  todo({}, 'show histogram of a distribution of the random variable β̂₁'),
));

export const summary = createDoc(() => dashbox(
  ['h2', 'Conclusion'],
  doc.small('main points are...'),
  note(
    'Population regression',
    'Sample regression',
    'Estimation',
    'Fitted values',
    'Regression risduals',
    'Understand why estimated parameteres are (ex-ante) random variables',
  ),
));
