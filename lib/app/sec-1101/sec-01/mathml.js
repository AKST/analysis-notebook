/**
 * @import { E } from '../../prelude-type.ts';
 */
import { doc, mathml, mathml2 } from '../../prelude.js';

// ∂

const {
  text, call, row,
  rows, matrix,
  frac, over, sub, space,
} = mathml;

const { mi, mo } = mathml2;

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
  const topLine = (vName, desc, output) => row([
    over(
      row([rows(desc.map(l => row([text(l)])))]),
      ['mtable', [
        ['mtr', [
          sub(text(vName), row([mi`i`, mi`j`])),
          mo`=`,
          over(mo`⏞`, row([abcd])),
        ].map(td)],
        ['mtr', [
          call('OC', abcd),
          mo`=`,
          output,
        ].map(td)],
      ]],
    ),
  ])

  return mathml([
    row([
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
    ])
  ]);
};

export const ppc = () => mathml([
  rows([
    row([mi`Cost`, mo`=`, matrix([
      [text('Hours to Produce X')],
      [text('Hours to Produce Y')],
    ])]),
    row([
      matrix([[text('α')], [text('β')]]), mo`=`,
      matrix([[text('max X per day')], [text('max Y per day')]]), mo`=`,
      frac([text('Time in Day')], [mi`Cost`]),
    ]),
    row([
      over(mi`Production Possibility Curve`, over(mo`⏞`, row([
        mi`y`, space(8), mo`=`, space(8),
        mi`β`, space(8), mo`-`, space(8),
        frac([mi`β`],[mi`α`]), mi`x`
      ]))),
    ]),
  ])
]);

export const vectorToCurve = () => doc.frag(
  mathml([
    mi`y`, mo`=`,
    mi`β`, mo`-`, frac([mi`β`],[mi`α`]), mi`x`
  ]),
);
