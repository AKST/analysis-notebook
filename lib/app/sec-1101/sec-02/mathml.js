import { mathml } from '../../prelude.js';

const {
  i, o, n, iv, set, row, matrix, paren,
  table, over, text, idx, space, rows,
  abs, sum, call, frac, sup, sub, SPECIAL,
  subsup, inv,
} = mathml;

const {
  greek: { alpha, beta },
  ellipse: e,
  operation: op
} = SPECIAL;

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
          [n(-1), n(1), n(0), e.h2, n(0)],
          [n(0), n(-1), n(1), e.h2, n(0)],
          [n(0), n(0), n(-1), e.h2, n(0)],
          [e.v, e.v, e.v, e.d1, e.v],
          [n(0), n(0), n(0), e.h2, n(1)],
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
        row([i('j'), SPECIAL.exists, SPECIAL.sets.nat]),
      ]),
      o(':'),
      row([
        sum(
          row([i('j'), o('-'), n(1)]),
          row([i('i'), o('='), n(0)]),
        ),
        row([
          idx(i('C'), i('i')),
          SPECIAL.constraint.lteq,
          i('y'),
        ]),
      ]),
    ])
  ]);
}

export function costBenefitPrinciple() {
  return mathml([
    row([
      call('MB', i('Price')),
      SPECIAL.constraint.lteq, i('MC'),
      space(8), SPECIAL.arrow,
      space(8), text('do it!'),
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
      [SPECIAL.greek.eplison, o('='), row([
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
        SPECIAL.exists,
        SPECIAL.sets.real,
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

export const mcToAtcAndAvc = () => mathml([
  rows([
    over(text('Marginal Cost'), row([
      i('MC'), o('='), sub(i('P'), i('S')),
      o('='), alpha, o('+'), beta, i('Q'),
    ])),
    space(8),
    over(text('Variable Cost'), rows([
      row([
        i('VC'), o('='),
        row([
          op.integral,
          row([alpha, o('+'), beta, i('Q')]),
          space(4), i('d'), i('Q')
        ]),
      ]),
      row([
        i('VC'), o('='),
        row([
          alpha, i('Q'), o('+'),
          frac([beta], [n(2)]), sup(i('Q'), n(2)),
          o('+'), i('C'),
        ]),
      ]),
    ])),
    space(8),
    over(text('Average {Total,Variable} Cost'), rows([
      row([
        row([
          i('ATC'), o('='),
          frac([i('VC'), o('+'), i('FC')], [i('Q')]),
        ]),
        space(16),
        row([
          i('AVC'), o('='),
          frac([i('VC')], [i('Q')]),
        ]),
      ]),
      row([
        i('ATC'), o('='), row([
          space(2), alpha, space(2), o('+'),
          space(2), frac([beta], [n(2)]), i('Q'), space(2), o('+'),
          space(2), frac([i('C'), o('+'), i('FC')], [i('Q')]),
        ]),
      ]),
      row([
        i('AVC'), o('='), row([
          space(2), alpha, space(2), o('+'),
          space(2), frac([beta], [n(2)]), i('Q'), space(2), o('+'),
          space(2), frac([i('C')], [i('Q')]),
        ]),
      ]),
    ])),
  ]),
]);
