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
  ], { style: 'font-size: 12px' }),
  doc.figcaption`The unemployment rate`,
);

export const actualUnemployment = doc.figure(
  mathml([
    text('Actual Unemployment'),
    space(8), o('='), space(8),
    under(row([
      text('Frictional'),
      space(8), o('+'), space(8),
      text('Structural'),
    ]), under(o('⏟'), text('natural', { style: 'font-size: 12px; margin-top: 4px' }))),
    space(8), o('+'), space(8),
    text('cyclical'),
  ], { style: 'font-size: 12px' }),
  doc.figcaption`Components of Unemployment`,
);

export const bathtubModel = {
  labourForce: doc.figure(
    mathml([
      eq(i('L̄'), add(sub(i('E'), i('t')), sub(i('U'), i('t')))),
    ]),
    doc.figcaption`Labour Force`,
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
    doc.figcaption`Labour Dynamics`,
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
      ], { columnalign: 'right center left' }),
    ]),
    doc.figcaption`Solve for unemployment`,
  ),

  unemploymentRate: doc.figure(
    mathml([
      sup(i('u'), i('*')),
      space(8), o('≡'), space(8),
      frac([sup(i('U'), i('*'))], [i('L')]),
      space(8), o('='), space(8),
      frac([i('s')], [add(i('f'), i('s'))]),
    ]),
    doc.figcaption`Unemployment Rate`,
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
    ], { style: 'font-size: 12px' }),
    doc.figcaption`Present discounted value`,
  ),
  presentDiscountedValueOfSalary: doc.figure(
    mathml([
      eq(
        text('PDV'),
        mul2(
          text('Annual Salary'),
          frac([
            minus(n(1), sup(
              paren([frac([n(1)], [add(n(1), i('R'))])]),
              i('T'),
            )),
          ], [
            minus(n(1), frac([n(1)], [add(n(1), i('R'))])),
          ]),
        ),
      ),
    ], { style: 'font-size: 12px' }),
    doc.figcaption`Present discounted value of salary`,
  ),
};
