/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container } = prelude.layout;
const { text, clsRef, infobox, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ page, slide }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 16, page }) : undefined,
    lec: slide != null ? ({ id: [10, 'W'], slide }) : undefined,
  }, item)
);

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
        'Simultaneous Equations Models', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W10, Lecture 2']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      doc.p`See here for resources relating to the lesson`,
    ),
  ),
));

export const natureSimultaneousEquations = createDoc(() => container(
  ref({ page: 535 }, doc.h2`The Nature of Simultaneous Equations Models`),
  dashbox(
    twoThree(
      container(
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const simultaneityBiasOls = createDoc(() => container(
  ref({ page: 538 }, doc.h2`Simultaneity Bias in OLS`),
  dashbox(
    twoThree(
      container(
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const identifyingEstimatingStructural = createDoc(() => container(
  ref({ page: 539 }, doc.h2`Identifying and Estimating a Structural Equation`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 540 }, doc.h4`Identification in a Two-Equation System`),
        note(),
        ref({ page: 543 }, doc.h4`Estimation by 2SLS`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const systemsMoreThanTwo = createDoc(() => container(
  ref({ page: 545 }, doc.h2`Systems with More Than Two Equations`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 545 }, doc.h4`Identification in Systems with Three or More Equations`),
        note(),
        ref({ page: 546 }, doc.h4`Estimation`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const simultaneousEquationsTimeSeries = createDoc(() => container(
  ref({ page: 546 }, doc.h2`Simultaneous Equations Models with Time Series`),
  dashbox(
    twoThree(
      container(
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const simultaneousEquationsPanelData = createDoc(() => container(
  ref({ page: 549 }, doc.h2`Simultaneous Equations Models with Panel Data`),
  dashbox(
    twoThree(
      container(
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));
