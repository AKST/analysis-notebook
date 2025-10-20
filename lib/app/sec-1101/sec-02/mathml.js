import { mathml } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const { mi, mo, mtext, mrow, mover, mn, msub, msup, mspace, mfrac } = mathml;

const { SPECIAL, abs, index, iv, set, matrix, rows, sum, parensA, table, call } = mathmlHelper2;

const {
  rel,
  greek: { alpha, beta },
  ellipse: e,
  operation: op
} = SPECIAL;

export function vectorDefs() {
  return mathml.math(
    table.attr({ className: 'mathtable' })(
      [mi`C`, mo`=`, mover(
        set(...[0, 0, 2, 5, 10, 18, 28, 40].map(x => mn(x))),
        mtext`Cumulative Cost Vector`,
      )],
      [mi`D`, mo`=`, mover(
        matrix(
          [mn(-1), mn(1), mn(0), e.h2, mn(0)],
          [mn(0), mn(-1), mn(1), e.h2, mn(0)],
          [mn(0), mn(0), mn(-1), e.h2, mn(0)],
          [e.v, e.v, e.v, e.d1, e.v],
          [mn(0), mn(0), mn(0), e.h2, mn(1)],
        ),
        mtext`Difference Matrix`,
      )],
      [
        mi`M`,
        mo`=`, mrow(
          mrow(mi`D`, mi`C`),
          mo`=`,
          mover(
            set(...[2, 3, 5, 8, 10, 12].map(x => mn(x))),
            mtext`Marginal Cost Vector`,
          ),
        ),
      ],
    ),
  );
}


export function marginalCost() {
  return mathml.math(
    mi`y`, mspace(8), mo`=`, mspace(8), mrow(
      sum.attr({
        inc: mrow(abs(mi`x`), mo`-`, mn(1)),
        max: mrow(mi`i`, mo`=`, mn(0)),
      })(),
      mrow.of(index(mi`M`, mi`i`)),
    ),
  );
}

export function timeToOutput() {
  return mathml.math(
    mi`x`, mo`=`,
    mrow(
      mrow(
        mi`max`,
        mspace(8),
        mrow(mi`j`, rel.exists, SPECIAL.sets.nat),
      ),
      mo`:`,
      mrow(
        sum.attr({
          inc: mrow(mi`j`, mo`-`, mn(1)),
          max: mrow(mi`i`, mo`=`, mn(0)),
        })(),
        mrow(
          index(mi`C`, mi`i`),
          rel.lteq,
          mi`y`,
        ),
      ),
    )
  );
}

export function costBenefitPrinciple() {
  return mathml.math(
    mrow(
      call.attr({ fn: mtext`MB` })(mi`Price`),
      rel.lteq, mi`MC`,
      mspace(8), rel.imply,
      mspace(8), mtext`do it!`,
    ),
  );
}

export function elasticity() {
  return mathml.math(
    table(
      [mi`ε`, mo`=`, mrow(
        mfrac(mi`P`, mi`Q`), mo`×`,
        mfrac(mi`ΔQ`, mi`ΔP`)
      )],
      [mi`ε`, mo`=`, mrow(
        mfrac(mi`P`, mi`Q`), mo`×`,
        mfrac(mi`1`, mtext`slope`),
      )],
      [SPECIAL.greek.eplison, mo`=`, mrow(
        mi`P`,
        mspace(4),
        msup(mi`Q`, mrow(mo`-`, mn(1))),
        mspace(4),
        msup(mtext`slope`, mrow(mo`-`, mn(1))),
      )],
    ),
  );
}

export function optimalNumberOfWorkers() {
  return mathml.math(mrow(
    msup(mi`w`, mi`*`),
    mo`=`,
    mtext`argmax`,
    mspace(8),
    mrow(
      mo`{`,
      mspace(8),
      mrow(
        mi`i`,
        rel.exists,
        SPECIAL.sets.real,
      ),
      mo`:`,
      mspace(8),
      mrow(
        msub(parensA(mi`p`, mi`D`, iv('q')), mi`i`),
        mspace(4),
        mo`–`,
        mspace(4),
        msub(parensA(mi`p`, mi`D`, iv('c')), mi`i`),
      ),
      mspace(8),
      mo`}`,
    ),
  ));
}

export const mcToAtcAndAvc = () => mathml.math(
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
          mfrac(beta, mn(2)), msup(mi`Q`, mn(2)),
          mo`+`, mi`C`,
        ),
      ),
    ), mtext`Variable Cost`),
    mspace(8),
    mover(rows(
      mrow(
        mrow(
          mi`ATC`, mo`=`,
          mfrac(mrow(mi`VC`, mo`+`, mi`FC`), mi`Q`),
        ),
        mspace(16),
        mrow(
          mi`AVC`, mo`=`,
          mfrac(mi`VC`, mi`Q`),
        ),
      ),
      mrow(
        mi`ATC`, mo`=`, mrow(
          mspace(2), alpha, mspace(2), mo`+`,
          mspace(2), mfrac(beta, mn(2)), mi`Q`, mspace(2), mo`+`,
          mspace(2), mfrac(mrow(mi`C`, mo`+`, mi`FC`), mi`Q`),
        ),
      ),
      mrow(
        mi`AVC`, mo`=`, mrow(
          mspace(2), alpha, mspace(2), mo`+`,
          mspace(2), mfrac(beta, mn(2)), mi`Q`, mspace(2), mo`+`,
          mspace(2), mfrac(mi`C`, mi`Q`),
        ),
      ),
    ), mtext`Average {Total,Variable} Cost`),
  ),
);
