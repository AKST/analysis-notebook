/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const {
  sum, sub, n, inv, paren, sup,
  space, call,
  set, frac, SPECIAL: CHARS
} = mathml;

const { mi, mo, mtext, mrow, mover } = mathml2;

const { rows } = mathmlHelper2;

/**
 * @returns {E.Item}
 */
export function horizontalSummation() {
  return mathml2.math(
    rows(
      mrow(
        CHARS.cursive.F,
        space(4), mo`=`, space(4),
        mrow(
          mo`{`, space(2),
          sub(mi`f`, mi`i`), space(2),
          mo`:`, space(2),
          mi`i`, space(2),
          CHARS.operation.exists, space(2),
          set([
            n(1), n(2), CHARS.ellipse.h, mi`n`,
          ]),
          space(2), mo`}`,
        ),
      ),
      mrow(
        sub(mi`f`, mi`i`), paren([mi`Q`]),
        space(2), mo`=`, space(2),
        mrow(
          sub(mi`a`, mi`i`), mo`+`,
          sub(mi`b`, mi`i`), mi`Q`,
        ),
        space(16), mtext`where`, space(16),
        mrow(mi`i`, CHARS.constraint.lteq, mi`n`),
      ),
      mover(mrow(
        mrow(
          mi`α`,
          mo`=`,
          sum(mi`n`, mrow(mi`i`, mo`=`, n('1'))),
          paren([
            sub(mi`a`, mi`i`),
            space(4),
            inv(sub(mi`b`, mi`i`)),
          ]),
        ),
        space(16),
        mrow(
          mi`β`,
          mo`=`,
          sum(mi`n`, mrow(mi`i`, mo`=`, n('1'))),
          inv(sub(mi`b`, mi`i`)),
        ),
      ), mtext`Sub Coeffients`),
      mover(mrow(
        mrow(
          mi`A`, space(4),
          mo`=`, space(4),
          mi`α`, CHARS.operation.dot,
          inv(mi`β`),
        ),
        space(16),
        mrow(mi`B`, mo`=`, inv(mi`β`)),
      ), mtext`Coefficents`),
      mover(
        mrow(
          call('ℋ', CHARS.cursive.F,),
          space(4),
          mo`=`,
          space(4),
          sup(mi`f`, mo`*`), mo`=`,
          space(4),
          mi`A`, mo`+`, mi`B`,
          CHARS.operation.dot, mi`Q`,
        ),
        mtext`Horizontal Summation`,
      ),
    ),
  );
}

export function supplyDemandCurvesContinuious() {
  /** @param {E.Item} qs */
  const ps = qs => call(sub(mi`P`, mi`S`), qs);
  /** @param {E.Item} qd */
  const pd = qd => call(sub(mi`P`, mi`D`), qd);

  return mathml2.math(
    rows(
      mrow(
        mover(mrow(ps(mi`q`)), mtext`Supply Price`),
        mo`=`, space(8),
        sub(CHARS.alpha, mi`S`), mo`+`,
        sub(CHARS.beta, mi`S`), mo`·`, mi`q`,
      ),
      mrow(
        mover(mrow(pd(mi`q`)), mtext`Demand Price`),
        mo`=`, space(8),
        sub(CHARS.alpha, mi`D`), mo`-`,
        sub(CHARS.beta, mi`D`), mo`·`, mi`q`
      ),
    )
  );
}

export function equilibriumContinuious() {
  const qe = sup(mi`q`, mo`*`);
  return mathml2.math(
    rows(
      mrow(
        mrow(
          sub(CHARS.alpha, mi`S`), mo`+`,
          sub(CHARS.beta, mi`S`), mo`·`, qe,
        ),
        space(8), mo`=`, space(8),
        mrow(
          sub(CHARS.alpha, mi`D`), mo`-`,
          sub(CHARS.beta, mi`D`), mo`·`, qe
        ),
      ),
      mrow(
        mrow(
          paren([
            sub(CHARS.beta, mi`S`), mo`+`,
            sub(CHARS.beta, mi`D`),
          ]),
          mo`·`, qe,
        ),
        space(8), mo`=`, space(8),
        mrow(
          sub(CHARS.alpha, mi`S`), mo`-`,
          sub(CHARS.alpha, mi`D`),
        ),
      ),
      mover(mrow(
        mrow(qe),
        space(8), mo`=`, space(8),
        mrow(
          frac([
            sub(CHARS.alpha, mi`S`), mo`-`,
            sub(CHARS.alpha, mi`D`),
          ], [
            sub(CHARS.beta, mi`S`), mo`+`,
            sub(CHARS.beta, mi`D`),
          ]),
        ),
      ), mtext`Equilibrium Quantity`),
      mover(mrow(
        sup(mi`p`, mo`*`), mo`=`,
        mrow(
          sub(CHARS.alpha, mi`S`), mo`+`,
          sub(CHARS.beta, mi`S`), mo`·`, qe,
        ),
      ), mtext`Equilibrium Price`),
    ),
  );
}

export function supplyDemandCurvesDiscrete() {
  /** @param {E.Item} qs */
  const ps = qs => call(sub(mi`P`, mi`S`), qs);
  /** @param {E.Item} qd */
  const pd = qd => call(sub(mi`P`, mi`D`), qd);

  /** @param {E.Item} a @param {E.Item} b */
  const index = (a, b) => mrow(a, mo`[`, b, mo`]`);

  const priceSet = set([
    sub(mi`p`, n(1)),
    sub(mi`p`, n(2)),
    CHARS.ellipse.h,
    sub(mi`p`, mi`n`),
  ]);

  const PS = sub(mi`ℙ`, mi`S`);
  const PD = sub(mi`ℙ`, mi`D`);
  const QConstraint = mrow(
    mtext`where`, space(8),
    mrow(mi`q`, mo`≤`, mi`n`),
  );

  return mathml2.math(
    rows(
      mrow(
        mover(
          mrow(PS, mo`=`, priceSet),
          mtext`Supply reserve price`,
        ),
        space(16),
        mover(
          mrow(PD, mo`=`, priceSet),
          mtext`Demand reserve price`,
        ),
      ),
      mover(mrow(
        mrow(ps(mi`q`)), mo`=`,
        index(PS, mi`q`), space(8),
        QConstraint,
      ), mtext`Supply Price`),
      mover(mrow(
        mrow(pd(mi`q`)), mo`=`,
        index(PD, mi`q`), space(8),
        QConstraint
      ), mtext`Demand Price`),
    )
  );
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

  return mathml2.math(
    rows(
      mover(mrow(
        mrow(call(mi`D`, mi`q`)),
        mo`=`, space(4),
        call('sign', mrow(ps(mi`q`), mo`-`, pd(mi`q`))),
      ), mtext`Difference of Sign`),
      mover(mrow(
        qe, mo`=`, mrow(
          mtext`min`, space(4),
          mo`{`, mi`i`, CHARS.operation.exists, mi`ℕ`, mo`:`,
          mrow(diff(mi`i`), CHARS.neq, diff(n(0))),
          mo`,`, space(2), mrow(mi`i`, mo`<`, mi`n`),
          mo`}`,
        ),
      ), mtext`Equilibrium Quantity`),
      mover(mrow(
        pe, mo`=`,
        frac([mrow(ps(qe), mo`-`, pd(qe))], [n(2)]),
      ), mtext`Equilibrium Price`),
    ),
  );
}
