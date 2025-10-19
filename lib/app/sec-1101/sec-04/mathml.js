/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, mathml2 } from '../../prelude.js';

const {
  sum, sub, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, SPECIAL: CHARS
} = mathml;

const { mi, mo } = mathml2;

/**
 * @returns {E.Item}
 */
export function horizontalSummation() {
  return mathml([
    rows([
      row([
        CHARS.cursive.F,
        space(4), mo`=`, space(4),
        row([
          mo`{`, space(2),
          sub(mi`f`, mi`i`), space(2),
          mo`:`, space(2),
          mi`i`, space(2),
          CHARS.operation.exists, space(2),
          set([
            n(1), n(2), CHARS.ellipse.h, mi`n`,
          ]),
          space(2), mo`}`,
        ]),
      ]),
      row([
        sub(mi`f`, mi`i`), paren([mi`Q`]),
        space(2), mo`=`, space(2),
        row([
          sub(mi`a`, mi`i`), mo`+`,
          sub(mi`b`, mi`i`), mi`Q`,
        ]),
        space(16), text('where'), space(16),
        row([mi`i`, CHARS.constraint.lteq, mi`n`]),
      ]),
      over(text('Sub Coeffients'), row([
        row([
          mi`α`,
          mo`=`,
          sum(mi`n`, row([mi`i`, mo`=`, n('1')])),
          paren([
            sub(mi`a`, mi`i`),
            space(4),
            inv(sub(mi`b`, mi`i`)),
          ]),
        ]),
        space(16),
        row([
          mi`β`,
          mo`=`,
          sum(mi`n`, row([mi`i`, mo`=`, n('1')])),
          inv(sub(mi`b`, mi`i`)),
        ]),
      ])),
      over(text('Coefficents'), row([
        row([
          mi`A`, space(4),
          mo`=`, space(4),
          mi`α`, CHARS.operation.dot,
          inv(mi`β`),
        ]),
        space(16),
        row([mi`B`, mo`=`, inv(mi`β`)]),
      ])),
      over(
        text('Horizontal Summation'),
        row([
          call('ℋ', CHARS.cursive.F,),
          space(4),
          mo`=`,
          space(4),
          sup(mi`f`, mo`*`), mo`=`,
          space(4),
          mi`A`, mo`+`, mi`B`,
          CHARS.operation.dot, mi`Q`,
        ]),
      ),
    ]),
  ]);
}

export function supplyDemandCurvesContinuious() {
  /** @param {E.Item} qs */
  const ps = qs => call(sub(mi`P`, mi`S`), qs);
  /** @param {E.Item} qd */
  const pd = qd => call(sub(mi`P`, mi`D`), qd);

  return mathml([
    rows([
      row([
        over(text('Supply Price'), row([ps(mi`q`)])),
        mo`=`, space(8),
        sub(CHARS.alpha, mi`S`), mo`+`,
        sub(CHARS.beta, mi`S`), mo`·`, mi`q`,
      ]),
      row([
        over(text('Demand Price'), row([pd(mi`q`)])),
        mo`=`, space(8),
        sub(CHARS.alpha, mi`D`), mo`-`,
        sub(CHARS.beta, mi`D`), mo`·`, mi`q`
      ]),
    ])
  ]);
}

export function equilibriumContinuious() {
  const qe = sup(mi`q`, mo`*`);
  return mathml([
    rows([
      row([
        row([
          sub(CHARS.alpha, mi`S`), mo`+`,
          sub(CHARS.beta, mi`S`), mo`·`, qe,
        ]),
        space(8), mo`=`, space(8),
        row([
          sub(CHARS.alpha, mi`D`), mo`-`,
          sub(CHARS.beta, mi`D`), mo`·`, qe
        ]),
      ]),
      row([
        row([
          paren([
            sub(CHARS.beta, mi`S`), mo`+`,
            sub(CHARS.beta, mi`D`),
          ]),
          mo`·`, qe,
        ]),
        space(8), mo`=`, space(8),
        row([
          sub(CHARS.alpha, mi`S`), mo`-`,
          sub(CHARS.alpha, mi`D`),
        ]),
      ]),
      over(text('Equilibrium Quantity'), row([
        row([qe]),
        space(8), mo`=`, space(8),
        row([
          frac([
            sub(CHARS.alpha, mi`S`), mo`-`,
            sub(CHARS.alpha, mi`D`),
          ], [
            sub(CHARS.beta, mi`S`), mo`+`,
            sub(CHARS.beta, mi`D`),
          ]),
        ]),
      ])),
      over(text('Equilibrium Price'), row([
        sup(mi`p`, mo`*`), mo`=`,
        row([
          sub(CHARS.alpha, mi`S`), mo`+`,
          sub(CHARS.beta, mi`S`), mo`·`, qe,
        ]),
      ])),
    ]),
  ]);
}

export function supplyDemandCurvesDiscrete() {
  /** @param {E.Item} qs */
  const ps = qs => call(sub(mi`P`, mi`S`), qs);
  /** @param {E.Item} qd */
  const pd = qd => call(sub(mi`P`, mi`D`), qd);

  /** @param {E.Item} a @param {E.Item} b */
  const index = (a, b) => row([a, mo`[`, b, mo`]`]);

  const priceSet = set([
    sub(mi`p`, n(1)),
    sub(mi`p`, n(2)),
    CHARS.ellipse.h,
    sub(mi`p`, mi`n`),
  ]);

  const PS = sub(mi`ℙ`, mi`S`);
  const PD = sub(mi`ℙ`, mi`D`);
  const QConstraint = row([
    text('where'), space(8),
    row([mi`q`, mo`≤`, mi`n`]),
  ]);

  return mathml([
    rows([
      row([
        over(
          text('Supply reserve price'),
          row([PS, mo`=`, priceSet]),
        ),
        space(16),
        over(
          text('Demand reserve price'),
          row([PD, mo`=`, priceSet]),
        ),
      ]),
      over(text('Supply Price'), row([
        row([ps(mi`q`)]), mo`=`,
        index(PS, mi`q`), space(8),
        QConstraint,
      ])),
      over(text('Demand Price'), row([
        row([pd(mi`q`)]), mo`=`,
        index(PD, mi`q`), space(8),
        QConstraint
      ])),
    ])
  ]);
}

export function equilibriumDiscrete() {
  const qe = sup(mi`q`, mo`*`);
  /** @param {E.Item} qs */
  const ps = qs => call(sub(mi`P`, mi`S`), qs);
  /** @param {E.Item} qd */
  const pd = qd => call(sub(mi`P`, mi`D`), qd);
  const pe = sup(mi`p`, mo`*`);

  /** @param {E.Item} id */
  const diff = id => call('D', sub(mi`q`, id));

  return mathml([
    rows([
      over(text('Difference of Sign'), row([
        row([call(mi`D`, mi`q`)]),
        mo`=`, space(4),
        call('sign', row([ps(mi`q`), mo`-`, pd(mi`q`)])),
      ])),
      over(text('Equilibrium Quantity'), row([
        qe, mo`=`, row([
          text('min'), space(4),
          mo`{`, mi`i`, CHARS.operation.exists, mi`ℕ`, mo`:`,
          row([diff(mi`i`), CHARS.neq, diff(n(0))]),
          mo`,`, space(2), row([mi`i`, mo`<`, mi`n`]),
          mo`}`,
        ]),
      ])),
      over(text('Equilibrium Price'), row([
        pe, mo`=`,
        frac([row([ps(qe), mo`-`, pd(qe)])], [n(2)]),
      ])),
    ]),
  ]);
}
