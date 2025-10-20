/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, doc } from '../../prelude.js';
import { mathmlHelper_2 } from '../prelude.js';

const { mi, mo, mtext, mrow, mn, msub, mfrac } = mathml;
const { annotationUnder, table, mul, eq, add, eqId, minus } = mathmlHelper_2;

const vars = {
  outShortRunT: msub(mi`Ỹ`, mi`t`),
  outShortTerm: mi`Ỹ`,
  outLongRunT: msub(mi`Ȳ`, mi`t`),
  outActualT: msub(mi`Y`, mi`t`),
  unemploymentActual: mi`u`,
  unemploymentNatural: mi`ū`,
};

export const modelComparison = doc.figure(
  mathml.math.attr({ style: 'font-size: 12px' })(
    table.attr({ columnalign: 'right center left' })(
      [mtext`long-run model`, mo`⇒`, mtext`potenial output, long-run inflation`],
      [mtext`short-run model`, mo`⇒`, mtext`current output, current inflation`],
    )
  ),
  doc.figcaption`Long-run vs Short-run`,
);

/** @param {E.Item} value @param {E.Item} label */
const labelUnder = (value, label) => (
  annotationUnder.attr({ labelSize: 16, marginTop: 4, label })(value)
);

export const actualOutput = doc.figure(
  mathml.math.attr({ style: 'font-size: 12px' })(
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

export const shortrunFluctuation = doc.figure(
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

export const okunsLaw = doc.figure(
  mathml.math(
    eq(
      minus(vars.unemploymentActual, vars.unemploymentNatural),
      mul(mrow(mo`-`, mfrac(mn(1), mn(2))), vars.outShortTerm),
    ),
  ),
  doc.figcaption`Okun's Law`,
);
