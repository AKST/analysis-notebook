/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, doc } from '../../prelude.js';
import { components, mathmlHelper } from '../prelude.js';

const {
  n, o, i, table, text,
  under, sub, frac, row,
} = mathml;

const { eq, add, mul2, eqId, minus } = mathmlHelper;

const vars = {
  outShortRunT: sub(i('Ỹ'), i('t')),
  outShortTerm: i('Ỹ'),
  outLongRunT: sub(i('Ȳ'), i('t')),
  outActualT: sub(i('Y'), i('t')),
  unemploymentActual: i('u'),
  unemploymentNatural: i('ū'),
};

export const modelComparison = doc._figure(
  mathml([
    table([
      [text('long-run model'), o('⇒'), text('potenial output, long-run inflation')],
      [text('short-run model'), o('⇒'), text('current output, current inflation')],
    ], { columnalign: 'right center left' }),
  ], { style: 'font-size: 12px' }),
  doc.figcaption`Long-run vs Short-run`,
);

export const actualOutput = doc._figure(
  mathml([
    eq(
      under(
        text('actual output'),
        under(o('⏟'), vars.outActualT),
      ),
      add(
        under(
          text('long-run trend'),
          under(o('⏟'), vars.outLongRunT),
        ),
        under(
          text('short-run trend'),
          under(o('⏟'), vars.outShortRunT),
        ),
      ),
    )
  ], { style: 'font-size: 12px' }),
  doc.figcaption`Actual Output`,
);

export const shortrunFluctuation = doc._figure(
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

export const okunsLaw = doc._figure(
  mathml([
    eq(
      minus(vars.unemploymentActual, vars.unemploymentNatural),
      mul2(row([o('-'), frac([n(1)], [n(2)])]), vars.outShortTerm),
    ),
  ]),
  doc.figcaption`Okun's Law`,
);
