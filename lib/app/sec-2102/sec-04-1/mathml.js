/**
 * @import { E } from '../../prelude-type.ts';
 */

import { doc, mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper, mathmlHelper_2 } from '../prelude.js';

const { space, sub, subsup, frac, sup, table } = mathml;
const { mi, mo, mtext, mrow } = mathml2;
const { rows, annotationUnder } = mathmlHelper_2;
const {
  implies, addP, eq, eqId, mul3,
  mul2, add, add3, minus, minusP,
} = mathmlHelper;

const vars = {
  priceT: sub(mi`P`, mi`t`),
  priceEq: subsup(mi`P`, mi`t`, mo`*`),
  moneyT: sub(mi`M`, mi`t`),
  moneyTEx: sub(mi`M̄`, mi`t`),
  outputT: sub(mi`Y`, mi`t`),
  outputTEx: sub(mi`Ȳ`, mi`t`),
  velocityEx: mi`V̄`,
  velocityT: sub(mi`V`, mi`t`),
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
        [sub(mi`g`, mi`M`), mo`=`, mtext`% change in money supply`],
        [sub(mi`g`, mi`V`), mo`=`, mtext`% change in velocity`],
        [sub(mi`g`, mi`P`), mo`=`, mtext`% change in price level`],
        [sub(mi`g`, mi`Y`), mo`=`, mtext`% change in real GDP`],
      ], {
        style: 'font-size: 10px',
        columnalign: 'right center left',
      }),
      table([
        [sup(mi`𝜋`, mo`*`), mo`=`, minus(
          sub(mi`g`, mi`M`),
          sub(mi`g`, mi`Y`),
        )],
        [
          add(sub(mi`g`, mi`M`), sub(mi`g`, mi`V`)), mo`=`,
          add(sub(mi`g`, mi`P`), sub(mi`g`, mi`Y`))
        ],
      ], { columnalign: 'right centre left' }),
    ),
  ),
  doc.figcaption`Theory Of Inflation`,
);

export const inflationRate = doc.figure(
  mathml2.math(eq(sup(mi`𝜋`, mo`*`), minus(
    sub(mi`g`, mi`M`),
    sub(mi`g`, mi`Y`),
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
