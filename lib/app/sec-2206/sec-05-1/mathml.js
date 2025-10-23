/**
 * @import { E } from '../../prelude-type.ts';
 */
import { mathml, doc } from '../../prelude.js';
import { mathmlHelper } from '../prelude.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const { math, mi, mo, mtext, mrow, mn, msup, msub, msubsup, msqrt, munder, mspace, mfrac } = mathml;
const {
  rows, parensB, SPECIAL, abs, annotationOver,
  parensA, parensC, call, table, op, annotationUnder, set
} = mathmlHelper;
const { eqId, mul0, eq, add, minus, div, mul } = op;
const { greek } = SPECIAL;

const Exp = call({ fn: mtext`Exp` });

export const semiElasticCalc = doc.figure(
  math(mul(mn(100), minus.square(Exp(msub(mi`𝛽̂`, mn(1))), mn(1)))),
  doc.figcaption`Semi Elasitic Calculation`,
);

export const conditionalProbability = doc.figure(
  math(
    table.attr({ columnalign: 'right center left' })(
      [
        mi`y`,
        mo`=`,
        add(
          msub(greek.beta, mn(0)),
          mul0(msub(greek.beta, mn(1)), msub(mi`x`, mn(1))),
          mo`⋯`,
          add(
            mul0(msub(greek.beta, mi`k`), msub(mi`x`, mi`k`)),
            mi`u`
          )
        ),
      ],
      [
        mrow(mi`E`, parensA(mrow(mi`y`, mo`|`, mi`x`))),
        mo`=`,
        add(
          msub(greek.beta, mn(0)),
          mul0(msub(greek.beta, mn(1)), msub(mi`x`, mn(1))),
          mo`⋯`,
          mul0(msub(greek.beta, mi`k`), msub(mi`x`, mi`k`))
        ),
      ],
      [
        mrow(mi`P`, parensA(mrow(mi`y`, mo`=`, mn(1), mo`|`, mi`x`))),
        mo`=`,
        add(
          msub(greek.beta, mn(0)),
          mul0(msub(greek.beta, mn(1)), msub(mi`x`, mn(1))),
          mo`⋯`,
          mul0(msub(greek.beta, mi`k`), msub(mi`x`, mi`k`))
        ),
      ],
    )
  ),
  doc.figcaption`Conditional probability`,
);

export const lpmCoefficentInterpretation = doc.figure(
  math(
    eq(
      mrow(mi`Δ`, mi`P`, parensA(mrow(mi`y`, mo`=`, mn(1), mo`|`, mi`x`))),
      mul0(
        msub(greek.beta, mi`j`),
        annotationUnder.attr({ label: mrow()  })(
          mrow(mi`Δ`, msub(mi`x`, mi`j`))
        )
      )
    )
  ),
  doc.figcaption`LPM coefficient interpretation`,
);

export const lpmAssumptionViolation = doc.figure(
  math(
    eq(
      call.attr({ fn: mtext`Var` })(op.cond(mi`y`, mi`x`)),
      mul0(
        call.attr({ fn: mi`p` })(mi`x`),
        minus.square(
          mn(1),
          call.attr({ fn: mi`p` })(mi`x`)
        )
      )
    )
  ),
  doc.figcaption`LPM assumption violation`,
);
