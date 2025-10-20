/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml } from '../../prelude.js';
import { mathmlHelper, mathmlHelper_2 } from '../prelude.js';

const { mi, mo, mtext, mrow, mover, mn, msub, msup, msubsup, munder, mspace, mfrac } = mathml;
const { SPECIAL, eq, eqId, imply, add, minus, rows, parensA, call, mul } = mathmlHelper_2;
const { Pi, alpha, Delta, delta } = SPECIAL.greek;

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
  labour: mi`L`,
  labourE: msup(mi`L`, alpha),
  labourT: msub(mi`L`, mi`t`),
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
  tech: mi`A`,
  techFixed: mi`Ā`,
  output: mi`Y`,
  outputT: msub(mi`Y`, mi`t`),
  outputEq: msup(mi`Y`, mo`*`),
  outputEqPerCapita: msup(mi`y`, mo`*`),
};

export const temporalOutput = mathml.math(
  eq(vars.outputT, mul(
    vars.techFixed,
    vars.captialET,
    vars.labourET,
  )),
);

export const temporalOutputWithFixedLabour = mathml.math(
  eq(vars.outputT, mul(
    vars.techFixed,
    vars.captialET,
    vars.labourFixedE,
  )),
);

export const resourceConstraint = mathml.math(
  eq(vars.outputT, add(vars.consumptionT, vars.investmentT)),
);

export const capitalAccumulation = mathml.math(
  eq(vars.captialTNext, minus(
    add(vars.captialT, vars.investmentT),
    frag([vars.depreciation, vars.captialT]),
  )),
);

export const capitalAccumulation2 = mathml.math(rows(
  eqId(frag([Delta, vars.captialTNext]), minus(vars.captialT, vars.captialTNext)),
  eq(frag([Delta, vars.captialTNext]), minus(
    vars.investmentT,
    frag([vars.depreciation, vars.captialT])
  )),
));

export const initialStock = mathml.math(eq(
  frag([Delta, vars.captial0]),
  minus(
    vars.investment0,
    frag([vars.depreciation, vars.captial0])
  ),
));

export const exogenousLabour = mathml.math(
  eq(vars.labourT, vars.labourFixed),
);

export const investmentDynamics = mathml.math(
  eq(vars.investmentT, mul(vars.iFactor, vars.outputT)),
);

export const consumptionDynamics = mathml.math(
  eq(vars.consumptionT, mul(
    parensA(minus(mn(1), vars.iFactor)),
    vars.outputT
  )),
);

export const derivingConsumptionT = mathml.math(
  imply(
    eq(add(vars.consumptionT, vars.investmentT), vars.outputT),
    imply(
      eq(
        add(vars.consumptionT, mul(vars.iFactor, vars.outputT)),
        vars.outputT,
      ),
      eq(vars.consumptionT, mul(
        minus.paren(mn(1), vars.iFactor),
        vars.outputT,
      )),
    ),
  ),
);

export const investmentConstraint = mathml.math(
  eq(
    munder(mrow(minus(vars.outputT, vars.consumptionT)), mtext`savings`),
    eq(
      munder(vars.investmentT, mtext`investment`),
      munder(msub(mi`S`, mi`t`), mtext`Savings`),
    ),
  ),
);

export const netInvestment = mathml.math(
  eq(vars.investmentT, mul(vars.depreciation, vars.captialT)),
);

export const netInvestmentConstraint = mathml.math(
  eq(
    mover(vars.captialTNext, mtext`Change in capital`),
    mover(minus(
      frag([vars.iFactor, vars.outputT]),
      frag([vars.depreciation, vars.captialT]),
    ), mtext`Net investment`),
  ),
);

export const solowDiagram = mathml.math(
  eq(
    frag([vars.iFactor, vars.output]),
    mul(
      frag([vars.iFactor, vars.techFixed]),
      vars.capitalE,
      vars.labourFixedE,
    )
  ),
);

export const steadyStateConstraint = mathml.math(
  eq(
    mul(
      frag([vars.iFactor, vars.techFixed]),
      vars.capitalEEq,
      vars.labourFixedE,
    ),
    frag([vars.depreciation, vars.capitalEq]),
  ),
);

export const solveSteadyState = mathml.math(
  eq(
    vars.capitalEq,
    mul(
      msup(
        parensA(
          mfrac(mrow(vars.iFactor, vars.techFixed), vars.depreciation),
        ),
        mfrac(mn(1), alpha),
      ),
      vars.labourFixed,
    ),
  ),
);

export const steadyStateOutput = mathml.math(
  eq(
    vars.outputEq,
    mul(
      msup(
        parensA(
          mfrac(mrow(vars.iFactor, vars.techFixed), vars.depreciation),
        ),
        mfrac(mrow(mn(1), mo`-`, alpha), alpha),
      ),
      msup(
        vars.techFixed,
        mfrac(mn(1), alpha),
      ),
      vars.labourFixed,
    )
  ),
);

