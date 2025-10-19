import { mathml, mathml2, doc } from '../../prelude.js';
import * as prelude from '../prelude.js';

const { mathmlHelper, components: { todo } } = prelude;
const {
  text, n, frac, sup, sub,
  table, rows, row, under, space,
  paren,
} = mathml;

const { mi, mo } = mathml2;

const { implies, addP, eq, eqId, mul3, mul2, add, minus, minusP } = mathmlHelper;

export const unemploymentRate = doc.figure(
  mathml([
    text('Unemployment Rate'), mo`=`,
    frac([text('number of unemployed')], [text('size of labour force')]),
  ], { style: 'font-size: 12px' }),
  doc.figcaption`The unemployment rate`,
);

export const actualUnemployment = doc.figure(
  mathml([
    text('Actual Unemployment'),
    space(8), mo`=`, space(8),
    under(row([
      text('Frictional'),
      space(8), mo`+`, space(8),
      text('Structural'),
    ]), under(mo`⏟`, text('natural', { style: 'font-size: 12px; margin-top: 4px' }))),
    space(8), mo`+`, space(8),
    text('cyclical'),
  ], { style: 'font-size: 12px' }),
  doc.figcaption`Components of Unemployment`,
);

export const bathtubModel = {
  labourForce: doc.figure(
    mathml([
      eq(mi`L̄`, add(sub(mi`E`, mi`t`), sub(mi`U`, mi`t`))),
    ]),
    doc.figcaption`Labour Force`,
  ),

  labourDynamics: doc.figure(
    mathml([
      eq(
        sub(mi`∆U`, row([mi`t`, mo`+`, n(1)])),
        minus(
          mul2(mi`s`, sub(mi`E`, mi`t`)),
          mul2(mi`f`, sub(mi`U`, mi`t`)),
        ),
      ),
    ]),
    doc.figcaption`Labour Dynamics`,
  ),

  solveForUnemployment: doc.figure(
    mathml([
      table([
        [n(0), mo`=`, minus(
          mul2(mi`s`, sub(mi`E`, mi`t`)),
          mul2(mi`f`, sub(mi`U`, mi`t`)),
        )],
        [space(8), mo`=`, minus(
          mul2(mi`s`, minusP(mi`L`, sub(mi`Y`, mi`t`))),
          mul2(mi`f`, sub(mi`U`, mi`t`)),
        )],
        [space(8), mo`=`, minus(
          mul2(mi`s`, mi`L`),
          mul2(addP(mi`f`, mi`s`), sub(mi`U`, mi`t`)),
        )],
        [sup(mi`U`, mi`*`), mo`=`, frac(
          [mul2(mi`s`, mi`L`)],
          [add(mi`f`, mi`s`)],
        )],
      ], { columnalign: 'right center left' }),
    ]),
    doc.figcaption`Solve for unemployment`,
  ),

  unemploymentRate: doc.figure(
    mathml([
      sup(mi`u`, mi`*`),
      space(8), mo`≡`, space(8),
      frac([sup(mi`U`, mi`*`)], [mi`L`]),
      space(8), mo`=`, space(8),
      frac([mi`s`], [add(mi`f`, mi`s`)]),
    ]),
    doc.figcaption`Unemployment Rate`,
  ),
};

export const valueOfHumanCapital = {
  presentDiscountedRate: doc.figure(
    mathml([
      text('Present Discounted Value'),
      space(8), mo`=`, space(8),
      frac([text('Future Value')], [
        sup(
          paren([n(1), mo`+`, text('Interest Rate')]),
          mi`T`,
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
              paren([frac([n(1)], [add(n(1), mi`R`)])]),
              mi`T`,
            )),
          ], [
            minus(n(1), frac([n(1)], [add(n(1), mi`R`)])),
          ]),
        ),
      ),
    ], { style: 'font-size: 12px' }),
    doc.figcaption`Present discounted value of salary`,
  ),
};
