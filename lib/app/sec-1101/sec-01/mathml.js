/**
 * @import { E } from '../../prelude-type.ts';
 */
import { doc, mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

// ∂

const { call, frac } = mathml;

const { mi, mo, mtext, mrow, mover, msub, mspace } = mathml2;
const { eq, minus, mul, matrix, rows, annotationOver } = mathmlHelper2;

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
        eq(call('OC', abcd), output),
      ),
      mrow(rows(...desc.map(l => mrow(mtext.of(l))))),
    ),
  )

  return mathml2.math(
    mrow(
      topLine(
        'Output',
        ['units produces by "Agent i"', 'of "good j" at time/cost of 1 hour'],
        matrix(
          [frac([mi`b`], [mi`a`]), frac([mi`a`], [mi`b`])],
          [frac([mi`d`], [mi`c`]), frac([mi`c`], [mi`d`])],
        ),
      ),
      topLine(
        'Cost',
        ['time/cost for "Agent i" to', 'produce a unit of "good j"'],
        matrix(
          [frac([mi`a`], [mi`b`]), frac([mi`b`], [mi`a`])],
          [frac([mi`c`], [mi`d`]), frac([mi`d`], [mi`c`])],
        ),
      ),
    )
  );
};

export const ppc = () => mathml2.math(
  rows(
    mrow(mi`Cost`, mo`=`, matrix(
      [mtext`Hours to Produce X`],
      [mtext`Hours to Produce Y`],
    )),
    eq(
      matrix([mtext`α`], [mtext`β`]),
      matrix([mtext`max X per day`], [mtext`max Y per day`]),
      frac([mtext`Time in Day`], [mi`Cost`]),
    ),
    annotationOver.attr({ label: mi`Production Possibility Curve` })(
      eq(mi`y`, minus(mi`β`, mul(frac([mi`β`],[mi`α`]), mi`x`))),
    ),
  )
);

export const vectorToCurve = () => mathml2.math(
  eq(mi`y`, minus(mi`β`, mul(frac([mi`β`],[mi`α`]), mi`x`))),
);
