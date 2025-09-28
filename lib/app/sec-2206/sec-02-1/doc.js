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
        'Multi Linear Regression', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W2, Lecture 1']],
      ]],
    ),
    infobox('Resources', [container(
      ulLight([
        'Chapter 3 of the textbook'
      ]),
    )]),
  ),
));

export const multipleLinearRegression = createDoc(() => dashbox(
  ['h2', 'Gauss Markov Assumptions'],
));
