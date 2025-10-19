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
  labour: mi`L`,
  labourE: sup(mi`L`, alpha),
  labourT: sub(mi`L`, mi`t`),
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
  tech: mi`A`,
  techFixed: mi`Ā`,
  output: mi`Y`,
  outputT: sub(mi`Y`, mi`t`),
  outputEq: sup(mi`Y`, mo`*`),
  outputEqPerCapita: sup(mi`y`, mo`*`),
};

const { implies, eq, eqId, mul3, mul2, add, minus, minusP } = mathmlHelper;

export const temporalOutput = mathml([
  eq(vars.outputT, mul3(
    vars.techFixed,
    vars.captialET,
    vars.labourET,
  )),
]);

export const temporalOutputWithFixedLabour = mathml([
  eq(vars.outputT, mul3(
    vars.techFixed,
    vars.captialET,
    vars.labourFixedE,
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

export const capitalAccumulation2 = mathml([rows([
  eqId(frag([Delta, vars.captialTNext]), minus(vars.captialT, vars.captialTNext)),
  eq(frag([Delta, vars.captialTNext]), minus(
    vars.investmentT,
    frag([vars.depreciation, vars.captialT])
  )),
])]);

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

export const derivingConsumptionT = mathml([
  implies(
    eq(add(vars.consumptionT, vars.investmentT), vars.outputT),
    implies(
      eq(
        add(vars.consumptionT, mul2(vars.iFactor, vars.outputT)),
        vars.outputT,
      ),
      eq(vars.consumptionT, mul2(
        minusP(n(1), vars.iFactor),
        vars.outputT,
      )),
    ),
  ),
]);

export const investmentConstraint = mathml([
  eq(
    under(row([minus(vars.outputT, vars.consumptionT)]), text('savings')),
    eq(
      under(vars.investmentT, text('investment')),
      under(sub(mi`S`, mi`t`), text('Savings')),
    ),
  ),
]);

export const netInvestment = mathml([
  eq(vars.investmentT, mul2(vars.depreciation, vars.captialT)),
]);

export const netInvestmentConstraint = mathml([
  eq(
    over(text('Change in capital'), vars.captialTNext),
    over(text('Net investment'), minus(
      frag([vars.iFactor, vars.outputT]),
      frag([vars.depreciation, vars.captialT]),
    )),
  ),
]);

export const solowDiagram = mathml([
  eq(
    frag([vars.iFactor, vars.output]),
    mul3(
      frag([vars.iFactor, vars.techFixed]),
      vars.capitalE,
      vars.labourFixedE,
    )
  ),
]);

export const steadyStateConstraint = mathml([
  eq(
    mul3(
      frag([vars.iFactor, vars.techFixed]),
      vars.capitalEEq,
      vars.labourFixedE,
    ),
    frag([vars.depreciation, vars.capitalEq]),
  ),
]);

export const solveSteadyState = mathml([
  eq(
    vars.capitalEq,
    mul2(
      sup(
        paren([
          frac([vars.iFactor, vars.techFixed], [vars.depreciation]),
        ]),
        frac([n(1)], [alpha]),
      ),
      vars.labourFixed,
    ),
  ),
]);

export const steadyStateOutput = mathml([
  eq(
    vars.outputEq,
    mul3(
      sup(
        paren([
          frac([vars.iFactor, vars.techFixed], [vars.depreciation]),
        ]),
        frac([n(1), mo`-`, alpha], [alpha]),
      ),
      sup(
        vars.techFixed,
        frac([n(1)], [alpha]),
      ),
      vars.labourFixed,
    )
  ),
]);

export const steadyStateWorkingout = mathml([rows([
  eq(
    mul3(frag([vars.iFactor, vars.techFixed]), vars.capitalEEq, vars.labourFixedE),
    frag([vars.depreciation, vars.capitalEq]),
  ),

  space(8),

  over(row([text('divide by'), space(8), vars.capitalEEq]), eq(
    mul2(frag([vars.iFactor, vars.techFixed]), vars.labourFixedE),
    frag([vars.depreciation, frac([vars.capitalEq], [vars.capitalEEq])]),
  )),

  space(8),

  over(text('simplify exponents'), eq(
    frac([vars.capitalEq], [vars.capitalEEq]),
    eq(
      sup(vars.capitalEq, row([n(1), mo`-`, paren([n(1), mo`-`, alpha])])),
      sup(vars.capitalEq, alpha),
    ),
  )),
  eq(
    mul2(row([vars.iFactor, vars.techFixed]), vars.labourFixedE),
    row([vars.depreciation, sup(vars.capitalEq, alpha)]),
  ),

  space(8),

  over(row([text('divide by'), space(8), vars.depreciation]), eq(
    frac(
      [mul2(frag([vars.iFactor, vars.techFixed]), vars.labourFixedE)],
      [vars.depreciation],
    ),
    sup(vars.capitalEq, alpha),
  )),

  space(8),

  over(row([text('apply recipical exponent')]), eq(
    mul2(
      sup(
        paren([
          frac([vars.iFactor, vars.techFixed], [vars.depreciation]),
        ]),
        frac([n(1)], [alpha]),
      ),
      vars.labourFixed,
    ),
    vars.capitalEq,
  )),
])]);

export const steadyStatePerWorker = mathml([
  eq(vars.outputEqPerCapita, eq(
    frac([vars.outputEq], [vars.labourFixed]),
    mul2(
      sup(vars.techFixed, frac([n(1)], [alpha])),
      sup(
        frac([vars.iFactor], [vars.depreciation]),
        frac([n(1), mo`-`, alpha], [alpha]),
      ),
    ),
  )),
]);

export const steadyStatePerWorkerWorkingOut = mathml([rows([
  eq(vars.outputEq, mul3(vars.techFixed, vars.capitalEEq, vars.labourFixedE)),
  eq(vars.outputEq, mul3(
    vars.techFixed,
    mul2(
      sup(
        paren([
          frac([vars.iFactor, vars.techFixed], [vars.depreciation]),
        ]),
        frac([n(1), mo`-`, alpha], [alpha]),
      ),
      sup(vars.labourFixed, paren([n(1), mo`-`, alpha])),
    ),
    vars.labourFixedE,
  )),
  eq(vars.outputEq, mul3(
    sup(vars.techFixed, frac([n(1)], [alpha])),
    sup(
      paren([
        frac([vars.iFactor, vars.techFixed], [vars.depreciation]),
      ]),
      frac([n(1), mo`-`, alpha], [alpha]),
    ),
    vars.labourFixed,
  )),
  eq(
    frac([vars.outputEq], [vars.labourFixed]),
    mul2(
      sup(vars.techFixed, frac([n(1)], [alpha])),
      sup(
        paren([frac([vars.iFactor], [vars.depreciation])]),
        frac([n(1), mo`-`, alpha], [alpha]),
      ),
    ),
  ),
])]);

export const productionPerCapita = mathml([
  eq(vars.outputEqPerCapita, mul2(vars.techFixed, vars.capitalPerWorkerE)),
]);

export const outputToCapitalRatio = mathml([
  eq(
    frac([vars.capitalEq], [vars.outputEq]),
    frac([vars.iFactor], [vars.depreciation]),
  ),
]);

export const continiousK = mathml([
  eq(call('K', mi`t`), sup(row([mo`[`, row([
    add(
      frag([
        minusP(
          subsup(mi`K`, n(0), alpha),
          frac([
            vars.iFactor,
            vars.tech,
            sup(vars.labour, alpha),
          ], [vars.depreciation]),
        ),
        sup(mi`e`, row([
          mo`—`, alpha,
          vars.depreciation,
          mi`t`,
        ])),
      ]),
      frac([
        vars.iFactor,
        vars.tech,
        sup(vars.labour, alpha),
      ], [vars.depreciation]),
    ),
  ]), mo`]`]), frac([n(1)], [alpha]))),
]);
