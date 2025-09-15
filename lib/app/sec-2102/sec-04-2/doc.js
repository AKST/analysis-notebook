/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import { createDoc } from '../common/util.js';
import { infobox, ulLight, dashbox, todo } from '../common/components.js';
import { twoColumns, twoThree, container } from '../common/layout.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

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
        'Macroeconomics 2', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W4, Lecture 2']],
      ]],
    ),
    infobox('Resources', [
      doc.p('See here for resources relating to the lesson'),
    ]),
  ),
));

export const dummy = createDoc(() => dashbox(
  ['h2', 'blah'],
  todo({}, 'content'),
));
