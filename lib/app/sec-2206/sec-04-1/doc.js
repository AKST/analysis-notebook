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
      doc.h1.of('Multiple Regression Analysis: OLS Asymptotics', doc.br(), (
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W4']]
      )),
    ),
    infobox('Resources', [
      ulLight([
        doc.span`Chapter 5`,
      ])
    ]),
  ),
));

export const introduction = createDoc(() => dashbox(
  ref({ page: 164 }, doc.h2`Intro`),
  todo({}, 'content'),
  note(
    doc.span`
      the fact that OLS is the best linear unbiased estimator under the full set of Gauss-
      Markov assumptions (MLR.1 through MLR.5) is a finite sample property
    `,
  ),
));

export const consistency = createDoc(() => dashbox(
  ref({ page: 164 }, doc.h2`Consistency`),
  mathml.page165,
  todo({}, 'Zero Mean and Zero Correlation'),
  todo({}, 'Deriving the Inconsistency in OLS'),
));

export const asymptoticNormality = createDoc(() => dashbox(
  ref({ page: 168 }, doc.h2`Asymptotic Normality and Large Sample Inference`),
  todo({}, 'Asymptotic Normality and Large Sample Inference'),
  todo({}, 'Other Large Sample Tests: The Lagrange Multiplier Statistic'),
  todo({}, 'The Lagrange Multiplier Statistic for q Exclusion Restrictions'),
));

export const asymptoticEfficiencyOfOLS = createDoc(() => dashbox(
  ref({ page: 175 }, doc.h2`Asymptotic Efficiency of OLS`),
));
