/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml } from '../../prelude.js';

const {
  sum, i, sub, o, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, matrix, SPECIAL, under,
  table,
} = mathml;

const { Pi, alpha, delta2: delta } = SPECIAL.greek;

const vars = {
  output: i('Y'),
  outputEq: sup(i('Y'), o('*')),
  outputEqPerCapita: sup(i('y'), o('*')),
  tech: i('A'),
  techFixed: i('Ā'),
  labour: i('L'),
  labourE: sup(i('L'), alpha),
  labourEq: sup(i('L'), o('*')),
  labourFixed: i('L̄'),
  labourFixedE: sup(i('L̄'), alpha),
  capital: i('K'),
  capitalE: sup(i('K'), paren([n(1), o('-'), alpha])),
  capitalEq: sup(i('K'), o('*')),
  capitalPerWorker: i('k̄'),
  capitalPerWorkerE: sup(i('k̄'), paren([n(1), o('-'), alpha])),
  captialFixed: i('K̄'),
  captialFixedE: sup(i('K̄'), paren([n(1), o('-'), alpha])),
  deltaY: row([delta, i('Y')]),
  deltaK: row([delta, i('K')]),
  deltaL: row([delta, i('L')]),
  deltaYOverK: frac([delta, i('Y')], [delta, i('K')]),
  deltaYOverL: frac([delta, i('Y')], [delta, i('L')]),
  partialDeltaK: frac([delta], [delta, i('K')]),
  partialDeltaL: frac([delta], [delta, i('L')]),
  realWage: i('w'),
  realWageEq: sup(i('w'), o('*')),
  realProfits: Pi,
  realRentPaidToCapital: i('r'),
  realRentPaidToCapitalEq: sup(i('r'), i('*')),
};

const cobbDouglas = row([
  i('Y'), o('='),
  vars.techFixed, space(3),
  vars.capitalE, space(2),
  vars.labourE,
]);

/**
 * @param {E.Item} f
 * @param {...E.Item} body
 * @returns {E.Item}
 */
function squareApply(f, ...body) {
  return row([f, row([o('['), ...body, o(']')])]);
}

export const production = {
  generalForm: mathml([
    row([
      i('Y'), o('='),
      call('F', vars.capital, vars.labour, vars.tech),
    ]),
  ]),
  cobbDouglas: mathml([cobbDouglas]),
};

const powL = frac([n(2)], [n(3)]);
const powK = frac([n(1)], [n(3)]);

export const marginalProduct = {
  preamble: mathml([
    row([
      cobbDouglas,
      space(32),
      text('Let'),
      space(8),
      row([
        alpha, o('='),
        frac([n(2)], [n(3)]),
      ]),
    ]),
  ]),
  ofLabour: mathml([
    rows([
      row([
        i('Y'), o('='),
        vars.techFixed, space(3),
        sup(vars.capital, powK), space(2),
        sup(vars.labour, powL),
      ]),
      row([
        vars.deltaYOverL, o('='),
        squareApply(
          vars.partialDeltaL,
          vars.techFixed, space(3),
          sup(vars.labour, powL), space(2),
          sup(vars.capital, powK),
        )
      ]),
      row([
        vars.deltaYOverL, o('='),
        vars.techFixed, space(3),
        sup(vars.capital, powK), space(2),
        squareApply(
          vars.partialDeltaL,
          sup(vars.labour, powL),
        )
      ]),
      row([
        vars.deltaYOverL, o('='),
        vars.techFixed, space(3),
        sup(vars.capital, powK), space(2),
        powL, space(2),
        sup(vars.labour, frac([n(-1)], [n(3)]))
      ]),
      row([
        SPECIAL.because, space(8),
        sup(vars.labour, frac([n(-1)], [n(3)])), o('='),
        frac([sup(vars.labour, powL)], [vars.labour]),
      ]),
      row([
        SPECIAL.therefore, space(8),
        vars.deltaYOverL, o('='),
        powL, space(2),
        frac([
          vars.techFixed, space(3),
          sup(vars.capital, powK), space(2),
          sup(vars.labourE, powL),
        ], [vars.labour]), o('='),
        powL, space(2),
        frac([i('Y')], [i('L')]),
      ]),
    ]),
  ]),
  ofCapital: mathml([
    rows([
      row([
        i('Y'), o('='),
        vars.techFixed, space(3),
        sup(vars.capital, powK), space(2),
        sup(vars.labour, powL),
      ]),
      row([
        vars.deltaYOverK, o('='),
        squareApply(
          vars.partialDeltaK,
          vars.techFixed, space(3),
          sup(vars.labour, powL), space(2),
          sup(vars.capital, powK),
        )
      ]),
      row([
        vars.deltaYOverK, o('='),
        vars.techFixed, space(3),
        sup(vars.labour, powL), space(2),
        squareApply(
          vars.partialDeltaK,
          sup(vars.capital, powK),
        )
      ]),
      row([
        vars.deltaYOverK, o('='),
        vars.techFixed, space(3),
        sup(vars.labour, powL), space(2),
        powK, space(2),
        sup(vars.capital, frac([n(-2)], [n(3)]))
      ]),
      row([
        SPECIAL.because, space(8),
        sup(vars.capital, frac([n(-2)], [n(3)])), o('='),
        frac([sup(vars.capital, powK)], [vars.capital]),
      ]),
      row([
        SPECIAL.therefore, space(8),
        vars.deltaYOverK, o('='),
        powK, space(2),
        frac([
          vars.techFixed, space(3),
          sup(vars.capital, powK), space(2),
          sup(vars.labourE, powL),
        ], [vars.capital]), o('='),
        powK, space(2),
        frac([i('Y')], [i('K')]),
      ]),
    ]),
  ]),
};

