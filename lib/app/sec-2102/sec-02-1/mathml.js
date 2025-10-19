/**
 * @import { E } from '../../prelude-type.ts';
 */
import { frag, mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper } from '../prelude.js';

const {
  sum, sub, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, matrix, SPECIAL, under,
  table, subsup,
} = mathml;

const { mi, mo } = mathml2;

const { Pi, alpha, Delta, delta2: delta } = SPECIAL.greek;
const { implies, eq, eqId, mul3, mul2, add, minus, minusP } = mathmlHelper;

const vars = {
  capital: mi`K`,
  captial0: sub(mi`K`, n(0)),
  captial1: sub(mi`K`, n(1)),
  capitalE: sup(mi`K`, paren([n(1), mo`-`, alpha])),
  capitalEq: sup(mi`K`, mo`*`),
  capitalEEq: sup(mi`K`, row([mo`*`, paren([n(1), mo`-`, alpha])])),
  captialET: subsup(mi`K`, mi`t`, paren([n(1), mo`-`, alpha])),
  captialT: sub(mi`K`, mi`t`),
  captialTLast: sub(mi`K`, paren([mi`t`, mo`-`, n(1)])),
  captialTNext: sub(mi`K`, paren([mi`t`, mo`+`, n(1)])),
  capitalPerWorker: mi`k̄`,
  capitalPerWorkerE: sup(mi`k̄`, paren([n(1), mo`-`, alpha])),
  captialFixed: mi`K̄`,
  captialFixedE: sup(mi`K̄`, paren([n(1), mo`-`, alpha])),
  consumption: mi`C`,
  consumptionT: sub(mi`C`, mi`t`),
  iFactor: mi`s̄`,
  investment: mi`I`,
  investment0: sub(mi`I`, n(0)),
  investmentT: sub(mi`I`, mi`t`),
  deltaY: row([delta, mi`Y`]),
  deltaK: row([delta, mi`K`]),
  deltaL: row([delta, mi`L`]),
  deltaYOverK: frac([delta, mi`Y`], [delta, mi`K`]),
  deltaYOverL: frac([delta, mi`Y`], [delta, mi`L`]),
  depreciation: mi`d̄`,
  knowledgeGrowthRate: mi`ḡ`,
  labour: mi`L`,
  labourE: sup(mi`L`, alpha),
  labourT: sub(mi`L`, mi`t`),
  labourAT: sub(mi`L`, row([mi`a`, mi`t`])),
  labourY: sub(mi`L`, mi`y`),
  labourYT: sub(mi`L`, row([mi`y`, mi`t`])),
  labourEq: sup(mi`L`, mo`*`),
  labourET: subsup(mi`L`, mi`t`, alpha),
  labourFixed: mi`L̄`,
  labourFixedE: sup(mi`L̄`, alpha),
  partialDeltaK: frac([delta], [delta, mi`K`]),
  partialDeltaL: frac([delta], [delta, mi`L`]),
  realWage: mi`w`,
  realWageEq: sup(mi`w`, mo`*`),
  realProfits: Pi,
  realRentPaidToCapital: mi`r`,
  realRentPaidToCapitalEq: sup(mi`r`, mi`*`),
  researchProductivity: mi`z̄`,
  researchSector: mi`𝓁̄`,
  tech: mi`A`,
  tech0: sub(mi`A`, n(0)),
  techT: sub(mi`A`, mi`t`),
  techTNext: sub(mi`A`, paren([mi`t`, mo`+`, n(1)])),
  techFixed: mi`Ā`,
  output: mi`Y`,
  outputT: sub(mi`Y`, mi`t`),
  outputTPerCapita: sub(mi`y`, mi`t`),
  outputEq: sup(mi`Y`, mo`*`),
  outputEqPerCapita: sup(mi`y`, mo`*`),
};

export const ideaDiagram = mathml([
  text('Ideas'), space(16), mo`⇒`, space(16),
  text('Nonrivalry'), space(16), mo`⇒`, space(16),
  rows([
    text('Increasing'),
    text('Returns'),
  ]),, space(16), mo`⇒`, space(16),
  rows([
    text('Problems with'),
    text('pure competition'),
  ]),
]);

/**
 * @retursn {E.Item}
 */
export const constantGrowth = mathml([
  eq(mi`ḡ`, row([mi`z̄`, mi`ℓ̄`, mi`L̄`])),
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
  eq(vars.labourAT, mul2(vars.researchSector, vars.labour)),
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
    sup(paren([add(n(1), vars.knowledgeGrowthRate)]), mi`t`),
  )),
]);

/**
 * @returns {E.Item}
 */
export const perCapitaStockOfKnowledge = () => mathml([
  eq(vars.outputTPerCapita, mul3(
    vars.tech0,
    minusP(n(1), vars.researchSector),
    sup(paren([add(n(1), vars.knowledgeGrowthRate)]), mi`t`),
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
  eq(sub(mi`g`, frag([mi`Y`, mi`t`])), add(
    sub(mi`g`, frag([mi`A`, mi`t`])),
    add(
      frag([frac([n(1)], [n(3)]), sub(mi`g`, frag([mi`K`, mi`t`]))]),
      frag([frac([n(2)], [n(3)]), sub(mi`g`, frag([mi`L`, mi`y`, mi`t`]))]),
    ),
  ))
]);

/**
 * @returns {E.Item}
 */
export const romerGrowthAccounting2 = () => mathml([
  eq(under(minusP(
    sub(mi`g`, frag([mi`Y`, mi`t`])),
    sub(mi`g`, frag([mi`L`, mi`t`])),
  ), text('growth of Y/L')), add(
    under(row([
      frac([n(1)], [n(3)]),
      minusP(
        sub(mi`g`, frag([mi`K`, mi`t`])),
        sub(mi`g`, frag([mi`L`, mi`t`])),
      ),
    ]), text('contribuion from K/L')),
    add(
      under(row([
        frac([n(2)], [n(3)]),
        minusP(
          sub(mi`g`, frag([mi`L`, mi`y`, mi`t`])),
          sub(mi`g`, frag([mi`K`, mi`t`])),
        ),
      ]), text('labour Component')),
      under(sub(mi`g`, frag([mi`A`, mi`t`])), text('TFP Growth')),
    ),
  ))
]);

/**
 * @returns {E.Item}
 */
export const continiousA = () => mathml([
  eq(call('A', mi`t`), frag([
    vars.tech0, sup(mi`e`, row([mi`g`, mi`t`])),
  ])),
]);

/**
 * @returns {E.Item}
 */
export const continiousY = () => mathml([
  eq(call('Y', mi`t`), mul3(
    call('A', mi`t`),
    sup(row([call('K', mi`t`)]), row([n(1), mo`-`, alpha])),
    sup(row([call('Ly', mi`t`)]), alpha),
  )),
]);

/**
 * @returns {E.Item}
 */
export const continiousK = () => mathml([
  eq(call('K', mi`t`), sup(row([mo`[`, row([
    add(
      mul2(
        subsup(mi`K`, n(0), alpha),
        sup(mi`e`, row([mo`-`, alpha, vars.depreciation, mi`t`])),
      ),
      frag([
        frac([
          mul2(
            mul2(alpha, vars.iFactor),
            mul2(vars.tech0, sup(vars.labourY, alpha)),
          ),
        ], [add(mi`g`, mul2(alpha, vars.depreciation))]),
        minusP(
          sup(mi`e`, row([mi`g`, mi`t`])),
          sup(mi`e`, row([mo`-`, alpha, vars.depreciation, mi`t`])),
        ),
      ]),
    ),
  ]), mo`]`]), frac([n(1)], [alpha]))),
]);
