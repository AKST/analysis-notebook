/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, mathml2, doc } from '../../prelude.js';
import { components, mathmlHelper } from '../prelude.js';

const {
  n, table, text,
  under, sub, frac, row,
} = mathml;

const { mi, mo } = mathml2;

const { eq, add, mul2, eqId, minus } = mathmlHelper;

const vars = {
  outShortRunT: sub(mi`Ỹ`, mi`t`),
  outShortTerm: mi`Ỹ`,
  outLongRunT: sub(mi`Ȳ`, mi`t`),
  outActualT: sub(mi`Y`, mi`t`),
  unemploymentActual: mi`u`,
  unemploymentNatural: mi`ū`,
};

export const modelComparison = doc.figure(
  mathml([
    table([
      [text('long-run model'), mo`⇒`, text('potenial output, long-run inflation')],
      [text('short-run model'), mo`⇒`, text('current output, current inflation')],
    ], { columnalign: 'right center left' }),
  ], { style: 'font-size: 12px' }),
  doc.figcaption`Long-run vs Short-run`,
);

export const actualOutput = doc.figure(
  mathml([
    eq(
      under(
        text('actual output'),
        under(mo`⏟`, vars.outActualT),
      ),
      add(
        under(
          text('long-run trend'),
          under(mo`⏟`, vars.outLongRunT),
        ),
        under(
          text('short-run trend'),
          under(mo`⏟`, vars.outShortRunT),
        ),
      ),
    )
  ], { style: 'font-size: 12px' }),
  doc.figcaption`Actual Output`,
);

export const shortrunFluctuation = doc.figure(
  mathml([
    eqId(
      vars.outShortRunT,
      frac(
        [minus(vars.outActualT, vars.outLongRunT)],
        [vars.outLongRunT],
      ),
    ),
  ]),
  doc.figcaption`Short-run Fluctuation`,
);

export const okunsLaw = doc.figure(
  mathml([
    eq(
      minus(vars.unemploymentActual, vars.unemploymentNatural),
      mul2(row([mo`-`, frac([n(1)], [n(2)])]), vars.outShortTerm),
    ),
  ]),
  doc.figcaption`Okun's Law`,
);
