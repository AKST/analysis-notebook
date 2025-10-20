/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml2 } from '../../prelude.js';
import { mathmlHelper, mathmlHelper_2 } from '../prelude.js';

const { mi, mo, mtext, mrow, mover, mn, msub, msup, munder, mspace, mfrac } = mathml2;
const { add, eq, rows, inv, call, parensA, table, SPECIAL } = mathmlHelper_2;
const { Pi, alpha, delta, theta } = SPECIAL.greek;
const { mul3, mul2, minusP } = mathmlHelper;

const vars = {
  output: mi`Y`,
  outputEq: msup(mi`Y`, mo`*`),
  outputEqPerCapita: msup(mi`y`, mo`*`),
  tech: mi`A`,
  techFixed: mi`Ā`,
  labour: mi`L`,
  labourE: msup(mi`L`, alpha),
  labourEq: msup(mi`L`, mo`*`),
  labourFixed: mi`L̄`,
  labourFixedE: msup(mi`L̄`, alpha),
  capital: mi`K`,
  capitalE: msup(mi`K`, parensA(mn(1), mo`-`, alpha)),
  capitalEq: msup(mi`K`, mo`*`),
  capitalPerWorker: mi`k̄`,
  capitalPerWorkerE: msup(mi`k̄`, parensA(mn(1), mo`-`, alpha)),
  captialFixed: mi`K̄`,
  captialFixedE: msup(mi`K̄`, parensA(mn(1), mo`-`, alpha)),
  deltaY: mrow(delta, mi`Y`),
  deltaK: mrow(delta, mi`K`),
  deltaL: mrow(delta, mi`L`),
  deltaYOverK: mfrac(mrow(delta, mi`Y`), mrow(delta, mi`K`)),
  deltaYOverL: mfrac(mrow(delta, mi`Y`), mrow(delta, mi`L`)),
  partialDeltaK: mfrac(delta, mrow(delta, mi`K`)),
  partialDeltaL: mfrac(delta, mrow(delta, mi`L`)),
  realWage: mi`w`,
  realWageEq: msup(mi`w`, mo`*`),
  realProfits: Pi,
  realRentPaidToCapital: mi`r`,
  realRentPaidToCapitalEq: msup(mi`r`, mi`*`),
};

const cobbDouglas = mrow(
  mi`Y`, mo`=`,
  vars.techFixed, mspace(3),
  vars.capitalE, mspace(2),
  vars.labourE,
);

/**
 * @param {E.Item} f
 * @param {...E.Item} body
 * @returns {E.Item}
 */
function squareApply(f, ...body) {
  return mrow(f, mrow(mo`[`, ...body, mo`]`));
}

export const production = {
  generalForm: mathml2.math(
    mrow(
      mi`Y`, mo`=`,
      call.attr({ fn: mi`F` })(vars.capital, vars.labour, vars.tech),
    ),
  ),
  cobbDouglas: mathml2.math(cobbDouglas),
};

const powL = mfrac(mn(2), mn(3));
const powK = mfrac(mn(1), mn(3));

export const marginalProduct = {
  preamble: mathml2.math(
    mrow(
      cobbDouglas,
      mspace(32),
      mtext`Let`,
      mspace(8),
      eq(alpha, mfrac(mn(2), mn(3))),
    ),
  ),
  ofLabour: mathml2.math(
    rows(
      eq(mi`Y`, mul3(vars.techFixed, msup(vars.capital, powK), msup(vars.labour, powL))),
      eq(vars.deltaYOverL, squareApply(
        vars.partialDeltaL,
        mul3(vars.techFixed, msup(vars.capital, powK), msup(vars.labour, powL)),
      )),
      eq(vars.deltaYOverL, mul3(
        vars.techFixed,
        msup(vars.capital, powK),
        squareApply(
          vars.partialDeltaL,
          msup(vars.labour, powL),
        ),
      )),
      mrow(
        vars.deltaYOverL, mo`=`,
        vars.techFixed, mspace(3),
        msup(vars.capital, powK), mspace(2),
        powL, mspace(2),
        msup(vars.labour, mfrac(mn(-1), mn(3)))
      ),
      mrow(
        SPECIAL.because, mspace(8),
        msup(vars.labour, mfrac(mn(-1), mn(3))), mo`=`,
        mfrac(msup(vars.labour, powL), vars.labour),
      ),
      mrow(
        SPECIAL.therefore, mspace(8),
        vars.deltaYOverL, mo`=`,
        powL, mspace(2),
        mfrac(mrow(
          vars.techFixed, mspace(3),
          msup(vars.capital, powK), mspace(2),
          msup(vars.labourE, powL),
        ), vars.labour), mo`=`,
        powL, mspace(2),
        mfrac(mi`Y`, mi`L`),
      ),
    ),
  ),
  ofCapital: mathml2.math(
    rows(
      mrow(
        mi`Y`, mo`=`,
        vars.techFixed, mspace(3),
        msup(vars.capital, powK), mspace(2),
        msup(vars.labour, powL),
      ),
      mrow(
        vars.deltaYOverK, mo`=`,
        squareApply(
          vars.partialDeltaK,
          vars.techFixed, mspace(3),
          msup(vars.labour, powL), mspace(2),
          msup(vars.capital, powK),
        )
      ),
      mrow(
        vars.deltaYOverK, mo`=`,
        vars.techFixed, mspace(3),
        msup(vars.labour, powL), mspace(2),
        squareApply(
          vars.partialDeltaK,
          msup(vars.capital, powK),
        )
      ),
      mrow(
        vars.deltaYOverK, mo`=`,
        vars.techFixed, mspace(3),
        msup(vars.labour, powL), mspace(2),
        powK, mspace(2),
        msup(vars.capital, mfrac(mn(-2), mn(3)))
      ),
      mrow(
        SPECIAL.because, mspace(8),
        msup(vars.capital, mfrac(mn(-2), mn(3))), mo`=`,
        mfrac(msup(vars.capital, powK), vars.capital),
      ),
      mrow(
        SPECIAL.therefore, mspace(8),
        vars.deltaYOverK, mo`=`,
        powK, mspace(2),
        mfrac(mrow(
          vars.techFixed, mspace(3),
          msup(vars.capital, powK), mspace(2),
          msup(vars.labourE, powL),
        ), vars.capital), mo`=`,
        powK, mspace(2),
        mfrac(mi`Y`, mi`K`),
      ),
    ),
  ),
};

