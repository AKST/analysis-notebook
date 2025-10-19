/**
 * @import { E } from '../../prelude-type.ts';
 */
import { frag, mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper, mathmlHelper_2 } from '../prelude.js';

const {
  inv,
  space, call, paren,
  set, frac, matrix, SPECIAL,
  table,
} = mathml;

const { mi, mo, mtext, mrow, mn, msub, msup, msubsup, munder } = mathml2;

const { rows, sum } = mathmlHelper_2;

const { Pi, alpha, Delta, delta2: delta } = SPECIAL.greek;
const { implies, eq, eqId, mul3, mul2, add, minus, minusP } = mathmlHelper;

const vars = {
  capital: mi`K`,
  captial0: msub(mi`K`, mn(0)),
  captial1: msub(mi`K`, mn(1)),
  capitalE: msup(mi`K`, paren([mn(1), mo`-`, alpha])),
  capitalEq: msup(mi`K`, mo`*`),
  capitalEEq: msup(mi`K`, mrow(mo`*`, paren([mn(1), mo`-`, alpha]))),
  captialET: msubsup(mi`K`, mi`t`, paren([mn(1), mo`-`, alpha])),
  captialT: msub(mi`K`, mi`t`),
  captialTLast: msub(mi`K`, paren([mi`t`, mo`-`, mn(1)])),
  captialTNext: msub(mi`K`, paren([mi`t`, mo`+`, mn(1)])),
  capitalPerWorker: mi`k̄`,
  capitalPerWorkerE: msup(mi`k̄`, paren([mn(1), mo`-`, alpha])),
  captialFixed: mi`K̄`,
  captialFixedE: msup(mi`K̄`, paren([mn(1), mo`-`, alpha])),
  consumption: mi`C`,
  consumptionT: msub(mi`C`, mi`t`),
  iFactor: mi`s̄`,
  investment: mi`I`,
  investment0: msub(mi`I`, mn(0)),
  investmentT: msub(mi`I`, mi`t`),
  deltaY: mrow(delta, mi`Y`),
  deltaK: mrow(delta, mi`K`),
  deltaL: mrow(delta, mi`L`),
  deltaYOverK: frac([delta, mi`Y`], [delta, mi`K`]),
  deltaYOverL: frac([delta, mi`Y`], [delta, mi`L`]),
  depreciation: mi`d̄`,
  knowledgeGrowthRate: mi`ḡ`,
  labour: mi`L`,
  labourE: msup(mi`L`, alpha),
  labourT: msub(mi`L`, mi`t`),
  labourAT: msub(mi`L`, mrow(mi`a`, mi`t`)),
  labourY: msub(mi`L`, mi`y`),
  labourYT: msub(mi`L`, mrow(mi`y`, mi`t`)),
  labourEq: msup(mi`L`, mo`*`),
  labourET: msubsup(mi`L`, mi`t`, alpha),
  labourFixed: mi`L̄`,
  labourFixedE: msup(mi`L̄`, alpha),
  partialDeltaK: frac([delta], [delta, mi`K`]),
  partialDeltaL: frac([delta], [delta, mi`L`]),
  realWage: mi`w`,
  realWageEq: msup(mi`w`, mo`*`),
  realProfits: Pi,
  realRentPaidToCapital: mi`r`,
  realRentPaidToCapitalEq: msup(mi`r`, mi`*`),
  researchProductivity: mi`z̄`,
  researchSector: mi`𝓁̄`,
  tech: mi`A`,
  tech0: msub(mi`A`, mn(0)),
  techT: msub(mi`A`, mi`t`),
  techTNext: msub(mi`A`, paren([mi`t`, mo`+`, mn(1)])),
  techFixed: mi`Ā`,
  output: mi`Y`,
  outputT: msub(mi`Y`, mi`t`),
  outputTPerCapita: msub(mi`y`, mi`t`),
  outputEq: msup(mi`Y`, mo`*`),
  outputEqPerCapita: msup(mi`y`, mo`*`),
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
  eq(vars.labourYT, mul2(minusP(mn(1), vars.researchSector), vars.labour)),
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
    msup(paren([add(mn(1), vars.knowledgeGrowthRate)]), mi`t`),
  )),
);

/**
 * @returns {E.Item}
 */
export const perCapitaStockOfKnowledge = () => mathml2.math(
  eq(vars.outputTPerCapita, mul3(
    vars.tech0,
    minusP(mn(1), vars.researchSector),
    msup(paren([add(mn(1), vars.knowledgeGrowthRate)]), mi`t`),
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
  eq(msub(mi`g`, frag([mi`Y`, mi`t`])), add(
    msub(mi`g`, frag([mi`A`, mi`t`])),
    add(
      frag([frac([mn(1)], [mn(3)]), msub(mi`g`, frag([mi`K`, mi`t`]))]),
      frag([frac([mn(2)], [mn(3)]), msub(mi`g`, frag([mi`L`, mi`y`, mi`t`]))]),
    ),
  ))
);

/**
 * @returns {E.Item}
 */
export const romerGrowthAccounting2 = () => mathml2.math(
  eq(munder(minusP(
    msub(mi`g`, frag([mi`Y`, mi`t`])),
    msub(mi`g`, frag([mi`L`, mi`t`])),
  ), mtext`growth of Y/L`), add(
    munder(mrow(
      frac([mn(1)], [mn(3)]),
      minusP(
        msub(mi`g`, frag([mi`K`, mi`t`])),
        msub(mi`g`, frag([mi`L`, mi`t`])),
      ),
    ), mtext`contribuion from K/L`),
    add(
      munder(mrow(
        frac([mn(2)], [mn(3)]),
        minusP(
          msub(mi`g`, frag([mi`L`, mi`y`, mi`t`])),
          msub(mi`g`, frag([mi`K`, mi`t`])),
        ),
      ), mtext`labour Component`),
      munder(msub(mi`g`, frag([mi`A`, mi`t`])), mtext`TFP Growth`),
    ),
  ))
);

/**
 * @returns {E.Item}
 */
export const continiousA = () => mathml2.math(
  eq(call('A', mi`t`), frag([
    vars.tech0, msup(mi`e`, mrow(mi`g`, mi`t`)),
  ])),
);

/**
 * @returns {E.Item}
 */
export const continiousY = () => mathml2.math(
  eq(call('Y', mi`t`), mul3(
    call('A', mi`t`),
    msup(mrow(call('K', mi`t`)), mrow(mn(1), mo`-`, alpha)),
    msup(mrow(call('Ly', mi`t`)), alpha),
  )),
);

/**
 * @returns {E.Item}
 */
export const continiousK = () => mathml2.math(
  eq(call('K', mi`t`), msup(mrow(mo`[`, mrow(
    add(
      mul2(
        msubsup(mi`K`, mn(0), alpha),
        msup(mi`e`, mrow(mo`-`, alpha, vars.depreciation, mi`t`)),
      ),
      frag([
        frac([
          mul2(
            mul2(alpha, vars.iFactor),
            mul2(vars.tech0, msup(vars.labourY, alpha)),
          ),
        ], [add(mi`g`, mul2(alpha, vars.depreciation))]),
        minusP(
          msup(mi`e`, mrow(mi`g`, mi`t`)),
          msup(mi`e`, mrow(mo`-`, alpha, vars.depreciation, mi`t`)),
        ),
      ]),
    ),
  ), mo`]`), frac([mn(1)], [alpha]))),
);
