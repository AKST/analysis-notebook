/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, doc } from '../../prelude.js';
import { components, mathmlHelper } from '../prelude.js';

const {
  n, o, i, table, text, subsup,
  space, under, sub, frac, row, sup,
} = mathml;

const {
	eq, add3, add, mul2, eqId, minus,
	minusP, mul3, implies,
} = mathmlHelper;

const { todo } = components;

export const interestRates = doc.figure(
  mathml([
    mathml.table([
      [
        sub(mathml.i('i'), mathml.i('t')),
        mathml.o('='),
        add(
          sub(mathml.i('R'), mathml.i('t')),
          sub(mathml.i('π'), mathml.i('t')),
        ),
      ],
      [
        sub(mathml.i('R'), mathml.i('t')),
        mathml.o('='),
        minus(
          sub(mathml.i('i'), mathml.i('t')),
          sub(mathml.i('π'), mathml.i('t')),
        ),
      ],
    ]),
  ]),
  'Nominal and real interest rate relationship: iₜ = Rₜ + πₜ and Rₜ = iₜ − πₜ',
);

export const inflation = doc.figure(
  mathml([
    eq(
      sub(i('π'), i('t')),
      add(
        under(
          subsup(i('π'), i('t'), i('e')),
          under(o('⏟'), text('expected inflation'))
        ),
        under(
          mul2(i('v̄'), sub(i('Ẏ'), i('t'))),
          under(o('⏟'), text('demand conditions'))
        ),
      ),
    ),
  ]),
  'Inflation decomposition into expected and demand-driven components',
);

export const inflationChange = doc.figure(
  mathml([
    table([
      [
        subsup(i('π'), i('t'), i('e')),
        o('='),
        sub(i('π'), row([i('t'), o('-'), n(1)])),
      ],
      [
        sub(i('π'), i('t')),
        o('='),
        add(
          sub(i('π'), row([i('t'), o('-'), n(1)])),
          mul2(i('v̄'), sub(i('Ẏ'), i('t')))
        ),
      ],
      [
        sub(i('Δπ'), i('t')),
        o('='),
        mul2(i('v̄'), sub(i('Ẏ'), i('t'))),
      ],
    ]),
  ]),
  'Inflation dynamics over time: expected inflation, actual inflation, and change in inflation',
);

export const inflationChange2 = doc.figure(
  mathml([
    table([
      [
        sub(i('π'), i('t')),
        o('='),
        add3(
          sub(i('π'), row([i('t'), o('-'), n(1)])),
          mul2(i('v̄'), sub(i('Ẏ'), i('t'))),
          i('ō')
        ),
      ],
      [
        sub(i('Δπ'), i('t')),
        o('='),
        add(
          mul2(i('v̄'), sub(i('Ẏ'), i('t'))),
          i('ō')
        ),
      ],
    ]),
  ]),
  'Inflation including shock term: πₜ = πₜ₋₁ + v̄Ẏₜ + ō and Δπₜ = v̄Ẏₜ + ō',
);

export const inANutShell = doc.figure(
  mathml([
    table([
      [
        text('MP curve'),
        implies(
          row([i('↑iₜ')]),
          row([i('↑Rₜ')])
        ),
      ],
      [
        text('IS curve'),
        implies(
          row([i('↑Rₜ')]),
          row([i('↓Ẏₜ')])
        ),
      ],
      [
        text('Phillips curve'),
        implies(
          row([i('↓Ẏₜ')]),
          row([i('↓Δπₜ')])
        ),
      ],
    ]),
  ]),
  'Causal relationships implied by MP, IS, and Phillips curves',
);



