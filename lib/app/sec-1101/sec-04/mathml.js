/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const {
  inv, paren,
  call,
  set, frac, SPECIAL: CHARS
} = mathml;

const { mi, mo, mtext, mrow, mover, mn, msub, msup, msqrt, munder, msubsup, mspace } = mathml2;

const { sum, rows } = mathmlHelper2;

/**
 * @returns {E.Item}
 */
export function horizontalSummation() {
  return mathml2.math(
    rows(
      mrow(
        CHARS.cursive.F,
        mspace(4), mo`=`, mspace(4),
        mrow(
          mo`{`, mspace(2),
          msub(mi`f`, mi`i`), mspace(2),
          mo`:`, mspace(2),
          mi`i`, mspace(2),
          CHARS.operation.exists, mspace(2),
          set([
            mn(1), mn(2), CHARS.ellipse.h, mi`n`,
          ]),
          mspace(2), mo`}`,
        ),
      ),
      mrow(
        msub(mi`f`, mi`i`), paren([mi`Q`]),
        mspace(2), mo`=`, mspace(2),
        mrow(
          msub(mi`a`, mi`i`), mo`+`,
          msub(mi`b`, mi`i`), mi`Q`,
        ),
        mspace(16), mtext`where`, mspace(16),
        mrow(mi`i`, CHARS.constraint.lteq, mi`n`),
      ),
      mover(mrow(
        mrow(
          mi`α`,
          mo`=`,
          sum.attr({ max: mi`n`, inc: mrow(mi`i`, mo`=`, mn(1)) })(),
          paren([
            msub(mi`a`, mi`i`),
            mspace(4),
            inv(msub(mi`b`, mi`i`)),
          ]),
        ),
        mspace(16),
        mrow(
          mi`β`,
          mo`=`,
          sum.attr({ max: mi`n`, inc: mrow(mi`i`, mo`=`, mn(1)) })(),
          inv(msub(mi`b`, mi`i`)),
        ),
      ), mtext`Sub Coeffients`),
      mover(mrow(
        mrow(
          mi`A`, mspace(4),
          mo`=`, mspace(4),
          mi`α`, CHARS.operation.dot,
          inv(mi`β`),
        ),
        mspace(16),
        mrow(mi`B`, mo`=`, inv(mi`β`)),
      ), mtext`Coefficents`),
      mover(
        mrow(
          call('ℋ', CHARS.cursive.F,),
          mspace(4),
          mo`=`,
          mspace(4),
          msup(mi`f`, mo`*`), mo`=`,
          mspace(4),
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
  const ps = qs => call(msub(mi`P`, mi`S`), qs);
  /** @param {E.Item} qd */
  const pd = qd => call(msub(mi`P`, mi`D`), qd);

  return mathml2.math(
    rows(
      mrow(
        mover(mrow.of(ps(mi`q`)), mtext`Supply Price`),
        mo`=`, mspace(8),
        msub(CHARS.alpha, mi`S`), mo`+`,
        msub(CHARS.beta, mi`S`), mo`·`, mi`q`,
      ),
      mrow(
        mover(mrow.of(pd(mi`q`)), mtext`Demand Price`),
        mo`=`, mspace(8),
        msub(CHARS.alpha, mi`D`), mo`-`,
        msub(CHARS.beta, mi`D`), mo`·`, mi`q`
      ),
    )
  );
}

export function equilibriumContinuious() {
  const qe = msup(mi`q`, mo`*`);
  return mathml2.math(
    rows(
      mrow(
        mrow(
          msub(CHARS.alpha, mi`S`), mo`+`,
          msub(CHARS.beta, mi`S`), mo`·`, qe,
        ),
        mspace(8), mo`=`, mspace(8),
        mrow(
          msub(CHARS.alpha, mi`D`), mo`-`,
          msub(CHARS.beta, mi`D`), mo`·`, qe
        ),
      ),
      mrow(
        mrow(
          paren([
            msub(CHARS.beta, mi`S`), mo`+`,
            msub(CHARS.beta, mi`D`),
          ]),
          mo`·`, qe,
        ),
        mspace(8), mo`=`, mspace(8),
        mrow(
          msub(CHARS.alpha, mi`S`), mo`-`,
          msub(CHARS.alpha, mi`D`),
        ),
      ),
      mover(mrow(
        mrow(qe),
        mspace(8), mo`=`, mspace(8),
        mrow(
          frac([
            msub(CHARS.alpha, mi`S`), mo`-`,
            msub(CHARS.alpha, mi`D`),
          ], [
            msub(CHARS.beta, mi`S`), mo`+`,
            msub(CHARS.beta, mi`D`),
          ]),
        ),
      ), mtext`Equilibrium Quantity`),
      mover(mrow(
        msup(mi`p`, mo`*`), mo`=`,
        mrow(
          msub(CHARS.alpha, mi`S`), mo`+`,
          msub(CHARS.beta, mi`S`), mo`·`, qe,
        ),
      ), mtext`Equilibrium Price`),
    ),
  );
}

export function supplyDemandCurvesDiscrete() {
  /** @param {E.Item} qs */
  const ps = qs => call(msub(mi`P`, mi`S`), qs);
  /** @param {E.Item} qd */
  const pd = qd => call(msub(mi`P`, mi`D`), qd);

  /** @param {E.Item} a @param {E.Item} b */
  const index = (a, b) => mrow(a, mo`[`, b, mo`]`);

  const priceSet = set([
    msub(mi`p`, mn(1)),
    msub(mi`p`, mn(2)),
    CHARS.ellipse.h,
    msub(mi`p`, mi`n`),
  ]);

  const PS = msub(mi`ℙ`, mi`S`);
  const PD = msub(mi`ℙ`, mi`D`);
  const QConstraint = mrow(
    mtext`where`, mspace(8),
    mrow(mi`q`, mo`≤`, mi`n`),
  );

  return mathml2.math(
    rows(
      mrow(
        mover(
          mrow(PS, mo`=`, priceSet),
          mtext`Supply reserve price`,
        ),
        mspace(16),
        mover(
          mrow(PD, mo`=`, priceSet),
          mtext`Demand reserve price`,
        ),
      ),
      mover(mrow(
        ps(mi`q`), mo`=`,
        index(PS, mi`q`), mspace(8),
        QConstraint,
      ), mtext`Supply Price`),
      mover(mrow(
        pd(mi`q`), mo`=`,
        index(PD, mi`q`), mspace(8),
        QConstraint
      ), mtext`Demand Price`),
    )
  );
}

export function equilibriumDiscrete() {
  const qe = msup(mi`q`, mo`*`);
  /** @param {E.Item} qs */
  const ps = qs => call(msub(mi`P`, mi`S`), qs);
  /** @param {E.Item} qd */
  const pd = qd => call(msub(mi`P`, mi`D`), qd);
  const pe = msup(mi`p`, mo`*`);

  /** @param {E.Item} id */
  const diff = id => call('D', msub(mi`q`, id));

  return mathml2.math(
    rows(
      mover(mrow(
        call(mi`D`, mi`q`),
        mo`=`, mspace(4),
        call('sign', mrow(ps(mi`q`), mo`-`, pd(mi`q`))),
      ), mtext`Difference of Sign`),
      mover(mrow(
        qe, mo`=`, mrow(
          mtext`min`, mspace(4),
          mo`{`, mi`i`, CHARS.operation.exists, mi`ℕ`, mo`:`,
          mrow(diff(mi`i`), CHARS.neq, diff(mn(0))),
          mo`,`, mspace(2), mrow(mi`i`, mo`<`, mi`n`),
          mo`}`,
        ),
      ), mtext`Equilibrium Quantity`),
      mover(mrow(
        pe, mo`=`,
        frac([mrow(ps(qe), mo`-`, pd(qe))], [mn(2)]),
      ), mtext`Equilibrium Price`),
    ),
  );
}