export const firms = {
  profits: mathml2.math(
    mrow(
      Pi, mo`=`,
      vars.techFixed, mspace(3),
      vars.capitalE, mspace(2),
      vars.labourE, mspace(2),
      mo`-`, mspace(2),
      vars.realWage,
      vars.labour, mspace(2),
      mo`-`, mspace(2),
      vars.realRentPaidToCapital,
      vars.capital,
    ),
  ),
  profitMaximisingCapital: mathml2.math(
    rows(
      mrow(mi`MPK`, mo`=`, mi`r`),
      mspace(8),
      mrow(
        mi`MPK`, mo`=`,
        vars.deltaYOverK, mo`=`, mspace(4),
        parensA(mn(1), mo`-`, alpha), mspace(4),
        mfrac(mi`Y`, vars.capital),
        mo`=`, vars.realRentPaidToCapital,
      ),
    ),
  ),
  profitMaximisingLabour: mathml2.math(
    rows(
      mrow(mi`MPL`, mo`=`, mi`w`),
      mspace(8),
      mrow(
        mi`MPL`, mo`=`,
        vars.deltaYOverL, mo`=`, mspace(4),
        alpha, mspace(4),
        mfrac(mi`Y`, vars.labour),
        mo`=`, vars.realWage,
      ),
    ),
  ),
};

export const nationalAccounting = {
  identities: mathml2.math(
    rows(
      table(
        [
          mrow(
            vars.realWageEq, mo`=`,
            mspace(4), alpha, mspace(4),
            mfrac(vars.outputEq, vars.labourEq),
            mspace(8),
          ),
          mrow(
            mspace(8),
            vars.realRentPaidToCapitalEq, mo`=`,
            mspace(4),
            parensA(mn(1), mo`-`, alpha), mspace(4),
            mfrac(vars.outputEq, vars.capitalEq),
          )
        ],
        [
          mrow(
            mfrac(mrow(vars.realWageEq, vars.labourEq), vars.outputEq),
            mspace(4), mo`=`, mspace(4), alpha, mspace(8),
          ),
          mrow(
            mspace(8),
            mfrac(mrow(vars.realRentPaidToCapitalEq, vars.capitalEq), vars.outputEq),
            mspace(4), mo`=`, mspace(4), parensA(mn(1), mo`-`, alpha),
          )
        ],
      ),
      mrow(
        mfrac(mrow(vars.realWageEq, vars.labourEq), vars.outputEq),
        mspace(4), mo`+`, mspace(4),
        mfrac(mrow(vars.realRentPaidToCapitalEq, vars.capitalEq), vars.outputEq),
        mspace(4), mo`=`, mspace(4),
        mn(1),
      ),
      mrow(
        vars.realWageEq,
        vars.labourEq,
        mspace(4), mo`+`, mspace(4),
        vars.realRentPaidToCapitalEq,
        vars.capitalEq,
        mspace(4), mo`=`, mspace(4),
        vars.outputEq,
      ),
    )
  ),
};

export const perCapita = {
  output: mathml2.math(
    table.attr({ columnalign: 'right center left' })(
      [vars.outputEqPerCapita, mo`=`, mrow(
        mfrac(vars.outputEq, vars.labourEq),
        mspace(8), mo`=`, mspace(8),
        vars.techFixed, mspace(4),
        vars.captialFixedE, mspace(4),
        vars.labourFixedE, mspace(4),
        inv(vars.labourFixed),
      )],
      [vars.outputEqPerCapita, mo`=`, mrow(
        vars.techFixed, mspace(4),
        vars.captialFixedE, mspace(4),
        msup(vars.labourFixed, mrow(alpha, mo`-`, mn(1))),
      )],
      [vars.outputEqPerCapita, mo`=`, mrow(
        vars.techFixed, mspace(4),
        vars.capitalPerWorkerE,
      )],
    ),
  ),
};

export const hypotheticalModel = {
  output: eq(mi`Y`, mover(mul2(
    msup(mi`K`, mfrac(mn(1), mn(3))),
    parensA(add(
      mul2(theta, msup(vars.labour, mfrac(mn(1), mn(2)))),
      mul2(
        minusP(mn(1), theta),
        msup(mi`H`, mfrac(mn(1), mn(2))),
      ),
    )),
  ), mtext`H is human capital`)),
  mpk: eq(mi`MPK`, mul2(
    mfrac(mn(1), mn(3)),
    mfrac(mi`Y`, mi`K`),
  )),
  mpkh: eq(mi`MPH`, mul2(
    mfrac(mn(1), mn(3)),
    mfrac(mi`Y`, mi`K`),
  )),
};

export const noop = () => undefined;
