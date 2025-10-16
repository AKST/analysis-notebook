
/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { responsiveGridAutoRow, twoColumns, twoThree, container } = prelude.layout;
const { clsRef, infobox, ulLight, ulLightSm, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

const LINKS = {
};

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ page, slide }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 9, page }) : undefined,
    lec: slide != null ? ({ id: [5, 'M'], slide }) : undefined,
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

export const header = createDoc(() => container(
  twoThree(
    container(
      ['h1', [
        'Macroeconomics 2', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W5, Lecture 2']],
      ]],
    ),
    infobox('Resources', [
      doc.p`See here for resources relating to the lesson`,
    ]),
  ),
));

export const intro = createDoc(() => container(
  ref({ page: 287 }, doc.h2`Introduction`),
  dashbox(
    mathml.moneyTransmission,
    todo({}, 'content'),
  ),
));

export const settingUpTheEconomony = createDoc(() => container(
  ref({ page: 288 }, doc.h2`Setting up the Economy`),
  dashbox(
    responsiveGridAutoRow([
      mathml.gdpExpenditure.output,
      mathml.gdpExpenditure.consumption,
    ], { columns: { desktop: 'auto auto' } }),
    responsiveGridAutoRow([
      mathml.gdpExpenditure.government,
      mathml.gdpExpenditure.exports,
      mathml.gdpExpenditure.imports,
      mathml.gdpExpenditure.investment,
    ], { columns: { desktop: 'auto auto auto auto' } }),
    todo({}, 'content'),
    container(
      ref({ page: 289 }, doc.h3`Consumption and Friends`),
      todo({}, 'content'),
    ),
    container(
      ref({ page: 289 }, doc.h3`The Investment Equation`),
      todo({}, 'content'),
    ),
    todo({}, 'full model'),
  ),
));

export const derivingTheIsCurve = createDoc(() => container(
  ref({ page: 292 }, doc.h2`Deriving the IS Curve`),
  dashbox(
    responsiveGridAutoRow([
      mathml.outputDecomposition.a,
      mathml.outputDecomposition.b,
    ], { columns: { desktop: 'auto auto' } }),
    responsiveGridAutoRow([
      mathml.outputDecomposition.c,
      mathml.outputDecomposition.d,
    ], { columns: { desktop: 'auto auto' } }),
    todo({}, 'content'),
    mathml.outputGap,
  ),
));

export const usingTheIsCurve = createDoc(() => container(
  ref({ page: 292 }, doc.h2`Using the IS Curve`),
  dashbox(
    todo({}, 'content'),
    container(
      ref({ page: 294 }, doc.h3`The Effect of a Change in the Interest rate`),
      mathml.outputGap,
      todo({}, 'content'),
    ),
    container(
      ref({ page: 294 }, doc.h3`An Aggregate Demand Shock`),
      todo({}, 'content'),
    ),
    container(
      ref({ page: 294 }, doc.h3`A Shock to Potential Output`),
      todo({}, 'content'),
    ),
    container(
      ref({ page: 294 }, doc.h3`Other Experiments`),
      todo({}, 'content'),
    ),
  ),
));

export const microfoundations = createDoc(() => container(
  ref({ page: 298 }, doc.h2`Microfoundations of the IS Curve`),
  dashbox(
    todo({}, 'content'),
    container(
      ref({ page: 301 }, doc.h3`Multiplier Effects`),
      mathml.consumptionShare,
      mathml.ISCurve,
      todo({}, 'content'),
    ),
    container(
      ref({ page: 303 }, doc.h3`Investment`),
      mathml.investmentLevel,
      todo({}, 'content'),
    ),
    container(
      ref({ page: 303 }, doc.h3`Government purchases`),
      todo({}, 'content'),
    ),
    container(
      ref({ page: 309 }, doc.h3`Net Exports`),
      todo({}, 'content'),
    ),
  ),
));

export const conclusion = createDoc(() => container(
  ref({ page: 309 }, doc.h2`Conclusion`),
  dashbox(
    todo({}, ''),
  ),
));
