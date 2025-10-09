/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { responsiveGridAutoRow, twoColumns, twoThree, container } = prelude.layout;
const { clsRef, infobox, ulLight, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

/**
 * @type {Record<string, E.Item>}
 */
const LINKS = {
  monsterOfInflation: ['a', { href: 'https://www.youtube.com/watch?v=pbgY0dYoBvA' }, ['The monster of Inflation']],
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

export const header = createDoc(() => container(
  twoThree(
    container(
      ['h1', [
        'Inflation', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W4, Lecture 1']],
      ]],
    ),
    infobox('Resources', [
      ulLight([LINKS.monsterOfInflation]),
    ]),
  ),
));

export const intro = createDoc(() => dashbox(
  clsRef({
    book: { chapter: 8, page: 212 },
    lec: { id: [4, 'W'], slide: 3 },
  }, ['h2', 'Intro']),
));

export const quantityTheoryOfMoney = createDoc(() => container(
  clsRef({
    book: { chapter: 8, page: 216 },
    lec: { id: [4, 'W'], slide: 14 },
  }, ['h2', 'Quantity Theory of Money']),
  dashbox(
    clsRef({ book: { chapter: 8, page: 216 } }, ['h3', 'Measures of money supply']),
    mathml.quantityOfMoney,
    note(),
  ),
  dashbox(
    clsRef({
      lec: { id: [4, 'W'], slide: 20 },
    }, ['h3', 'The Classical Dichotomy']),
    responsiveGridAutoRow([
      mathml.classicalDichotomy.velocity,
      mathml.classicalDichotomy.supplyOfMoney,
      mathml.classicalDichotomy.realGDP,
    ], {
      columns: { desktop: 'auto auto auto' },
    }),
    note(),
  ),
  tables.moneyTerms,
));

export const priceLevelsOfMoney = createDoc(() => dashbox(
  clsRef({
    lec: { id: [4, 'W'], slide: 26 },
  }, ['h3', 'Price Level of Money']),
  mathml.priceLevelOfMoney,
  note(),
));

export const theoryOfInflation = createDoc(() => dashbox(
  clsRef({
    lec: { id: [4, 'W'], slide: 26 },
  }, ['h3', 'Theory Of Inflation']),
  responsiveGridAutoRow([
    mathml.theoryOfInflation,
    mathml.inflationRate,
  ], { columns: { desktop: 'auto auto' } }),
  note(),
));

export const realAndNominalInterest = createDoc(() => dashbox(
  clsRef({
    lec: { id: [4, 'W'], slide: 33 },
  }, ['h2', 'Real And Nominal Interest Rate']),
  mathml.fisherEquation,
  note(),
));

export const costOfInflation = createDoc(() => dashbox(
  clsRef({
    lec: { id: [4, 'W'], slide: 40 },
  }, ['h2', 'Cost of Inflation']),
  note(),
));

export const fiscalCausesOfHighInflation = createDoc(() => container(
  clsRef({
    lec: { id: [4, 'W'], slide: 46 },
  }, ['h2', 'Fiscal Causes Of High Inflation']),
  dashbox(
    mathml.governmentBudgetConstraint,
    note(),
  ),
  dashbox(
    clsRef({
      lec: { id: [4, 'W'], slide: 47 },
      book: { chapter: 8, page: 228 },
    }, ['h3', 'Inflation Tax']),
    note(),
  ),
  dashbox(
    clsRef({
      lec: { id: [4, 'W'], slide: 48 },
      book: { chapter: 8, page: 229 },
    }, ['h3', 'Central Bank Independence']),
    note(),
  ),
));
