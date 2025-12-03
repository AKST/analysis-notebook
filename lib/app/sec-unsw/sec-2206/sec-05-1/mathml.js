/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { mathml, doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';
import {
  rows, parensB, SPECIAL, abs, annotationOver,
  parensA, parensC, call, table, op, annotationUnder, set
} from '@prelude-uni/mathml.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const { math, mi, mo, mtext, mrow, mn, msup, msub, msubsup, msqrt, munder, mspace, mfrac } = mathml;
const { comma, eqId, mul0, eq, add, minus, div, mul } = op;
const { greek } = SPECIAL;

const Exp = call({ fn: mtext`Exp` });

export const semiElasticCalc = text.figure(
  math(mul(mn(100), minus.square(Exp(msub(mi`β̂`, mn(1))), mn(1)))),
  doc.figcaption`Semi Elasitic Calculation`,
);

export const conditionalProbability = text.figure(
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

export const lpmCoefficentInterpretation = text.figure(
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

export const lpmAssumptionViolation = text.figure(
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

export const dummyEffects = text.figure(
  math(
    rows(
      eq(
        mi`y`,
        add(
          msub(greek.beta, mn(0)),
          mul0(msub(greek.delta, mn(0)), mi`dummy`),
          mi`u`
        )
      ),
      table.attr({
        columnalign: 'right center left',
        style: 'font-size: 12px',
      })(
        [
          mrow(mi`E`, parensA(op.cond(mi`y`, mrow(mi`dummy`, mo`=`, mn(0))))),
          mo`=`,
          msub(greek.beta, mn(0)),
        ],
        [
          mrow(mi`E`, parensA(op.cond(mi`y`, mrow(mi`dummy`, mo`=`, mn(1))))),
          mo`=`,
          add(msub(greek.beta, mn(0)), msub(greek.delta, mn(0))),
        ],
        [
          minus(
            mrow(mi`E`, parensA(op.cond(mi`y`, mrow(mi`dummy`, mo`=`, mn(1))))),
            mrow(mi`E`, parensA(op.cond(mi`y`, mrow(mi`dummy`, mo`=`, mn(0)))))
          ),
          mo`=`,
          msub(greek.delta, mn(0)),
        ],
      )
    )
  ),
  doc.figcaption`Effects of dummy variables`,
);

export const dummySlopehypothesisTest = text.figure(
  math(
    rows(
      eq(
        mi`y`,
        add(
          msub(mi`β`, mn(0)),
          munder(
            mul0(msub(mi`δ`, mn(0)),  msub(mi`x`, mn(1))),
            mtext`dummy`,
          ),
          munder(
            mul0(msub(mi`β`, mn(1)),  msub(mi`x`, mn(2))),
            mtext`slope`,
          ),
          munder(
            mul0(msub(mi`δ`, mn(1)),  msub(mi`x`, mn(1)), msub(mi`x`, mn(2))),
            mtext`interaction`,
          ),
          mi`u`,
        ),
      ),
      table.attr({ columnalign: 'left left' })(
        [
          mrow(msub(mi`H`, mn(0)), mo`:`),
          mrow(msub(greek.delta, mn(0)), mo`=`, msub(greek.delta, mn(1)), mo`=`, mn(0)),
        ],
        [
          mrow(msub(mi`H`, mn(1)), mo`:`),
          mtext`otherwise`,
        ],
      )
    )
  ),
  doc.figcaption`F Test: Hypothesis test for different slopes`,
);

export const interactionSlope = text.figure(
  math(
    eq(
      mi`y`,
      add(
        msub(mi`β̂`, mn(0)),
        munder(
          mul0(msub(mi`β̂`, mn(1)),  msub(mi`x`, mn(1))),
          mtext`dummy`,
        ),
        munder(
          mul0(msub(mi`β̂`, mn(2)),  msub(mi`x`, mn(2))),
          mtext`slope`,
        ),
        munder(
          mul0(msub(mi`β̂`, mn(3)),  msub(mi`x`, mn(1)), msub(mi`x`, mn(2))),
          mtext`interaction`,
        ),
        mi`u`,
      ),
    ),
    doc.figcaption`Different slopes for dummy`,
  ),
);

export const chowTest = {
  models: {
    withoutGroup: text.figure(
      math(
        eq(
          mi`y`,
          add(
            msub(mi`β̂`, mn(0)),
            munder(
              mul0(msub(mi`β̂`, mn(1)),  msub(mi`s`, mn(1))),
              mtext`slope 1`,
            ),
            munder(
              mul0(msub(mi`β̂`, mn(2)),  msub(mi`s`, mn(2))),
              mtext`slope 2`,
            ),
            munder(
              mul0(msub(mi`β̂`, mn(3)),  msub(mi`s`, mn(3))),
              mtext`slope 3`,
            ),
            mi`u`,
          ),
        ),
      ),
      doc.figcaption`Model without dummy`,
    ),
    withGroup: text.figure(
      math(
        table({ columnalign: 'right center left' })(
          [mi`y`, mo`=`, add(
            munder(
              mul0(msub(mi`δ`, mn(0)), msub(mi`d`, mn(1))),
              mtext`dummy`,
            ),
            munder(
              mul0(msub(mi`β`, mn(1)),  msub(mi`s`, mn(1))),
              mtext`slope 1`,
            ),
            munder(
              mul0(msub(mi`δ`, mn(1)), msub(mi`d`, mn(1)),  msub(mi`s`, mn(1))),
              mtext`interaction`,
            ),
            munder(
              mul0(msub(mi`β`, mn(2)),  msub(mi`s`, mn(2))),
              mtext`slope 2`,
            ),
            mspace(0),
          )],
          [mspace(0), mspace(0), add(
            munder(
              mul0(msub(mi`δ`, mn(2)), msub(mi`d`, mn(1)),  msub(mi`s`, mn(2))),
              mtext`interaction`,
            ),
            munder(
              mul0(msub(mi`β`, mn(3)),  msub(mi`s`, mn(3))),
              mtext`slope 3`,
            ),
            munder(
              mul0(msub(mi`δ`, mn(3)), msub(mi`d`, mn(1)),  msub(mi`s`, mn(3))),
              mtext`interaction`,
            ),
            mi`u`,
          )],
        ),
      ),
      doc.figcaption`Model with dummy`,
    ),
    withSeperateRegressions: text.figure(
      math(
        eq(
          msub(mi`y`, mi`g`),
          add(
            msub(mi`β̂`, comma.sub(mi`g`, mn(0))),
            mul0(msub(mi`β̂`, comma.sub(mi`g`, mn(1))),  msub(mi`s`, mn(1))),
            mul0(msub(mi`β̂`, comma.sub(mi`g`, mn(2))),  msub(mi`s`, mn(2))),
            mul0(msub(mi`β̂`, comma.sub(mi`g`, mn(3))),  msub(mi`s`, mn(3))),
            mi`u`,
          ),
        ),
      ),
      doc.figcaption`Model without dummy`,
    ),
  },
  hypothesis: {
    null: text.figure(
      math(
        mrow(
          msub(mi`H`, mn(0)),
          mo`:`, mspace(4),
          comma(
            eq(msub(mi`δ`, mn(0)), mn(0)),
            eq(msub(mi`δ`, mn(1)), mn(0)),
            eq(msub(mi`δ`, mn(2)), mn(0)),
            eq(msub(mi`δ`, mn(3)), mn(0)),
          ),
        ),
      ),
      doc.figcaption`Null hypothesis`,
    ),
    chow: text.figure(
      math(
        mrow(
          msub(mi`H`, mn(0)),
          mo`:`, mspace(4),
          eq(
            set(
              mrow(
                msub(greek.beta, mrow(mi`g`, mi`j`)),
                mo`:`, mspace(4),
                mi`g`,
                mo`∈`,
                set(mn(1), mn(2), SPECIAL.ellipse.h2, mi`G`)
              )
            ),
            set(msub(greek.beta, mi`j`))
          ),
          mspace(4),
          mtext`for all`,
          mspace(4),
          mi`j`,
          mo`∈`,
          set(mn(0), mn(1), mn(2), SPECIAL.ellipse.h2, mi`k`)
        )
      ),
      doc.figcaption`Chow test null hypothesis`,
    ),
  },
  statistic: text.figure(
    math(
      eq(
        mi`F`,
        mul0(
          mfrac(
            minus.square(
              msub(mtext`SSR`, mi`P`),
              add.paren(msub(mtext`SSR`, mn(1)), msub(mtext`SSR`, mn(2)))
            ),
            add.paren(msub(mtext`SSR`, mn(1)), msub(mtext`SSR`, mn(2)))
          ),
          mfrac(
            minus.square(mi`n`, mul0(mn(2), add.paren(mi`k`, mn(1)))),
            add.paren(mi`k`, mn(1)),
          ),
        )
      )
    ),
    doc.figcaption`Chow statistic`,
  ),
  df: math(
    minus(mi`n`, mul0(mi`g`, add.paren(mi`k`, mn(1)))),
  ),
  ssrUr: math(
    eq(
      msub(mi`SSR`, mi`ur`),
      add(
        msub(mi`SSR`, mn(1)),
        msub(mi`SSR`, mn(2)),
        mo`⋯`,
        msub(mi`SSR`, mi`g`),
      ),
    ),
  ),
  ssrFStat: math(
    eq(
      mi`F`,
      mul0(
        mfrac(
          minus.square(
            msub(mtext`SSR`, mi`P`),
            add.paren(msub(mtext`SSR`, mn(1)), msub(mtext`SSR`, mn(2)))
          ),
          add.paren(msub(mtext`SSR`, mn(1)), msub(mtext`SSR`, mn(2)))
        ),
        mfrac(
          minus.square(mi`n`, mul0(mn(2), add.paren(mi`k`, mn(1)))),
          mi`k`,
        ),
      )
    )
  ),
};
