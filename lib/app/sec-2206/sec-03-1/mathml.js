/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml, doc } from '../../prelude.js';
import { components, mathmlHelper } from '../prelude.js';

const {
  call, o, i, n, sup, sub, sum, subsup,
  paren, row, rows, text, space, over, frac,
  SPECIAL, inv,
} = mathml;

const { todo } = components;

const {
  greek: {
    beta, betaCrfx, Delta,
    rho, rhoCrfx,
    sigma, sigmaCrfx,
  },
} = mathml.SPECIAL;

const vars = {
  y: i('y'),
  yi: sub(i('y'), i('i')),
  yEst: i('ŷ'),
  yEstI: sub(i('ŷ'), i('i')),
  ysm: i('ȳ'),
  u: i('u'),
  ui: sub(i('u'), i('i')),
  uEst: i('û'),
  uEstI: sub(i('û'), i('i')),
  x: i('x'),
  xi: sub(i('x'), i('i')),
  xsm: i('x̄'),

  b0: sub(beta, n(0)),
  b1: sub(beta, n(1)),
  b0Est: sub(betaCrfx, n(0)),
  b1Est: sub(betaCrfx, n(1)),
  colXY: sub(rho, row([i('x'), i('y')])),
  colXYEst: sub(rhoCrfx, row([i('x'), i('y')])),
  stddevX: sub(sigma, i('x')),
  stddevXEst: sub(sigmaCrfx, i('x')),
  stddevY: sub(sigma, i('y')),
  stddevYEst: sub(sigmaCrfx, i('y')),
};

const {
  eqId, eq, add, mul2, mul3, minusSqP,
  minus, minusP, add3,
} = mathmlHelper;

/** @param {...E.Item} body */
const E = (...body) => call('E', frag([...body]))

/** @param {E.Item} a @param {E.Item} b */
const Covar = (a, b) => call('Covar', a, b)

const summaise = sum(i('n'), row([i('i'), o('='), n(0)]));

export const samplingDistribution = doc.figure(
  todo({}, 'See Slide 3'),
  'Normal Sampling Distribution under MLR1-6',
);

export const tDistributionOfEstimators = doc.figure(
  todo({}, 'See Slide 6'),
  'Normal Sampling Distribution under MLR1-6',
);

export const tStatistic = doc.figure(
  todo({}, 'See Slide 13'),
  'T Statistic',
);
