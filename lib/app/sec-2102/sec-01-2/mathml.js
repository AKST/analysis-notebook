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
      under(sub(i('S'), i('t')), text('Savings')),
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
        frac([n(1), o('-'), alpha], [alpha]),
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
      sup(vars.capitalEq, row([n(1), o('-'), paren([n(1), o('-'), alpha])])),
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
        frac([n(1), o('-'), alpha], [alpha]),
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
        frac([n(1), o('-'), alpha], [alpha]),
      ),
      sup(vars.labourFixed, paren([n(1), o('-'), alpha])),
    ),
    vars.labourFixedE,
  )),
  eq(vars.outputEq, mul3(
    sup(vars.techFixed, frac([n(1)], [alpha])),
    sup(
      paren([
        frac([vars.iFactor, vars.techFixed], [vars.depreciation]),
      ]),
      frac([n(1), o('-'), alpha], [alpha]),
    ),
    vars.labourFixed,
  )),
  eq(
    frac([vars.outputEq], [vars.labourFixed]),
    mul2(
      sup(vars.techFixed, frac([n(1)], [alpha])),
      sup(
        paren([frac([vars.iFactor], [vars.depreciation])]),
        frac([n(1), o('-'), alpha], [alpha]),
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
