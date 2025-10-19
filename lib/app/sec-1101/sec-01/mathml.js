/**
 * @import { E } from '../../prelude-type.ts';
 */
import { doc, mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

// ∂

const {
  call, matrix,
  frac, space,
} = mathml;

const { mi, mo, mtext, mrow, mover, msub } = mathml2;
const { rows, annotationOver } = mathmlHelper2;

export const ocMatrix = () => {
  const abcd = matrix([
    [mi`a`, mi`b`],
    [mi`c`, mi`d`],
  ]);

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
      ['mtable', [
        ['mtr', [
          msub(mtext.of(vName), mrow(mi`i`, mi`j`)),
          mo`=`,
          annotationOver(abcd),
        ].map(td)],
        ['mtr', [
          call('OC', abcd),
          mo`=`,
          output,
        ].map(td)],
      ]],
      mrow(rows(...desc.map(l => mrow(mtext.of(l))))),
    ),
  )

  return mathml2.math(
    mrow(
      topLine(
        'Output',
        ['units produces by "Agent i"', 'of "good j" at time/cost of 1 hour'],
        matrix([
          [frac([mi`b`], [mi`a`]), frac([mi`a`], [mi`b`])],
          [frac([mi`d`], [mi`c`]), frac([mi`c`], [mi`d`])],
        ]),
      ),
      topLine(
        'Cost',
        ['time/cost for "Agent i" to', 'produce a unit of "good j"'],
        matrix([
          [frac([mi`a`], [mi`b`]), frac([mi`b`], [mi`a`])],
          [frac([mi`c`], [mi`d`]), frac([mi`d`], [mi`c`])],
        ]),
      ),
    )
  );
};

export const ppc = () => mathml2.math(
  rows(
    mrow(mi`Cost`, mo`=`, matrix([
      [mtext`Hours to Produce X`],
      [mtext`Hours to Produce Y`],
    ])),
    mrow(
      matrix([[mtext`α`], [mtext`β`]]), mo`=`,
      matrix([[mtext`max X per day`], [mtext`max Y per day`]]), mo`=`,
      frac([mtext`Time in Day`], [mi`Cost`]),
    ),
    annotationOver.attr({ label: mi`Production Possibility Curve` })(
      mi`y`, space(8), mo`=`, space(8),
      mi`β`, space(8), mo`-`, space(8),
      frac([mi`β`],[mi`α`]), mi`x`
    ),
  )
);

export const vectorToCurve = () => doc.frag(
  mathml2.math(
    mi`y`, mo`=`,
    mi`β`, mo`-`, frac([mi`β`],[mi`α`]), mi`x`
  ),
);
