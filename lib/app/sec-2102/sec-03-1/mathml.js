import { mathml, doc } from '../../prelude.js';
import * as prelude from '../prelude.js';

const { mathmlHelper, components: { todo } } = prelude;
const {
  text, i, o, n, frac, sup, sub,
  table, rows, row, under, space,
  paren,
} = mathml;

const { implies, addP, eq, eqId, mul3, mul2, add, minus, minusP } = mathmlHelper;

export const unemploymentRate = doc.figure(
  mathml([
    text('Unemployment Rate'), o('='),
    frac([text('number of unemployed')], [text('size of labour force')]),
  ]),
  'The unemployment rate',
);

export const actualUnemployment = doc.figure(
  mathml([
    text('Actual Unemployment'),
    space(8), o('='), space(8),
    under(row([
      text('Frictional'),
      space(8), o('+'), space(8),
      text('Structural'),
    ]), under(o('⏟'), text('natural'))),
    space(8), o('+'), space(8),
    text('cyclical'),
  ]),
  'Components of Unemployment',
);

export const bathtubModel = {
  labourForce: doc.figure(
    mathml([
      eq(i('L̄'), add(sub(i('E'), i('t')), sub(i('U'), i('t')))),
    ]),
    'Labour Force',
  ),

  labourDynamics: doc.figure(
    mathml([
      eq(
        sub(i('∆U'), row([i('t'), o('+'), n(1)])),
        minus(
          mul2(i('s'), sub(i('E'), i('t'))),
          mul2(i('f'), sub(i('U'), i('t'))),
        ),
      ),
    ]),
    'Labour Dynamics',
  ),

  solveForUnemployment: doc.figure(
    mathml([
      table([
        [n(0), o('='), minus(
          mul2(i('s'), sub(i('E'), i('t'))),
          mul2(i('f'), sub(i('U'), i('t'))),
        )],
        [space(8), o('='), minus(
          mul2(i('s'), minusP(i('L'), sub(i('Y'), i('t')))),
          mul2(i('f'), sub(i('U'), i('t'))),
        )],
        [space(8), o('='), minus(
          mul2(i('s'), i('L')),
          mul2(addP(i('f'), i('s')), sub(i('U'), i('t'))),
        )],
        [sup(i('U'), i('*')), o('='), frac(
          [mul2(i('s'), i('L'))],
          [add(i('f'), i('s'))],
        )],
      ]),
    ]),
    'Solve for unemployment',
  ),

  unemploymentRate: doc.figure(
    mathml([
      sup(i('u'), i('*')),
      space(8), o('≡'), space(8),
      frac([sup(i('u'), i('*'))], [i('L')]),
      space(8), o('='), space(8),
      frac([i('s')], [add(i('f'), i('s'))]),
    ]),
    'Unemployment Rate',
  ),
};

export const valueOfHumanCapital = {
  presentDiscountedRate: doc.figure(
    mathml([
      text('Present Discounted Value'),
      space(8), o('='), space(8),
      frac([text('Future Value')], [
        sup(
          paren([n(1), o('+'), text('Interest Rate')]),
          i('T'),
        ),
      ]),
    ]),
    'Present discounted value',
  ),
};
