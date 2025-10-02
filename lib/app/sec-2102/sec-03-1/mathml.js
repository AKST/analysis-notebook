import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';

const { components: { todo } } = prelude;

export const unemploymentRate = doc.figure(
  todo({ leadingText: 'MATH' }, 'unemployment rate'),
  'The unemployment rate',
);

export const actualUnemployment = doc.figure(
  todo({ leadingText: 'MATH' }, 'actual unemployment'),
  'The actual unemployement',
);

export const bathtubModel = {
  labourForce: doc.figure(
    todo({ leadingText: 'MATH' }, 'Et + Ut = L'),
    'Labour Force',
  ),

  labourDynamics: doc.figure(
    todo({ leadingText: 'MATH' }, 'dynamics'),
    'Labour Dynamics',
  ),

  solveForUnemployment: doc.figure(
    todo({ leadingText: 'MATH' }, 'solve for unemployment'),
    'Solve for unemployment',
  ),

  unemploymentRate: doc.figure(
    todo({ leadingText: 'MATH' }, 'unemployment rate'),
    'Unemployment Rate',
  ),
};

export const valueOfHumanCapital = {
  presentDiscountedRate: doc.figure(
    todo({ leadingText: 'MATH' }, 'unemployment rate'),
    'Present discounted value',
  ),
};
