/**
 * @import { E } from '../../prelude-type.ts';
 */
import { frag, mathml } from '../../prelude.js';
import { mathmlHelper, mathmlHelper_2 } from '../prelude.js';

const { mi, mo, mtext, mrow, mn, msub, msup, msubsup, munder, mspace, mfrac } = mathml;
const { SPECIAL, rows, parensA, call } = mathmlHelper_2;
const { Pi, alpha, Delta, delta } = SPECIAL.greek;
const { eq, mul3, mul2, add, minusP } = mathmlHelper;

const vars = {
  capital: mi`K`,
  captial0: msub(mi`K`, mn(0)),
  captial1: msub(mi`K`, mn(1)),
  capitalE: msup(mi`K`, parensA(mn(1), mo`-`, alpha)),
  capitalEq: msup(mi`K`, mo`*`),
  capitalEEq: msup(mi`K`, mrow(mo`*`, parensA(mn(1), mo`-`, alpha))),
  captialET: msubsup(mi`K`, mi`t`, parensA(mn(1), mo`-`, alpha)),
  captialT: msub(mi`K`, mi`t`),
  captialTLast: msub(mi`K`, parensA(mi`t`, mo`-`, mn(1))),
  captialTNext: msub(mi`K`, parensA(mi`t`, mo`+`, mn(1))),
  capitalPerWorker: mi`k̄`,
  capitalPerWorkerE: msup(mi`k̄`, parensA(mn(1), mo`-`, alpha)),
  captialFixed: mi`K̄`,
  captialFixedE: msup(mi`K̄`, parensA(mn(1), mo`-`, alpha)),
  consumption: mi`C`,
  consumptionT: msub(mi`C`, mi`t`),
  iFactor: mi`s̄`,
  investment: mi`I`,
  investment0: msub(mi`I`, mn(0)),
  investmentT: msub(mi`I`, mi`t`),
  deltaY: mrow(delta, mi`Y`),
  deltaK: mrow(delta, mi`K`),
  deltaL: mrow(delta, mi`L`),
  deltaYOverK: mfrac(mrow(delta, mi`Y`), mrow(delta, mi`K`)),
  deltaYOverL: mfrac(mrow(delta, mi`Y`), mrow(delta, mi`L`)),
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
  partialDeltaK: mfrac(delta, mrow(delta, mi`K`)),
  partialDeltaL: mfrac(delta, mrow(delta, mi`L`)),
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
  techTNext: msub(mi`A`, parensA(mi`t`, mo`+`, mn(1))),
  techFixed: mi`Ā`,
  output: mi`Y`,
  outputT: msub(mi`Y`, mi`t`),
  outputTPerCapita: msub(mi`y`, mi`t`),
  outputEq: msup(mi`Y`, mo`*`),
  outputEqPerCapita: msup(mi`y`, mo`*`),
};

export const ideaDiagram = mathml.math(
  mrow(
    mtext`Ideas`, mspace(16), mo`⇒`, mspace(16),
    mtext`Nonrivalry`, mspace(16), mo`⇒`, mspace(16),
    rows(
      mtext`Increasing`,
      mtext`Returns`,
    ), mspace(16), mo`⇒`, mspace(16),
    rows(
      mtext`Problems with`,
      mtext`pure competition`,
    ),
  )
);

/**
 * @retursn {E.Item}
 */
export const constantGrowth = mathml.math(
  eq(mi`ḡ`, mrow(mi`z̄`, mi`ℓ̄`, mi`L̄`)),
);

/**
 * @returns {E.Item}
 */
export const romerGrowthModel = () => mathml.math(
  eq(vars.outputT, mul2(vars.techT, vars.labourYT)),
);

/**
 * @returns {E.Item}
 */
export const romerModelProductionOfNewIdeas = () => mathml.math(
  eq(frag([Delta, vars.techTNext]), mul3(vars.researchProductivity, vars.techT, vars.labourAT)),
);

/**
 * @returns {E.Item}
 */
export const romerLabour = () => mathml.math(
  eq(vars.labour, add(vars.labourAT, vars.labourYT)),
);

