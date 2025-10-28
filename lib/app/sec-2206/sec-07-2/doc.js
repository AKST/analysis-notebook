/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container } = prelude.layout;
const { infobox, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

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
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W7, Lecture 2']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      doc.p`See here for resources relating to the lesson`,
    ),
  ),
));

export const dummy = createDoc(() => dashbox(
  doc.h2`blah`,
  todo({}, 'content'),
));
