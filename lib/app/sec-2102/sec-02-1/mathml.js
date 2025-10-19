/**
 * @import { E } from '../../prelude-type.ts';
 */
import { frag, mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper, mathmlHelper_2 } from '../prelude.js';

const {
  sum, sub, n, inv,
  space, call, paren, sup, over,
  set, frac, matrix, SPECIAL, under,
  table, subsup,
} = mathml;

const { mi, mo, mtext, mrow } = mathml2;

const { rows } = mathmlHelper_2;

const { Pi, alpha, Delta, delta2: delta } = SPECIAL.greek;
const { implies, eq, eqId, mul3, mul2, add, minus, minusP } = mathmlHelper;

const vars = {
  capital: mi`K`,
  captial0: sub(mi`K`, n(0)),
  captial1: sub(mi`K`, n(1)),
  capitalE: sup(mi`K`, paren([n(1), mo`-`, alpha])),
  capitalEq: sup(mi`K`, mo`*`),
  capitalEEq: sup(mi`K`, mrow(mo`*`, paren([n(1), mo`-`, alpha]))),
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
  deltaY: mrow(delta, mi`Y`),
  deltaK: mrow(delta, mi`K`),
  deltaL: mrow(delta, mi`L`),
  deltaYOverK: frac([delta, mi`Y`], [delta, mi`K`]),
  deltaYOverL: frac([delta, mi`Y`], [delta, mi`L`]),
  depreciation: mi`d̄`,
  knowledgeGrowthRate: mi`ḡ`,
  labour: mi`L`,
  labourE: sup(mi`L`, alpha),
  labourT: sub(mi`L`, mi`t`),
  labourAT: sub(mi`L`, mrow(mi`a`, mi`t`)),
  labourY: sub(mi`L`, mi`y`),
  labourYT: sub(mi`L`, mrow(mi`y`, mi`t`)),
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

export const ideaDiagram = mathml2.math(
  mrow(
    mtext`Ideas`, space(16), mo`⇒`, space(16),
    mtext`Nonrivalry`, space(16), mo`⇒`, space(16),
    rows(
      mtext`Increasing`,
      mtext`Returns`,
    ), space(16), mo`⇒`, space(16),
    rows(
      mtext`Problems with`,
      mtext`pure competition`,
    ),
  )
);

/**
 * @retursn {E.Item}
 */
export const constantGrowth = mathml2.math(
  eq(mi`ḡ`, mrow(mi`z̄`, mi`ℓ̄`, mi`L̄`)),
);

/**
 * @returns {E.Item}
 */
export const romerGrowthModel = () => mathml2.math(
  eq(vars.outputT, mul2(vars.techT, vars.labourYT)),
);

/**
 * @returns {E.Item}
 */
export const romerModelProductionOfNewIdeas = () => mathml2.math(
  eq(frag([Delta, vars.techTNext]), mul3(vars.researchProductivity, vars.techT, vars.labourAT)),
);

/**
 * @returns {E.Item}
 */
export const romerLabour = () => mathml2.math(
  eq(vars.labour, add(vars.labourAT, vars.labourYT)),
);

/**
 * @returns {E.Item}
 */
export const romerLabourResearch = () => mathml2.math(
  eq(vars.labourAT, mul2(vars.researchSector, vars.labour)),
);

/**
 * @returns {E.Item}
 */
export const romerLabourOutput = () => mathml2.math(
  eq(vars.labourYT, mul2(minusP(n(1), vars.researchSector), vars.labour)),
);

/**
 * @returns {E.Item}
 */
export const romerGrowthRateOfKnowledge = () => mathml2.math(
  eq(vars.knowledgeGrowthRate, mul3(
    vars.researchProductivity,
    vars.researchSector,
    vars.labour,
  )),
);

/**
 * @returns {E.Item}
 */
export const stockOfKnowledge = () => mathml2.math(
  eq(vars.techT, mul2(
    vars.tech0,
    sup(paren([add(n(1), vars.knowledgeGrowthRate)]), mi`t`),
  )),
);

/**
 * @returns {E.Item}
 */
export const perCapitaStockOfKnowledge = () => mathml2.math(
  eq(vars.outputTPerCapita, mul3(
    vars.tech0,
    minusP(n(1), vars.researchSector),
    sup(paren([add(n(1), vars.knowledgeGrowthRate)]), mi`t`),
  )),
);

/**
 * @returns {E.Item}
 */
export const romerSolvingAssumptions = () => (
  ['div', { style: 'background: red; color: white' }, ['knowledge stock assumption']]
);


/**
 * @returns {E.Item}
 */
export const romerGrowthAccounting = () => mathml2.math(
  eq(sub(mi`g`, frag([mi`Y`, mi`t`])), add(
    sub(mi`g`, frag([mi`A`, mi`t`])),
    add(
      frag([frac([n(1)], [n(3)]), sub(mi`g`, frag([mi`K`, mi`t`]))]),
      frag([frac([n(2)], [n(3)]), sub(mi`g`, frag([mi`L`, mi`y`, mi`t`]))]),
    ),
  ))
);

/**
 * @returns {E.Item}
 */
export const romerGrowthAccounting2 = () => mathml2.math(
  eq(under(minusP(
    sub(mi`g`, frag([mi`Y`, mi`t`])),
    sub(mi`g`, frag([mi`L`, mi`t`])),
  ), mtext`growth of Y/L`), add(
    under(mrow(
      frac([n(1)], [n(3)]),
      minusP(
        sub(mi`g`, frag([mi`K`, mi`t`])),
        sub(mi`g`, frag([mi`L`, mi`t`])),
      ),
    ), mtext`contribuion from K/L`),
    add(
      under(mrow(
        frac([n(2)], [n(3)]),
        minusP(
          sub(mi`g`, frag([mi`L`, mi`y`, mi`t`])),
          sub(mi`g`, frag([mi`K`, mi`t`])),
        ),
      ), mtext`labour Component`),
      under(sub(mi`g`, frag([mi`A`, mi`t`])), mtext`TFP Growth`),
    ),
  ))
);

/**
 * @returns {E.Item}
 */
export const continiousA = () => mathml2.math(
  eq(call('A', mi`t`), frag([
    vars.tech0, sup(mi`e`, mrow(mi`g`, mi`t`)),
  ])),
);

/**
 * @returns {E.Item}
 */
export const continiousY = () => mathml2.math(
  eq(call('Y', mi`t`), mul3(
    call('A', mi`t`),
    sup(mrow(call('K', mi`t`)), mrow(n(1), mo`-`, alpha)),
    sup(mrow(call('Ly', mi`t`)), alpha),
  )),
);

/**
 * @returns {E.Item}
 */
export const continiousK = () => mathml2.math(
  eq(call('K', mi`t`), sup(mrow(mo`[`, mrow(
    add(
      mul2(
        subsup(mi`K`, n(0), alpha),
        sup(mi`e`, mrow(mo`-`, alpha, vars.depreciation, mi`t`)),
      ),
      frag([
        frac([
          mul2(
            mul2(alpha, vars.iFactor),
            mul2(vars.tech0, sup(vars.labourY, alpha)),
          ),
        ], [add(mi`g`, mul2(alpha, vars.depreciation))]),
        minusP(
          sup(mi`e`, mrow(mi`g`, mi`t`)),
          sup(mi`e`, mrow(mo`-`, alpha, vars.depreciation, mi`t`)),
        ),
      ]),
    ),
  ), mo`]`), frac([n(1)], [alpha]))),
);