/**
 * @returns {E.Item}
 */
export const romerLabourResearch = () => mathml.math(
  eq(vars.labourAT, mul2(vars.researchSector, vars.labour)),
);

/**
 * @returns {E.Item}
 */
export const romerLabourOutput = () => mathml.math(
  eq(vars.labourYT, mul2(minusP(mn(1), vars.researchSector), vars.labour)),
);

/**
 * @returns {E.Item}
 */
export const romerGrowthRateOfKnowledge = () => mathml.math(
  eq(vars.knowledgeGrowthRate, mul3(
    vars.researchProductivity,
    vars.researchSector,
    vars.labour,
  )),
);

/**
 * @returns {E.Item}
 */
export const stockOfKnowledge = () => mathml.math(
  eq(vars.techT, mul2(
    vars.tech0,
    msup(parensA(add(mn(1), vars.knowledgeGrowthRate)), mi`t`),
  )),
);

/**
 * @returns {E.Item}
 */
export const perCapitaStockOfKnowledge = () => mathml.math(
  eq(vars.outputTPerCapita, mul3(
    vars.tech0,
    minusP(mn(1), vars.researchSector),
    msup(parensA(add(mn(1), vars.knowledgeGrowthRate)), mi`t`),
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
export const romerGrowthAccounting = () => mathml.math(
  eq(msub(mi`g`, frag([mi`Y`, mi`t`])), add(
    msub(mi`g`, frag([mi`A`, mi`t`])),
    add(
      frag([mfrac(mn(1), mn(3)), msub(mi`g`, frag([mi`K`, mi`t`]))]),
      frag([mfrac(mn(2), mn(3)), msub(mi`g`, frag([mi`L`, mi`y`, mi`t`]))]),
    ),
  ))
);

/**
 * @returns {E.Item}
 */
export const romerGrowthAccounting2 = () => mathml.math(
  eq(munder(minusP(
    msub(mi`g`, frag([mi`Y`, mi`t`])),
    msub(mi`g`, frag([mi`L`, mi`t`])),
  ), mtext`growth of Y/L`), add(
    munder(mrow(
      mfrac(mn(1), mn(3)),
      minusP(
        msub(mi`g`, frag([mi`K`, mi`t`])),
        msub(mi`g`, frag([mi`L`, mi`t`])),
      ),
    ), mtext`contribuion from K/L`),
    add(
      munder(mrow(
        mfrac(mn(2), mn(3)),
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
export const continiousA = () => mathml.math(
  eq(call.attr({ fn: mi`A` })(mi`t`), frag([
    vars.tech0, msup(mi`e`, mrow(mi`g`, mi`t`)),
  ])),
);

/**
 * @returns {E.Item}
 */
export const continiousY = () => mathml.math(
  eq(call.attr({ fn: mi`Y` })(mi`t`), mul3(
    call.attr({ fn: mi`A` })(mi`t`),
    msup(mrow(call.attr({ fn: mi`K` })(mi`t`)), mrow(mn(1), mo`-`, alpha)),
    msup(mrow(call.attr({ fn: mtext`Ly` })(mi`t`)), alpha),
  )),
);

/**
 * @returns {E.Item}
 */
export const continiousK = () => mathml.math(
  eq(call.attr({ fn: mi`K` })(mi`t`), msup(mrow(mo`[`, mrow(
    add(
      mul2(
        msubsup(mi`K`, mn(0), alpha),
        msup(mi`e`, mrow(mo`-`, alpha, vars.depreciation, mi`t`)),
      ),
      frag([
        mfrac(
          mul2(
            mul2(alpha, vars.iFactor),
            mul2(vars.tech0, msup(vars.labourY, alpha)),
          ),
          add(mi`g`, mul2(alpha, vars.depreciation))
        ),
        minusP(
          msup(mi`e`, mrow(mi`g`, mi`t`)),
          msup(mi`e`, mrow(mo`-`, alpha, vars.depreciation, mi`t`)),
        ),
      ]),
    ),
  ), mo`]`), mfrac(mn(1), alpha))),
);
