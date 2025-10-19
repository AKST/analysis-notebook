/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, doc } from '../../prelude.js';
import { components, mathmlHelper_2 as mathmlHelper } from '../prelude.js';

const {
  n, o, i, table, text, subsup,
  space, under, sub, row, sup, frac,
} = mathml;

const {
  eq, eqId, add, mul, minus, imply,
  SPECIAL,
  minusPA
} = mathmlHelper;

export const interestRates = {
  relationship: doc.figure(
    mathml([
      mathml.table([
        [
          sub(mathml.i('i'), mathml.i('t')),
          mathml.o('='),
          add(
            sub(mathml.i('R'), mathml.i('t')),
            sub(mathml.i('π'), mathml.i('t')),
          ),
        ],
        [
          sub(mathml.i('R'), mathml.i('t')),
          mathml.o('='),
          minus(
            sub(mathml.i('i'), mathml.i('t')),
            sub(mathml.i('π'), mathml.i('t')),
          ),
        ],
      ], { columnalign: 'right center left' }),
    ]),
    doc.figcaption`Nominal and real interest rate relationship`,
  ),
};

export const inflation = {
  identity: doc.figure(
    mathml([
      eqId(
        sub(i('𝜋'), i('t')),
        frac([
          minusPA(
            sub(i('P'), row([i('t'), o('-'), n(1)])),
            sub(i('P'), i('t')),
          ),
        ], [sub(i('P'), i('t'))]),
      ),
    ]),
    doc.figcaption`Inflation Identity`,
  ),
  decomposition: doc.figure(
    mathml([
      eq(
        sub(i('π'), i('t')),
        add(
          under(
            subsup(i('π'), i('t'), i('e')),
            under(o('⏟'), text('expected inflation'))
          ),
          under(
            mul(i('v̄'), sub(i('Ẏ'), i('t'))),
            under(o('⏟'), text('demand conditions'))
          ),
        ),
      ),
    ]),
    doc.figcaption`Decomposition into components`,
  ),
  dynamics: doc.figure(
    mathml([
      table([
        [
          subsup(i('π'), i('t'), i('e')),
          o('='),
          sub(i('π'), row([i('t'), o('-'), n(1)])),
        ],
        [
          sub(i('π'), i('t')),
          o('='),
          add(
            sub(i('π'), row([i('t'), o('-'), n(1)])),
            mul(i('v̄'), sub(i('Ẏ'), i('t')))
          ),
        ],
        [
          sub(i('Δπ'), i('t')),
          o('='),
          mul(i('v̄'), sub(i('Ẏ'), i('t'))),
        ],
      ], { columnalign: 'right center left' }),
    ]),
    doc.figcaption`Inflation dynamics over time`,
  ),
};

export const inflationChange2 = doc.figure(
  mathml([
    table([
      [
        sub(i('π'), i('t')),
        o('='),
        add(
          sub(i('π'), row([i('t'), o('-'), n(1)])),
          mul(i('v̄'), sub(i('Ẏ'), i('t'))),
          i('ō')
        ),
      ],
      [
        sub(i('Δπ'), i('t')),
        o('='),
        add(mul(i('v̄'), sub(i('Ẏ'), i('t'))), i('ō')),
      ],
    ], { columnalign: 'right center left' }),
  ]),
  doc.figcaption`Inflation including shock term`,
);

export const inANutShell = doc.figure(
  mathml([
    table([
      [
        text('MP curve'),
        imply(i('↑iₜ'), i('↑Rₜ')),
      ],
      [
        text('IS curve'),
        imply(i('↑Rₜ'), i('↓Ẏₜ')),
      ],
      [
        text('Phillips curve'),
        imply(i('↓Ẏₜ'), i('↓Δπₜ'))
      ],
    ], { columnalign: 'right left' }),
  ]),
  doc.figcaption`Causal relationships implied by MP, IS, and Phillips curves`,
);



