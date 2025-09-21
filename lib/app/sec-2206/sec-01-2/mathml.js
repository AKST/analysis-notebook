/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml } from '../../prelude.js';

const {
  call, o, i, n, sup, sub,
  row, text, space,
} = mathml;

const {
  greek: { beta, betaCrfx, Delta },
} = mathml.SPECIAL;

const vars = {
  y: i('y'),
  u: i('u'),
  x: i('x'),

  b0: sub(beta, n(0)),
  b1: sub(beta, n(1)),
  b0Est: sub(betaCrfx, n(0)),
  b1Est: sub(betaCrfx, n(1)),
};

/** @param {E.Item} a @param {...E.Item} b */
const eq = (a, ...b) => frag([a, space(4), o('='), space(4), ...b]);

/** @param {E.Item} a @param {E.Item} b */
const add = (a, b) => frag([a, space(4), o('+'), space(4), b]);

/** @param {E.Item} a @param {E.Item} b  @param {E.Item} c */
const add3 = (a, b, c) => frag([
  a, space(4), o('+'), space(4),
  b, space(4), o('+'), space(4),
  c,
]);


export const simpleLinearRegresion = mathml([
  eq(vars.y, add3(vars.b0, frag([vars.b1, vars.x]), vars.u)),
]);

export const xyFunctionalRelationship = mathml([
  eq(frag([Delta, vars.y]), frag([vars.b1, Delta, vars.x])),
  space(16), text('if'), space(16),
  eq(frag([Delta, vars.u]), n(0)),
]);

export const assumeExpectedUToBe0 = mathml([
  eq(call('E', vars.u), n(0)),
]);

export const assumeExpectedUDoesNotDependOnX = mathml([
  eq(call('E', frag([vars.u, o('|'), vars.x])), call('E', vars.u)),
]);

export const assumeZeroConditionalMean = mathml([
  eq(call('E', frag([vars.u, o('|'), vars.x])), n(0)),
]);
