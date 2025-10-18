/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, doc } from '../../prelude.js';
import { components, mathmlHelper } from '../prelude.js';

const {
  n, o, i, table, text,
  space, under, sub, frac, row,
} = mathml;

const {
	eq, add3, add, mul2, eqId, minus,
	minusP, mul3,
} = mathmlHelper;

export const moneyTransmission = doc.figure(
  mathml([
    o('↑'),
    space(4), mathml.text('interest rate'),
    space(12), mathml.SPECIAL.arrow, space(12),
    mathml.o('↓'), space(4), mathml.text('investment'),
    space(12), mathml.SPECIAL.arrow, space(12),
    mathml.o('↓'), space(4), mathml.text('output'),
  ]),
  'Monetary transmission: higher interest rate reduces investment and output'
);

export const gdpExpenditure = {
  output: doc.figure(
    mathml([
      row([
        sub(i('Y'), i('t')),
        space(4), o('='), space(4),
        add3(
          sub(i('C'), i('t')),
          sub(i('I'), i('t')),
          add(
            sub(i('G'), i('t')),
            minus(
              sub(i('EX'), i('t')),
              sub(i('IM'), i('t'))
            )
          )
        ),
      ]),
    ]),
    'Output in Expenditure Accounting identities.'
  ),
  consumption: doc.figure(
    mathml([
      eq(
        sub(i('C'), i('t')),
        mul2(
          sub(i('ā'), i('c')),
          sub(i('Ȳ'), i('t'))
        )
      ),
    ]),
    'Consumption'
  ),
  government: doc.figure(
    mathml([
      eq(
        sub(i('G'), i('t')),
        mul2(
          sub(i('ā'), i('g')),
          sub(i('Ȳ'), i('t'))
        )
      ),
    ]),
    'Government'
  ),
  exports: doc.figure(
    mathml([
      eq(
        sub(i('EX'), i('t')),
        mul2(
          sub(i('ā'), i('ex')),
          sub(i('Ȳ'), i('t'))
        )
      ),
    ]),
    'Exports'
  ),
  imports: doc.figure(
    mathml([
      eq(
        sub(i('IM'), i('t')),
        mul2(
          sub(i('ā'), i('im')),
          sub(i('Ȳ'), i('t'))
        )
      ),
    ]),
    'Imports'
  ),
  investment: doc.figure(
    mathml([
      eq(
        frac([sub(i('I'), i('t'))], [sub(i('Ȳ'), i('t'))]),
        minus(
          sub(i('ā'), i('i')),
          mul2(
            i('b̄'),
            minusP(sub(i('R'), i('t')), i('r̄'))
          )
        )
      ),
    ]),
    'Investment'
  ),
};

export const outputDecomposition = {
  a: doc.figure(
    mathml([
      eq(
        frac([sub(i('Y'), i('t'))], [sub(i('Ȳ'), i('t'))]),
        add3(
          frac([sub(i('C'), i('t'))], [sub(i('Ȳ'), i('t'))]),
          frac([sub(i('I'), i('t'))], [sub(i('Ȳ'), i('t'))]),
          add(
            frac([sub(i('G'), i('t'))], [sub(i('Ȳ'), i('t'))]),
            minus(
              frac([sub(i('EX'), i('t'))], [sub(i('Ȳ'), i('t'))]),
              frac([sub(i('IM'), i('t'))], [sub(i('Ȳ'), i('t'))]),
            ),
          )
        )
      ),
    ]),
    'Output identity in ratio form'
  ),
  b: doc.figure(
    mathml([
      eq(
        frac([sub(i('Y'), i('t'))], [sub(i('Ȳ'), i('t'))]),
        add3(
          sub(i('ā'), i('c')),
          sub(i('ā'), i('i')),
          add3(
            sub(i('ā'), i('g')),
            sub(i('ā'), i('ex')),
            minus(
              sub(i('ā'), i('im')),
              mul2(i('b̄'), minusP(sub(i('R'), i('t')), i('r̄')))
            )
          )
        )
      ),
    ]),
    'Equilibrium output as a function of behavioural parameters'
  ),
  c: doc.figure(
    mathml([
      eqId(
        sub(i('Ỹ'), i('t')),
        frac(
          [
            minus(sub(i('Y'), i('t')), sub(i('Ȳ'), i('t')))
          ],
          [sub(i('Ȳ'), i('t'))]
        )
      ),
    ]),
    'Definition of the output gap'
  ),
  d: doc.figure(
    mathml([
      eq(
        row([
          under(
            frac([sub(i('Y'), i('t'))], [sub(i('Ȳ'), i('t'))]),
            under(o('⏟'), i('Ỹₜ'))
          ),
          space(4), o('-'), space(4), n(1)
        ]),
        row([
          under(
            row([
              sub(i('ā'), i('c')), space(4),
              o('+'), space(4), sub(i('ā'), i('i')), space(4),
              o('+'), space(4), sub(i('ā'), i('g')), space(4),
              o('+'), space(4), sub(i('ā'), i('ex')), space(4),
              o('-'), space(4), sub(i('ā'), i('im')), space(4),
              o('-'), space(4), n(1),
            ]),
            under(o('⏟'), i('ā'))
          ),
          space(4), o('-'), space(4),
          mul2(i('b̄'), minusP(sub(i('R'), i('t')), i('r̄')))
        ])
      ),
    ]),
    'Output gap decomposition with parameter grouping'
  ),
};

export const outputGap = doc.figure(
  mathml([
    eq(
      sub(i('Ỹ'), i('t')),
      minus(
        i('ā'),
        mul2(
          i('b̄'),
          minusP(sub(i('R'), i('t')), i('r̄'))
        )
      )
    ),
  ]),
  'Output gap'
);

export const consumptionShare = doc.figure(
  mathml([
    eq(
      frac([sub(i('C'), i('t'))], [sub(i('Y'), i('t'))]),
      add(
        sub(i('ā'), i('c')),
        mul2(i('x̄'), sub(i('Ỹ'), i('t')))
      )
    ),
  ]),
  'Consumption share'
);

export const ISCurve = doc.figure(
  mathml([
    eq(
      sub(i('Ỹ'), i('t')),
      mul2(
        under(
          frac([n(1)], [minus(n(1), i('x̄'))]),
          under(o('⏟'), text('multiplier'))
        ),
        under(
          row([
            o('['),
            minus(
              i('ā'),
              mul2(i('b̄'), minusP(sub(i('R'), i('t')), i('r̄')))
            ),
            o(']'),
          ]),
          under(o('⏟'), text('original IS curve'))
        )
      )
    ),
  ]),
  'IS curve with consumption response'
);

export const investmentLevel = doc.figure(
  mathml([
    eq(
      sub(i('I'), i('t')),
      minus(
        mul2(sub(i('ā'), i('i')), sub(i('Ȳ'), i('t'))),
        mul3(i('b̄'), minusP(sub(i('R'), i('t')), i('r̄')), sub(i('Ȳ'), i('t')))
      )
    ),
  ]),
  'Investment level: Iₜ = ā_iȲₜ − b̄(Rₜ − r̄)Ȳₜ'
);



