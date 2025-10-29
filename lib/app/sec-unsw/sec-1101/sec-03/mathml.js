import { mathml } from '../../../prelude.js';
import { mathmlHelper } from '../prelude.js';

const { mi, mo, mtext, mrow, mn, msup, msub, munder, mspace, mfrac } = mathml;

const { rows, table } = mathmlHelper;

export function relativeValue() {
  const muai = msub(mi`MU`, mrow(mi`A`, mspace(2), mi`i`));
  const mubj = msub(mi`MU`, mrow(mi`B`, mspace(2), mi`j`));
  const pb = msub(mtext`p`, mi`B`);
  const ipb = msup(pb, mrow(mo`-`, mn(1)));

  return mathml.math(
    rows(
      mrow(
        msub(mtext`Reserve Price`, mi`A`),
        mspace(4), mo`=`, mspace(4),
        mfrac(muai, mrow(mubj, mo`×`, ipb)),
      ),
      mrow(),
      mrow(muai, mo`=`, mtext`Marginal Utility of A, at position i`),
      mrow(mubj, mo`=`, mtext`Marginal Utility of B, at position j`),
      mrow(pb, mo`=`, mtext`Price of B`),
    ),
  );
}

export function reservationPrice() {
  return mathml.math(
    rows(
      mrow(
        mtext`Reserve Price`,
        mspace(4), mo`=`, mspace(4),
        mfrac(msub(mi`MU`, mi`i`), mi`λ`),
      ),
      mrow(mi`λ`, mo`=`, mtext`Marginal Utility of Income`),
    ),
  );
}

export function reservationPriceCourse() {
  const indexA = mrow(
    mspace(4), mi`A`,
    mspace(4), mi`i`,
  );

  return mathml.math(
    mrow(
      munder(
        msub(mtext`Reserve Price`, indexA),
        mrow(mi`i`, mo`>`, mn(0)),
      ),
      mspace(4), mo`=`, mspace(4),
      mfrac(
        msub(mi`MU`, indexA),
        mrow(
          msup(mi`p`, mrow(mo`-`, mn(1))),
          mspace(4),
          msub(mi`MU`, mrow(mi`B`, mspace(2), mn(1))),
        )
      ),
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
    ),
  );
}
