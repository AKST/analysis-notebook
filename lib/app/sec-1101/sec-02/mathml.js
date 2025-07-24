import { mathml } from '../../prelude.js';

const {
  i, o, n, iv, set, row, matrix, paren,
  table, over, text, idx, space,
  abs, sum, call, frac, sup, sub,
} = mathml;

export function vectorDefs() {
  return mathml([
    table([
      [i('C'), o('='), over(
        text('Cumulative Cost Vector'),
        row([set([0, 0, 2, 5, 10, 18, 28, 40].map(n))]
      ))],
      [i('D'), o('='), over(
        text('Difference Matrix'),
        matrix([
          [n(-1), n(1), n(0), o('⋯'), n(0)],
          [n(0), n(-1), n(1), o('⋯'), n(0)],
          [n(0), n(0), n(-1), o('⋯'), n(0)],
          [o('⋮'), o('⋮'), o('⋮'), o('⋱'), o('⋮')],
          [n(0), n(0), n(0), o('⋯'), n(1)],
        ])
      )],
      [
        i('M'),
        o('='), row([
        row([i('D'), i('C')]),
          o('='), over(
            text('Marginal Cost Vector'),
            row([set([2, 3, 5, 8, 10, 12].map(n))]),
          ),
        ]),
      ],
    ], { className: 'mathtable' }),
  ]);
}


export function marginalCost() {
  return mathml([
    i('y'), space(8), o('='), space(8), row([
      sum(
        row([abs(i('x')), o('-'), n(1)]),
        row([i('i'), o('='), n(0)]),
      ),
      row([idx(i('M'), i('i'))]),
    ]),
  ]);
}

export function timeToOutput() {
  return mathml([
    i('x'), o('='),
    row([
      row([
        i('max'),
        space(8),
        row([i('j'), o('∈'), i('ℕ')]),
      ]),
      o(':'),
      row([
        sum(
          row([i('j'), o('-'), n(1)]),
          row([i('i'), o('='), n(0)]),
        ),
        row([
          idx(i('C'), i('i')),
          o('≤'),
          i('y'),
        ]),
      ]),
    ])
  ]);
}

export function costBenefitPrinciple() {
  return mathml([
    row([
      call('MB', i('Price')), o('≥'), i('MC'),
      space(8), o('⇒'), space(8), text('do it!'),
    ]),
  ]);
}

export function elasticity() {
  return mathml([
    table([
      [i('ε'), o('='), row([
        frac([i('P')], [i('Q')]), o('×'),
        frac([i('ΔQ')], [i('ΔP')])
      ])],
      [i('ε'), o('='), row([
        frac([i('P')], [i('Q')]), o('×'),
        frac([i('1')], [text('slope')]),
      ])],
      [i('ε'), o('='), row([
        i('P'),
        space(4),
        sup(i('Q'), row([o('-'), n(1)])),
        space(4),
        sup(text('slope'), row([o('-'), n(1)])),
      ])],
    ]),
  ]);
}

export function optimalNumberOfWorkers() {
  return mathml([row([
    sup(i('w'), i('*')),
    o('='),
    text('argmax'),
    space(8),
    row([
      o('{'),
      space(8),
      row([
        i('i'),
        o('∈'),
        i('ℝ'),
      ]),
      o(':'),
      space(8),
      row([
        sub(paren([i('p'), i('D'), iv('q')]), i('i')),
        space(4),
        o('–'),
        space(4),
        sub(paren([i('p'), i('D'), iv('c')]), i('i')),
      ]),
      space(8),
      o('}'),
    ]),
  ])]);
}
