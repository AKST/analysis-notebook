import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const {
  iv, set, matrix, paren,
  table, idx,
  abs, call, frac, SPECIAL,
  inv,
} = mathml;

const { mi, mo, mtext, mrow, mover, mn, msub, msup, msubsup, mspace } = mathml2;

const { rows, sum } = mathmlHelper2;

const {
  greek: { alpha, beta },
  ellipse: e,
  operation: op
} = SPECIAL;

export function vectorDefs() {
  return mathml2.math(
    table([
      [mi`C`, mo`=`, mover(
        set([0, 0, 2, 5, 10, 18, 28, 40].map(x => mn(x))),
        mtext`Cumulative Cost Vector`,
      )],
      [mi`D`, mo`=`, mover(
        matrix([
          [mn(-1), mn(1), mn(0), e.h2, mn(0)],
          [mn(0), mn(-1), mn(1), e.h2, mn(0)],
          [mn(0), mn(0), mn(-1), e.h2, mn(0)],
          [e.v, e.v, e.v, e.d1, e.v],
          [mn(0), mn(0), mn(0), e.h2, mn(1)],
        ]),
        mtext`Difference Matrix`,
      )],
      [
        mi`M`,
        mo`=`, mrow(
          mrow(mi`D`, mi`C`),
          mo`=`,
          mover(
            set([2, 3, 5, 8, 10, 12].map(x => mn(x))),
            mtext`Marginal Cost Vector`,
          ),
        ),
      ],
    ], { className: 'mathtable' }),
  );
}


export function marginalCost() {
  return mathml2.math(
    mi`y`, mspace(8), mo`=`, mspace(8), mrow(
      sum.attr({
        inc: mrow(abs(mi`x`), mo`-`, mn(1)),
        max: mrow(mi`i`, mo`=`, mn(0)),
      })(),
      mrow.of(idx(mi`M`, mi`i`)),
    ),
  );
}

export function timeToOutput() {
  return mathml2.math(
    mi`x`, mo`=`,
    mrow(
      mrow(
        mi`max`,
        mspace(8),
        mrow(mi`j`, SPECIAL.operation.exists, SPECIAL.sets.nat),
      ),
      mo`:`,
      mrow(
        sum.attr({
          inc: mrow(mi`j`, mo`-`, mn(1)),
          max: mrow(mi`i`, mo`=`, mn(0)),
        })(),
        mrow(
          idx(mi`C`, mi`i`),
          SPECIAL.constraint.lteq,
          mi`y`,
        ),
      ),
    )
  );
}

export function costBenefitPrinciple() {
  return mathml2.math(
    mrow(
      call('MB', mi`Price`),
      SPECIAL.constraint.lteq, mi`MC`,
      mspace(8), SPECIAL.arrow,
      mspace(8), mtext`do it!`,
    ),
  );
}

export function elasticity() {
  return mathml2.math(
    table([
      [mi`ε`, mo`=`, mrow(
        frac([mi`P`], [mi`Q`]), mo`×`,
        frac([mi`ΔQ`], [mi`ΔP`])
      )],
      [mi`ε`, mo`=`, mrow(
        frac([mi`P`], [mi`Q`]), mo`×`,
        frac([mi`1`], [mtext`slope`]),
      )],
      [SPECIAL.greek.eplison, mo`=`, mrow(
        mi`P`,
        mspace(4),
        msup(mi`Q`, mrow(mo`-`, mn(1))),
        mspace(4),
        msup(mtext`slope`, mrow(mo`-`, mn(1))),
      )],
    ]),
  );
}

export function optimalNumberOfWorkers() {
  return mathml2.math(mrow(
    msup(mi`w`, mi`*`),
    mo`=`,
    mtext`argmax`,
    mspace(8),
    mrow(
      mo`{`,
      mspace(8),
      mrow(
        mi`i`,
        SPECIAL.operation.exists,
        SPECIAL.sets.real,
      ),
      mo`:`,
      mspace(8),
      mrow(
        msub(paren([mi`p`, mi`D`, iv('q')]), mi`i`),
        mspace(4),
        mo`–`,
        mspace(4),
        msub(paren([mi`p`, mi`D`, iv('c')]), mi`i`),
      ),
      mspace(8),
      mo`}`,
    ),
  ));
}

export const mcToAtcAndAvc = () => mathml2.math(
  rows(
    mover(mrow(
      mi`MC`, mo`=`, msub(mi`P`, mi`S`),
      mo`=`, alpha, mo`+`, beta, mi`Q`,
    ), mtext`Marginal Cost`),
    mspace(8),
    mover(rows(
      mrow(
        mi`VC`, mo`=`,
        mrow(
          op.integral,
          mrow(alpha, mo`+`, beta, mi`Q`),
          mspace(4), mi`d`, mi`Q`
        ),
      ),
      mrow(
        mi`VC`, mo`=`,
        mrow(
          alpha, mi`Q`, mo`+`,
          frac([beta], [mn(2)]), msup(mi`Q`, mn(2)),
          mo`+`, mi`C`,
        ),
      ),
    ), mtext`Variable Cost`),
    mspace(8),
    mover(rows(
      mrow(
        mrow(
          mi`ATC`, mo`=`,
          frac([mi`VC`, mo`+`, mi`FC`], [mi`Q`]),
        ),
        mspace(16),
        mrow(
          mi`AVC`, mo`=`,
          frac([mi`VC`], [mi`Q`]),
        ),
      ),
      mrow(
        mi`ATC`, mo`=`, mrow(
          mspace(2), alpha, mspace(2), mo`+`,
          mspace(2), frac([beta], [mn(2)]), mi`Q`, mspace(2), mo`+`,
          mspace(2), frac([mi`C`, mo`+`, mi`FC`], [mi`Q`]),
        ),
      ),
      mrow(
        mi`AVC`, mo`=`, mrow(
          mspace(2), alpha, mspace(2), mo`+`,
          mspace(2), frac([beta], [mn(2)]), mi`Q`, mspace(2), mo`+`,
          mspace(2), frac([mi`C`], [mi`Q`]),
        ),
      ),
    ), mtext`Average {Total,Variable} Cost`),
  ),
);
