/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { doc, mathml } from '@app/prelude.js';
import { op, matrix, rows, annotationOver, call, SPECIAL } from '@prelude-uni/mathml.js';

// ∂

const { mi, mo, mtext, mrow, mover, msub, mspace, mfrac } = mathml;
const { eq, minus, mul } = op;

export const ocMatrix = () => {
  const abcd = matrix(
    [mi`a`, mi`b`],
    [mi`c`, mi`d`],
  );

  /**
   * @param {E.Item} it
   * @returns {E.Node}
   */
  const td = it => ['mtd', [it]]

  /**
   * @param {string} vName
   * @param {string[]} desc
   * @param {E.Item} output
   * @returns {E.Item}
   */
  const topLine = (vName, desc, output) => mrow(
    mover(
      rows(
        eq(msub(mtext.of(vName), mrow(mi`i`, mi`j`)), annotationOver(abcd)),
        eq(call.attr({ fn: mtext`OC` }).of(abcd), output),
      ),
      mrow(rows(...desc.map(l => mrow(mtext.of(l))))),
    ),
  )

  return mathml.math(
    mrow(
      topLine(
        'Output',
        ['units produces by "Agent i"', 'of "good j" at time/cost of 1 hour'],
        matrix(
          [mfrac(mi`b`, mi`a`), mfrac(mi`a`, mi`b`)],
          [mfrac(mi`d`, mi`c`), mfrac(mi`c`, mi`d`)],
        ),
      ),
      topLine(
        'Cost',
        ['time/cost for "Agent i" to', 'produce a unit of "good j"'],
        matrix(
          [mfrac(mi`a`, mi`b`), mfrac(mi`b`, mi`a`)],
          [mfrac(mi`c`, mi`d`), mfrac(mi`d`, mi`c`)],
        ),
      ),
    )
  );
};

export const ppc = () => mathml.math(
  rows(
    mrow(mi`Cost`, mo`=`, matrix(
      [mtext`Hours to Produce X`],
      [mtext`Hours to Produce Y`],
    )),
    eq(
      matrix([mtext`α`], [mtext`β`]),
      matrix([mtext`max X per day`], [mtext`max Y per day`]),
      mfrac(mtext`Time in Day`, mi`Cost`),
    ),
    annotationOver.attr({ label: mi`Production Possibility Curve` }).of(
      eq(mi`y`, minus(mi`β`, mul(mfrac(mi`β`, mi`α`), mi`x`))),
    ),
  )
);

export const vectorToCurve = () => mathml.math(
  eq(mi`y`, minus(mi`β`, mul(mfrac(mi`β`, mi`α`), mi`x`))),
);
