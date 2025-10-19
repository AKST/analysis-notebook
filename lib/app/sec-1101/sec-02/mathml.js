import { mathml, mathml2 } from '../../prelude.js';

const {
  n, iv, set, row, matrix, paren,
  table, over, text, idx, space, rows,
  abs, sum, call, frac, sup, sub, SPECIAL,
  subsup, inv,
} = mathml;

const { mi, mo } = mathml2;

const {
  greek: { alpha, beta },
  ellipse: e,
  operation: op
} = SPECIAL;

export function vectorDefs() {
  return mathml([
    table([
      [mi`C`, mo`=`, over(
        text('Cumulative Cost Vector'),
        row([set([0, 0, 2, 5, 10, 18, 28, 40].map(n))]
      ))],
      [mi`D`, mo`=`, over(
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
        mi`M`,
        mo`=`, row([
        row([mi`D`, mi`C`]),
          mo`=`, over(
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
    mi`y`, space(8), mo`=`, space(8), row([
      sum(
        row([abs(mi`x`), mo`-`, n(1)]),
        row([mi`i`, mo`=`, n(0)]),
      ),
      row([idx(mi`M`, mi`i`)]),
    ]),
  ]);
}

export function timeToOutput() {
  return mathml([
    mi`x`, mo`=`,
    row([
      row([
        mi`max`,
        space(8),
        row([mi`j`, SPECIAL.operation.exists, SPECIAL.sets.nat]),
      ]),
      mo`:`,
      row([
        sum(
          row([mi`j`, mo`-`, n(1)]),
          row([mi`i`, mo`=`, n(0)]),
        ),
        row([
          idx(mi`C`, mi`i`),
          SPECIAL.constraint.lteq,
          mi`y`,
        ]),
      ]),
    ])
  ]);
}

export function costBenefitPrinciple() {
  return mathml([
    row([
      call('MB', mi`Price`),
      SPECIAL.constraint.lteq, mi`MC`,
      space(8), SPECIAL.arrow,
      space(8), text('do it!'),
    ]),
  ]);
}

export function elasticity() {
  return mathml([
    table([
      [mi`ε`, mo`=`, row([
        frac([mi`P`], [mi`Q`]), mo`×`,
        frac([mi`ΔQ`], [mi`ΔP`])
      ])],
      [mi`ε`, mo`=`, row([
        frac([mi`P`], [mi`Q`]), mo`×`,
        frac([mi`1`], [text('slope')]),
      ])],
      [SPECIAL.greek.eplison, mo`=`, row([
        mi`P`,
        space(4),
        sup(mi`Q`, row([mo`-`, n(1)])),
        space(4),
        sup(text('slope'), row([mo`-`, n(1)])),
      ])],
    ]),
  ]);
}

export function optimalNumberOfWorkers() {
  return mathml([row([
    sup(mi`w`, mi`*`),
    mo`=`,
    text('argmax'),
    space(8),
    row([
      mo`{`,
      space(8),
      row([
        mi`i`,
        SPECIAL.operation.exists,
        SPECIAL.sets.real,
      ]),
      mo`:`,
      space(8),
      row([
        sub(paren([mi`p`, mi`D`, iv('q')]), mi`i`),
        space(4),
        mo`–`,
        space(4),
        sub(paren([mi`p`, mi`D`, iv('c')]), mi`i`),
      ]),
      space(8),
      mo`}`,
    ]),
  ])]);
}

export const mcToAtcAndAvc = () => mathml([
  rows([
    over(text('Marginal Cost'), row([
      mi`MC`, mo`=`, sub(mi`P`, mi`S`),
      mo`=`, alpha, mo`+`, beta, mi`Q`,
    ])),
    space(8),
    over(text('Variable Cost'), rows([
      row([
        mi`VC`, mo`=`,
        row([
          op.integral,
          row([alpha, mo`+`, beta, mi`Q`]),
          space(4), mi`d`, mi`Q`
        ]),
      ]),
      row([
        mi`VC`, mo`=`,
        row([
          alpha, mi`Q`, mo`+`,
          frac([beta], [n(2)]), sup(mi`Q`, n(2)),
          mo`+`, mi`C`,
        ]),
      ]),
    ])),
    space(8),
    over(text('Average {Total,Variable} Cost'), rows([
      row([
        row([
          mi`ATC`, mo`=`,
          frac([mi`VC`, mo`+`, mi`FC`], [mi`Q`]),
        ]),
        space(16),
        row([
          mi`AVC`, mo`=`,
          frac([mi`VC`], [mi`Q`]),
        ]),
      ]),
      row([
        mi`ATC`, mo`=`, row([
          space(2), alpha, space(2), mo`+`,
          space(2), frac([beta], [n(2)]), mi`Q`, space(2), mo`+`,
          space(2), frac([mi`C`, mo`+`, mi`FC`], [mi`Q`]),
        ]),
      ]),
      row([
        mi`AVC`, mo`=`, row([
          space(2), alpha, space(2), mo`+`,
          space(2), frac([beta], [n(2)]), mi`Q`, space(2), mo`+`,
          space(2), frac([mi`C`], [mi`Q`]),
        ]),
      ]),
    ])),
  ]),
]);
