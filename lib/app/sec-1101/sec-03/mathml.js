import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const {
  n, frac,
  sup, sub, space,
  under, table,
} = mathml;

const { mi, mo, mtext, mrow } = mathml2;

const { rows } = mathmlHelper2;

export function relativeValue() {
  const muai = sub(mi`MU`, mrow(mi`A`, space(2), mi`i`));
  const mubj = sub(mi`MU`, mrow(mi`B`, space(2), mi`j`));
  const pb = sub(mtext`p`, mi`B`);
  const ipb = sup(pb, mrow(mo`-`, n(1)));

  return mathml2.math(
    rows(
      mrow(
        sub(mtext`Reserve Price`, mi`A`),
        space(4), mo`=`, space(4),
        frac([muai], [mubj, mo`×`, ipb]),
      ),
      mrow(),
      mrow(muai, mo`=`, mtext`Marginal Utility of A, at position i`),
      mrow(mubj, mo`=`, mtext`Marginal Utility of B, at position j`),
      mrow(pb, mo`=`, mtext`Price of B`),
    ),
  );
}

export function reservationPrice() {
  return mathml2.math(
    rows(
      mrow(
        mtext`Reserve Price`,
        space(4), mo`=`, space(4),
        frac([sub(mi`MU`, mi`i`)], [mi`λ`]),
      ),
      mrow(mi`λ`, mo`=`, mtext`Marginal Utility of Income`),
    ),
  );
}

export function reservationPriceCourse() {
  const indexA = mrow(
    space(4), mi`A`,
    space(4), mi`i`,
  );

  return mathml2.math(
    mrow(
      under(
        sub(mtext`Reserve Price`, indexA),
        mrow(mi`i`, mo`>`, n(0)),
      ),
      space(4), mo`=`, space(4),
      frac([
        sub(mi`MU`, indexA)
      ], [
        sup(mi`p`, mrow(mo`-`, n(1))),
        space(4),
        sub(mi`MU`, mrow(mi`B`, space(2), n(1))),
      ]),
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
    ]),
  );
}
