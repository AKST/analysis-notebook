/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml } from '../../prelude.js';

const {
  sum, i, sub, o, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, matrix, SPECIAL, under,
  table, subsup,
} = mathml;

const { Pi, alpha, Delta, delta2: delta } = SPECIAL.greek;

const vars = {
  capital: i('K'),
  captial0: sub(i('K'), n(0)),
  captial1: sub(i('K'), n(1)),
  capitalE: sup(i('K'), paren([n(1), o('-'), alpha])),
  capitalEq: sup(i('K'), o('*')),
  captialET: subsup(i('K'), i('t'), paren([n(1), o('-'), alpha])),
  captialT: sub(i('K'), i('t')),
  captialTLast: sub(i('K'), paren([i('t'), o('-'), n(1)])),
  captialTNext: sub(i('K'), paren([i('t'), o('-'), n(1)])),
  capitalPerWorker: i('k̄'),
  capitalPerWorkerE: sup(i('k̄'), paren([n(1), o('-'), alpha])),
  captialFixed: i('K̄'),
  captialFixedE: sup(i('K̄'), paren([n(1), o('-'), alpha])),
  consumption: i('C'),
  consumptionT: sub(i('C'), i('t')),
  iFactor: i('s̄'),
  investment: i('I'),
  investment0: sub(i('I'), n(0)),
  investmentT: sub(i('I'), i('t')),
  deltaY: row([delta, i('Y')]),
  deltaK: row([delta, i('K')]),
  deltaL: row([delta, i('L')]),
  deltaYOverK: frac([delta, i('Y')], [delta, i('K')]),
  deltaYOverL: frac([delta, i('Y')], [delta, i('L')]),
  depreciation: i('d̄'),
  labour: i('L'),
  labourE: sup(i('L'), alpha),
  labourT: sub(i('L'), i('t')),
  labourEq: sup(i('L'), o('*')),
  labourET: subsup(i('L'), i('t'), alpha),
  labourFixed: i('L̄'),
  labourFixedE: sup(i('L̄'), alpha),
  partialDeltaK: frac([delta], [delta, i('K')]),
  partialDeltaL: frac([delta], [delta, i('L')]),
  realWage: i('w'),
  realWageEq: sup(i('w'), o('*')),
  realProfits: Pi,
  realRentPaidToCapital: i('r'),
  realRentPaidToCapitalEq: sup(i('r'), i('*')),
  tech: i('A'),
  techFixed: i('Ā'),
  output: i('Y'),
  outputT: sub(i('Y'), i('t')),
  outputEq: sup(i('Y'), o('*')),
  outputEqPerCapita: sup(i('y'), o('*')),
};

/** @param {E.Item} a @param {...E.Item} b */
const eq = (a, ...b) => frag([a, space(4), o('='), space(4), ...b]);

/** @param {E.Item} a @param {...E.Item} b */
const eqId = (a, ...b) => frag([a, space(4), o('≡'), space(4), ...b]);

/** @param {E.Item} a @param {E.Item} b */
const add = (a, b) => frag([a, space(4), o('+'), space(4), b]);

/** @param {E.Item} a @param {E.Item} b  @param {E.Item} c */
const add3 = (a, b, c) => frag([
  a, space(4), o('+'), space(4),
  b, space(4), o('+'), space(4),
  c,
]);

/** @param {E.Item} a @param {E.Item} b */
const minus = (a, b) => frag([
  a, space(4), o('-'), space(4), b,
]);

/** @param {E.Item} a @param {E.Item} b */
const mul2 = (a, b) => frag([
  a, space(6), b,
]);

/** @param {E.Item} a @param {E.Item} b  @param {E.Item} c */
const mul3 = (a, b, c) => frag([
  a, space(6), b, space(6), c,
]);

export const temporalOutput = mathml([
  eq(vars.outputT, mul3(
    vars.techFixed,
    vars.captialET,
    vars.labourET,
  )),
]);

export const resourceConstraint = mathml([
  eq(vars.outputT, add(vars.consumptionT, vars.investmentT)),
]);

export const capitalAccumulation = mathml([
  eq(vars.captialTNext, minus(
    add(vars.captialT, vars.investmentT),
    frag([vars.depreciation, vars.captialT]),
  )),
]);

export const capitalAccumulation2 = mathml([eqId(
  minus(vars.captialT, vars.captialTNext),
  eq(frag([Delta, vars.captialTNext]), minus(
    vars.investmentT,
    frag([vars.depreciation, vars.captialT])
  )),
)]);

export const initialStock = mathml([eq(
  frag([Delta, vars.captial0]),
  minus(
    vars.investment0,
    frag([vars.depreciation, vars.captial0])
  ),
)]);

export const exogenousLabour = mathml([
  eq(vars.labourT, vars.labourFixed),
]);

export const investmentDynamics = mathml([
  eq(vars.investmentT, mul2(vars.iFactor, vars.outputT)),
]);

export const consumptionDynamics = mathml([
  eq(vars.consumptionT, mul2(
    paren([minus(n(1), vars.iFactor)]),
    vars.outputT
  )),
]);
