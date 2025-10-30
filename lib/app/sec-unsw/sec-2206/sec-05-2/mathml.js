/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { mathml, doc, table } from '@app/prelude.js';
import { responsiveGridAutoRow, twoThree, twoColumns, container } from '@prelude-uni/layout.js';
import { todo } from '@prelude-uni/components.js';
import { SPECIAL, call, op, parensA } from '@prelude-uni/mathml.js';

const { math, mi, mo, mtext, mrow, mn, msup, msub, mover, mfrac, munderover } = mathml;
const { eq, minus } = op;
const { greek } = SPECIAL;

export const noop = doc.figure(
  todo({}, 'Noop'),
  doc.figcaption`noop`,
);

export const homoskedasticity = doc.figure(
  math(
    eq(
      call.attr({ fn: mtext`Var` })(
        op.cond(
          mi`u`,
          mrow(msub(mi`x`, mn(1)), mo`...`, msub(mi`x`, mi`K`))
        )
      ),
      msup(greek.sigma, mn(2))
    )
  ),
  doc.figcaption`Homoskedasticity`,
);

export const unbiasedEstimatorUnderMlr5 = doc.figure(
  math(
    eq(
      call.attr({ fn: mover(mtext`Var`, mo`^`) })(
        msub(mi`𝛽̂`, mn(1))
      ),
      mfrac(
        msup(mi`𝜎̂`, mn(2)),
        mrow(
          munderover(
            mo`Σ`,
            eq.sub(mi`i`, mn(1)),
            mi`N`
          ),
          msup(minus.paren(msub(mi`x`, mi`i`), mi`x̄`), mn(2))
        )
      )
    )
  ),
  doc.figcaption`Unbiased estimator under MLR.5`,
);
