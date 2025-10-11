
/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container } = prelude.layout;
const { clsRef, infobox, ulLight, dashbox, note, todo } = prelude.components;
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
        'The Short run', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W5, Lecture 1']],
      ]],
    ),
    infobox('Resources', [
      doc.p`See here for resources relating to the lesson`,
    ]),
  ),
));

export const intro = createDoc(() => container(
  ref({ page: 243 }, doc.h2`Introductions`),
  dashbox(
    note(),
  ),
));

export const theLongrunTheShortrun = createDoc(() => container(
  ref({ page: 244 }, doc.h2`The Long-Run, the Short-Run, shocks`),
  note(),
  dashbox(
    mathml.modelComparison,
    note(),
    twoColumns(
      container(
        doc.h3`Trends and Fluation`,
        mathml.actualOutput,
        note(),
        mathml.shortrunFluctuation,
      ),
      container(
        doc.h3`Short-Run Output in the US`,
        note(),
      ),
    ),
    twoColumns(
      container(
        doc.h3`Measusring Potenial Output`,
        note(),
      ),
      container(
        doc.h3`Inflation Rate`,
        note(),
      ),
    ),
  ),
));

export const theShortrunModel = createDoc(() => container(
  ref({ page: 251 }, doc.h2`The Short-Run Model`),
  dashbox(
    doc.h3`A graph of the short run model`,
    note(),
    doc.h3`How the short run model works`,
    note(),
    doc.h3`The Empirical Fit of the Phillips Curve`,
    note(),
  ),
));

export const okunsLaw = createDoc(() => container(
  ref({ page: 255 }, doc.h2`Okuns Law: Output and Unemployment`),
  dashbox(
    mathml.okunsLaw,
  ),
));

export const summary = createDoc(() => container(
  ref({ page: 258 }, doc.h2`Summary`),
  dashbox(
    note(),
  ),
));
