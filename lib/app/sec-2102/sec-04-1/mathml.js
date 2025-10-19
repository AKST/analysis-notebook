/**
 * @import { E } from '../../prelude-type.ts';
 */

import { doc, mathml } from '../../prelude.js';
import * as prelude from '../prelude.js';

const {
  space, sub, subsup, o, i,
  frac, sup, rows, table, text,
  under,
} = mathml;
const { mathmlHelper, components: { clsRef, todo } } = prelude;
const {
  implies, addP, eq, eqId, mul3,
  mul2, add, add3, minus, minusP,
} = mathmlHelper;

const vars = {
  priceT: sub(i('P'), i('t')),
  priceEq: subsup(i('P'), i('t'), o('*')),
  moneyT: sub(i('M'), i('t')),
  moneyTEx: sub(i('M̄'), i('t')),
  outputT: sub(i('Y'), i('t')),
  outputTEx: sub(i('Ȳ'), i('t')),
  velocityEx: i('V̄'),
  velocityT: sub(i('V'), i('t')),
};

export const model = {
  priceLevel: doc.figure(
    mathml([
      vars.priceEq, space(8), o('='), space(8),
      frac([vars.moneyTEx, vars.velocityEx], [vars.outputTEx]),
    ]),
    doc.figcaption`Price Level Of Money`,
  ),
  quantity: doc.figure(
    mathml([
      eq(
        mul2(vars.moneyT, vars.velocityT),
        mul2(vars.priceT, vars.outputT),
      ),
    ]),
    doc.figcaption`Quantity of Money`,
  ),
  velocity: doc.figure(
    mathml([vars.velocityT, o('='), vars.velocityEx]),
    doc.figcaption`Velocity Of Money`,
  ),
  supplyOfMoney: doc.figure(
    mathml([vars.moneyT, o('='), vars.moneyTEx]),
    doc.figcaption`Supply Of Money`,
  ),
  realGDP: doc.figure(
    mathml([vars.outputT, o('='), vars.outputTEx]),
    doc.figcaption`Real GDP`,
  ),
}

export const quantityTheoryOfInflation = doc.figure(
  mathml([
    rows([
      table([
        [sub(i('g'), i('M')), o('='), text('% change in money supply')],
        [sub(i('g'), i('V')), o('='), text('% change in velocity')],
        [sub(i('g'), i('P')), o('='), text('% change in price level')],
        [sub(i('g'), i('Y')), o('='), text('% change in real GDP')],
      ], {
        style: 'font-size: 10px',
        columnalign: 'right center left',
      }),
      table([
        [sup(i('𝜋'), o('*')), o('='), minus(
          sub(i('g'), i('M')),
          sub(i('g'), i('Y')),
        )],
        [
          add(sub(i('g'), i('M')), sub(i('g'), i('V'))), o('='),
          add(sub(i('g'), i('P')), sub(i('g'), i('Y')))
        ],
      ], { columnalign: 'right centre left' }),
    ]),
  ]),
  doc.figcaption`Theory Of Inflation`,
);

export const inflationRate = doc.figure(
  mathml([eq(sup(i('𝜋'), o('*')), minus(
    sub(i('g'), i('M')),
    sub(i('g'), i('Y')),
  ))]),
  doc.figcaption`Theory Of Inflation`,
);

export const fisherEquation = doc.figure(
  mathml([eq(i('i'), add(i('R'), i('𝜋')))]),
  doc.figcaption`Fisher Equation`,
);

export const governmentBudgetConstraint = doc.figure(
  mathml([
    eq(
      under(i('G'), under(o('⏟'), text('uses'))),
      under(
        add3(i('T'), i('∆B'), i('∆M')),
        under(o('⏟'), text('sources of funds')),
      ),
    ),
  ]),
  doc.figcaption`The Government Budget Constraint`,
);
