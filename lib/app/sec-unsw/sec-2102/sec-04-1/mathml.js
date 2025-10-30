/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { doc, mathml } from '@app/prelude.js';
import { rows, annotationUnder, table, op, SPECIAL } from '@prelude-uni/mathml.js';

const { mi, mo, mtext, mrow, mn, msub, msubsup, msup, mspace, mfrac } = mathml;
const { mul, eq, eqId, add, minus } = op;

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
    mathml.math(
      mrow(
        vars.priceEq, mspace(8), mo`=`, mspace(8),
        mfrac(mrow(vars.moneyTEx, vars.velocityEx), vars.outputTEx),
      )
    ),
    doc.figcaption`Price Level Of Money`,
  ),
  quantity: doc.figure(
    mathml.math(
      eq(
        mul(vars.moneyT, vars.velocityT),
        mul(vars.priceT, vars.outputT),
      ),
    ),
    doc.figcaption`Quantity of Money`,
  ),
  velocity: doc.figure(
    mathml.math(mrow(vars.velocityT, mo`=`, vars.velocityEx)),
    doc.figcaption`Velocity Of Money`,
  ),
  supplyOfMoney: doc.figure(
    mathml.math(mrow(vars.moneyT, mo`=`, vars.moneyTEx)),
    doc.figcaption`Supply Of Money`,
  ),
  realGDP: doc.figure(
    mathml.math(mrow(vars.outputT, mo`=`, vars.outputTEx)),
    doc.figcaption`Real GDP`,
  ),
}

export const quantityTheoryOfInflation = doc.figure(
  mathml.math(
    rows(
      table.attr({
        style: 'font-size: 10px',
        columnalign: 'right center left',
      })(
        [msub(mi`g`, mi`M`), mo`=`, mtext`% change in money supply`],
        [msub(mi`g`, mi`V`), mo`=`, mtext`% change in velocity`],
        [msub(mi`g`, mi`P`), mo`=`, mtext`% change in price level`],
        [msub(mi`g`, mi`Y`), mo`=`, mtext`% change in real GDP`],
      ),
      table.attr({ columnalign: 'right centre left' })(
        [msup(mi`𝜋`, mo`*`), mo`=`, minus(
          msub(mi`g`, mi`M`),
          msub(mi`g`, mi`Y`),
        )],
        [
          add(msub(mi`g`, mi`M`), msub(mi`g`, mi`V`)), mo`=`,
          add(msub(mi`g`, mi`P`), msub(mi`g`, mi`Y`))
        ],
      ),
    ),
  ),
  doc.figcaption`Theory Of Inflation`,
);

export const inflationRate = doc.figure(
  mathml.math(eq(msup(mi`𝜋`, mo`*`), minus(
    msub(mi`g`, mi`M`),
    msub(mi`g`, mi`Y`),
  ))),
  doc.figcaption`Theory Of Inflation`,
);

export const fisherEquation = doc.figure(
  mathml.math(eq(mi`i`, add(mi`R`, mi`𝜋`))),
  doc.figcaption`Fisher Equation`,
);

export const governmentBudgetConstraint = doc.figure(
  mathml.math(
    eq(
      annotationUnder.attr({ label: mtext`uses` })(mi`G`),
      annotationUnder.attr({ label: mtext`sources of funds` })(
        add(mi`T`, mi`∆B`, mi`∆M`),
      ),
    ),
  ),
  doc.figcaption`The Government Budget Constraint`,
);
