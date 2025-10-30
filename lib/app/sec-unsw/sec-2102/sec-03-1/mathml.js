import { mathml, doc } from '@app/prelude.js';
import { annotationUnder, parensA, table, op } from '@prelude-uni/mathml.js';

const { mi, mo, mtext, mrow, mn, msub, msup, mspace, mfrac } = mathml;
const { eq, add, minus, mul } = op;

export const unemploymentRate = doc.figure(
  mathml.math(
    mrow(
      mtext`Unemployment Rate`, mo`=`,
      mfrac(mtext`number of unemployed`, mtext`size of labour force`),
    )
  ),
  doc.figcaption`The unemployment rate`,
);

export const actualUnemployment = doc.figure(
  mathml.math(
    mrow(
      mtext`Actual Unemployment`,
      mspace(8), mo`=`, mspace(8),
      annotationUnder.attr({
        labelSize: 12,
        marginTop: 4,
        label: mtext`Natural`,
      })(
        mtext`Frictional`,
        mspace(8), mo`+`, mspace(8),
        mtext`Structural`,
      ),
      mspace(8), mo`+`, mspace(8),
      mtext`cyclical`,
    )
  ),
  doc.figcaption`Components of Unemployment`,
);

export const bathtubModel = {
  labourForce: doc.figure(
    mathml.math(
      eq(mi`L̄`, add(msub(mi`E`, mi`t`), msub(mi`U`, mi`t`))),
    ),
    doc.figcaption`Labour Force`,
  ),

  labourDynamics: doc.figure(
    mathml.math(
      eq(
        msub(mi`∆U`, mrow(mi`t`, mo`+`, mn(1))),
        minus(
          mul(mi`s`, msub(mi`E`, mi`t`)),
          mul(mi`f`, msub(mi`U`, mi`t`)),
        ),
      ),
    ),
    doc.figcaption`Labour Dynamics`,
  ),

  solveForUnemployment: doc.figure(
    mathml.math(
      table.attr({ columnalign: 'right center left' })(
        [mn(0), mo`=`, minus(
          mul(mi`s`, msub(mi`E`, mi`t`)),
          mul(mi`f`, msub(mi`U`, mi`t`)),
        )],
        [mspace(8), mo`=`, minus(
          mul(mi`s`, minus.paren(mi`L`, msub(mi`Y`, mi`t`))),
          mul(mi`f`, msub(mi`U`, mi`t`)),
        )],
        [mspace(8), mo`=`, minus(
          mul(mi`s`, mi`L`),
          mul(add.paren(mi`f`, mi`s`), msub(mi`U`, mi`t`)),
        )],
        [msup(mi`U`, mi`*`), mo`=`, mfrac(
          mul(mi`s`, mi`L`),
          add(mi`f`, mi`s`),
        )],
      ),
    ),
    doc.figcaption`Solve for unemployment`,
  ),

  unemploymentRate: doc.figure(
    mathml.math(
      mrow(
        msup(mi`u`, mi`*`),
        mspace(8), mo`≡`, mspace(8),
        mfrac(msup(mi`U`, mi`*`), mi`L`),
        mspace(8), mo`=`, mspace(8),
        mfrac(mi`s`, add(mi`f`, mi`s`)),
      )
    ),
    doc.figcaption`Unemployment Rate`,
  ),
};

export const valueOfHumanCapital = {
  presentDiscountedRate: doc.figure(
    mathml.math.attr({ style: 'font-size: 12px' })(
      mrow(
        mtext`Present Discounted Value`,
        mspace(8), mo`=`, mspace(8),
        mfrac(mtext`Future Value`,
          msup(
            parensA(mn(1), mo`+`, mtext`Interest Rate`),
            mi`T`,
          ),
        ),
      ),
    ),
    doc.figcaption`Present discounted value`,
  ),
  presentDiscountedValueOfSalary: doc.figure(
    mathml.math.attr({ style: 'font-size: 12px' })(
      eq(
        mtext`PDV`,
        mul(
          mtext`Annual Salary`,
          mfrac(
            minus(mn(1), msup(
              parensA(mfrac(mn(1), add(mn(1), mi`R`))),
              mi`T`,
            )),
            minus(mn(1), mfrac(mn(1), add(mn(1), mi`R`))),
          ),
        ),
      ),
    ),
    doc.figcaption`Present discounted value of salary`,
  ),
};
