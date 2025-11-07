/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { rows, call, op } from '@prelude-uni/mathml.js';
import { todo } from '@prelude-uni/components.js';

const { mul0, eq, add } = op;
const {
  msqrt, mspace, math, mi, mo, mtext,
  mrow, mn, msup, msub, msubsup, mover,
  mfrac, munderover, mtable,
} = mathml;

export const nonlinearFittedValues = {
  ySquared: doc.figure(
    math(
      eq(msub(mi`ŷ`, mn(2)), add(
        msub(mi`𝛽̂`, mn(0)),
        mul0(msub(mi`𝛽̂`, mn(1)), msubsup(mi`x`, mn(1), mn(2))),
        mul0(msub(mi`𝛽̂`, mn(2)), msubsup(mi`x`, mn(2), mn(2))),
        mo`⋯`,
        mul0(msub(mi`𝛽̂`, mi`j`), msubsup(mi`x`, mi`j`, mn(2))),
      )),
    ),
    doc.figcaption`ŷ² as a nonlinear function of xⱼ`,
  ),
  yCubed: doc.figure(
    math(
      eq(msub(mi`ŷ`, mn(3)), add(
        msub(mi`𝛽̂`, mn(0)),
        mul0(msub(mi`𝛽̂`, mn(1)), msubsup(mi`x`, mn(1), mn(3))),
        mul0(msub(mi`𝛽̂`, mn(2)), msubsup(mi`x`, mn(2), mn(3))),
        mo`⋯`,
        mul0(msub(mi`𝛽̂`, mi`j`), msubsup(mi`x`, mi`j`, mn(3))),
      )),
    ),
    doc.figcaption`ŷ³ as a nonlinear function of xⱼ`,
  ),
};

export const reset = {
  models: {
    original: doc.figure(
      math(
        eq(mi`y`, add(
          msub(mi`𝛽̂`, mn(0)),
          mul0(msub(mi`𝛽̂`, mn(1)), msub(mi`x`, mn(1))),
          mul0(msub(mi`𝛽̂`, mn(2)), msub(mi`x`, mn(2))),
          mo`⋯`,
          mul0(msub(mi`𝛽̂`, mi`k`), msub(mi`x`, mi`k`)),
        )),
      ),
      doc.figcaption`Original Model`,
    ),
    resetVariant: doc.figure(
      math(
        eq(mi`y`, add(
          msub(mi`𝛽̂`, mn(0)),
          mul0(msub(mi`𝛽̂`, mn(1)), msub(mi`x`, mn(1))),
          mul0(msub(mi`𝛽̂`, mn(2)), msub(mi`x`, mn(2))),
          mo`⋯`,
          mul0(msub(mi`𝛽̂`, mi`k`), msub(mi`x`, mi`k`)),
          mul0(msub(mi`𝛿̂`, mn(1)), msup(mi`ŷ`, mn({ style: 'color: #ff0099' })(2))),
          mul0(msub(mi`𝛿̂`, mn(2)), msup(mi`ŷ`, mn({ style: 'color: #ff0099' })(3))),
        )),
      ),
      doc.figcaption`Reset Variant`,
    ),
  },
  hypothesis: {
    null: math(
      mrow(msub(mi`H`, mn(0)), mo`:`),
      mspace(4),
      op.comma(
        eq(msub(mi`𝛿̂`, mn(1)), mn(0)),
        eq(msub(mi`𝛿̂`, mn(2)), mn(0)),
      ),
    ),
  },
};

const x1 = msub(mi`x`, mn(1));
const x2 = msub(mi`x`, mn(2));
const x3 = msub(mi`x`, mn(3));
const xk = msub(mi`x`, mi`k`);
const Log = call({ fn: mtext`Log` });
const Expect = call({ fn: mi`𝔼` });

export const nonnested = {
  example: doc.figure(
    math(
      mtable(
        eq.mtr({ pos: ['right', 'left'] })(mi`y`, add(
          msub(mi`𝛽`, mn(0)),
          mul0(msub(mi`𝛽`, mn(1)), msub(mi`x`, mn(1))),
          mul0(msub(mi`𝛽`, mn(2)), msub(mi`x`, mn(2))),
          mi`u`,
        )),
        eq.mtr({ pos: ['right', 'left'] })(mi`y`, add(
          msub(mi`p`, mn(0)),
          mul0(msub(mi`𝛽`, mn(1)), Log(msub(mi`x`, mn(1)))),
          mul0(msub(mi`𝛽`, mn(2)), Log(msub(mi`x`, mn(2)))),
          mi`u`,
        )),
      ),
    ),
    doc.figcaption`Example of nonnested models`,
  ),
  mizon: doc.figure(
    math(
      rows(
        eq(mi`y`, add(
          msub(mi`𝛾`, mn(0)),
          mul0(msub(mi`𝛾`, mn(1)), msub(mi`x`, mn(1))),
          mul0(msub(mi`𝛾`, mn(2)), msub(mi`x`, mn(2))),
          mul0(msub(mi`𝛾`, mn(3)), Log(msub(mi`x`, mn(1)))),
          mul0(msub(mi`𝛾`, mn(4)), Log(msub(mi`x`, mn(2)))),
          mi`u`,
        )),
        mrow(
          mrow({ style: 'padding: 2px; border: 0.5px solid var(--fg-white)' })(
            mrow(msub(mi`H`, mn(0)), mo`:`), mspace(4),
            op.comma(
              eq(msub(mi`𝛾`, mn(3)), mn(0)),
              eq(msub(mi`𝛾`, mn(4)), mn(0)),
            ),
          ),
          mspace(16),
          mtext`or`,
          mspace(16),
          mrow({ style: 'padding: 2px; border: 0.5px solid var(--fg-white)' })(
            mrow(msub(mi`H`, mn(0)), mo`:`), mspace(4),
            op.comma(
              eq(msub(mi`𝛾`, mn(1)), mn(0)),
              eq(msub(mi`𝛾`, mn(2)), mn(0)),
            ),
          )
        ),
      ),
    ),
    doc.figcaption`Mizon & Richard Test`,
  ),
  davidson: {
    assumption: doc.figure(
      math(eq(Expect(op.cond(mi`y`, op.comma(x1, x2))), mn(0))),
      doc.figcaption`Davidson-MacKinnon Assumption`,
    ),
    model: doc.figure(
      math(
        mtable(
          eq.mtr({ pos: ['right', 'left'] })(
            mi`y̌`,
            mtext`fitted values from other model`,
          ),
          eq.mtr({ pos: ['right', 'left'] })(mi`y`, add(
            msub(mi`p`, mn(0)),
            mul0(msub(mi`𝛽`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`𝛽`, mn(2)), msub(mi`x`, mn(2))),
            mul0(msub(mi`𝜃`, mn(1)), mi`y̌`),
            mi`error`,
          )),
        ),
      ),
      doc.figcaption`Davidson-MacKinnon Auxiliary model`,
    ),
  },
};