export const steadyStateWorkingout = mathml.math(rows(
  eq(
    mul(frag([vars.iFactor, vars.techFixed]), vars.capitalEEq, vars.labourFixedE),
    frag([vars.depreciation, vars.capitalEq]),
  ),

  mspace(8),

  mover(eq(
    mul(frag([vars.iFactor, vars.techFixed]), vars.labourFixedE),
    frag([vars.depreciation, mfrac(vars.capitalEq, vars.capitalEEq)]),
  ), mrow(mtext`divide by`, mspace(8), vars.capitalEEq)),

  mspace(8),

  mover(eq(
    mfrac(vars.capitalEq, vars.capitalEEq),
    eq(
      msup(vars.capitalEq, mrow(mn(1), mo`-`, parensA(mn(1), mo`-`, alpha))),
      msup(vars.capitalEq, alpha),
    ),
  ), mtext`simplify exponents`),
  eq(
    mul(mrow(vars.iFactor, vars.techFixed), vars.labourFixedE),
    mrow(vars.depreciation, msup(vars.capitalEq, alpha)),
  ),

  mspace(8),

  mover(eq(
    mfrac(
      mul(frag([vars.iFactor, vars.techFixed]), vars.labourFixedE),
      vars.depreciation,
    ),
    msup(vars.capitalEq, alpha),
  ), mrow(mtext`divide by`, mspace(8), vars.depreciation)),

  mspace(8),

  mover(eq(
    mul(
      msup(
        parensA(
          mfrac(mrow(vars.iFactor, vars.techFixed), vars.depreciation),
        ),
        mfrac(mn(1), alpha),
      ),
      vars.labourFixed,
    ),
    vars.capitalEq,
  ), mrow(mtext`apply recipical exponent`)),
));

export const steadyStatePerWorker = mathml.math(
  eq(vars.outputEqPerCapita, eq(
    mfrac(vars.outputEq, vars.labourFixed),
    mul(
      msup(vars.techFixed, mfrac(mn(1), alpha)),
      msup(
        mfrac(vars.iFactor, vars.depreciation),
        mfrac(mrow(mn(1), mo`-`, alpha), alpha),
      ),
    ),
  )),
);

export const steadyStatePerWorkerWorkingOut = mathml.math(rows(
  eq(vars.outputEq, mul(vars.techFixed, vars.capitalEEq, vars.labourFixedE)),
  eq(vars.outputEq, mul(
    vars.techFixed,
    mul(
      msup(
        parensA(
          mfrac(mrow(vars.iFactor, vars.techFixed), vars.depreciation),
        ),
        mfrac(mrow(mn(1), mo`-`, alpha), alpha),
      ),
      msup(vars.labourFixed, parensA(mn(1), mo`-`, alpha)),
    ),
    vars.labourFixedE,
  )),
  eq(vars.outputEq, mul(
    msup(vars.techFixed, mfrac(mn(1), alpha)),
    msup(
      parensA(
        mfrac(mrow(vars.iFactor, vars.techFixed), vars.depreciation),
      ),
      mfrac(mrow(mn(1), mo`-`, alpha), alpha),
    ),
    vars.labourFixed,
  )),
  eq(
    mfrac(vars.outputEq, vars.labourFixed),
    mul(
      msup(vars.techFixed, mfrac(mn(1), alpha)),
      msup(
        parensA(mfrac(vars.iFactor, vars.depreciation)),
        mfrac(mrow(mn(1), mo`-`, alpha), alpha),
      ),
    ),
  ),
));

export const productionPerCapita = mathml.math(
  eq(vars.outputEqPerCapita, mul(vars.techFixed, vars.capitalPerWorkerE)),
);

export const outputToCapitalRatio = mathml.math(
  eq(
    mfrac(vars.capitalEq, vars.outputEq),
    mfrac(vars.iFactor, vars.depreciation),
  ),
);

export const continiousK = mathml.math(
  eq(call.attr({ fn: mi`K` })(mi`t`), msup(mrow(mo`[`, mrow(
    add(
      frag([
        minus.paren(
          msubsup(mi`K`, mn(0), alpha),
          mfrac(mrow(
            vars.iFactor,
            vars.tech,
            msup(vars.labour, alpha),
          ), vars.depreciation),
        ),
        msup(mi`e`, mrow(
          mo`—`, alpha,
          vars.depreciation,
          mi`t`,
        )),
      ]),
      mfrac(mrow(
        vars.iFactor,
        vars.tech,
        msup(vars.labour, alpha),
      ), vars.depreciation),
    ),
  ), mo`]`), mfrac(mn(1), alpha))),
);
