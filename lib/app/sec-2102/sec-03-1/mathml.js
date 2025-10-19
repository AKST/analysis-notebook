import { mathml, mathml2, doc } from '../../prelude.js';
import { mathmlHelper, mathmlHelper_2 } from '../prelude.js';

const {
  n, frac, sup, sub,
  table, space,
  paren,
} = mathml;

const { mi, mo, mtext, mrow } = mathml2;
const { rows, annotationUnder } = mathmlHelper_2;
const { implies, addP, eq, eqId, mul3, mul2, add, minus, minusP } = mathmlHelper;

export const unemploymentRate = doc.figure(
  mathml2.math(
    mrow(
      mtext`Unemployment Rate`, mo`=`,
      frac([mtext`number of unemployed`], [mtext`size of labour force`]),
    )
  ),
  doc.figcaption`The unemployment rate`,
);

export const actualUnemployment = doc.figure(
  mathml2.math(
    mrow(
      mtext`Actual Unemployment`,
      space(8), mo`=`, space(8),
      annotationUnder.attr({
        labelSize: 12,
        marginTop: 4,
        label: mtext`Natural`,
      })(
        mtext`Frictional`,
        space(8), mo`+`, space(8),
        mtext`Structural`,
      ),
      space(8), mo`+`, space(8),
      mtext`cyclical`,
    )
  ),
  doc.figcaption`Components of Unemployment`,
);

export const bathtubModel = {
  labourForce: doc.figure(
    mathml2.math(
      eq(mi`L̄`, add(sub(mi`E`, mi`t`), sub(mi`U`, mi`t`))),
    ),
    doc.figcaption`Labour Force`,
  ),

  labourDynamics: doc.figure(
    mathml2.math(
      eq(
        sub(mi`∆U`, mrow(mi`t`, mo`+`, n(1))),
        minus(
          mul2(mi`s`, sub(mi`E`, mi`t`)),
          mul2(mi`f`, sub(mi`U`, mi`t`)),
        ),
      ),
    ),
    doc.figcaption`Labour Dynamics`,
  ),

  solveForUnemployment: doc.figure(
    mathml2.math(
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
    ),
    doc.figcaption`Solve for unemployment`,
  ),

  unemploymentRate: doc.figure(
    mathml2.math(
      mrow(
        sup(mi`u`, mi`*`),
        space(8), mo`≡`, space(8),
        frac([sup(mi`U`, mi`*`)], [mi`L`]),
        space(8), mo`=`, space(8),
        frac([mi`s`], [add(mi`f`, mi`s`)]),
      )
    ),
    doc.figcaption`Unemployment Rate`,
  ),
};

export const valueOfHumanCapital = {
  presentDiscountedRate: doc.figure(
    mathml2.math.attr({ style: 'font-size: 12px' })(
      mrow(
        mtext`Present Discounted Value`,
        space(8), mo`=`, space(8),
        frac([mtext`Future Value`], [
          sup(
            paren([n(1), mo`+`, mtext`Interest Rate`]),
            mi`T`,
          ),
        ]),
      ),
    ),
    doc.figcaption`Present discounted value`,
  ),
  presentDiscountedValueOfSalary: doc.figure(
    mathml2.math.attr({ style: 'font-size: 12px' })(
      eq(
        mtext`PDV`,
        mul2(
          mtext`Annual Salary`,
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
    ),
    doc.figcaption`Present discounted value of salary`,
  ),
};
