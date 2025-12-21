/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';
import { annotationUnder, table, op, SPECIAL } from '@prelude-uni/mathml.js';

const { mi, mo, mtext, mrow, mn, msub, mfrac } = mathml;
const { mul, eq, add, eqId, minus } = op;

const vars = {
  outShortRunT: msub(mi`Ỹ`, mi`t`),
  outShortTerm: mi`Ỹ`,
  outLongRunT: msub(mi`Ȳ`, mi`t`),
  outActualT: msub(mi`Y`, mi`t`),
  unemploymentActual: mi`u`,
  unemploymentNatural: mi`ū`,
};

export const modelComparison = text.figure(
  mathml.math({ style: 'font-size: 12px' }).c(
    table({ columnalign: 'right center left' }).c(
      [mtext`long-run model`, mo`⇒`, mtext`potenial output, long-run inflation`],
      [mtext`short-run model`, mo`⇒`, mtext`current output, current inflation`],
    )
  ),
  doc.figcaption`Long-run vs Short-run`,
);

/** @param {E.Item} value @param {E.Item} label */
const labelUnder = (value, label) => (
  annotationUnder({ labelSize: 16, marginTop: 4, label }).c(value)
);

export const actualOutput = text.figure(
  mathml.math({ style: 'font-size: 12px' }).c(
    eq(
      labelUnder(mtext`actual output`, vars.outActualT),
      add(
        labelUnder(mtext`long-run trend`, vars.outLongRunT),
        labelUnder(mtext`short-run trend`, vars.outShortRunT),
      ),
    )
  ),
  doc.figcaption`Actual Output`,
);

export const shortrunFluctuation = text.figure(
  mathml.math(
    eqId(
      vars.outShortRunT,
      mfrac(
        minus(vars.outActualT, vars.outLongRunT),
        vars.outLongRunT,
      ),
    ),
  ),
  doc.figcaption`Short-run Fluctuation`,
);

export const okunsLaw = text.figure(
  mathml.math(
    eq(
      minus(vars.unemploymentActual, vars.unemploymentNatural),
      mul(mrow(mo`-`, mfrac(mn(1), mn(2))), vars.outShortTerm),
    ),
  ),
  doc.figcaption`Okun's Law`,
);
