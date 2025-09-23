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
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W2, Lecture 1']],
      ]],
    ),
    infobox('Resources', [container(
      ulLight([
        'Chapter 2 of the textbook'
      ]),
    )]),
  ),
));

export const gaussMarkovAssumptions = createDoc(() => dashbox(
  ['h2', 'Gauss Markov Assumptions'],
  note(
    'Theorem 2.1, you need 4 assumptions to be met to have unbiased estimators',
  ),
  twoColumns(
    container(
      ['h4', 'SLR.1, Linear in parameters'],
      doc.small('model is linear in parameters'),
    ),
    container(
      ['h4', 'SLR.2, Random Sample'],
      doc.small(`
        It is drawn from a random sample of the population
      `),
    ),
  ),
  twoColumns(
    container(
      ['h4', 'SLR.3, '],
    ),
    container(
      ['h4', 'SLR.4, Zero Conditional mean'],
    ),
  ),
));

export const goodnessOfFit = createDoc(() => dashbox(
  ['h2', 'Goodness of Fit R²'],
  todo({}, 'content'),
));
