/**
 * @import { E } from '../../prelude-type.ts';
 */
import { mathml, doc } from '../../prelude.js';
import { mathmlHelper } from '../prelude.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const { mi, mo, mtext, mrow, mn, msup, msub, msubsup, msqrt, munder, mspace, mfrac } = mathml;
const { SPECIAL, abs, annotationOver, rows: rows_2, parensA, call, table, eqId, eq, add, minus, div, mul } = mathmlHelper;

export const functionalForms = {
  log: doc.figure(
    mathml.math(
      rows_2(
        eq(
          call.attr({ fn: mtext`log` })(mi`y`),
          add(
            msub(mi`β`, mn(0)),
            mul(msub(mi`β`, mn(1)), call.attr({ fn: mtext`log` })(msub(mi`x`, mn(1)))),
            add(
              add(msub(mi`β`, mn(2)), mul(msub(mi`β`, mn(2)), msub(mi`x`, mn(2)))),
              mi`u`
            ),
          )
        ),

        mrow(
          annotationOver.attr({ label:  mtext`with x₁ fixed` })(
            eq(
              mi`%Δŷ`,
              mul(
                mn(100),
                minus.paren(
                  call.attr({ fn: mtext`exp` })(mul(msub(mi`β`, mn(2)), msub(mi`Δx`, mn(2)))),
                  mn(1)
                )
              )
            ),
          ),
          mspace(32),
          annotationOver.attr({ label: mtext`with x₂ fixed` })(
            eq(
              mi`%Δŷ`,
              mul(msub(mi`β`, mn(1)), mi`%Δx₁`)
            ),
          ),
        ),
      )
    ),
    doc.figcaption`Interpretations of changes in x₁ and x₂ in a semilog model`
  ),
  quadratic: doc.figure(
    mathml.math(
      table.attr({ columnalign: 'right centre left' })(
        [
          mi`y`,
          mo`=`,
          add(
            msub(mi`β`, mn(0)),
            mul(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
            add(
              mul(msub(mi`β`, mn(2)), msup(msub(mi`x`, mn(1)), mn(2))),
              mi`u`
            )
          ),
        ],

        [
          mi`ŷ`,
          mo`=`,
          add(
            msub(SPECIAL.greek.circumflex.beta, mn(0)),
            mul(msub(SPECIAL.greek.circumflex.beta, mn(1)), msub(mi`x`, mn(1))),
            mul(msub(SPECIAL.greek.circumflex.beta, mn(2)), msup(msub(mi`x`, mn(1)), mn(2)))
          ),
        ],

        [
          mi`Δŷ`,
          mo`≈`,
          mul(
            parensA(
              add(
                msub(SPECIAL.greek.circumflex.beta, mn(1)),
                mul(mn(2), mul(msub(SPECIAL.greek.circumflex.beta, mn(2)), msub(mi`x`, mn(1)))),
              )
            ),
            msub(mi`Δx`, mn(1))
          ),
        ],

        [
          mfrac(mi`Δŷ`, msub(mi`Δx`, mn(1))),
          mo`≈`,
          add(
            msub(SPECIAL.greek.circumflex.beta, mn(1)),
            mul(mn(2), mul(msub(SPECIAL.greek.circumflex.beta, mn(2)), msub(mi`x`, mn(1)))),
          ),
        ],
      ),
    ),
    doc.figcaption`Quadratic-in-x₁ model, fitted form, and marginal effect`
  ),
  quadraticTurningPoint: doc.figure(
    mathml.math(
      mrow(
        msup(mi`x`, mo`*`),
        mspace(4), mo`=`, mspace(4),
        abs(
          mfrac(
            msub(SPECIAL.greek.circumflex.beta, mn(1)),
            mul(mn(2), msub(SPECIAL.greek.circumflex.beta, mn(2)))
          )
        ),
      ),
    ),
    doc.figcaption`Quadratic Turning Point`
  ),
  logQuadratic: doc.figure(
    mathml.math(
      table.attr({ columnalign: 'right center left' })(
        // Row 1: log(y) = β0 + β1·log(x1) + β2·(log(x1))²
        [
          call.attr({ fn: mtext`log` })(mi`y`),
          mo`=`,
          add(
            msub(SPECIAL.greek.beta, mn(0)),
            mul(msub(SPECIAL.greek.beta, mn(1)), call.attr({ fn: mtext`log` })(msub(mi`x`, mn(1)))),
            mul(
              msub(SPECIAL.greek.beta, mn(2)),
              msup(parensA(call.attr({ fn: mtext`log` })(msub(mi`x`, mn(1)))), mn(2))
            )
          ),
        ],

        // Row 2: %Δy ≈ [β1 + 2·β2·log(x1)] · %Δx1
        [
          mi`%Δy`,
          mo`≈`,
          mul(
            mrow(
              mo`[`,
              add(
                msub(SPECIAL.greek.beta, mn(1)),
                mul(
                  mn(2),
                  mul(
                    msub(SPECIAL.greek.beta, mn(2)),
                    call.attr({ fn: mtext`log` })(msub(mi`x`, mn(1)))
                  ),
                )
              ),
              mo`]`,
            ),
            mi`%Δx₁`
          ),
        ],
      ),
    ),
    doc.figcaption`Semilog quadratic model and %Δy interpretation`
  ),
  interactions: doc.figure(
    mathml.math(
      rows_2(
        mrow(
          mi`y`,
          mspace(4), mo`=`, mspace(4),
          add(
            msub(SPECIAL.greek.beta, mn(0)),
            add(
              mul(msub(SPECIAL.greek.beta, mn(1)), msub(mi`x`, mn(1))),
              mul(msub(SPECIAL.greek.beta, mn(2)), msub(mi`x`, mn(2))),
            ),
            add(
              mul(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(1)), msub(mi`x`, mn(2))),
              mi`u`
            )
          ),
        ),

        mrow(
          mfrac(mi`Δy`, msub(mi`Δx`, mn(2))),
          mspace(4), mo`=`, mspace(4),
          add(
            msub(SPECIAL.greek.beta, mn(2)),
            mul(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(1)))
          ),
        ),
      )
    ),
    doc.figcaption`Marginal effect of interaction model`
  ),
  partialEffect: doc.figure(
    mathml.math(
      mrow(
        eq(mi`y`, add(
          msub(mi`α`, mn(0)),
          mul(msub(mi`𝛿`, mn(1)), msub(mi`x`, mn(1))),
          add(
            mul(msub(mi`𝛿`, mn(2)), msub(mi`x`, mn(2))),
            add(
              mul(
                msub(SPECIAL.greek.beta, mn(3)),
                minus.paren(msub(mi`x`, mn(1)), msub(mi`𝜇`, mn(1))),
                minus.paren(msub(mi`x`, mn(2)), msub(mi`𝜇`, mn(2))),
              ),
              mi`u`
            ),
          ),
        )),
      ),
    ),
    doc.figcaption`Parital Effect`
  ),
  ape: doc.figure(
    mathml.math(
      rows_2(
        mrow(
          mi`y`,
          mspace(4), mo`=`, mspace(4),
          add(
            msub(SPECIAL.greek.beta, mn(0)),
            mul(msub(SPECIAL.greek.beta, mn(1)), msub(mi`x`, mn(1))),
            add(
              mul(msub(SPECIAL.greek.beta, mn(2)), msub(mi`x`, mn(2))),
              mul(msub(SPECIAL.greek.beta, mn(3)), msup(msub(mi`x`, mn(1)), mn(2))),
              add(
                mul(msub(SPECIAL.greek.beta, mn(4)), msub(mi`x`, mn(1)), msub(mi`x`, mn(2))),
                mi`u`
              )
            )
          ),
        ),

        mrow(
          mfrac(mi`Δy`, msub(mi`Δx`, mn(1))),
          mspace(4), mo`=`, mspace(4),
          add(
            msub(SPECIAL.greek.beta, mn(1)),
            mul(mn(2), mul(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(1)))),
            mul(msub(SPECIAL.greek.beta, mn(4)), msub(mi`x`, mn(2)))
          ),
        ),

        mrow(
          msub(mi`APE`, msub(mi`x`, mn(1))),
          mspace(4), mo`=`, mspace(4),
          add(
            msub(SPECIAL.greek.circumflex.beta, mn(1)),
            mul(mn(2), mul(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x̄`, mn(1)))),
            mul(msub(SPECIAL.greek.beta, mn(4)), msub(mi`x̄`, mn(2)))
          ),
        ),
      )
    ),
    doc.figcaption`Average partial effect and marginal response in a quadratic interaction model`
  ),
};
