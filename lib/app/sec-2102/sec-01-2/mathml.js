/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper, mathmlHelper_2 } from '../prelude.js';

const { call, paren, frac, SPECIAL } = mathml;
const { mi, mo, mtext, mrow, mover, mn, msub, msup, msubsup, munder, mspace } = mathml2;
const { rows } = mathmlHelper_2;

const { Pi, alpha, Delta, delta2: delta } = SPECIAL.greek;

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
  labour: mi`L`,
  labourE: msup(mi`L`, alpha),
  labourT: msub(mi`L`, mi`t`),
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
  tech: mi`A`,
  techFixed: mi`Ā`,
  output: mi`Y`,
  outputT: msub(mi`Y`, mi`t`),
  outputEq: msup(mi`Y`, mo`*`),
  outputEqPerCapita: msup(mi`y`, mo`*`),
};

const { implies, eq, eqId, mul3, mul2, add, minus, minusP } = mathmlHelper;

export const temporalOutput = mathml2.math(
  eq(vars.outputT, mul3(
    vars.techFixed,
    vars.captialET,
    vars.labourET,
  )),
);

export const temporalOutputWithFixedLabour = mathml2.math(
  eq(vars.outputT, mul3(
    vars.techFixed,
    vars.captialET,
    vars.labourFixedE,
  )),
);

export const resourceConstraint = mathml2.math(
  eq(vars.outputT, add(vars.consumptionT, vars.investmentT)),
);

export const capitalAccumulation = mathml2.math(
  eq(vars.captialTNext, minus(
    add(vars.captialT, vars.investmentT),
    frag([vars.depreciation, vars.captialT]),
  )),
);

export const capitalAccumulation2 = mathml2.math(rows(
  eqId(frag([Delta, vars.captialTNext]), minus(vars.captialT, vars.captialTNext)),
  eq(frag([Delta, vars.captialTNext]), minus(
    vars.investmentT,
    frag([vars.depreciation, vars.captialT])
  )),
));

export const initialStock = mathml2.math(eq(
  frag([Delta, vars.captial0]),
  minus(
    vars.investment0,
    frag([vars.depreciation, vars.captial0])
  ),
));

export const exogenousLabour = mathml2.math(
  eq(vars.labourT, vars.labourFixed),
);

export const investmentDynamics = mathml2.math(
  eq(vars.investmentT, mul2(vars.iFactor, vars.outputT)),
);

export const consumptionDynamics = mathml2.math(
  eq(vars.consumptionT, mul2(
    paren([minus(mn(1), vars.iFactor)]),
    vars.outputT
  )),
);

export const derivingConsumptionT = mathml2.math(
  implies(
    eq(add(vars.consumptionT, vars.investmentT), vars.outputT),
    implies(
      eq(
        add(vars.consumptionT, mul2(vars.iFactor, vars.outputT)),
        vars.outputT,
      ),
      eq(vars.consumptionT, mul2(
        minusP(mn(1), vars.iFactor),
        vars.outputT,
      )),
    ),
  ),
);

export const investmentConstraint = mathml2.math(
  eq(
    munder(mrow(minus(vars.outputT, vars.consumptionT)), mtext`savings`),
    eq(
      munder(vars.investmentT, mtext`investment`),
      munder(msub(mi`S`, mi`t`), mtext`Savings`),
    ),
  ),
);

export const netInvestment = mathml2.math(
  eq(vars.investmentT, mul2(vars.depreciation, vars.captialT)),
);

export const netInvestmentConstraint = mathml2.math(
  eq(
    mover(vars.captialTNext, mtext`Change in capital`),
    mover(minus(
      frag([vars.iFactor, vars.outputT]),
      frag([vars.depreciation, vars.captialT]),
    ), mtext`Net investment`),
  ),
);

export const solowDiagram = mathml2.math(
  eq(
    frag([vars.iFactor, vars.output]),
    mul3(
      frag([vars.iFactor, vars.techFixed]),
      vars.capitalE,
      vars.labourFixedE,
    )
  ),
);

export const steadyStateConstraint = mathml2.math(
  eq(
    mul3(
      frag([vars.iFactor, vars.techFixed]),
      vars.capitalEEq,
      vars.labourFixedE,
    ),
    frag([vars.depreciation, vars.capitalEq]),
  ),
);

export const solveSteadyState = mathml2.math(
  eq(
    vars.capitalEq,
    mul2(
      msup(
        paren([
          frac([vars.iFactor, vars.techFixed], [vars.depreciation]),
        ]),
        frac([mn(1)], [alpha]),
      ),
      vars.labourFixed,
    ),
  ),
);

