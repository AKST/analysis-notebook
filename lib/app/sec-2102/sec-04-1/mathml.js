/**
 * @import { E } from '../../prelude-type.ts';
 */

import { doc, mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper, mathmlHelper_2 } from '../prelude.js';

const { space, frac, table } = mathml;
const { mi, mo, mtext, mrow, mn, msub, msubsup, msup } = mathml2;
const { rows, annotationUnder } = mathmlHelper_2;
const {
  implies, addP, eq, eqId, mul3,
  mul2, add, add3, minus, minusP,
} = mathmlHelper;

const vars = {
  priceT: msub(mi`P`, mi`t`),
  priceEq: msubsup(mi`P`, mi`t`, mo`*`),
  moneyT: msub(mi`M`, mi`t`),
  moneyTEx: msub(mi`M̄`, mi`t`),
  outputT: msub(mi`Y`, mi`t`),
  outputTEx: msub(mi`Ȳ`, mi`t`),
  velocityEx: mi`V̄`,
  velocityT: msub(mi`V`, mi`t`),
};

export const model = {
  priceLevel: doc.figure(
    mathml2.math(
      mrow(
        vars.priceEq, space(8), mo`=`, space(8),
        frac([vars.moneyTEx, vars.velocityEx], [vars.outputTEx]),
      )
    ),
    doc.figcaption`Price Level Of Money`,
  ),
  quantity: doc.figure(
    mathml2.math(
      eq(
        mul2(vars.moneyT, vars.velocityT),
        mul2(vars.priceT, vars.outputT),
      ),
    ),
    doc.figcaption`Quantity of Money`,
  ),
  velocity: doc.figure(
    mathml2.math(mrow(vars.velocityT, mo`=`, vars.velocityEx)),
    doc.figcaption`Velocity Of Money`,
  ),
  supplyOfMoney: doc.figure(
    mathml2.math(mrow(vars.moneyT, mo`=`, vars.moneyTEx)),
    doc.figcaption`Supply Of Money`,
  ),
  realGDP: doc.figure(
    mathml2.math(mrow(vars.outputT, mo`=`, vars.outputTEx)),
    doc.figcaption`Real GDP`,
  ),
}

export const quantityTheoryOfInflation = doc.figure(
  mathml2.math(
    rows(
      table([
        [msub(mi`g`, mi`M`), mo`=`, mtext`% change in money supply`],
        [msub(mi`g`, mi`V`), mo`=`, mtext`% change in velocity`],
        [msub(mi`g`, mi`P`), mo`=`, mtext`% change in price level`],
        [msub(mi`g`, mi`Y`), mo`=`, mtext`% change in real GDP`],
      ], {
        style: 'font-size: 10px',
        columnalign: 'right center left',
      }),
      table([
        [msup(mi`𝜋`, mo`*`), mo`=`, minus(
          msub(mi`g`, mi`M`),
          msub(mi`g`, mi`Y`),
        )],
        [
          add(msub(mi`g`, mi`M`), msub(mi`g`, mi`V`)), mo`=`,
          add(msub(mi`g`, mi`P`), msub(mi`g`, mi`Y`))
        ],
      ], { columnalign: 'right centre left' }),
    ),
  ),
  doc.figcaption`Theory Of Inflation`,
);

export const inflationRate = doc.figure(
  mathml2.math(eq(msup(mi`𝜋`, mo`*`), minus(
    msub(mi`g`, mi`M`),
    msub(mi`g`, mi`Y`),
  ))),
  doc.figcaption`Theory Of Inflation`,
);

export const fisherEquation = doc.figure(
  mathml2.math(eq(mi`i`, add(mi`R`, mi`𝜋`))),
  doc.figcaption`Fisher Equation`,
);

export const governmentBudgetConstraint = doc.figure(
  mathml2.math(
    eq(
      annotationUnder.attr({ label: mtext`uses` })(mi`G`),
      annotationUnder.attr({ label: mtext`sources of funds` })(
        add3(mi`T`, mi`∆B`, mi`∆M`),
      ),
    ),
  ),
  doc.figcaption`The Government Budget Constraint`,
);
