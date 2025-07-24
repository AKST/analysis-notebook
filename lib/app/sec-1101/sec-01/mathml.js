/**
 * @import { E } from '../../prelude-type.ts';
 */
import { doc, mathml } from '../../prelude.js';

// ∂

const {
  text, call, row,
  rows, i, o, matrix,
  frac, over, sub, space,
} = mathml;

export const ocMatrix = () => {
  const abcd = matrix([
    [i('a'), i('b')],
    [i('c'), i('d')],
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
          sub(text(vName), row([i('i'), i('j')])),
          o('='),
          over(o('⏞'), row([abcd])),
        ].map(td)],
        ['mtr', [
          call('OC', abcd),
          o('='),
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
          [frac([i('b')], [i('a')]), frac([i('a')], [i('b')])],
          [frac([i('d')], [i('c')]), frac([i('c')], [i('d')])],
        ]),
      ),
      topLine(
        'Cost',
        ['time/cost for "Agent i" to', 'produce a unit of "good j"'],
        matrix([
          [frac([i('a')], [i('b')]), frac([i('b')], [i('a')])],
          [frac([i('c')], [i('d')]), frac([i('d')], [i('c')])],
        ]),
      ),
    ])
  ]);
};

export const ppc = () => mathml([
  rows([
    row([i('Cost'), o('='), matrix([
      [text('Hours to Produce X')],
      [text('Hours to Produce Y')],
    ])]),
    row([
      matrix([[text('α')], [text('β')]]), o('='),
      matrix([[text('max X per day')], [text('max Y per day')]]), o('='),
      frac([text('Time in Day')], [i('Cost')]),
    ]),
    row([
      over(i('Production Possibility Curve'), over(o('⏞'), row([
        i('y'), space(8), o('='), space(8),
        i('β'), space(8), o('-'), space(8),
        frac([i('β')],[i('α')]), i('x')
      ]))),
    ]),
  ])
]);

export const vectorToCurve = () => doc.frag(
  mathml([
    i('y'), o('='),
    i('β'), o('-'), frac([i('β')],[i('α')]), i('x')
  ]),
);