export const steadyStateOutput = mathml2.math(
  eq(
    vars.outputEq,
    mul3(
      msup(
        paren([
          frac([vars.iFactor, vars.techFixed], [vars.depreciation]),
        ]),
        frac([mn(1), mo`-`, alpha], [alpha]),
      ),
      msup(
        vars.techFixed,
        frac([mn(1)], [alpha]),
      ),
      vars.labourFixed,
    )
  ),
);

export const steadyStateWorkingout = mathml2.math(rows(
  eq(
    mul3(frag([vars.iFactor, vars.techFixed]), vars.capitalEEq, vars.labourFixedE),
    frag([vars.depreciation, vars.capitalEq]),
  ),

  mspace(8),

  mover(eq(
    mul2(frag([vars.iFactor, vars.techFixed]), vars.labourFixedE),
    frag([vars.depreciation, frac([vars.capitalEq], [vars.capitalEEq])]),
  ), mrow(mtext`divide by`, mspace(8), vars.capitalEEq)),

  mspace(8),

  mover(eq(
    frac([vars.capitalEq], [vars.capitalEEq]),
    eq(
      msup(vars.capitalEq, mrow(mn(1), mo`-`, paren([mn(1), mo`-`, alpha]))),
      msup(vars.capitalEq, alpha),
    ),
  ), mtext`simplify exponents`),
  eq(
    mul2(mrow(vars.iFactor, vars.techFixed), vars.labourFixedE),
    mrow(vars.depreciation, msup(vars.capitalEq, alpha)),
  ),

  mspace(8),

  mover(eq(
    frac(
      [mul2(frag([vars.iFactor, vars.techFixed]), vars.labourFixedE)],
      [vars.depreciation],
    ),
    msup(vars.capitalEq, alpha),
  ), mrow(mtext`divide by`, mspace(8), vars.depreciation)),

  mspace(8),

  mover(eq(
    mul2(
      msup(
        paren([
          frac([vars.iFactor, vars.techFixed], [vars.depreciation]),
        ]),
        frac([mn(1)], [alpha]),
      ),
      vars.labourFixed,
    ),
    vars.capitalEq,
  ), mrow(mtext`apply recipical exponent`)),
));

export const steadyStatePerWorker = mathml2.math(
  eq(vars.outputEqPerCapita, eq(
    frac([vars.outputEq], [vars.labourFixed]),
    mul2(
      msup(vars.techFixed, frac([mn(1)], [alpha])),
      msup(
        frac([vars.iFactor], [vars.depreciation]),
        frac([mn(1), mo`-`, alpha], [alpha]),
      ),
    ),
  )),
);

export const steadyStatePerWorkerWorkingOut = mathml2.math(rows(
  eq(vars.outputEq, mul3(vars.techFixed, vars.capitalEEq, vars.labourFixedE)),
  eq(vars.outputEq, mul3(
    vars.techFixed,
    mul2(
      msup(
        paren([
          frac([vars.iFactor, vars.techFixed], [vars.depreciation]),
        ]),
        frac([mn(1), mo`-`, alpha], [alpha]),
      ),
      msup(vars.labourFixed, paren([mn(1), mo`-`, alpha])),
    ),
    vars.labourFixedE,
  )),
  eq(vars.outputEq, mul3(
    msup(vars.techFixed, frac([mn(1)], [alpha])),
    msup(
      paren([
        frac([vars.iFactor, vars.techFixed], [vars.depreciation]),
      ]),
      frac([mn(1), mo`-`, alpha], [alpha]),
    ),
    vars.labourFixed,
  )),
  eq(
    frac([vars.outputEq], [vars.labourFixed]),
    mul2(
      msup(vars.techFixed, frac([mn(1)], [alpha])),
      msup(
        paren([frac([vars.iFactor], [vars.depreciation])]),
        frac([mn(1), mo`-`, alpha], [alpha]),
      ),
    ),
  ),
));

export const productionPerCapita = mathml2.math(
  eq(vars.outputEqPerCapita, mul2(vars.techFixed, vars.capitalPerWorkerE)),
);

export const outputToCapitalRatio = mathml2.math(
  eq(
    frac([vars.capitalEq], [vars.outputEq]),
    frac([vars.iFactor], [vars.depreciation]),
  ),
);

export const continiousK = mathml2.math(
  eq(call('K', mi`t`), msup(mrow(mo`[`, mrow(
    add(
      frag([
        minusP(
          msubsup(mi`K`, mn(0), alpha),
          frac([
            vars.iFactor,
            vars.tech,
            msup(vars.labour, alpha),
          ], [vars.depreciation]),
        ),
        msup(mi`e`, mrow(
          mo`—`, alpha,
          vars.depreciation,
          mi`t`,
        )),
      ]),
      frac([
        vars.iFactor,
        vars.tech,
        msup(vars.labour, alpha),
      ], [vars.depreciation]),
    ),
  ), mo`]`), frac([mn(1)], [alpha]))),
);
