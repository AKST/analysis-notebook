/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
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
        'Intro to Econometrics', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W1, Lecture 2']],
      ]],
    ),
    infobox('Resources', [container(
      doc.small('See chapter 2 of the textbook.'),
    )]),
  ),
));

export const models = createDoc(() => dashbox(
  ['h2', 'Modelling and understanding problems'],
  twoColumns(
    container(
      ['h3', 'Theoretical Model'],
      doc.small(`
        This is a platonic model where you consider all the parameters
        and determinants and their effects on an outcome, regardless
        whether you can measure this or not. In a way this model reflects
        intutition.
      `),
      ['h4', 'Example, Wage model'],
      todo({}, 'SHOW theorical model'),
    ),
    container(
      ['h3', 'Economic Models'],
      doc.small(`
        This maps the theory into a model that can be observed. We
        need
      `),
      note(
        'This model can only include things we can measure',
        'This might not be everything you specify in the Theoretical model',
        'Those are called unobservable variables',
      ),
      ['h4', 'Example, Wage model'],
      todo({}, 'SHOW linear regression of wage model'),
      note(
        'talk about how coeffient explain observables',
        'talk about how error rate is the unobservables',
      ),
    ),
  ),
  ['h3', 'Economic Hypothesises'],
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