export const firms = {
  profits: mathml([
    row([
      Pi, o('='),
      vars.techFixed, space(3),
      vars.capitalE, space(2),
      vars.labourE, space(2),
      o('-'), space(2),
      vars.realWage,
      vars.labour, space(2),
      o('-'), space(2),
      vars.realRentPaidToCapital,
      vars.capital,
    ]),
  ]),
  profitMaximisingCapital: mathml([
    rows([
      row([i('MPK'), o('='), i('r')]),
      space(8),
      row([
        i('MPK'), o('='),
        vars.deltaYOverK, o('='), space(4),
        paren([n(1), o('-'), alpha]), space(4),
        frac([i('Y')], [vars.capital]),
        o('='), vars.realRentPaidToCapital,
      ]),
    ]),
  ]),
  profitMaximisingLabour: mathml([
    rows([
      row([i('MPL'), o('='), i('w')]),
      space(8),
      row([
        i('MPL'), o('='),
        vars.deltaYOverL, o('='), space(4),
        alpha, space(4),
        frac([i('Y')], [vars.labour]),
        o('='), vars.realWage,
      ]),
    ]),
  ]),
};

export const nationalAccounting = {
  identities: mathml([
    rows([
      table([
        [
          row([
            vars.realWageEq, o('='),
            space(4), alpha, space(4),
            frac([vars.outputEq], [vars.labourEq]),
            space(8),
          ]),
          row([
            space(8),
            vars.realRentPaidToCapitalEq, o('='),
            space(4),
            paren([n(1), o('-'), alpha]), space(4),
            frac([vars.outputEq], [vars.capitalEq]),
          ])
        ],
        [
          row([
            frac([vars.realWageEq, vars.labourEq], [vars.outputEq]),
            space(4), o('='), space(4), alpha, space(8),
          ]),
          row([
            space(8),
            frac([vars.realRentPaidToCapitalEq, vars.capitalEq], [vars.outputEq]),
            space(4), o('='), space(4), paren([n(1), o('-'), alpha]),
          ])
        ],
      ]),
      row([
        frac([vars.realWageEq, vars.labourEq], [vars.outputEq]),
        space(4), o('+'), space(4),
        frac([vars.realRentPaidToCapitalEq, vars.capitalEq], [vars.outputEq]),
        space(4), o('='), space(4),
        n(1),
      ]),
      row([
        vars.realWageEq,
        vars.labourEq,
        space(4), o('+'), space(4),
        vars.realRentPaidToCapitalEq,
        vars.capitalEq,
        space(4), o('='), space(4),
        vars.outputEq,
      ]),
    ])
  ]),
};

export const perCapita = {
  output: mathml([
    table([
      [vars.outputEqPerCapita, o('='), row([
        frac([vars.outputEq], [vars.labourEq]),
        space(8), o('='), space(8),
        vars.techFixed, space(4),
        vars.captialFixedE, space(4),
        vars.labourFixedE, space(4),
        inv(vars.labourFixed),
      ])],
      [vars.outputEqPerCapita, o('='), row([
        vars.techFixed, space(4),
        vars.captialFixedE, space(4),
        sup(vars.labourFixed, row([alpha, o('-'), n(1)])),
      ])],
      [vars.outputEqPerCapita, o('='), row([
        vars.techFixed, space(4),
        vars.capitalPerWorkerE,
      ])],
    ]),
  ]),
};

export const noop = () => undefined;
