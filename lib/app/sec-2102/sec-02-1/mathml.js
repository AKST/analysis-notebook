/**
 * @import { E } from '../../prelude-type.ts';
 */
import { frag, mathml } from '../../prelude.js';
import { mathmlHelper } from '../prelude.js';

const {
  sum, i, sub, o, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, matrix, SPECIAL, under,
  table, subsup,
} = mathml;

const { Pi, alpha, Delta, delta2: delta } = SPECIAL.greek;
const { implies, eq, eqId, mul3, mul2, add, minus, minusP } = mathmlHelper;

const vars = {
  capital: i('K'),
  captial0: sub(i('K'), n(0)),
  captial1: sub(i('K'), n(1)),
  capitalE: sup(i('K'), paren([n(1), o('-'), alpha])),
  capitalEq: sup(i('K'), o('*')),
  capitalEEq: sup(i('K'), row([o('*'), paren([n(1), o('-'), alpha])])),
  captialET: subsup(i('K'), i('t'), paren([n(1), o('-'), alpha])),
  captialT: sub(i('K'), i('t')),
  captialTLast: sub(i('K'), paren([i('t'), o('-'), n(1)])),
  captialTNext: sub(i('K'), paren([i('t'), o('+'), n(1)])),
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
  knowledgeGrowthRate: i('ḡ'),
  labour: i('L'),
  labourE: sup(i('L'), alpha),
  labourT: sub(i('L'), i('t')),
  labourAT: sub(i('L'), row([i('a'), i('t')])),
  labourY: sub(i('L'), i('y')),
  labourYT: sub(i('L'), row([i('y'), i('t')])),
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
  researchProductivity: i('z̄'),
  researchSector: i('𝓁̄'),
  tech: i('A'),
  tech0: sub(i('A'), n(0)),
  techT: sub(i('A'), i('t')),
  techTNext: sub(i('A'), paren([i('t'), o('+'), n(1)])),
  techFixed: i('Ā'),
  output: i('Y'),
  outputT: sub(i('Y'), i('t')),
  outputTPerCapita: sub(i('y'), i('t')),
  outputEq: sup(i('Y'), o('*')),
  outputEqPerCapita: sup(i('y'), o('*')),
};

/**
 * @returns {E.Item}
 */
export const irsExampleOfDoublingTechnology = () => (
  ['div', { style: 'background: red; color: white' }, ['todo computer chips example']]
);

/**
 * @retursn {E.Item}
 */
export const constantGrowth = mathml([
  eq(i('ḡ'), row([i('z̄'), i('ℓ̄'), i('L̄')])),
]);

/**
 * @returns {E.Item}
 */
export const romerGrowthModel = () => mathml([
  eq(vars.outputT, mul2(vars.techT, vars.labourYT)),
]);

/**
 * @returns {E.Item}
 */
export const romerModelProductionOfNewIdeas = () => mathml([
  eq(frag([Delta, vars.techTNext]), mul3(vars.researchProductivity, vars.techT, vars.labourAT)),
]);

/**
 * @returns {E.Item}
 */
export const romerLabour = () => mathml([
  eq(vars.labour, add(vars.labourAT, vars.labourYT)),
]);

/**
 * @returns {E.Item}
 */
export const romerLabourResearch = () => mathml([
  eq(vars.labour, add(vars.labourAT, vars.labourYT)),
]);

/**
 * @returns {E.Item}
 */
export const romerLabourOutput = () => mathml([
  eq(vars.labourYT, mul2(minusP(n(1), vars.researchSector), vars.labour)),
]);

/**
 * @returns {E.Item}
 */
export const romerGrowthRateOfKnowledge = () => mathml([
  eq(vars.knowledgeGrowthRate, mul3(
    vars.researchProductivity,
    vars.researchSector,
    vars.labour,
  )),
]);

/**
 * @returns {E.Item}
 */
export const stockOfKnowledge = () => mathml([
  eq(vars.techT, mul2(
    vars.tech0,
    sup(paren([add(n(1), vars.knowledgeGrowthRate)]), i('t')),
  )),
]);

/**
 * @returns {E.Item}
 */
export const perCapitaStockOfKnowledge = () => mathml([
  eq(vars.outputTPerCapita, mul3(
    vars.tech0,
    minusP(n(1), vars.researchSector),
    sup(paren([add(n(1), vars.knowledgeGrowthRate)]), i('t')),
  )),
]);

/**
 * @returns {E.Item}
 */
export const romerSolvingAssumptions = () => (
  ['div', { style: 'background: red; color: white' }, ['knowledge stock assumption']]
);


/**
 * @returns {E.Item}
 */
export const romerGrowthAccounting = () => mathml([
  eq(sub(i('g'), frag([i('Y'), i('t')])), add(
    sub(i('g'), frag([i('A'), i('t')])),
    add(
      frag([frac([n(1)], [n(3)]), sub(i('g'), frag([i('K'), i('t')]))]),
      frag([frac([n(2)], [n(3)]), sub(i('g'), frag([i('L'), i('y'), i('t')]))]),
    ),
  ))
]);

/**
 * @returns {E.Item}
 */
export const romerGrowthAccounting2 = () => mathml([
  eq(under(minusP(
    sub(i('g'), frag([i('Y'), i('t')])),
    sub(i('g'), frag([i('L'), i('t')])),
  ), text('growth of Y/L')), add(
    under(row([
      frac([n(1)], [n(3)]),
      minusP(
        sub(i('g'), frag([i('K'), i('t')])),
        sub(i('g'), frag([i('L'), i('t')])),
      ),
    ]), text('contribuion from K/L')),
    add(
      under(row([
        frac([n(2)], [n(3)]),
        minusP(
          sub(i('g'), frag([i('L'), i('y'), i('t')])),
          sub(i('g'), frag([i('K'), i('t')])),
        ),
      ]), text('labour Component')),
      under(sub(i('g'), frag([i('A'), i('t')])), text('TFP Growth')),
    ),
  ))
]);

/**
 * @returns {E.Item}
 */
export const continiousA = () => mathml([
  eq(call('A', i('t')), frag([
    vars.tech0, sup(i('e'), row([i('g'), i('t')])),
  ])),
]);

/**
 * @returns {E.Item}
 */
export const continiousY = () => mathml([
  eq(call('Y', i('t')), mul3(
    call('A', i('t')),
    sup(row([call('K', i('t'))]), row([n(1), o('-'), alpha])),
    sup(row([call('Ly', i('t'))]), alpha),
  )),
]);

/**
 * @returns {E.Item}
 */
export const continiousK = () => mathml([
  eq(call('K', i('t')), sup(row([o('['), row([
    add(
      mul2(
        subsup(i('K'), n(0), alpha),
        sup(i('e'), row([o('-'), alpha, vars.depreciation, i('t')])),
      ),
      frag([
        frac([
          mul2(
            mul2(alpha, vars.iFactor),
            mul2(vars.tech0, sup(vars.labourY, alpha)),
          ),
        ], [add(i('g'), mul2(alpha, vars.depreciation))]),
        minusP(
          sup(i('e'), row([i('g'), i('t')])),
          sup(i('e'), row([o('-'), alpha, vars.depreciation, i('t')])),
        ),
      ]),
    ),
  ]), o(']')]), frac([n(1)], [alpha]))),
]);
