/**
 * @import { E } from '../../prelude-type.ts';
 */

import { doc, table } from '../../prelude.js';
import { components } from '../prelude.js';

const { clsRef, todo } = components;

export const quantityOfMoney = doc.figure(
  todo({}, 'Quantity of Money'),
  clsRef({
    book: { chapter: 8, page: 218 },
    lec: { id: [4, 'M'], slide: 19 },
  }, 'Quntity of Money'),
);

export const classicalDichotomy = {
  velocity: doc.figure(
    todo({}, 'Velocity Of Money'),
    'Velocity Of Money',
  ),
  supplyOfMoney: doc.figure(
    todo({}, 'Supply Of Money'),
    'Supply Of Money',
  ),
  realGDP: doc.figure(
    todo({}, 'Real GDP'),
    'Real GDP',
  ),
}

export const priceLevelOfMoney = doc.figure(
  todo({}, 'Price Level of Money'),
  clsRef({
    book: { chapter: 8, page: 219 },
    lec: { id: [4, 'M'], slide: 26 },
  }, 'Price Level of Money'),
);

export const theoryOfInflation = doc.figure(
  todo({}, 'Theory Of Inflation'),
  clsRef({
    book: { chapter: 8, page: 220 },
    lec: { id: [4, 'M'], slide: 29 },
  }, 'Theory Of Inflation'),
);

export const inflationRate = doc.figure(
  todo({}, 'Theory Of Inflation'),
  clsRef({
    lec: { id: [4, 'M'], slide: 30 },
  }, 'Theory Of Inflation'),
);

export const fisherEquation = doc.figure(
  todo({}, 'Fisher Equation'),
  clsRef({
    lec: { id: [4, 'M'], slide: 36 },
    book: { chapter: 8, page: 223 },
  }, 'Fisher Equation'),
);

export const governmentBudgetConstraint = doc.figure(
  todo({}, 'Govt Budget Constraint'),
  clsRef({
    lec: { id: [4, 'M'], slide: 45 },
    book: { chapter: 8, page: 228 },
  }, 'The Government Budget Constraint'),
);
