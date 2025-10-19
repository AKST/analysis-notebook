import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const {
  iv, set, matrix, paren,
  table, idx, space,
  abs, call, frac, SPECIAL,
  inv,
} = mathml;

const { mi, mo, mtext, mrow, mover, mn, msub, msup, msubsup } = mathml2;

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
    mi`y`, space(8), mo`=`, space(8), mrow(
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
        space(8),
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
      space(8), SPECIAL.arrow,
      space(8), mtext`do it!`,
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
        space(4),
        msup(mi`Q`, mrow(mo`-`, mn(1))),
        space(4),
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
    space(8),
    mrow(
      mo`{`,
      space(8),
      mrow(
        mi`i`,
        SPECIAL.operation.exists,
        SPECIAL.sets.real,
      ),
      mo`:`,
      space(8),
      mrow(
        msub(paren([mi`p`, mi`D`, iv('q')]), mi`i`),
        space(4),
        mo`–`,
        space(4),
        msub(paren([mi`p`, mi`D`, iv('c')]), mi`i`),
      ),
      space(8),
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
    space(8),
    mover(rows(
      mrow(
        mi`VC`, mo`=`,
        mrow(
          op.integral,
          mrow(alpha, mo`+`, beta, mi`Q`),
          space(4), mi`d`, mi`Q`
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
    space(8),
    mover(rows(
      mrow(
        mrow(
          mi`ATC`, mo`=`,
          frac([mi`VC`, mo`+`, mi`FC`], [mi`Q`]),
        ),
        space(16),
        mrow(
          mi`AVC`, mo`=`,
          frac([mi`VC`], [mi`Q`]),
        ),
      ),
      mrow(
        mi`ATC`, mo`=`, mrow(
          space(2), alpha, space(2), mo`+`,
          space(2), frac([beta], [mn(2)]), mi`Q`, space(2), mo`+`,
          space(2), frac([mi`C`, mo`+`, mi`FC`], [mi`Q`]),
        ),
      ),
      mrow(
        mi`AVC`, mo`=`, mrow(
          space(2), alpha, space(2), mo`+`,
          space(2), frac([beta], [mn(2)]), mi`Q`, space(2), mo`+`,
          space(2), frac([mi`C`], [mi`Q`]),
        ),
      ),
    ), mtext`Average {Total,Variable} Cost`),
  ),
);
