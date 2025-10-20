/**
 * @import { E } from '../../prelude-type.ts';
 */
import { frag, mathml, mathml2, doc } from '../../prelude.js';
import { mathmlHelper, mathmlHelper_2 } from '../prelude.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const { paren, frac } = mathml;

const { mi, mo, mtext, mrow, mn, msup, msub, msubsup, msqrt, munder, mspace } = mathml2;
const { abs, annotationOver, rows: rows_2 } = mathmlHelper_2;

const {
  eqId, eq, add, minusSqP,
  minus, minusP, div, divP, add3,
} = mathmlHelper;

/** @param {E.Item} a @param {E.Item} b */
const mul2 = (a, b) => mrow(a, mspace(4), b);

/** @param {E.Item} a @param {E.Item} b @param {E.Item} c */
const mul3 = (a, b, c) => mrow(a, mspace(4), b, mspace(4), c);

export const functionalForms = {
  log: doc.figure(
    mathml2.math(
      rows_2(
        eq(
          mathml.call('log', mi`y`),
          add3(
            msub(mi`β`, mn(0)),
            mul2(msub(mi`β`, mn(1)), mathml.call('log', msub(mi`x`, mn(1)))),
            add(
              add(msub(mi`β`, mn(2)), mul2(msub(mi`β`, mn(2)), msub(mi`x`, mn(2)))),
              mi`u`
            ),
          )
        ),

        mrow(
          annotationOver.attr({ label:  mtext`with x₁ fixed` })(
            eq(
              mi`%Δŷ`,
              mul2(
                mn(100),
                minusP(
                  mathml.call('exp', mul2(msub(mi`β`, mn(2)), msub(mi`Δx`, mn(2)))),
                  mn(1)
                )
              )
            ),
          ),
          mspace(32),
          annotationOver.attr({ label: mtext`with x₂ fixed` })(
            eq(
              mi`%Δŷ`,
              mul2(msub(mi`β`, mn(1)), mi`%Δx₁`)
            ),
          ),
        ),
      )
    ),
    doc.figcaption`Interpretations of changes in x₁ and x₂ in a semilog model`
  ),
  quadratic: doc.figure(
    mathml2.math(
      mathml.table([
        [
          mi`y`,
          mo`=`,
          add3(
            msub(mi`β`, mn(0)),
            mul2(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
            add(
              mul2(msub(mi`β`, mn(2)), msup(msub(mi`x`, mn(1)), mn(2))),
              mi`u`
            )
          ),
        ],

        [
          mi`ŷ`,
          mo`=`,
          add3(
            msub(mathml.SPECIAL.greek.circumflex.beta, mn(0)),
            mul2(msub(mathml.SPECIAL.greek.circumflex.beta, mn(1)), msub(mi`x`, mn(1))),
            mul2(msub(mathml.SPECIAL.greek.circumflex.beta, mn(2)), msup(msub(mi`x`, mn(1)), mn(2)))
          ),
        ],

        [
          mi`Δŷ`,
          mo`≈`,
          mul2(
            mathml.paren([
              add(
                msub(mathml.SPECIAL.greek.circumflex.beta, mn(1)),
                mul2(mn(2), mul2(msub(mathml.SPECIAL.greek.circumflex.beta, mn(2)), msub(mi`x`, mn(1)))),
              )
            ]),
            msub(mi`Δx`, mn(1))
          ),
        ],

        [
          frac([mi`Δŷ`], [msub(mi`Δx`, mn(1))]),
          mo`≈`,
          add(
            msub(mathml.SPECIAL.greek.circumflex.beta, mn(1)),
            mul2(mn(2), mul2(msub(mathml.SPECIAL.greek.circumflex.beta, mn(2)), msub(mi`x`, mn(1)))),
          ),
        ],
      ], { columnalign: 'right centre left' }),
    ),
    doc.figcaption`Quadratic-in-x₁ model, fitted form, and marginal effect`
  ),
  quadraticTurningPoint: doc.figure(
    mathml2.math(
      mrow(
        msup(mi`x`, mo`*`),
        mspace(4), mo`=`, mspace(4),
        abs(
          frac(
            [ msub(mathml.SPECIAL.greek.circumflex.beta, mn(1)) ],
            [ mul2(mn(2), msub(mathml.SPECIAL.greek.circumflex.beta, mn(2))) ]
          )
        ),
      ),
    ),
    doc.figcaption`Quadratic Turning Point`
  ),
  logQuadratic: doc.figure(
    mathml2.math(
      mathml.table([
        // Row 1: log(y) = β0 + β1·log(x1) + β2·(log(x1))²
        [
          mathml.call('log', mi`y`),
          mo`=`,
          add3(
            msub(mathml.SPECIAL.greek.beta, mn(0)),
            mul2(msub(mathml.SPECIAL.greek.beta, mn(1)), mathml.call('log', msub(mi`x`, mn(1)))),
            mul2(
              msub(mathml.SPECIAL.greek.beta, mn(2)),
              msup(paren([mathml.call('log', msub(mi`x`, mn(1)))]), mn(2))
            )
          ),
        ],

        // Row 2: %Δy ≈ [β1 + 2·β2·log(x1)] · %Δx1
        [
          mi`%Δy`,
          mo`≈`,
          mul2(
            mrow(
              mo`[`,
              add(
                msub(mathml.SPECIAL.greek.beta, mn(1)),
                mul2(
                  mn(2),
                  mul2(
                    msub(mathml.SPECIAL.greek.beta, mn(2)),
                    mathml.call('log', msub(mi`x`, mn(1)))
                  ),
                )
              ),
              mo`]`,
            ),
            mi`%Δx₁`
          ),
        ],
      ], { columnalign: 'right center left' }),
    ),
    doc.figcaption`Semilog quadratic model and %Δy interpretation`
  ),
  interactions: doc.figure(
    mathml2.math(
      rows_2(
        mrow(
          mi`y`,
          mspace(4), mo`=`, mspace(4),
          add3(
            msub(mathml.SPECIAL.greek.beta, mn(0)),
            add(
              mul2(msub(mathml.SPECIAL.greek.beta, mn(1)), msub(mi`x`, mn(1))),
              mul2(msub(mathml.SPECIAL.greek.beta, mn(2)), msub(mi`x`, mn(2))),
            ),
            add(
              mul3(msub(mathml.SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(1)), msub(mi`x`, mn(2))),
              mi`u`
            )
          ),
        ),

        mrow(
          frac([mi`Δy`], [msub(mi`Δx`, mn(2))]),
          mspace(4), mo`=`, mspace(4),
          add(
            msub(mathml.SPECIAL.greek.beta, mn(2)),
            mul2(msub(mathml.SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(1)))
          ),
        ),
      )
    ),
    doc.figcaption`Marginal effect of interaction model`
  ),
  partialEffect: doc.figure(
    mathml2.math(
      mrow(
        eq(mi`y`, add3(
          msub(mi`α`, mn(0)),
          mul2(msub(mi`𝛿`, mn(1)), msub(mi`x`, mn(1))),
          add(
            mul2(msub(mi`𝛿`, mn(2)), msub(mi`x`, mn(2))),
            add(
              mul3(
                msub(mathml.SPECIAL.greek.beta, mn(3)),
                minusP(msub(mi`x`, mn(1)), msub(mi`𝜇`, mn(1))),
                minusP(msub(mi`x`, mn(2)), msub(mi`𝜇`, mn(2))),
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
    mathml2.math(
      rows_2(
        mrow(
          mi`y`,
          mspace(4), mo`=`, mspace(4),
          add3(
            msub(mathml.SPECIAL.greek.beta, mn(0)),
            mul2(msub(mathml.SPECIAL.greek.beta, mn(1)), msub(mi`x`, mn(1))),
            add3(
              mul2(msub(mathml.SPECIAL.greek.beta, mn(2)), msub(mi`x`, mn(2))),
              mul2(msub(mathml.SPECIAL.greek.beta, mn(3)), msup(msub(mi`x`, mn(1)), mn(2))),
              add(
                mul3(msub(mathml.SPECIAL.greek.beta, mn(4)), msub(mi`x`, mn(1)), msub(mi`x`, mn(2))),
                mi`u`
              )
            )
          ),
        ),

        mrow(
          frac([mi`Δy`], [msub(mi`Δx`, mn(1))]),
          mspace(4), mo`=`, mspace(4),
          add3(
            msub(mathml.SPECIAL.greek.beta, mn(1)),
            mul2(mn(2), mul2(msub(mathml.SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(1)))),
            mul2(msub(mathml.SPECIAL.greek.beta, mn(4)), msub(mi`x`, mn(2)))
          ),
        ),

        mrow(
          msub(mi`APE`, msub(mi`x`, mn(1))),
          mspace(4), mo`=`, mspace(4),
          add3(
            msub(mathml.SPECIAL.greek.circumflex.beta, mn(1)),
            mul2(mn(2), mul2(msub(mathml.SPECIAL.greek.beta, mn(3)), msub(mi`x̄`, mn(1)))),
            mul2(msub(mathml.SPECIAL.greek.beta, mn(4)), msub(mi`x̄`, mn(2)))
          ),
        ),
      )
    ),
    doc.figcaption`Average partial effect and marginal response in a quadratic interaction model`
  ),
};
