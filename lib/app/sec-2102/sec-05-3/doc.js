
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


export const intro = createDoc(() => dashbox(
  ref({ page: 318 }, doc.h2`Introduction`),
  todo({}, 'content'),
));

export const theMPCurve = createDoc(() => container(
  ref({ page: 319 }, doc.h2`The MP Curve Monetary Policy and interest Rates`),
  dashbox(
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 321 }, doc.h3`From Nominal to Real Interest Rates`),
    mathml.interestRates,
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 323 }, doc.h3`The IS-MP Diagram`),
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 324 }, doc.h3`Example: The End of a Housing Bubble`),
    todo({}, 'content'),
  ),
));

export const philipCurve = createDoc(() => container(
  ref({ page: 327 }, doc.h2`The Phillips Curve`),
  dashbox(
    mathml.inflation,
    todo({}, 'content'),
    mathml.inflationChange,
  ),
  dashbox(
    ref({ page: 329 }, doc.h3`Price Shocks and the Phillips Curve`),
    mathml.inflationChange2,
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 329 }, doc.h3`Cost-Push and Demand-Pull Inflation`),
    todo({}, 'content'),
  ),
));

export const usingShortRunModel = createDoc(() => container(
  ref({ page: 332 }, doc.h2`Using the Short-Run Model`),
  dashbox(
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 333 }, doc.h3`The Volcker Disinflation`),
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 336 }, doc.h3`The Great Inflation of the 1970s`),
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 336 }, doc.h3`The Short-Run Model in a Nutshell`),
    mathml.inANutShell,
    todo({}, 'content'),
  ),
));

export const microFoundations = createDoc(() => container(
  ref({ page: 338 }, doc.h2`Microfoundations: Understanding Sticky Inflation`),
  dashbox(
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 338 }, doc.h3`The Classical Dichotomy in the Short Run`),
    todo({}, 'content'),
  ),
  ref({ page: 342 }, doc.h3`Microfoundations: How Central Banks Control Nominal Interest Rates`),
  dashbox(
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 343 }, doc.h3`Changing the Interest Rate`),
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 343 }, doc.h3`Why iₜ Instead of Mₜ?`),
    todo({}, 'content'),
  ),
));

export const insideTheFed = createDoc(() => container(
  ref({ page: 346 }, doc.h2`Inside the Federal Reserve`),
  dashbox(
    doc.h3`Conventional Monetary Policy`,
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 347 }, doc.h3`Open- Market Operations: How the Fed Controls the Money Supply`),
    todo({}, 'content'),
  ),
));

export const conclusions = createDoc(() => container(
  ref({ page: 348 }, doc.h2`Conclusions`),
  dashbox(
    todo({}, 'content'),
  ),
));
