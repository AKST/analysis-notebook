/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml } from '../../prelude.js';

const {
  sum, i, sub, o, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, SPECIAL: CHARS
} = mathml;

/**
 * @returns {E.Item}
 */
export function horizontalSummation() {
  return mathml([
    rows([
      row([
        CHARS.cursive.F,
        space(4), o('='), space(4),
        row([
          o('{'), space(2),
          sub(i('f'), i('i')), space(2),
          o(':'), space(2),
          i('i'), space(2),
          CHARS.exists, space(2),
          set([
            n(1), n(2), CHARS.ellipse.h, i('n'),
          ]),
          space(2), o('}'),
        ]),
      ]),
      row([
        sub(i('f'), i('i')), paren([i('Q')]),
        space(2), o('='), space(2),
        row([
          sub(i('a'), i('i')), o('+'),
          sub(i('b'), i('i')), i('Q'),
        ]),
        space(16), text('where'), space(16),
        row([i('i'), CHARS.constraint.lteq, i('n')]),
      ]),
      over(text('Sub Coeffients'), row([
        row([
          i('α'),
          o('='),
          sum(i('n'), row([i('i'), o('='), n('1')])),
          paren([
            sub(i('a'), i('i')),
            space(4),
            inv(sub(i('b'), i('i'))),
          ]),
        ]),
        space(16),
        row([
          i('β'),
          o('='),
          sum(i('n'), row([i('i'), o('='), n('1')])),
          inv(sub(i('b'), i('i'))),
        ]),
      ])),
      over(text('Coefficents'), row([
        row([
          i('A'), space(4),
          o('='), space(4),
          i('α'), CHARS.operation.dot,
          inv(i('β')),
        ]),
        space(16),
        row([i('B'), o('='), inv(i('β'))]),
      ])),
      over(
        text('Horizontal Summation'),
        row([
          call('ℋ', CHARS.cursive.F,),
          space(4),
          o('='),
          space(4),
          sup(i('f'), o('*')), o('='),
          space(4),
          i('A'), o('+'), i('B'),
          CHARS.operation.dot, i('Q'),
        ]),
      ),
    ]),
  ]);
}

export function supplyDemandCurvesContinuious() {
  /** @param {E.Item} qs */
  const ps = qs => call(sub(i('P'), i('S')), qs);
  /** @param {E.Item} qd */
  const pd = qd => call(sub(i('P'), i('D')), qd);

  return mathml([
    rows([
      row([
        over(text('Supply Price'), row([ps(i('q'))])),
        o('='), space(8),
        sub(CHARS.alpha, i('S')), o('+'),
        sub(CHARS.beta, i('S')), o('·'), i('q'),
      ]),
      row([
        over(text('Demand Price'), row([pd(i('q'))])),
        o('='), space(8),
        sub(CHARS.alpha, i('D')), o('-'),
        sub(CHARS.beta, i('D')), o('·'), i('q')
      ]),
    ])
  ]);
}

export function equilibriumContinuious() {
  const qe = sup(i('q'), o('*'));
  return mathml([
    rows([
      row([
        row([
          sub(CHARS.alpha, i('S')), o('+'),
          sub(CHARS.beta, i('S')), o('·'), qe,
        ]),
        space(8), o('='), space(8),
        row([
          sub(CHARS.alpha, i('D')), o('-'),
          sub(CHARS.beta, i('D')), o('·'), qe
        ]),
      ]),
      row([
        row([
          paren([
            sub(CHARS.beta, i('S')), o('+'),
            sub(CHARS.beta, i('D')),
          ]),
          o('·'), qe,
        ]),
        space(8), o('='), space(8),
        row([
          sub(CHARS.alpha, i('S')), o('-'),
          sub(CHARS.alpha, i('D')),
        ]),
      ]),
      over(text('Equilibrium Quantity'), row([
        row([qe]),
        space(8), o('='), space(8),
        row([
          frac([
            sub(CHARS.alpha, i('S')), o('-'),
            sub(CHARS.alpha, i('D')),
          ], [
            sub(CHARS.beta, i('S')), o('+'),
            sub(CHARS.beta, i('D')),
          ]),
        ]),
      ])),
      over(text('Equilibrium Price'), row([
        sup(i('p'), o('*')), o('='),
        row([
          sub(CHARS.alpha, i('S')), o('+'),
          sub(CHARS.beta, i('S')), o('·'), qe,
        ]),
      ])),
    ]),
  ]);
}

export function supplyDemandCurvesDiscrete() {
  /** @param {E.Item} qs */
  const ps = qs => call(sub(i('P'), i('S')), qs);
  /** @param {E.Item} qd */
  const pd = qd => call(sub(i('P'), i('D')), qd);

  /** @param {E.Item} a @param {E.Item} b */
  const index = (a, b) => row([a, o('['), b, o(']')]);

  const priceSet = set([
    sub(i('p'), n(1)),
    sub(i('p'), n(2)),
    CHARS.ellipse.h,
    sub(i('p'), i('n')),
  ]);

  const PS = sub(i('ℙ'), i('S'));
  const PD = sub(i('ℙ'), i('D'));
  const QConstraint = row([
    text('where'), space(8),
    row([i('q'), o('≤'), i('n')]),
  ]);

  return mathml([
    rows([
      row([
        over(
          text('Supply reserve price'),
          row([PS, o('='), priceSet]),
        ),
        space(16),
        over(
          text('Demand reserve price'),
          row([PD, o('='), priceSet]),
        ),
      ]),
      over(text('Supply Price'), row([
        row([ps(i('q'))]), o('='),
        index(PS, i('q')), space(8),
        QConstraint,
      ])),
      over(text('Demand Price'), row([
        row([pd(i('q'))]), o('='),
        index(PD, i('q')), space(8),
        QConstraint
      ])),
    ])
  ]);
}

export function equilibriumDiscrete() {
  const qe = sup(i('q'), o('*'));
  /** @param {E.Item} qs */
  const ps = qs => call(sub(i('P'), i('S')), qs);
  /** @param {E.Item} qd */
  const pd = qd => call(sub(i('P'), i('D')), qd);
  const pe = sup(i('p'), o('*'));

  /** @param {E.Item} id */
  const diff = id => call('D', sub(i('q'), id));

  return mathml([
    rows([
      over(text('Difference of Sign'), row([
        row([call(i('D'), i('q'))]),
        o('='), space(4),
        call('sign', row([ps(i('q')), o('-'), pd(i('q'))])),
      ])),
      over(text('Equilibrium Quantity'), row([
        qe, o('='), row([
          text('min'), space(4),
          o('{'), i('i'), CHARS.exists, i('ℕ'), o(':'),
          row([diff(i('i')), CHARS.neq, diff(n(0))]),
          o(','), space(2), row([i('i'), o('<'), i('n')]),
          o('}'),
        ]),
      ])),
      over(text('Equilibrium Price'), row([
        pe, o('='),
        frac([row([ps(qe), o('-'), pd(qe)])], [n(2)]),
      ])),
    ]),
  ]);
}
