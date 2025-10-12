/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container, responsiveGridAutoRow } = prelude.layout;
const { ulLightSm, clsRef, infobox, ulLight, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

/**
 * @type {Record<string, E.Item>}
 */
const LINKS = {
};

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ slide, page }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 5, page }) : undefined,
    lec: slide != null ? ({ id: [4, 'Th'], slide }) : undefined,
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


export const intro = createDoc(() => container(
  twoThree(
    container(
      doc.h1.of('Multiple Regression Analysis: Further Issues', doc.br(), (
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W4']]
      )),
    ),
    infobox('Resources', [
      ulLight([
        doc.span`Chapter 6`,
      ])
    ]),
  ),
));

export const dataScaling = createDoc(() => dashbox(
  ref({ page: 181 }, doc.h2`Effects of Data Scaling on OLS Statistics`),
  todo({}, 'content'),
));

export const moreOnFunctionalForm = createDoc(() => dashbox(
  ref({ page: 186 }, doc.h2`More on Functional Form`),
  todo({}, 'content'),
));

export const moreOnGoodnessOfFit = createDoc(() => dashbox(
  ref({ page: 195 }, doc.h2`More on Goodness-of-Fit and Selection of Regressors`),
  todo({}, 'content'),
));
