import * as prelude from '../prelude.js';

const { components: { todo } } = prelude;

export const unemploymentRate =
  todo({ leadingText: 'MATH' }, 'unemployment rate');

export const actualUnemployment =
  todo({ leadingText: 'MATH' }, 'actual unemployment');

export const bathtubModel = {
  labourForce:
    todo({ leadingText: 'MATH' }, 'Et + Ut = L'),

  labourDynamics:
    todo({ leadingText: 'MATH' }, 'dynamics'),

  solveForUnemployment:
    todo({ leadingText: 'MATH' }, 'solve for unemployment'),

  unemploymentRate:
    todo({ leadingText: 'MATH' }, 'unemployment rate'),
};

export const valueOfHumanCapital = {
  presentDiscountedRate:
    todo({ leadingText: 'MATH' }, 'unemployment rate'),
};
